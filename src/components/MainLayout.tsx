// components
import { Layout, Menu, Avatar, Input } from "antd";
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
      label: "settings",
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

  const items = workspaces.map((workspacePermission: any) => {
    return {
      key: workspacePermission._id,
      label: <WorkspaceTab workspace={workspacePermission} />,
      children: [
        {
          key: workspacePermission._id + "1",
          label: (
            <AddBoardTab
              workspaceId={workspacePermission?.workspace?._id}
            ></AddBoardTab>
          ),
        },
        ...workspacePermission.workspace.boards.map((board: any) => {
          return {
            key: board._id,
            label: (
              <BoardTab
                board={board}
                workspaceId={workspacePermission.workspace._id}
              ></BoardTab>
            ),
            // label: board.name,
          };
        }),
      ],
    };
  });

  return (
    <Layout className="h-screen">
      <Header className="bg-blue-400 flex flex-row justify-center items-start space-x-2">
        <div className="flex items-center justify-center mt-1">
          <img
            src="../../../public/leadership.png"
            alt=""
            className="w-10 h-10"
          />
        </div>
        <div className="text-2xl text-bold text-center mt-3">
          Task management
        </div>
        <div>Workspace</div>
        <div>template</div>
        <div>create</div>
        <div className="flex justify-end items-center flex-1 space-x-2">
          <Search
            placeholder="input search text"
            //    onSearch={onSearch}
            enterButton
            className="w-56"
          />
          <div>
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
            />
            {/* {user && <AvatarCus user={user} />} */}
          </div>
        </div>
      </Header>
      <Layout hasSider>
        <Sider width={300} className="bg-slate-300">
          <Menu
            mode="inline"
            // defaultOpenKeys={workspaces[0]?._id as string}
            items={[settings, ...items]}
            className="h-full"
          />
        </Sider>
        <Content className="bg-slate-200">{children}</Content>
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
