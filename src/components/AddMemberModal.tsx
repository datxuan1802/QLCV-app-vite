import { get, post } from "@/services/axios.service";
import {
  openAddMemberModal,
  selectWorkspaceIdAtom,
} from "@/states/modal.state";
import { errorToast, successToast } from "@/utils/toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Modal, Button, Input } from "antd";
import { useAtom } from "jotai";
import React, { useState } from "react";

export const AddMemberModal = () => {
  const [open, setOpen] = useAtom(openAddMemberModal);
  const [email, setEmail] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const [workspaceId] = useAtom(selectWorkspaceIdAtom);

  const [enabled, setEnabled] = useState(false);
  const inviteUser = useMutation({
    mutationFn: (userId: string) => {
      return post(
        `/workspaces/invite-member?workspaceId=${workspaceId}&userId=${userId}&email=${email}`,
        {}
      );
    },
    onSuccess: (data) => {
      // setRefresh(true);
      setOpen(false);
      // successToast("The invitation has been sent to email successfully!");
      successToast("Thêm nhân sự thành công");
      //   navigation(path.home);
    },
    onError(error, variables, context) {
      errorToast("Email này chưa đăng ký tài khoản. Vui lòng thử lại!");
    },
  });
  useQuery({
    queryKey: ["findUser"],
    queryFn: () => {
      return get(`/auth/find-by-email?email=${email}`).then((data) => {
        return data || {};
      });
    },
    onSuccess: (user) => {
      setEnabled(false);
      inviteUser.mutate(user?._id);
    },
    enabled: enabled,
  });
  const handleOk = () => {
    // console.log(workspaceId);
    // console.log(email);

    setEnabled(true);
  };
  const handleCancel = () => {
    setEmail("");
    setOpen(false);
  };

  return (
    <Modal
      title="Invite Member"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button
          key="submit"
          type="primary"
          className="bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
          loading={inviteUser.isLoading}
          disabled={inviteUser.isLoading}
          onClick={handleOk}
        >
          Mời
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Hủy
        </Button>,
      ]}
    >
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block mr-2 text-sm font-medium text-gray-900"
        >
          Email
        </label>
        <Input
          placeholder="abc@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
        />
      </div>
    </Modal>
  );
};
