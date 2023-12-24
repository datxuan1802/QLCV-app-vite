import { useState } from "react";
// antd
import { Button, Modal, Input, Select } from "antd";

import { openWorkspaceModal } from "@/states/modal.state";
// network
import { post } from "@/services/axios.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { successToast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { queryKey } from "@/utils/queryKey";

const WorkspaceModal: React.FC = () => {
  const [open, setOpen] = useAtom(openWorkspaceModal);
  const queryClient = useQueryClient();

  //   input field
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("private");

  //   navigation
  const navigation = useNavigate();

  const { isLoading, isError, mutate } = useMutation({
    mutationFn: () => {
      return post(`/workspaces/create`, {
        name,
        description,
        type,
      });
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKey.workspace] });
      successToast("Create new workspace successfully");
      // navigation(path.home);
    },
    onError: (error: any) => {
      console.log(error);
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
        title="Create a new workspace"
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
            Create
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <div className="space-y-3">
          {/* input field */}
          <div className="flex flex-row">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium w-32 text-gray-900 "
            >
              Name
            </label>
            <Input
              placeholder="Workspace name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
            />
          </div>
          {/* input field */}
          <div className="flex flex-row">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium w-32 text-gray-900 "
            >
              Description
            </label>
            <Input
              placeholder="Workspace Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              size="small"
            />
          </div>
          {/* input field */}
          <div className="flex flex-row">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium w-32 text-gray-900 "
            >
              Type
            </label>
            <Select
              defaultValue="private"
              style={{ width: 120 }}
              onChange={(val: string) => setType(val)}
              options={[
                { value: "private", label: "private" },
                { value: "public", label: "public" },
              ]}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WorkspaceModal;
