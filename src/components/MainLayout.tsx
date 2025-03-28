// components
import { Layout, Menu, Avatar, Input, Button, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  AddBoardTab,
  BoardTab,
  WorkspaceTab,
  AddWorkspaceTab,
  BoardModal,
  WorkspaceModal,
  TaskModal,
  TaskDetailModal,
  AddMemberModal,
  AvatarCus,
  ReportLayout,
} from ".";
const { Header, Content, Sider } = Layout;
const { Search } = Input;

// hooks
import { useWorkspace } from "@/hooks/workspace.hook";
import { useAtom } from "jotai";
import { userAtom } from "@/states/user.state";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/services/axios.service";
import { useState } from "react";

const SettingsTab = () => {
  const navigation = useNavigate();
  return <div onClick={() => navigation("/settings")}>Settings</div>;
};

const settings = {
  key: "2",
  label: "Some settings",
  children: [
    {
      key: "14",
      label: <AddWorkspaceTab />,
    },
    {
      key: "12",
      label: <SettingsTab />,
    },
    {
      key: "13",
      label: "reports",
    },
  ],
};

const MainLayout = ({ children }: any) => {
  const { workspaces } = useWorkspace();
  const [user] = useAtom(userAtom);

  const items = workspaces?.map((workspacePermission: any) => {
    return {
      key: workspacePermission?._id,
      label: <WorkspaceTab workspace={workspacePermission} />,
      children: [
        {
          key: workspacePermission?._id + "1",
          label: (
            <AddBoardTab
              workspaceId={workspacePermission?.workspace?._id}
            ></AddBoardTab>
          ),
        },
        ...workspacePermission.workspace.boards.map((board: any) => {
          return {
            key: board?._id,
            label: (
              <BoardTab
                board={board}
                workspaceId={workspacePermission.workspace?._id}
              ></BoardTab>
            ),
            // label: board.name,
          };
        }),
      ],
    };
  });

  return (
    <Layout className="min-h-screen ">
      <MainHeader />
      <Layout hasSider className="mt-16 ">
        <Sider width={300} className="bg-slate-300">
          <Menu
            mode="inline"
            // defaultOpenKeys={workspaces[0]?._id as string}
            items={[settings, ...items]}
            className="min-h-full fixed left-0 w-[300px] "
          />
        </Sider>
        <Content className="min-h-screen bg-white">{children}</Content>
      </Layout>
      <BoardModal />
      <WorkspaceModal />
      <TaskModal />
      <TaskDetailModal />
      <AddMemberModal />
    </Layout>
  );
};

export default MainLayout;

export const MainHeader = () => {
  const navigation = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      return get(`/auth/profile`).then((data) => {
        return data;
      });
    },
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    localStorage.clear();
    navigation("/login");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title="Xác nhận đăng xuất"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đăng xuất"
        cancelText="Hủy"
        okButtonProps={{
          className:
            "hover:bg-blue-600 hover:text-white hover:border-none text-black border border-black ",
        }}
        cancelButtonProps={{
          className:
            "border border-black text-black hover:bg-red-100 hover:text-red-500 hover:border-none",
        }}
      >
        Bạn có chắc chắn muốn đăng xuất không?
      </Modal>
      <Header className="z-50 bg-blue-400 flex flex-row justify-center items-start space-x-2 fixed top-0 left-0 right-0">
        <div className="flex items-center justify-center mt-1">
          <img src="/leadership.png" alt="" className="w-10 h-10" />
        </div>
        <div className="text-2xl text-bold text-center mt-3">
          Task management
        </div>
        {/* <div>Workspace</div>
      <div>template</div>
      <div>create</div> */}
        <div className="flex justify-end items-center flex-1 space-x-2">
          <Search
            placeholder="input search text"
            //    onSearch={onSearch}
            enterButton
            className="w-56"
          />
          <div className="flex items-center gap-x-1">
            {!isLoading && (
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
                src={data?.avatar}
              />
            )}
            {!isLoading && <div>{data?.name}</div>}
            {/* {user && <AvatarCus user={user} />} */}
          </div>
          <Button type="text" onClick={showModal}>
            Logout
          </Button>
        </div>
      </Header>
    </>
  );
};
