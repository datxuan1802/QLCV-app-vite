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
import { get, patch, post } from "@/services/axios.service";
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
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import { getBgPriorityColor, getBgStatusTask } from "@/utils/mapping";
import { AvatarCus } from "@/components/";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";

import io from "socket.io-client";

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
      <div className="flex flex-row justify-between mt-4 mx-2 bg-slate-200">
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
    // <div className="w-72 p-2 rounded-lg bg-slate-500">
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
          <div className="text-center font-bold">{columnName}</div>
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
          className="bg-white rounded-lg shadow-sm p-2"
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
                  className="w-full h-32 bg-slate-200 rounded-xl border-none"
                />
              </div>
            )}
            <div className="py-2 px-1 font-bold">
              {item?.name.toUpperCase()}
            </div>
            <div
              className={`${getBgPriorityColor(
                item.priority
              )} py-1 px-2 rounded-md w-fit font-semibold`}
            >
              {item.priority}
            </div>
            <div className="p-1 rounded-md bg-blue-500 w-fit flex flex-row items-center ">
              <ClockCircleOutlined className="pr-2" />
              {dayjs(item.dueDate).format("DD/MM/YYYY")}
            </div>
            <div>
              <Avatar.Group>
                {item.assignIds.map((data: any, index: number) => {
                  return (
                    <AvatarCus
                      user={
                        user?.find((item: any) => item?.user?._id === data)
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
        console.log(data);
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
      queryClient.invalidateQueries({
        queryKey: [`task/findByBoardId/${boardId}`],
      });
      successToast("Create new task");
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
        title="Create a new task"
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
              className="block mb-2 text-sm font-medium w-32 text-gray-900 "
            >
              Description
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
              className="block mb-2 text-sm font-medium w-32 text-gray-900 "
            >
              Time
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
            {/* <div className="flex flex-row space-x-1 items-center">
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
            <div className="flex flex-row justify-start space-x-1 items-center">
              <label
                htmlFor="name"
                className="block mb-2 w-24 text-sm font-medium text-gray-900 "
              >
                Priority
              </label>
              <Select
                defaultValue={EPriority.HIGH}
                style={{ width: 120 }}
                onChange={(val: EPriority) => setPriority(val)}
                options={[
                  { value: EPriority.HIGH, label: "High" },
                  { value: EPriority.MEDIUM, label: "Medium" },
                  { value: EPriority.LOW, label: "Low" },
                ]}
              />
            </div>
          </div>
          {/* input field */}
          <div className="flex flex-row justify-start space-x-1 items-center">
            <label
              htmlFor="name"
              className="block mb-2 w-24 text-sm font-medium text-gray-900 mr-5"
            >
              Assign
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
          <div className="flex flex-row items-center">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium w-24 text-gray-900 "
            >
              Background image
            </label>
            <Upload className="" onChange={handleChange} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            <div className="ml-2 flex-1 overflow-hidden h-5">{bgUrl}</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export const BoardHeader = () => {
  const [, setOpen] = useAtom(openTaskModal);
  const [, setOpenAddMemberModal] = useAtom(openAddMemberModal);
  const { workspaceId, boardId } = useParams();
  const [, setSelectWorkspaceId] = useAtom(selectWorkspaceIdAtom);
  const [, setSelectView] = useAtom(selectViewAtom);
  const navigation = useNavigate();

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
      <Header className="bg-white flex flex-row justify-center items-center fixed top-16 w-full z-50 shadow-xl">
        <div className="flex-1 space-x-4 flex flex-row justify-start items-center">
          <div>
            <h2 className="text-2xl text-bold">{data?.name}</h2>
          </div>
          <Button
            className="bg-blue-500 normal-case "
            onClick={() => setOpen(true)}
            type="primary"
          >
            Create new task
          </Button>
          <Button
            className="bg-blue-500 normal-case "
            onClick={() => {
              setOpenAddMemberModal(true);
              setSelectWorkspaceId(workspaceId as string);
            }}
            type="primary"
          >
            Invite member
          </Button>
          <Select
            defaultValue="Board"
            style={{ width: 120 }}
            onChange={(value: string) => setSelectView(value)}
            options={[
              { value: "Board", label: "Board" },
              { value: "Timeline", label: "Timeline" },
              { value: "Table", label: "Table" },
              // { value: "Calendar", label: "Calender" },
            ]}
          />
          <Button
            className="bg-blue-500 normal-case "
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
            Report
          </Button>
          <Button
            className="bg-blue-500 normal-case "
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
            Detail
          </Button>
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

  return (
    <Modal
      open={!isLoading && open}
      onCancel={DoCancel}
      footer={[
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
          Detail
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="bg-white border-blue-400 border text-blue-400 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
          // loading={isLoading}
          onClick={DoUpdate}
        >
          Edit
        </Button>,
        <Button key="back" onClick={DoCancel}>
          Cancel
        </Button>,
      ]}
    >
      <div className="text-3xl mb-3  flex flex-row items-center">
        <div className="text-base text-gray-400">Name</div>
        <Input
          defaultValue={task?.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="font-bold border-none focus:border-none focus:shadow-none "
        />
      </div>
      <div className="space-y-6">
        <div className="flex flex-row space-x-2 items-center">
          <div className="text-base text-gray-400">Status</div>
          <div className={`flex-1 flex flex-row items-center space-x-2`}>
            <div
              className={`${getBgStatusTask(
                task?.status
              )} w-fit py-1 px-2 rounded-lg`}
            >
              {task?.status}
            </div>
            <ArrowRightOutlined />
            <Select
              defaultValue={EStatus.DONE}
              style={{ width: 120 }}
              options={[
                { value: EStatus.DONE, label: "Done" },
                { value: EStatus.IN_PROGRESS, label: "In-progress" },
                { value: EStatus.TODO, label: "Todo" },
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
        <div className="flex flex-row space-x-2 items-center">
          <div className="text-base text-gray-400">Priority</div>
          <div className={`flex-1 flex flex-row items-center space-x-2`}>
            <div
              className={`${getBgPriorityColor(
                task?.priority
              )} w-fit py-1 px-2 rounded-lg`}
            >
              {task?.priority}
            </div>
            <ArrowRightOutlined />
            <Select
              defaultValue={EPriority.HIGH}
              style={{ width: 120 }}
              options={[
                { value: EPriority.HIGH, label: "High" },
                { value: EPriority.MEDIUM, label: "Medium" },
                { value: EPriority.LOW, label: "Low" },
              ]}
              onChange={(value: any) => {
                console.log(value);
                setFormData((preState) => ({
                  ...preState,
                  priority: value,
                }));
              }}
            />
          </div>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <div className="text-base text-gray-400">Due date</div>
          <div className="flex-1">
            <div className="w-fit px-2 py-1 rounded-md bg-slate-200">
              {dayjs(task?.dueDate).format("DD/MM/YYYY")}
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <div className="text-base text-gray-400">Assign</div>
          <Avatar.Group>
            {!isLoading &&
              avatars &&
              task?.assignIds?.map((item: any) => {
                console.log(
                  avatars?.find((data: any) => data?.user?._id === item)?.user,
                  "filter data"
                );
                return (
                  <AvatarCus
                    user={
                      avatars?.find((data: any) => data?.user?._id === item)
                        ?.user
                    }
                  />
                );
              })}
          </Avatar.Group>
        </div>
      </div>
      <div className="mt-3">
        <div className="text-xl text-black font-bold mb-2">Description</div>
        <div>
          <TextArea
            rows={4}
            defaultValue={task?.description}
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
  );
};
