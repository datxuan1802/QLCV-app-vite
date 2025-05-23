import React, { useState, useEffect } from "react";
import {
  Column,
  KanbanLayout,
  MainLayout,
  Task,
  BoardHeader,
  TimelineLayout,
  TableLayout,
} from "@/components";
import { useParams } from "react-router";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, patch } from "@/services/axios.service";

import { EStatus } from "@/utils/type";
import { mapStatusTask } from "@/utils/mapping";
import { useAtom } from "jotai";
import { selectViewAtom } from "@/states/modal.state";
import { errorToast, successToast } from "@/utils/toast";
import { userAtom } from "@/states/user.state";

const BoardPage = () => {
  const { boardId, workspaceId } = useParams();
  const [tasks, setTasks] = useState<any>({
    todos: [],
    inProgress: [],
    done: [],
  });

  const [selectView] = useAtom(selectViewAtom);
  const [user] = useAtom(userAtom);
  const [permission, setPermission] = useState([]);

  useEffect(() => {
    localStorage.setItem(
      "defaultNavigation",
      `/workspaces/${workspaceId}/boards/${boardId}`
    );
  }, [boardId, workspaceId]);

  useQueries({
    queries: [
      {
        queryKey: [`task/findByBoardId/${boardId}`, EStatus.TODO],
        queryFn: () => get(`task/findByBoardId/${boardId}?status=todo`),
        onSuccess: (data: any) => {
          setTasks((pre: any) => ({
            ...pre,
            todos: data,
          }));
        },
        enabled: !!boardId,
      },
      {
        queryKey: [`task/findByBoardId/${boardId}`, EStatus.IN_PROGRESS],
        queryFn: () => get(`task/findByBoardId/${boardId}?status=in-progress`),
        onSuccess: (data: any) => {
          setTasks((pre: any) => ({
            ...pre,
            inProgress: data,
          }));
        },
        enabled: !!boardId,
      },
      {
        queryKey: [`task/findByBoardId/${boardId}`, EStatus.DONE],
        queryFn: () => get(`task/findByBoardId/${boardId}?status=done`),
        onSuccess: (data: any) => {
          setTasks((pre: any) => ({
            ...pre,
            done: data,
          }));
        },
        enabled: !!boardId,
      },
    ],
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    // mutationFn:  (taskId: string,status:EStatus) => {
    //   return post(`/task/update-status/${taskId}?status=${status}`,{})
    // }
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: string;
      status: string;
    }) => {
      return await patch(`/task/update-status/${taskId}?status=${status}`, {});
    },
     onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: [`task/findByBoardId/${boardId}`],
          });
          queryClient.invalidateQueries({
            queryKey: [`task/${data._id}`],
          });
          successToast("Cập nhật thành công");
        },
  });
  const { mutate: mutateUpdate } = useMutation({
    mutationFn: async ({ taskId, data }: any) => {
      return await patch(`/task/update/${taskId}`, data);
    },
  });

  // NOTE: get permission
  useQuery({
    queryKey: [`permission/${workspaceId}/${user?._id}`],
    queryFn: () => {
      return get(`/workspaces/permission?workspaceId=${workspaceId}`).then(
        (data) => {
          return data || {};
        }
      );
    },
    onSuccess: (permission) => {
      setPermission(permission?.roles || []);
    },
    // enabled: enabled,
  });

  const handleOnDragEnd = (result: any) => {
    const { source, destination } = result;
    //NOTE: Check if the draggable item was dropped outside a droppable area
    if (!destination) return;
    //NOTE: Check if the draggable item was dropped back to its original position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceTodos = tasks[source.droppableId];
    const task = sourceTodos[source.index];

    //NOTE: Drag and drop within the same column
    if (
      source.droppableId === destination.droppableId &&
      source.index !== destination.index
    ) {
      sourceTodos.splice(source.index, 1);
      sourceTodos.splice(destination.index, 0, task);
      setTasks((pre: any) => ({
        ...pre,
        [source.droppableId]: sourceTodos,
      }));

      // console.log();
      // mutateUpdate({
      //   taskId: task._id,
      //   data: {
      //     order: destination.index,
      //   },
      // });
    }

    // NOTE: Drag and drop between different columns
    if (source.droppableId !== destination.droppableId) {
      const destinationTodos = tasks[destination.droppableId];
      sourceTodos.splice(source.index, 1);
      task.status = destination.droppableId;
      destinationTodos.splice(destination.index, 0, task);
      if (
        source.droppableId === "done" &&
        hasAdminOrManager(permission) === false
      ) {
        errorToast("You don't have permission move task when status is done");
        return;
      }
      setTasks((pre: any) => ({
        ...pre,
        [source.droppableId]: sourceTodos,
        [destination.droppableId]: destinationTodos,
      }));
      mutate({
        taskId: task?._id,
        status: mapStatusTask(destination.droppableId),
      });
    }
  };
  return (
    <MainLayout workspaceId={workspaceId} type='board'>
      <BoardHeader selectView={selectView}/>
      {selectView === "Board" && (
        <KanbanLayout handleOnDragEnd={handleOnDragEnd}>
          <Column droppableId={"todos"} columnName="Việc cần  làm">
            {tasks.todos &&
              tasks.todos?.map((task: any, index: number) => (
                <Task
                  key={task?._id}
                  item={task}
                  index={index}
                  draggableId={task?._id}
                />
              ))}
          </Column>
          <Column
            droppableId={"inProgress"}
            columnName="Đang thực hiện"
            className="bg-red-200"
          >
            {tasks.inProgress &&
              tasks.inProgress?.map((task: any, index: number) => (
                <Task
                  key={task?._id}
                  item={task}
                  index={index}
                  draggableId={task?._id}
                />
              ))}
          </Column>
          <Column droppableId={"done"} columnName="Hoàn thành" className="bg-red-500">
            {tasks.done &&
              tasks.done?.map((task: any, index: number) => (
                <Task
                  key={task?._id}
                  item={task}
                  index={index}
                  draggableId={task?._id}
                />
              ))}
          </Column>
        </KanbanLayout>
      )}
      {selectView === "Timeline" && (
        <TimelineLayout tasks={tasks} setTasks={setTasks} />
      )}
      {selectView === "Table" && <TableLayout />}
    </MainLayout>
  );
};

export default BoardPage;

function hasAdminOrManager(arr: string[]) {
  return arr.includes("Admin") || arr.includes("Manager");
}
