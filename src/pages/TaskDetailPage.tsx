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

let socket: any;
const TaskDetailPage = () => {
  const navigation = useNavigate();
  const { taskId } = useParams();
  const user: any = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(user?._id);
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

  const { data, isLoading: isMessLoading } = useQuery({
    queryKey: [`message/${taskId}`],
    queryFn: () =>
      get(`message/${taskId}`).then((data) => {
        return data;
      }),
    onSuccess: (data) => {
      setMessages(data);
    },
  });
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    description: "",
    priority: "",
  });
  const { mutate } = useMutation({
    mutationFn: async ({ taskId, data }: any) => {
      return await patch(`task/update/${taskId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`task/${taskId}`],
      });
      //   queryClient.invalidateQueries({
      //     queryKey: [`task/findByBoardId/${boardId}`],
      //   });
      //   queryClient.invalidateQueries({
      //     queryKey: [`task/${selectTaskId}`],
      //   });
      successToast("Cập nhật thành công");
    },
  });

  const DoUpdate = () => {
    mutate({
      taskId: taskId,
      data: formData,
    });
  };

  const { data: task } = useQuery({
    queryKey: [`task/${taskId}`],
    queryFn: () => get(`task/${taskId}`),
    onSuccess: (data) => {
      setFormData({
        name: data.name,
        status: data.status,
        description: data.description,
        priority: data.priority,
      });
    },
  });
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Do something when Enter is pressed (without Shift)
      // const socket = io(
      //   `http://localhost:5556?task_id=${taskId}&user_id=${user?._id}`
      // );
      socket.emit("send-comment", {
        message: content,
      });
      setContent("");
      // Add your logic here for what should happen when Enter is pressed
      // For example, you can submit the form, save the comment, etc.
    }
  };
  return (
    <div>
      <MainHeader />
      <div className="w-full h-screen mt-16">
        {task?.bg_url && (
          <div className="bg-slate-200 h-60">
            <img src={task?.bg_url} alt="" className="w-full h-full" />
          </div>
        )}
        <div className="px-60 pt-5 space-y-4">
          <div className="flex flex-row items-center space-x-2">
            <Input
              className="text-5xl font-bold border-none focus:shadow-none ml-0 pl-0"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  name: e.target.value,
                });
              }}
              defaultValue={task?.name}
            />
            <Button
              onClick={DoUpdate}
              className="border-2 bg-blue-400 text-white font-bold hover:bg-blue-400"
            >
              Save
            </Button>

            <Upload
              className=" border-none text-white "
              showUploadList={false}
              // onChange={handleUpLoadBg}
            >
              <Button
                icon={<UploadOutlined />}
                className="bg-blue-400 text-white font-bold"
              >
                Click to Upload
              </Button>
            </Upload>
            <Button
              onClick={() => navigation(-1)}
              className="border-2 border-blue-400 text-black hover:bg-blue-400"
            >
              Quay lại
            </Button>
          </div>
          <div className="flex flex-row items-center space-x-2 ml-2">
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
              defaultValue={task?.description}
            />
          </div>
          <div>
            <Label label="Sub-task" />
            <div className="flex flex-col space-y-2 mt-2">
              <Checkbox className="text-base font-semibold w-fit" value="D">
                Sub-task 1
              </Checkbox>
              <Checkbox className="text-base font-semibold w-fit" value="D">
                Sub-task 2
              </Checkbox>
              <Checkbox className="text-base font-semibold w-fit" value="D">
                Sub-task 3
              </Checkbox>
            </div>
          </div>
          <div className="pb-16">
            <Label label="Comments" />
            <div
              className="mt-6 overflow-y-scroll h-96"
              ref={scrollToBottomRef}
            >
              {!isMessLoading &&
                messages.map((item: any) => <Comment message={item} />)}
            </div>
            <div className="flex flex-row items-start justify-center space-x-2 mt-2">
              <AvatarCus user={user} />
              <Input
                className="h-12"
                placeholder="Comments here"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                onKeyDown={handleKeyPress}
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
    <div className="bg-blue-400 py-1 px-2 rounded-md w-fit font-semibold">
      {startDate} - {dueDate}
    </div>
  );
};

const Label = ({ label }: { label: string }) => {
  return <div className="font-semibold text-4xl">{label}</div>;
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
    <div className="flex flex-row items-start space-x-4 mb-2">
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
