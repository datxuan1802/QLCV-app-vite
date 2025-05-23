import { get } from "@/services/axios.service";
import {
  openWorkspaceModal,
  selectWorkspaceIdAtom,
} from "@/states/modal.state";
import { queryKey } from "@/utils/queryKey";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { useNavigate } from "react-router";
const WorkspaceTab = ({ workspace }: { workspace: any }) => {
  // const navigation = useNavigate();
  const [, setSelectWorkspaceId] = useAtom(selectWorkspaceIdAtom);
  const queryClient = useQueryClient();

  return (
    // <div onClick={() => navigation(`/workspaces/${workspaceId}`)}>
    <div
      onClick={() => {
        setSelectWorkspaceId(workspace?.workspace?._id);
        // setEnabled(true);
        queryClient.invalidateQueries({
          queryKey: [queryKey.getBoardByWorkspaceId],
        });
      }}
    >
      {workspace?.workspace?.name}
    </div>
  );
};

export default WorkspaceTab;

export const AddWorkspaceTab = () => {
  const [, setOpen] = useAtom(openWorkspaceModal);
  return <div onClick={() => setOpen(true)}>Tạo không gian làm việc </div>;
};
