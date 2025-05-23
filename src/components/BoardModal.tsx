import { useState } from "react";
// antd
import { Button, Modal, Input, Select } from "antd";

import { openBoardModal, selectWorkspaceIdAtom } from "@/states/modal.state";
// network
import { post } from "@/services/axios.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { successToast } from "@/utils/toast";

// navigate
import { useNavigate } from "react-router-dom";
import { path } from "@/utils/path";
import { useBoard } from "@/hooks/board.hook";
import { queryKey } from "@/utils/queryKey";

const BoardModal: React.FC = () => {
  const [open, setOpen] = useAtom(openBoardModal);
  const [workspaceId] = useAtom(selectWorkspaceIdAtom);
  //   input field
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();

  //   navigation
  const navigation = useNavigate();

  const { setBoards } = useBoard();

  const { data, isLoading, isError, mutate } = useMutation({
    mutationFn: () => {
      return post(`/board/create?workspaceId=${workspaceId}`, {
        name,
        description,
      });
    },
    onSuccess: (data) => {
      // setRefresh(true);
      queryClient.invalidateQueries({ queryKey: [queryKey.workspace] });
      setBoards((preBoards: any) => [...preBoards, data]);
      successToast("cập nhật dự án thành công");
      setName('');
      setDescription('');
    },
  });

  const handleOk = () => {
    mutate();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  if (isError) {
    return <div>error</div>;
  }
  return (
    <>
      <Modal
        open={open}
        title="Tạo dự án mới"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            className="bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
            loading={isLoading}
            onClick={handleOk}
          >
            Tạo
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
        ]}
      >
        <div className="space-y-3">
          {/* input field */}
          <div className="flex flex-row">
            <label
              htmlFor="name"
              className="block w-32 mb-2 text-sm font-medium text-gray-900 "
            >
              Tên
            </label>
            <Input
              placeholder="Tên dự án"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
            />
          </div>
          {/* input field */}
          <div className="flex flex-row">
            <label
              htmlFor="description"
              className="block w-32 mb-2 text-sm font-medium text-gray-900 "
            >
              Mô tả
            </label>
            <Input
              placeholder="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              size="small"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BoardModal;
