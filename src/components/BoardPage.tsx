import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import {
  Button,
  Input,
  Modal,
  Select,
  DatePicker,
  Layout,
  Avatar,
  Image,
  Dropdown,
  Space,
  Upload,
  UploadProps,
  message,
  Tag,
} from "antd";
import {
  ArrowRightOutlined,
  FilterOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBoard, get, patch, post } from "@/services/axios.service";
import { successToast } from "@/utils/toast";
import { useAtom } from "jotai";
import {
  openAddMemberModal,
  openDetailTaskModal,
  openTaskModal,
  selectTaskIdAtom,
  selectViewAtom,
  selectWorkspaceIdAtom,
} from "@/states/modal.state";
import { EPriority, EStatus } from "@/utils/type";
import { useLocation, useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import { getBgPriorityColor, getBgStatusTask } from "@/utils/mapping";
import { AvatarCus } from "@/components/";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";

import io from "socket.io-client";
import { useWorkspace } from "@/hooks/workspace.hook";

const { Header } = Layout;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface KanbanLayoutProps {
  children: React.ReactNode;
  handleOnDragEnd: OnDragEndResponder;
}
export const KanbanLayout = ({
  children,
  handleOnDragEnd,
  ...rest
}: KanbanLayoutProps) => {
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="flex flex-row justify-between mx-2 mt-4 bg-slate-200">
        {children}
      </div>
    </DragDropContext>
  );
};

interface ColumnLayoutProps {
  children: React.ReactNode;
  droppableId: string;
  columnName: string;
  [x: string]: any;
}
export const Column = ({
  children,
  droppableId,
  columnName,
}: ColumnLayoutProps) => {
  // const [, setOpen] = useAtom(openTaskModal);
  return (
    // <div className="p-2 rounded-lg w-72 bg-slate-500">
    <Droppable droppableId={droppableId} type="board">
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`space-y-1 
          w-72 p-2 rounded-lg bg-slate-300 h-fit
          ${snapshot.isDraggingOver ? "bg-red-200" : ""}
            `}
        >
          <div className="font-bold text-center">{columnName}</div>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

interface TaskLayoutProps {
  item: any;
  draggableId: string;
  index: number;
}
export const Task = ({ item, draggableId, index }: TaskLayoutProps) => {
  const [, setOpen] = useAtom(openDetailTaskModal);
  const [, setTaskId] = useAtom(selectTaskIdAtom);
  const { workspaceId } = useParams();

  const { data: user } = useQuery({
    queryKey: [workspaceId],
    queryFn: () => {
      if (!workspaceId) return null;
      return get(`/workspaces/getMembers?workspaceId=${workspaceId}`);
    },
  });
    return (
    <Draggable key={item?._id} draggableId={draggableId} index={index}>
      {(provided) => (
        <div
          className="p-2 bg-white rounded-lg shadow-sm"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => {
            setTaskId(item?._id);
            setOpen(true);
          }}
        >
          <div className="space-y-1">
            {item?.bg_url && (
              <div>
                <img
                  src={item?.bg_url}
                  alt=""
                  className="w-full h-32 border-none bg-slate-200 rounded-xl"
                />
              </div>
            )}
            <div className="px-1 py-2 font-bold">
              {item?.name.toUpperCase()}
            </div>
            <div
              className={`${getBgPriorityColor(
                item.priority
              )} py-1 px-2 rounded-md w-fit font-semibold`}
            >
              {item.priority==='high'?'Cao':item.priority==='medium'?'Trung bình':'Thấp'}
            </div>
            <div className="flex flex-row items-center p-1 bg-blue-500 rounded-md w-fit ">
              <ClockCircleOutlined className="pr-2" />
              {dayjs(item.dueDate).format("DD/MM/YYYY")}
            </div>
            <div>
              <Avatar.Group>
                {item.assignIds.map((data: any, index: number) => {
                  return (
                    <AvatarCus
                      user={
                        user?.find((item: any) => item?.user?._id === data?._id)
                          ?.user
                      }
                      key={index}
                      className="w-5 h-5"
                    />
                  );
                })}
              </Avatar.Group>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export const TaskModal = () => {
  const [open, setOpen] = useAtom(openTaskModal);
  const queryClient = useQueryClient();

  //   input field
  const { boardId, workspaceId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(EPriority.HIGH);
  const [dueDate, setDueDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [assignIds, setAssignIds] = useState<string[]>([]);
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  const { data: assignUsers, isLoading: assignUsersLoading } = useQuery({
    queryKey: [workspaceId],
    queryFn: () => {
      if (!workspaceId) return null;
      return get(`/workspaces/getMembers?workspaceId=${workspaceId}`);
    },
  });
  const assignOptions =
    !assignUsersLoading &&
    assignUsers?.map((item: any) => ({
      label: (
        <div className="flex flex-row items-center ">
          <AvatarCus user={item.user} />
          <div className="ml-2">{item?.user?.name}</div>
        </div>
      ),
      value: item.user?._id,
    }));

  const handleChange: UploadProps["onChange"] = async (
    info: UploadChangeParam<UploadFile>
  ) => {
    const fileUpload = info.file.originFileObj as RcFile;
    const formData = new FormData();
    formData.append("file", fileUpload);

    post("/s3-upload/image?src=task-bg", formData)
      .then((data) => {
        setBgUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTimeFormat = (str: string) => {
    const parts = str.split("/");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };
  const DoSetDate = (dates: any, dateStrings: any) => {
    setStartDate(getTimeFormat(dateStrings[0]));
    setDueDate(getTimeFormat(dateStrings[1]));
  };

  const { isLoading, isError, mutate } = useMutation({
    mutationFn: async () => {
      return await post(`/task/create?boardId=${boardId}`, {
        name,
        description,
        priority,
        dueDate,
        startDate,
        bg_url: bgUrl,
        assignIds,
      });
    },

    onSuccess: (data) => {

      setName('');
      setDescription('');
      setPriority(EPriority.HIGH);
      setAssignIds([]);
      setBgUrl(null);
      queryClient.invalidateQueries({
        queryKey: [`task/findByBoardId/${boardId}`],
      });
      successToast("Tạo nhiệm vụ mới thành công");
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
        title="Tạo nhiệm vụ mới"
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
              placeholder="Task name"
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
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              size="small"
            />
          </div>

          {/* input field */}
          <div className="flex flex-row">
            <label
              htmlFor="name"
              className="block w-32 mb-2 text-sm font-medium text-gray-900 "
            >
              Thời gian
            </label>
            <RangePicker
              className="w-full"
              format="DD/MM/YYYY"
              defaultValue={[dayjs(), dayjs().add(1, "day")]}
              onChange={DoSetDate}
            />
          </div>
          <div className="flex flex-row space-x-2">
            {/* input field */}
            {/* <div className="flex flex-row items-center space-x-1">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Trạng thái nhiệm vụ
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
            </div> */}
            {/* input field */}
            <div className="flex flex-row items-center justify-start space-x-1">
              <label
                htmlFor="name"
                className="block w-24 mb-2 text-sm font-medium text-gray-900 "
              >
                Mức độ
              </label>
              <Select
                defaultValue={EPriority.HIGH}
                style={{ width: 120 }}
                onChange={(val: EPriority) => setPriority(val)}
                options={[
                  { value: EPriority.HIGH, label: "Cao" },
                  { value: EPriority.MEDIUM, label: "Trung bình" },
                  { value: EPriority.LOW, label: "Thấp" },
                ]}
              />
            </div>
          </div>
          {/* input field */}
          <div className="flex flex-row items-center justify-start space-x-1">
            <label
              htmlFor="name"
              className="block w-24 mb-2 mr-5 text-sm font-medium text-gray-900"
            >
              Giao phó
            </label>
            <Select
              // defaultValue={EPriority.HIGH}
              mode="multiple"
              allowClear
              placeholder="Assign user"
              className="w-full"
              onChange={(selectedAssignId) => setAssignIds(selectedAssignId)}
              options={assignOptions}
            />
          </div>
          {/* input field */}
          {/* <div className="flex flex-row items-center">
            <label
              htmlFor="name"
              className="block w-24 mb-2 text-sm font-medium text-gray-900 "
            >
              Background image
            </label>
            <Upload className="" onChange={handleChange} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            <div className="flex-1 h-5 ml-2 overflow-hidden">{bgUrl}</div>
          </div> */}
        </div>
      </Modal>
    </>
  );
};

export const BoardHeader = () => {
  const [, setOpen] = useAtom(openTaskModal);
  const path = useLocation();
  const [, setOpenAddMemberModal] = useAtom(openAddMemberModal);
  const { workspaceId, boardId } = useParams();
  const [, setSelectWorkspaceId] = useAtom(selectWorkspaceIdAtom);
  const [, setSelectView] = useAtom(selectViewAtom);
  const navigation = useNavigate();
 const { workspaces }:any = useWorkspace();
 const Users =JSON.parse(localStorage.getItem('user') as string);
  const { data, isLoading } = useQuery({
    queryKey: [`board/${boardId}`],
    queryFn: () =>
      get(`/board/${boardId}`).then((data) => {
        return data;
      }),
    onSuccess: (data) => {},
  });
  return (
    <>
      <Header className="fixed z-40 flex flex-row items-center justify-center w-full bg-white shadow-xl top-16">
        <div className="flex flex-row items-center justify-start flex-1 w-full space-x-4">
          <div>
            <h2 className="text-2xl font-semibold text-bold max-w-[1/5] truncate">{data?.name}</h2>
          </div>
          <Button
            className="normal-case bg-blue-500 "
            onClick={() => setOpen(true)}
            type="primary"
          >
            Tạo nhiệm vụ mới
          </Button>
          {workspaces?.find((data:any)=>data?.workspace?._id===workspaceId)?.owner===Users?._id&&<Button
            className="normal-case bg-blue-500 "
            onClick={() => {
              setOpenAddMemberModal(true);
              setSelectWorkspaceId(workspaceId as string);
            }}
            type="primary"
          >
            Thêm nhân sự
          </Button>}
          {path.pathname.includes('/report')?'':<Select
            defaultValue="Board"
            style={{ width: 150 }}
            onChange={(value: string) => setSelectView(value)}
            options={[
              { value: "Board", label: "Bảng nhiệm vụ" },
              { value: "Timeline", label: "Dòng thời gian" },
              { value: "Table", label: "Danh sách nhân sự" },
              // { value: "Calendar", label: "Calender" },
            ]}
          />}
          {/* <Button
            className="normal-case bg-blue-500 "
            onClick={() => {
              const url = window.location.pathname;
              const parts = url.split("/");
              const endpoint = parts[parts.length - 1];
              if (endpoint === "report") {
                navigation(`/workspaces/${workspaceId}/boards/${boardId}`);
                return;
              }
              navigation(`/workspaces/${workspaceId}/boards/${boardId}/report`);
            }}
            type="primary"
          >
            Báo cáo
          </Button> */}
          {/* <Button
            className="normal-case bg-blue-500 "
            onClick={() => {
              const url = window.location.pathname;
              const parts = url.split("/");
              const endpoint = parts[parts.length - 1];
              if (endpoint === "report") {
                navigation(`/workspaces/${workspaceId}/boards/${boardId}`);
                return;
              }
              navigation(`/workspaces/${workspaceId}/boards/${boardId}/report`);
            }}
            type="primary"
          >
            Chi tiết
          </Button> */}
          <div className="flex flex-row items-center space-x-2">
            <AvatarGroup />
            <Button
              className="border-blue-400"
              icon={<FilterOutlined className="text-blue-400" />}
              size="large"
            />
          </div>
        </div>
      </Header>
      {/* handle position absolute */}
      <div className="h-16"></div>
    </>
  );
};

// Avatar
let workspaceSocket: any;
const AvatarGroup = () => {
  // const [workspaceId] = useAtom(selectWorkspaceIdAtom);
  const { workspaceId } = useParams();
  const [avatars, setAvatars] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    workspaceSocket = io(
      `http://localhost:5556/workspaces-socket?workspace_id=${workspaceId}`
    );
    workspaceSocket.on("connect", () => {
      console.log("Connected to server");
    });
    workspaceSocket.on("user-access", (newWorkspacePermission: any) => {
      setAvatars((preAvatar: any) => [...preAvatar, newWorkspacePermission]);
    });
    // Clean up the workspaceSocket connection when component unmounts
    return () => {
      workspaceSocket.disconnect();
    };
  }, [workspaceId]);

  const DoGetAvatars = async () => {
    setIsLoading(true);
    const res = await get(`/workspaces/getMembers?workspaceId=${workspaceId}`);
    setAvatars(res);
    setIsLoading(false);
  };
  useEffect(() => {
    DoGetAvatars();
  }, [workspaceId]);

  if (isLoading) return <></>;
  return (
    <Avatar.Group>
      {avatars?.map((item: any) => (
        <AvatarCus key={item?.user?._id} user={item.user} tailwind="h-8 w-8" />
      ))}
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

export const TaskDetailModal = () => {
  const [open, setOpen] = useAtom(openDetailTaskModal);
  const [dataTask, setDataTask] = useState<any>();
  const [selectTaskId] = useAtom(selectTaskIdAtom);
  const [avatars, setAvatars] = useState<any>([]);
  const queryClient = useQueryClient();
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    description: "",
    priority: "",
  });
 
  const { boardId, workspaceId } = useParams();
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [`task/${selectTaskId}`],
    });
  }, [selectTaskId]);
  const { data: task, isLoading } = useQuery({
    queryKey: [`task/${selectTaskId}`],
    queryFn: () => get(`task/${selectTaskId}`),
    onSuccess: (data) => {
      setFormData({
        name: data?.name,
        status: data.status,
        description: data.description,
        priority: data.priority,
      });
    },
  });

  useEffect(()=>{if(task){
    setDataTask(task);
  }},[open,task,selectTaskId])


  const { mutate, error } = useMutation({
    mutationFn: async ({ taskId, data }: any) => {
      return await patch(`task/update/${taskId}`, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`task/findByBoardId/${boardId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`task/${selectTaskId}`],
      });
      successToast("Cập nhật thành công");
      setOpen(false);
    },
  });
  //delete task
  const { mutate:DelBoard} = useMutation({
    mutationFn: async ({taskId}: any) => {
      return await deleteBoard(`task/delete`,taskId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`task/findByBoardId/${boardId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`task/${selectTaskId}`],
      });
      successToast("Xóa task thành công");
      setOpen(false);
      DoCancel();
      setIsModalVisible(false);
    },
  });
  const DoGetAvatars = async () => {
    const res = await get(`/workspaces/getMembers?workspaceId=${workspaceId}`);
    setAvatars(res);
  };
  useEffect(() => {
    DoGetAvatars();
  }, [workspaceId]);

  const DoCancel = () => {
    setOpen(false);
  };

  const DoUpdate = () => {
    mutate({
      taskId: selectTaskId,
      data: formData,
    });
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    DelBoard({taskId: dataTask._id});
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
    <Modal
        title="Xóa task"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận xóa"
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
        Bạn có chắc chắn muốn Xóa task này không?
      </Modal>
    <Modal
      open={!isLoading && open}
      onCancel={DoCancel}
      footer={!!dataTask&&dataTask?.status!=='done'?[
        <Button
          key="submit"
          type="primary"
          className="bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
          // loading={isLoading}
          onClick={() => {
            navigation(
              `/workspaces/${workspaceId}/boards/${boardId}/tasks/${selectTaskId}`
            );
            setOpen(false);
          }}
        >
          Chi tiết
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="bg-white border-blue-400 border text-blue-400 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
          // loading={isLoading}
          onClick={DoUpdate}
        >
          Cập nhật
        </Button>,
        <Button key="back" onClick={showModal} className="text-white bg-red-500">
        Xóa
      </Button>,
        <Button key="back" onClick={DoCancel}>
          Hủy
        </Button>,
      ]:[
        <Button
          key="submit"
          type="primary"
          className="bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
          // loading={isLoading}
          onClick={() => {
            navigation(
              `/workspaces/${workspaceId}/boards/${boardId}/tasks/${selectTaskId}`
            );
            setOpen(false);
          }}
        >
          Chi tiết
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="bg-white border-blue-400 border text-blue-400 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
          // loading={isLoading}
          onClick={DoUpdate}
        >
          Cập nhật
        </Button>,
        
        <Button key="back" onClick={DoCancel}>
          Hủy
        </Button>,
      ]}
    >
      <div className="flex flex-row items-center mb-3 text-3xl">
        <div className="text-base text-gray-400">Tên</div>
        <Input
          defaultValue={dataTask?.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="font-bold border-none focus:border-none focus:shadow-none "
        />
      </div>
      <div className="space-y-6">
        <div className="flex flex-row items-center space-x-2">
          <div className="text-base text-gray-400">Trạng thái</div>
          <div className={`flex-1 flex flex-row items-center space-x-2`}>
            <div
              className={`${getBgStatusTask(
                dataTask?.status
              )} w-fit py-1 px-2 rounded-lg`}
            >
              {dataTask?.status==='todo'?'Việc cần làm':dataTask?.status==='done'?'Hoàn thành':"Đang thực hiện"}
            </div>
            <ArrowRightOutlined />
            <Select
              defaultValue={EStatus.DONE}
              style={{ width: 120 }}
              options={[
                { value: EStatus.DONE, label: "Hoàn thành" },
                { value: EStatus.IN_PROGRESS, label: "Đang làm" },
                { value: EStatus.TODO, label: "Việc cần làm" },
              ]}
              onChange={(value: any) => {
                setFormData((preState) => ({
                  ...preState,
                  status: value,
                }));
              }}
            />
          </div>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <div className="text-base text-gray-400">Mức độ</div>
          <div className={`flex-1 flex flex-row items-center space-x-2`}>
            <div
              className={`${getBgPriorityColor(
                dataTask?.priority
              )} w-fit py-1 px-2 rounded-lg`}
            >
              {dataTask?.priority==='high'?'Cao':dataTask?.priority==='medium'?'Trung bình':'Thấp'}
            </div>
            <ArrowRightOutlined />
            <Select
              defaultValue={EPriority.HIGH}
              style={{ width: 120 }}
              options={[
                { value: EPriority.HIGH, label: "Cao" },
                { value: EPriority.MEDIUM, label: "Trung bình" },
                { value: EPriority.LOW, label: "Thấp" },
              ]}
              onChange={(value: any) => {
                setFormData((preState) => ({
                  ...preState,
                  priority: value,
                }));
              }}
            />
          </div>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <div className="text-base text-gray-400">Ngày đến hạn</div>
          <div className="flex-1">
            <div className="px-2 py-1 rounded-md w-fit bg-slate-200">
              {dayjs(dataTask?.dueDate).format("DD/MM/YYYY")}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <div className="text-base text-gray-400">Giao phó</div>
          <Avatar.Group>
            {
              avatars &&
              dataTask?.assignIds?.map((item: any) => {
                return (
                  <AvatarCus
                    user={
                      avatars?.find((data: any) => data?.user?._id === item._id)
                        ?.user
                    }
                  />
                );
              })}
          </Avatar.Group>
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-2 text-xl font-bold text-black">Mô tả</div>
        <div>
          <TextArea
            rows={4}
            defaultValue={dataTask?.description}
            className="border-none"
            onChange={(e) => {
              setFormData((preState) => ({
                ...preState,
                description: e.target.value,
              }));
            }}
          />
        </div>
      </div>
    </Modal>
    </>
  );
};
