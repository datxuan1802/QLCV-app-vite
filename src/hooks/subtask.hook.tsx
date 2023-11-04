import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, patch, post } from "@/services/axios.service";

export enum ESubStatus {
  TODO = "todo",
  DONE = "done",
}
const useSubTask = (taskId: string) => {
  const [subTasks, setSubTasks] = useState<any>([]);

  const { isLoading } = useQuery({
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
        name: "Sub-task name",
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
          if (subTask._id === data._id) {
            return data;
          }
          return subTask;
        });
      });
    },
  });

  return {
    subTasks,
    subTaskLoading: isLoading,
    createSubTask: create,
    updateSubTask: update,
  };
};

export default useSubTask;
