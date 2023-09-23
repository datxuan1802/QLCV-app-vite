import { get } from "@/services/axios.service";
import { queryKey } from "@/utils/queryKey";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useWorkspace = () => {
  const [workspaces, setWorkspace] = useState([]);

  const { isLoading, error, data } = useQuery({
    queryKey: [queryKey.workspace],
    queryFn: () =>
      get(`/workspaces/permission/findByUserId`).then((data) => {
        return data;
      }),
    onSuccess: (data) => {
      setWorkspace(data);
    },
  });
  return { workspaces, isLoading, error, data };
};
