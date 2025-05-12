// import React from "react";
import { MainLayout } from "@/components";
import { useDefaultPage } from "@/hooks/localStorage.hook";
import { Button } from "antd";
import { useAtom } from "jotai";
import { openWorkspaceModal } from "@/states/modal.state";
const Home = () => {
  // useDefaultPage();
  const [, setOpen] = useAtom(openWorkspaceModal);
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-full space-y-4">
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
      </div>
    </MainLayout>
  );
};

export default Home;
