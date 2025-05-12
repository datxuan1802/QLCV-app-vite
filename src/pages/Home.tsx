// import React from "react";
import { MainLayout } from "@/components";
import { useDefaultPage } from "@/hooks/localStorage.hook";
import { Button } from "antd";
import { useAtom } from "jotai";
import { openWorkspaceModal } from "@/states/modal.state";
import { useWorkspace } from "@/hooks/workspace.hook";
import { useNavigate } from "react-router";
const Home = () => {
  // useDefaultPage();
    const navigation = useNavigate();
  
  const [, setOpen] = useAtom(openWorkspaceModal);
    const { workspaces } = useWorkspace();
    const Users= JSON.parse(localStorage.getItem('user') as string);
    console.log(Users,'user');
console.log(workspaces,'ws');
  return (
    <MainLayout>
      {/* <div className="flex flex-col items-center justify-center h-full space-y-4">
        <img src="/leadership.png" alt="" className="w-80 h-80" />
        <h1 className="text-3xl w-[600px] font-semibold text-center">
          Tạo không gian làm việc mới
        </h1>
        <div>
          <Button
            size="large"
            className="text-white bg-blue-500"
            onClick={() => setOpen(true)}
          >
            Tạo không gian làm việc mới
          </Button>
        </div>
      </div> */}
      <div className="flex flex-col p-6 h-fit px-9">
        <div className="pb-12 text-3xl font-semibold">Danh sách không gian làm việc</div>
        <div className="flex flex-wrap justify-start w-full h-fit gap-x-6 gap-y-6">
  {workspaces.map((data: any) => {
    return (
      <div
        onClick={() => {
          navigation(`/workspaces/${data?._id}`);
        }}
        key={data._id}
        className="flex flex-col w-[calc(33.333%-1rem)] p-4 cursor-pointer bg-white hover:bg-blue-100 border rounded-lg h-[200px] gap-y-2"
      >
        <div className="flex items-center text-[15px] gap-x-2">
          <p className="w-20 font-semibold">Tên : </p>
          <p className="font-normal ">{data?.workspace?.name}</p>
        </div>
        <div className="flex items-center text-[15px] gap-x-2">
          <p className="w-20 font-semibold">Mô tả : </p>
          <p className="font-normal">{data?.workspace?.description}</p>
        </div>
        <div className="flex items-center text-[15px] gap-x-2">
          <p className="w-20 font-semibold">Vai trò : </p>
          <p className="font-normal">
            {data?.owner === Users?._id ? "Người tạo" : "Thành viên"}
          </p>
        </div>
        <div className="flex items-center text-[15px] gap-x-2">
          <p className="w-20 font-semibold">Dự án : </p>
          <p className="font-normal">{data?.workspace?.boards?.length}</p>
        </div>
        <div className="flex items-center text-[15px] gap-x-2">
          <p className="w-20 font-semibold">Loại : </p>
          <p className="font-normal">
            {data?.workspace?.type === "private" ? "Riêng tư" : "Mở"}
          </p>
        </div>
      </div>
    );
  })}
  <div
    onClick={() => {
      setOpen(true);
    }}
    className="h-[200px] w-[calc(33.333%-1rem)] rounded-lg cursor-pointer bg-white flex flex-col justify-center items-center text-2xl text-[#1922FF]"
  >
    <p>Tạo không gian làm việc mới</p>
    <p className="text-2xl">+</p>
  </div>
</div>
      </div>
    </MainLayout>
  );
};

export default Home;
