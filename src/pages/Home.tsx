// ant design
import { Layout, Avatar, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Header } = Layout;
const { Search } = Input;

// components
import { Workspace, WorkspaceModal } from "@/components";

// state
import { useAtom } from "jotai";
import { userAtom } from "@/states/user.state";

//network
import { useQuery } from "@tanstack/react-query";
import { queryKey } from "@/utils/queryKey";
import { get } from "@/services/axios.service";
import { path } from "@/utils/path";
import { openWorkspaceModal } from "@/states/modal.state";

const Home = () => {
  const [search, setSearch] = useState("");
  const [workspaces, setWorkspace] = useState([]);
  const [user] = useAtom(userAtom);
  const onSearch = (value: string) => {
    setSearch(value);
  };
  const { isLoading, error, data } = useQuery({
    queryKey: [queryKey.workspace],
    queryFn: () =>
      get(`/workspaces/findByOwnerId?ownerId=64f7cadf35863ade52d7dc2f`).then(
        (data) => {
          return data;
        }
      ),
    onSuccess: (data) => {
      console.log(data);
      setWorkspace(data);
    },
  });

  if (error) {
    // console.log(error);
    return <div>error</div>;
  }
  return (
    <>
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
              onSearch={onSearch}
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

        {isLoading ? (
          <div>Loading...</div>
        ) : workspaces.length > 0 ? (
          <Workspace />
        ) : (
          <NoWorkspace />
        )}
      </Layout>
      <WorkspaceModal />
      {/* <CreateTodoModal /> */}
    </>
  );
};

export default Home;

const NoWorkspace = () => {
  const [, setOpen] = useAtom(openWorkspaceModal);

  const showModal = () => {
    setOpen(true);
  };
  return (
    <div className="flex flex-row justify-center items-center space-x-3 mt-10">
      <Button
        className="w-56 h-56 rounded-md flex justify-center item-center bg-red-400 hover:opacity-30 hover:cursor-pointer"
        type="primary"
        onClick={showModal}
      >
        <div>Create a workspace 🐊</div>
      </Button>

      <div className="w-56 h-56 rounded-md flex justify-center item-center bg-red-400 hover:opacity-30 hover:cursor-pointer">
        Vào workspace
      </div>
    </div>
  );
};
