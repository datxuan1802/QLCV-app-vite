import { Layout, Menu, Avatar, Dropdown, Space, Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";

// import { Navbar, Button } from "react-daisyui";
const { Header, Content, Sider } = Layout;

const workspace = {
  key: "1",
  label: "Workspaces",
  children: [
    {
      key: "11",
      label: "Add member +",
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
const boards = {
  key: "2",
  label: "Boards",
  children: [
    {
      key: "21",
      label: "option 1",
    },
    {
      key: "22",
      label: "option 2",
    },
    {
      key: "23",
      label: "option 3",
    },
  ],
};
const Workspace = () => {
  return (
    <Layout hasSider>
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%" }}
          items={[workspace, boards]}
        />
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
        {/* <Board /> */}
        <div>Board</div>
      </Content>
    </Layout>
  );
};

export default Workspace;

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
