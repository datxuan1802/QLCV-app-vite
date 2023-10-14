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
  DatePickerProps,
  Layout,
  Avatar,
  Image,
  Dropdown,
  Space,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/services/axios.service";
import { successToast } from "@/utils/toast";
import { useAtom } from "jotai";
import {
  openAddMemberModal,
  openDetailTaskModal,
  openTaskModal,
  selectTaskIdAtom,
  selectWorkspaceIdAtom,
} from "@/states/modal.state";
import { EPriority } from "@/utils/type";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import { getBgPriorityColor, getBgStatusTask } from "@/utils/mapping";
import { path } from "@/utils/path";
import { AvatarCus } from "@/components/";

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
      <div className="flex flex-row justify-between mt-4 mx-2">{children}</div>
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
          w-72 p-2 rounded-lg bg-slate-200 h-fit
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
  console.log(item);
  return (
    <Draggable key={item} draggableId={draggableId} index={index}>
      {(provided) => (
        <div
          className="bg-slate-300 rounded-lg shadow-sm p-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => {
            setTaskId(item._id);
            setOpen(true);
          }}
        >
          <div className="space-y-1">
            <div className="py-2 px-1 bg-slate-200 rounded-md">{item.name}</div>
            <div
              className={`${getBgPriorityColor(
                item.priority
              )} py-1 px-2 rounded-md w-fit`}
            >
              {item.priority}
            </div>
            <div className="p-1 rounded-md bg-blue-500 w-fit flex flex-row items-center ">
              <ClockCircleOutlined className="mr-1" />
              {dayjs(item.dueDate).format("DD/MM/YYYY")}
            </div>
            <div>
              <Avatar.Group>
                <AvatarCus user={item.assign} className="w-5 h-5" />
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
  const [bgUrl, setBgUrl] = useState("");

  const {
    data: assignUsers,
    isLoading: assignUsersLoading,
    error,
  } = useQuery({
    queryKey: [workspaceId],
    queryFn: () => {
      return get(`/workspaces/getMembers?workspaceId=${workspaceId}`);
    },
  });

  const assignOptions =
    !assignUsersLoading &&
    assignUsers?.map((item: any) => ({
      label: (
        <div className="flex flex-row items-center">
          <AvatarCus user={item.user} />
          <div className="ml-2">{item.user.name}</div>
        </div>
      ),
      value: item.user._id,
    }));
  // const DoGetAvatars = async () => {
  //   setIsLoading(true);
  //   const res = await get(`/workspaces/getMembers?workspaceId=${workspaceId}`);
  //   setAvatars(res);
  //   setIsLoading(false);
  // };
  // useEffect(() => {
  //   DoGetAvatars();
  // }, [workspaceId]);
  //   navigation
  const DoSetDate = (dates: any, dateStrings: any) => {
    setStartDate(dateStrings[0]);
    setDueDate(dateStrings[1]);
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
        title="Tạo một nhiệm vụ mới"
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
            Quay lại
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
              Tên nhiệm vụ
            </label>
            <Input
              placeholder="Tên nhiệm vụ"
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
              Mô tả
            </label>
            <Input
              placeholder="Mô tả nhiệm vụ"
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
                Độ ưu tiên
              </label>
              <Select
                defaultValue={EPriority.HIGH}
                style={{ width: 120 }}
                onChange={(val: EPriority) => setPriority(val)}
                options={[
                  { value: EPriority.HIGH, label: "Cao" },
                  { value: EPriority.MEDIUM, label: "Vừa" },
                  { value: EPriority.LOW, label: "Thấp" },
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
              Người đảm nhiệm
            </label>
            <Select
              // defaultValue={EPriority.HIGH}
              mode="multiple"
              allowClear
              placeholder="Người nhận nhiệm vụ"
              className="w-full"
              onChange={(selectedAssignId) => setAssignIds(selectedAssignId)}
              options={assignOptions}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export const BoardHeader = () => {
  const [, setOpen] = useAtom(openTaskModal);
  const [, setOpenAddMemberModal] = useAtom(openAddMemberModal);
  const { workspaceId } = useParams();
  const [, setSelectWorkspaceId] = useAtom(selectWorkspaceIdAtom);
  return (
    <Header className="bg-slate-200 flex flex-row justify-center items-center">
      <div className="flex-1 space-x-2 flex flex-row justify-start items-center">
        <div>
          <h2 className="text-2xl text-bold">Board Name</h2>
        </div>
        <Button
          className="bg-blue-500 normal-case "
          onClick={() => setOpen(true)}
          type="primary"
        >
          Tạo nhiệm vụ mới
        </Button>
        <Button
          className="bg-blue-500 normal-case "
          onClick={() => {
            setOpenAddMemberModal(true);
            setSelectWorkspaceId(workspaceId as string);
          }}
          type="primary"
        >
          Thêm thành viên
        </Button>
      </div>
      <div className="flex-none space-x-2 flex flex-row justify-center items-center">
        <AvatarGroup />
        <SmartOptionBoard />
        <div>Filter</div>
      </div>
    </Header>
  );
};

// Avatar
const AvatarGroup = () => {
  // const [workspaceId] = useAtom(selectWorkspaceIdAtom);
  const { workspaceId } = useParams();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        <Avatar key={item.user._id} src={item.user.avatar} />
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
  const [selectTaskId, setSelectTaskId] = useAtom(selectTaskIdAtom);
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [selectTaskId],
    });
  }, [selectTaskId]);
  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: [selectTaskId],
    queryFn: () => get(`task/${selectTaskId}`),
  });
  const [duedate, setDuedate] = useState();

  const DoCancel = () => {
    setOpen(false);
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
          // onClick={handleOk}
        >
          Tạo
        </Button>,
        <Button key="back" onClick={DoCancel}>
          Quay lại
        </Button>,
      ]}
    >
      <div className="text-3xl mb-3 font-bold">{task?.name}</div>
      <div className="space-y-6">
        <div className="flex flex-row space-x-2 items-center">
          <div className="text-base text-gray-400">Assign</div>
          <div className="flex-1">Trung vip</div>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <div className="text-base text-gray-400">Status</div>
          <div className={`flex-1`}>
            <div
              className={`${getBgStatusTask(
                task?.status
              )} w-fit py-1 px-2 rounded-lg`}
            >
              {task?.status}
            </div>
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
          <div className="text-base text-gray-400">Priority</div>
          <div
            className={`${getBgPriorityColor(
              task?.priority
            )} py-1 px-2 rounded-md w-fit`}
          >
            {task?.priority}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="text-xl text-black font-bold">Description</div>
        <div>
          <TextArea rows={4} defaultValue={task?.description} />
        </div>
      </div>
      <div>
        <div className="text-xl text-black font-bold">Comments</div>
      </div>
    </Modal>
  );
};
