// components
import { Layout, Menu, Avatar, Dropdown, Space, Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  AddBoardTab,
  BoardTab,
  WorkspaceTab,
  AddWorkspaceTab,
  BoardModal,
  WorkspaceModal,
} from ".";
const { Header, Content, Sider } = Layout;
const { Search } = Input;

// hooks
import { useWorkspace } from "@/hooks/workspace.hook";

const settings = {
  key: "2",
  label: "Some settings",
  children: [
    {
      key: "11",
      label: (
        <div
          onClick={() => {
            console.log("add");
          }}
        >
          Add member +
        </div>
      ),
    },
    {
      key: "14",
      label: <AddWorkspaceTab></AddWorkspaceTab>,
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
            label: <BoardTab board={board}></BoardTab>,
            // label: board.name,
          };
        }),
      ],
    };
  });

  return (
    <Layout className="h-screen">
      <Header className="bg-green-400 flex flex-row justify-center items-start space-x-2">
        <div className="text-2xl text-bold text-center mt-3">
          Task management app
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
          </div>
        </div>
      </Header>
      <Layout hasSider>
        <Sider width={300} className="bg-slate-300">
          <Menu mode="inline" items={[settings, ...items]} className="h-full" />
        </Sider>
        <Content>
          <Header className="bg-slate-400 flex flex-row justify-center items-center">
            <div className="flex-1 space-x-2 flex flex-row justify-start items-center">
              <div>
                <h2 className="text-2xl text-bold">Board Name</h2>
              </div>
              <Button className="normal-case text-xl">Trello</Button>
            </div>
            <div className="flex-none space-x-2 flex flex-row justify-center items-center">
              <AvatarGroup />
              <SmartOptionBoard />
              <div>Filter</div>
            </div>
          </Header>
          {children}
        </Content>
      </Layout>
      <BoardModal />
      <WorkspaceModal />
    </Layout>
  );
};

export default MainLayout;

// Avatar
const AvatarGroup = () => {
  return (
    <Avatar.Group>
      <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
      <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
      <Avatar style={{ backgroundColor: "#87d068" }}>H</Avatar>
      <Avatar style={{ backgroundColor: "#1677ff" }}>W</Avatar>
    </Avatar.Group>
  );
};

const menuItem = [
  {
    key: "1",
    label: "Rules to automation",
  },
  {
    key: "2",
    label: "Email report",
  },
];

const SmartOptionBoard = () => {
  return (
    <Dropdown menu={{ items: menuItem }}>
      <Space>{/* <Button>Smart options</Button> */}</Space>
    </Dropdown>
  );
};
