// components
import { Layout, Menu, Avatar, Input, Button, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FaHome, FaUser } from 'react-icons/fa';
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
import { AiOutlineProject } from 'react-icons/ai';
// hooks
import { useWorkspace } from "@/hooks/workspace.hook";
import { useAtom } from "jotai";
import { userAtom } from "@/states/user.state";
import { useLocation, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/services/axios.service";
import { useEffect, useRef, useState } from "react";
import { AiOutlineDown } from 'react-icons/ai';
import { MdBarChart, MdFormatListBulleted, MdVisibility, MdWorkspacesOutline } from "react-icons/md";
import { openWorkspaceModal } from "@/states/modal.state";



const MainLayout = ({ children,workspaceId ,type}: any) => {
  const { workspaces }:any = useWorkspace();
  const { boardId } = useParams();
  const pathname=useLocation();
  const [user] = useAtom(userAtom);
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigate();
   const [, setOpen] = useAtom(openWorkspaceModal);
  const popupRef = useRef<HTMLDivElement>(null);
    // Click outside để đóng popup
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  const SettingsTab = () => {
    const navigation = useNavigate();
    return <div onClick={() => navigation("/settings")} className={`flex items-center gap-x-2  pl-2 hover:text-[#1922FF] ${pathname.pathname.includes('/settings')?'bg-blue-100 rounded':''}`}> <FaUser size={20} color="gray" />Thông tin tài khoản</div>;
  };
  const HomeTab = () => {
    const navigation = useNavigate();
    return <div onClick={() => navigation("/")} className={`flex items-center  pl-2 gap-x-2 hover:text-[#1922FF] ${workspaceId?'border-t':''} ${pathname.pathname===('/')?'bg-blue-100 rounded ':''}`}><div><MdWorkspacesOutline size={20} className="text-black" /></div>Danh sách không gian làm việc</div>;
  };
  const WorkspaceName = () => {
    const navigation = useNavigate();
    return <><div onClick={()=>{setIsOpen(true)}} className="flex items-center gap-x-2 hover:text-[#1922FF] "><div><AiOutlineProject size={25} color="#007bff" /></div><div className="text-xl font-semibold">{workspaces?.find((item:any)=>item?.workspace?._id===workspaceId)?.workspace?.name}</div><AiOutlineDown size={20} color="gray" className="ml-1" /></div></>;
  };
  const ListBoard = () => {
    const navigation = useNavigate();
    return <div onClick={() => navigation(`/workspaces/${workspaceId}`)} className={`flex  pl-2 items-center gap-x-2 border-t hover:text-[#1922FF] ${pathname.pathname.includes('workspaces')&&(!pathname.pathname.includes('boards')&&!pathname.pathname.includes('report'))?'bg-blue-100 rounded ':''}`}> <MdFormatListBulleted size={20} className="text-black" />Danh sách dự án</div>;
  };
  const Report = () => {
    const navigation = useNavigate();
    return <>{type==='board'&&<div onClick={() => navigation(`/workspaces/${workspaceId}/boards/${boardId}/report`)} className={`flex pl-2 items-center gap-x-2  hover:text-[#1922FF] ${pathname.pathname.includes('report')?'bg-blue-100 rounded ':''}`}>  <MdBarChart size={20} className="text-black"/>Báo cáo</div>}</>;
  };
  const Detail = () => {
    const navigation = useNavigate();
    return <>{type==='board'&&<div onClick={() => navigation(`/workspaces/${workspaceId}/boards/${boardId}`)} className={`flex pl-2 items-center gap-x-2  hover:text-[#1922FF] ${pathname.pathname.includes('workspaces')&&pathname.pathname.includes('boards')&&!pathname.pathname.includes('report')?'bg-blue-100 rounded ':''}`}> <MdVisibility size={20} className="text-black"/>Chi tiết dự án</div>}</>;
  };
  const settings =  [
    {
      key: "26",
      label: <WorkspaceName/>,
    },
    {
      key: "25",
      label: <HomeTab/>,
    },
    // {
    //   key: "14",
    //   label: <AddWorkspaceTab />,
    // },
    {
      key: "12",
      label: <SettingsTab />,
    },
    {
      key: "27  ",
      label: <ListBoard />,
    },
   
    {
      key: "28  ",
      label: <Detail />,
    },
    {
      key: "29  ",
      label: <Report />,
    },
    // {
    //   key: "13",
    //   label: "Báo cáo",
    // },
  ];
  const setting =  [
    {
      key: "25",
      label: <HomeTab/>,
    },
    // {
    //   key: "14",
    //   label: <AddWorkspaceTab />,
    // },
    {
      key: "12",
      label: <SettingsTab />,
    },
    // {
    //   key: "13",
    //   label: "Báo cáo",
    // },
  ];
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
        ...workspacePermission?.workspace?.boards?.map((board: any) => {
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
    <>{isOpen&&<div ref={popupRef} className="flex flex-col justify-between fixed bg-red  bg-white max-w-[500px]  py-4 shadow-lg shadow-slate-600 rounded-lg w-fit max-h-[400px] overflow-y-auto z-50 left-6 top-28">
      <div className="flex flex-col w-full h-[20%]">
        <div className="px-2 pb-3 border-b border-b-slate-300"><WorkspaceName/></div>
        <div className="px-2 pt-3 text-lg font-medium">Chuyển không gian làm việc</div>
      </div>
      <div className="max-h-[70%] overflow-y-auto p-2 flex flex-col gap-y-2   ">{workspaces?.filter((item:any)=>item?.workspace?._id!==workspaceId)?.map((data:any)=>{return(
        <div onClick={()=>{navigation(`/workspaces/${data?.workspace?._id}`);setIsOpen(false)}} className="flex items-center px-2 py-2 rounded-lg cursor-pointer gap-x-2 hover:bg-blue-100"><Avatar shape='square' className={` bg-green-500`}>
        {data?.workspace?.name?.charAt(0).toUpperCase()}
      </Avatar><p className="text-sm max-w-[300px] truncate">{data?.workspace?.name}</p></div>
      )})}</div>
      <div onClick={()=>{setIsOpen(false);setOpen(true)}} className="h-[10%] pt-2 flex items-center gap-x-2 px-4 cursor-pointer hover:text-[#1922FF]"><span className="h-[32px] w-[32px] bg-gray-400 rounded flex items-center text-center justify-center ">+</span><p>Tạo không gian làm việc</p></div>
      </div>}
    <Layout className="min-h-screen ">
      <MainHeader />
      <Layout hasSider className="mt-16 ">
        <Sider width={300} className="bg-slate-300">
          <Menu
            mode="inline"
            // defaultOpenKeys={workspaces[0]?._id as string}
            items={workspaceId?settings:setting}
            className="min-h-full fixed left-0 w-[300px]"
          />
        </Sider>
        <Content className="min-h-screen bg-gray-200">{children}</Content>
      </Layout>
      <BoardModal />
      <WorkspaceModal />
      <TaskModal />
      <TaskDetailModal />
      <AddMemberModal />
    </Layout>
    </>
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
  const [isOpen, setIsOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    localStorage.clear();
    setIsOpen(false);
    navigation("/login");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsOpen(false);
  };
const popupRef = useRef<HTMLDivElement>(null);
    // Click outside để đóng popup
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
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
      <Header className="fixed top-0 left-0 right-0 z-50 flex flex-row items-start justify-center space-x-2 bg-blue-400">
        <div className="flex items-center justify-center mt-1">
          <img src="/leadership.png" alt="" className="w-10 h-10" />
        </div>
        <div className="mt-3 text-2xl text-center text-bold">
          Quản lý dự án
        </div>
        {/* <div>Workspace</div>
      <div>template</div>
      <div>create</div> */}
        <div className="flex items-center justify-end flex-1 space-x-2">
          {/* <Search
            placeholder="input search text"
            //    onSearch={onSearch}
            enterButton
            className="w-56"
          /> */}
          <div className="flex items-center cursor-pointer gap-x-1 hover:text-white" onClick={()=>{setIsOpen(true)}}>
            {!isLoading && (
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
                src={data?.avatar}
              />
            )}
            {!isLoading && <div>{data?.name}</div>}
            <AiOutlineDown size={10} color="white" className="ml-1" />
            {/* {user && <AvatarCus user={user} />} */}
          </div>
          {isOpen && (
        <div
          ref={popupRef}
          className="absolute z-50 w-40 bg-white border rounded-lg shadow-lg top-12 right-10"
        >
          <ul className="text-sm text-gray-700">
            <li onClick={()=>{navigation('/settings');setIsOpen(false)}} className="px-4 py-2 hover:text-[#1922FF] cursor-pointer hover:bg-blue-200">Thông tin tài khoản</li>
            <li onClick={()=>{setIsModalVisible(true);setIsOpen(false)}} className="px-4 py-2 text-red-400 cursor-pointer hover:bg-red-100">Đăng xuất</li>

          </ul>
        </div>
      )}
        </div>
      </Header>
    </>
  );
};
