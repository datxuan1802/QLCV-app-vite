import React from "react";

import { Checkbox, Button, Avatar, Input, Upload } from "antd";

import { UploadOutlined } from "@ant-design/icons";
import type { CheckboxValueType } from "antd/es/checkbox/Group";

import { MainHeader } from "@/components";

const TaskDetailPage = () => {
  return (
    <div>
      <MainHeader />
      <div className="w-full h-screen mt-16">
        <div className="bg-red-500 h-60"></div>
        <div className="px-60 pt-5 space-y-4">
          <div className="flex flex-row items-center space-x-2">
            <Input
              className="text-5xl font-bold border-none focus:shadow-none ml-0 pl-0"
              defaultValue="Title"
            />
            <Button className="border-2 border-blue-400 text-black hover:bg-blue-400">
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
          </div>
          <div className="flex flex-row items-center space-x-2 ml-2">
            <StatusTag label="In Progress" />
            <StatusTag label="In Progress" />
            <StatusTag label="In Progress" />
          </div>
          <div>
            <Input.TextArea
              className="text-base border-none focus:shadow-none"
              rows={6}
              defaultValue={
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatemqui odio sint ab est ipsum asperiores. Laudantium quis sunt nonducimus sit rerum illo nulla qui, aliquid, earum repellendus, quodvoluptates officiis? Recusandae alias earum, aspernatur quaerat velillo quae itaque! Esse beatae eveniet natus rerum vitae a recusandaeporro, incidunt ea tempore itaque, iste nisi labore iure, voluptatumreprehenderit in magni mollitia! Ad, sunt amet assumenda at maximevoluptatem eos ipsa adipisci repellendus eveniet commodi accusamusea earum porro a alias laborum perspiciatis illo, cupiditate sequiquidem sint accusantium illum cum. Dicta a sunt modi! Illumpraesentium officia nesciunt."
              }
            ></Input.TextArea>
          </div>
          <div>
            <Label label="Sub-task" />
            <div className="flex flex-col space-y-2 mt-2">
              <Checkbox className="text-base font-semibold" value="D">
                Sub-task 1
              </Checkbox>
              <Checkbox className="text-base font-semibold" value="D">
                Sub-task 2
              </Checkbox>
              <Checkbox className="text-base font-semibold" value="D">
                Sub-task 3
              </Checkbox>
            </div>
          </div>
          <div className="pb-16">
            <Label label="Comments" />
            <div className="flex flex-row items-start justify-center space-x-2 mt-2">
              <Avatar>T</Avatar>
              <Input.TextArea rows={4} placeholder="Comments here" />
            </div>
            <div className="mt-6">
              <Comment />
              <Comment />
              <Comment />
              <Comment />
              <Comment />
              <Comment />
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
    <div className="bg-blue-400 py-1 px-2 rounded-md w-fit font-semibold">
      {label}
    </div>
  );
};

const Label = ({ label }: { label: string }) => {
  return <div className="font-semibold text-4xl">{label}</div>;
};

const Comment = () => {
  return (
    <div className="flex flex-row items-start space-x-4 mb-2">
      <Avatar className="w-12 h-8">T</Avatar>
      <div className="px-2 bg-slate-200 rounded-xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
        veritatis id, minus cupiditate est sunt culpa, dolorum necessitatibus
        autem delectus alias recusandae ipsum dolores. Facilis mollitia
        similique natus placeat ex.
      </div>
    </div>
  );
};
