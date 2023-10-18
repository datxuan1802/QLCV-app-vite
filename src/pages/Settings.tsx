import React from "react";
import { MainLayout } from "@/components";
import { Avatar, Button, Breadcrumb, Input } from "antd";

const Settings = () => {
  return (
    <MainLayout>
      <div>
        <div className="h-52 w-full relative">
          <div className="bg-slate-300 h-64 absolute top-0 right-0 left-0"></div>
        </div>
        <div className="ml-6 flex flex-row justify-center items-end">
          <Avatar className="w-24 h-24 bg-blue-200" src="/leadership.png" />
          <div className="font-semibold text-2xl ml-2 mb-2">Trung Vux</div>
          <div className="flex-1 flex flex-row flex-end space-x-2 justify-end items-center mr-6 mb-2">
            <Button className=" rounded-r-lg bg-blue-400 text-white font-semibold">
              Save
            </Button>
            <Button className="border rounded-r-lg border-slate-200 text-black font-semibold">
              Cancel
            </Button>
          </div>
        </div>
        <Breadcrumb
          className="ml-8 mt-6"
          items={[
            {
              title: "Home",
            },
            {
              title: <a href="">Application Center</a>,
            },
            {
              title: <a href="">Application List</a>,
            },
            {
              title: "An Application",
            },
          ]}
        />
        <div className="flex flex-row items-center justify-start space-x-5 ml-6 mt-6">
          <InputForm label="Tên người dùng" />
          <InputForm label="Email" />
        </div>
        <div className="ml-6 mt-6">
          <div className={`space-y-2`}>
            <div className="font-semibold">Mô tả</div>
            <div>
              <Input.TextArea
                placeholder="Mô tả"
                size="large"
                showCount
                maxLength={100}
                style={{ height: 120, marginBottom: 24, width: 440 }}
                // onChange={onChange}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default Settings;

interface InputFormProps {
  label: string;
  inputStyle?: string;
}
const InputForm = ({ label, inputStyle }: InputFormProps) => {
  return (
    <div className={`${inputStyle} space-y-2`}>
      <div className="font-semibold">{label}</div>
      <div>
        <Input placeholder={label} size="large" />
      </div>
    </div>
  );
};
