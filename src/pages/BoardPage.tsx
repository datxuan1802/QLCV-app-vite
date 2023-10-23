import React, { useState, useEffect } from "react";
import {
  Column,
  KanbanLayout,
  MainLayout,
  Task,
  BoardHeader,
  TimelineLayout,
} from "@/components";
import { useParams } from "react-router";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useMutation, useQueries } from "@tanstack/react-query";
import { get, patch } from "@/services/axios.service";

import { EStatus } from "@/utils/type";
import { mapStatusTask } from "@/utils/mapping";
import { useAtom } from "jotai";
import { selectViewAtom } from "@/states/modal.state";

const BoardPage = () => {
  const { boardId, workspaceId } = useParams();
  const [tasks, setTasks] = useState<any>({
    todos: [],
    inProgress: [],
    done: [],
  });

  const [selectView] = useAtom(selectViewAtom);

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
  });

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: async ({ taskId, data }: any) => {
      return await patch(`/task/update/${taskId}`, data);
    },
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
      setTasks((pre: any) => ({
        ...pre,
        [source.droppableId]: sourceTodos,
        [destination.droppableId]: destinationTodos,
      }));
      mutate({
        taskId: task._id,
        status: mapStatusTask(destination.droppableId),
      });
    }
  };
  return (
    <MainLayout>
      <BoardHeader />
      {selectView === "Board" && (
        <KanbanLayout handleOnDragEnd={handleOnDragEnd}>
          <Column droppableId={"todos"} columnName="To Do">
            {tasks.todos &&
              tasks.todos?.map((task: any, index: number) => (
                <Task
                  key={task._id}
                  item={task}
                  index={index}
                  draggableId={task._id}
                />
              ))}
          </Column>
          <Column
            droppableId={"inProgress"}
            columnName="In Progress"
            className="bg-red-200"
          >
            {tasks.inProgress &&
              tasks.inProgress?.map((task: any, index: number) => (
                <Task
                  key={task._id}
                  item={task}
                  index={index}
                  draggableId={task._id}
                />
              ))}
          </Column>
          <Column droppableId={"done"} columnName="Done" className="bg-red-500">
            {tasks.done &&
              tasks.done?.map((task: any, index: number) => (
                <Task
                  key={task._id}
                  item={task}
                  index={index}
                  draggableId={task._id}
                />
              ))}
          </Column>
        </KanbanLayout>
      )}
      {selectView === "Timeline" && (
        <TimelineLayout tasks={tasks} setTasks={setTasks} />
      )}
    </MainLayout>
  );
};

export default BoardPage;
