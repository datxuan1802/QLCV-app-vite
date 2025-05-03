import React, { useEffect, useState } from "react";

import { Checkbox, Button, Avatar, Input, Upload } from "antd";

import { UploadOutlined } from "@ant-design/icons";
import { AvatarCus } from "@/components";
import { MainHeader } from "@/components";
import { useNavigate, useParams } from "react-router";
import useScrollToTop, { useScrollToBottom } from "@/hooks/useScrollToTop";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, patch } from "@/services/axios.service";
import { getBgPriorityColor, getBgStatusTask } from "@/utils/mapping";
import { EPriority, EStatus } from "@/utils/type";
import moment from "moment";
import { successToast } from "@/utils/toast";
import io from "socket.io-client";
import useSubTask from "@/hooks/subtask.hook";
import { Trash2 } from 'lucide-react';

let socket: any;
const TaskDetailPage = () => {
  const navigation = useNavigate();
  const { taskId } = useParams();
  const user: any = JSON.parse(localStorage.getItem("user") || "{}");
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<any>([]);

  useScrollToTop();
  const scrollToBottomRef = useScrollToBottom(messages);
  useEffect(() => {
    socket = io(`http://localhost:5556?task_id=${taskId}&user_id=${user?._id}`);
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("receive-comment", (message: any) => {
      console.log("receive-comment");
      console.log(message);
      setMessages((prevMessages: any) => [...prevMessages, message]);
    });
    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, [taskId]);

  const { isLoading: isMessLoading } = useQuery({
    queryKey: [`message/${taskId}`],
    queryFn: () =>
      get(`message/${taskId}`).then((data) => {
        return data;
      }),
    onSuccess: (data) => {
      setMessages(data);
    },
  });
  const { data: task, refetch } = useQuery({
    queryKey: [`task/${taskId}`],
    queryFn: () => get(`task/${taskId}`),
  });
  useEffect(() => {
    refetch();
  }, [task]);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: task?.name || "",
    status: task?.status || "",
    description: task?.description || "",
    priority: task?.priority || "",
  });
  const { mutate } = useMutation({
    mutationFn: async ({ taskId, data }: any) => {
      return await patch(`task/update/${taskId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`task/${taskId}`],
      });
      successToast("Cập nhật thành công");
    },
  });
  const { subTasks, subTaskLoading, createSubTask, updateSubTask,deleteSubtask } = useSubTask(
    taskId as string
  );

  const DoUpdate = () => {
    mutate({
      taskId: taskId,
      data: formData,
    });
  };

  const DoPressEnter = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      socket.emit("send-comment", {
        message: content,
      });
      setContent("");
    }
  };
  return (
    <div>
      <MainHeader />
      <div className="w-full h-screen mt-16">
        <div className="bg-slate-200 h-60">
          {task?.bg_url && (
            // <img src={task?.bg_url} alt="" className="w-full h-full" />
            <img
              src={"/default.png"}
              alt=""
              className="w-full h-full bg-cover"
            />
          )}
        </div>
        <div className="pt-5 space-y-4 px-60">
          <div className="flex flex-row items-center space-x-2">
            {/* <Input
              className="pl-0 ml-0 text-5xl font-bold border-none focus:shadow-none"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  name: e.target.value,
                });
              }}
              placeholder="Task name here"
              defaultValue={formData?.name}
            /> */}
            <h1 className="pl-0 ml-0 text-5xl font-bold border-none focus:shadow-none">
              {formData?.name}
            </h1>
            <Button
              onClick={DoUpdate}
              className="font-bold text-white bg-blue-400 border-2 hover:bg-blue-400"
            >
              Save
            </Button>
            {/* <Upload
              className="text-white border-none "
              showUploadList={false}
              // onChange={handleUpLoadBg}
            >
              <Button
                icon={<UploadOutlined />}
                className="font-bold text-white bg-blue-400"
              >
                Click to Upload
              </Button>
            </Upload> */}
            <Button
              onClick={() => navigation(-1)}
              className="text-black border-2 border-blue-400 hover:bg-blue-400"
            >
              Cancel
            </Button>
          </div>
          <div className="flex flex-row items-center ml-2 space-x-2">
            <StatusTag label={task?.status} />
            <PriorityTag label={task?.priority} />
            <TimeTag
              startDate={moment(task?.startDate).format("DD/MM")}
              dueDate={moment(task?.dueDate).format("DD/MM/YYYY")}
            />
          </div>
          <div>
            <Label label="Description" />
            <Input.TextArea
              className="text-base border-none focus:shadow-none"
              rows={6}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  description: e.target.value,
                });
              }}
              placeholder="Description here"
              defaultValue={formData?.description}
            />
          </div>
          <div>
            <div className="flex flex-row items-center space-x-1">
              <Label label="Sub-task" />
              <Button
                onClick={() => createSubTask()}
                className="flex items-center justify-center pb-2 text-5xl font-bold border-none focus:shadow-none"
              >
                +
              </Button>
            </div>
            <div className="flex flex-col mt-2 space-y-2">
              {!subTaskLoading &&
                subTasks.map((subTask: any) => (
                  <SubTask subTask={subTask} updateSubTask={updateSubTask} deleteSubtask={deleteSubtask} />
                ))}
            </div>
          </div>
          <div className="pb-16">
            <Label label="Comments" />
            <div
              className="mt-6 overflow-y-scroll max-h-96"
              ref={scrollToBottomRef}
            >
              {!isMessLoading &&
                messages.map((item: any) => <Comment message={item} />)}
            </div>
            <div className="flex flex-row items-start justify-center mt-2 space-x-2">
              <AvatarCus user={user} />
              <Input
                className="h-12"
                placeholder="Comments here"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                onKeyDown={DoPressEnter}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;

const StatusTag = ({ label }: { label: string }) => {
  return (
    <div
      className={`${getBgStatusTask(
        label as EStatus
      )} py-1 px-2 rounded-md w-fit font-semibold`}
    >
      {label?.toUpperCase()}
    </div>
  );
};
const PriorityTag = ({ label }: { label: string }) => {
  return (
    <div
      className={`${getBgPriorityColor(
        label as EPriority
      )} py-1 px-2 rounded-md w-fit font-semibold`}
    >
      {label?.toUpperCase()}
    </div>
  );
};

const TimeTag = ({
  startDate,
  dueDate,
}: {
  startDate: string;
  dueDate: string;
}) => {
  return (
    <div className="px-2 py-1 font-semibold bg-blue-400 rounded-md w-fit">
      {startDate} - {dueDate}
    </div>
  );
};

const Label = ({ label }: { label: string }) => {
  return <div className="text-4xl font-semibold">{label}</div>;
};

const Comment = ({ message }: { message: any }) => {
  const user = {
    _id: message?.user?._id,
    name: message?.user?.name,
    avatar: message?.user?.avatar,
  } as User;
  const _user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAuth = _user?._id === user?._id;
  return (
    <div className="flex flex-row items-start mb-2 space-x-4">
      <AvatarCus user={user} tailwind="h-8 w-8" />
      <div
        className={`px-2  rounded-xl w-full min-h-[64px] ${
          isAuth ? "bg-blue-200" : "bg-slate-200"
        }`}
      >
        {message?.message}
      </div>
    </div>
  );
};

const SubTask = ({ updateSubTask,deleteSubtask, subTask }: any) => {
  const [text, setText] = useState(subTask?.name);
  const DoPressEnter = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      updateSubTask({
        subTaskId: subTask._id,
        data: {
          name: text,
        },
      });
      successToast("Cập nhật sub task thành công");
    }
  };
  return (
    <div className="flex flex-row items-center">
      <Checkbox
        className="text-base font-semibold w-fit"
        checked={subTask.status === EStatus.DONE ? true : false}
        onChange={() => {
          updateSubTask({
            subTaskId: subTask._id,
            data: {
              status:
                subTask.status === EStatus.DONE ? EStatus.TODO : EStatus.DONE,
            },
          });
        }}
      />
      <Input
        defaultValue={subTask?.name}
        value={text}
        placeholder="Sub-task name"
        className="border-none w-fit focus:shadow-none"
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={DoPressEnter}
      />
      <button title="trash" onClick={()=>{deleteSubtask({subTaskId: subTask._id})}} className="text-red-500 hover:text-red-700">
      <Trash2 size={20} />
    </button>

    </div>
  );
};
