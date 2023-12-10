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
      <div className="flex justify-center items-center h-full flex-col space-y-4">
        <img src="/leadership.png" alt="" className="w-80 h-80" />
        <h1 className="text-3xl w-[600px] font-semibold text-center">
          Vui lòng tạo một workspace
        </h1>
        <div>
          <Button
            size="large"
            className="bg-blue-500 text-white"
            onClick={() => setOpen(true)}
          >
            Tạo một workspace
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
