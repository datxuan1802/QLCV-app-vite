import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteBoard, get, patch, post } from "@/services/axios.service";

export enum ESubStatus {
  TODO = "todo",
  DONE = "done",
}
const useSubTask = (taskId: string) => {
  const [subTasks, setSubTasks] = useState<any>([]);

  const { isLoading,refetch } = useQuery({
    queryKey: ["sub-task"],
    queryFn: () => {
      return get(`/sub-task/find-by-task/${taskId}`).then((data) => {
        return data;
      });
    },
    onSuccess: (data) => {
      setSubTasks(data);
    },
  });

  const { mutate: create } = useMutation({
    mutationFn: async () => {
      return await post(`/sub-task/create/${taskId}`, {
        name: "nhiệm vụ phụ mới",
        status: ESubStatus.TODO,
      }).then((data) => {
        return data;
      });
    },
    onSuccess: (data) => {
      setSubTasks((preSubTask: any) => [...preSubTask, data]);
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: async ({
      subTaskId,
      data,
    }: {
      subTaskId: string;
      data: any;
    }) => {
      return await patch(`/sub-task/update/${subTaskId}`, data);
    },
    onSuccess: (data) => {
      setSubTasks((preSubTask: any) => {
        return preSubTask.map((subTask: any) => {
          if (subTask?._id === data?._id) {
            return data;
          }
          return subTask;
        });
      });
    },
  });
  

  const { mutate: deleteSubtask } = useMutation({
    mutationFn: async ({
      subTaskId,
    }: {
      subTaskId: string;
    }) => {
      return await deleteBoard(`/sub-task/delete`, subTaskId);
    },
    onSuccess(data, variables, context) {
      refetch();
    },
  });
  return {
    subTasks,
    subTaskLoading: isLoading,
    createSubTask: create,
    updateSubTask: update,
    deleteSubtask: deleteSubtask,
  };
};

export default useSubTask;
