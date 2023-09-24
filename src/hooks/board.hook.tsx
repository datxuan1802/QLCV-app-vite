import { get } from "@/services/axios.service";
import { selectWorkspaceIdAtom } from "@/states/modal.state";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export const useBoard = () => {
  const [boards, setBoards] = useState<any>([]);
  const [selectWorkspaceId] = useAtom(selectWorkspaceIdAtom);

  const getBoards = async () =>
    get(`/board/find-by-workspace/${selectWorkspaceId}`).then((data) => {
      // console.log("in", workspace?.workspace?._id);
      setBoards(data);
    });
  useEffect(() => {
    selectWorkspaceId && getBoards();
  }, [selectWorkspaceId]);

  return { boards, setBoards };
};

export const useQueryBoardByWorkspace = (workspaceId: string) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [`boards/${workspaceId}`],
    queryFn: () => {
      get(`/board/find-by-workspace/${workspaceId}`).then((data) => {
        // console.log("in", workspace?.workspace?._id);
        return data;
      });
    },
  });
  return { isLoading, error, data };
};
