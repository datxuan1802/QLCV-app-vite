import React from "react";
import { MainLayout } from "@/components";
import { useDefaultPage } from "@/hooks/localStorage.hook";
const Home = () => {
  useDefaultPage();
  return (
    <MainLayout>
      <div className="flex justify-center items-center h-full flex-col">
        <img src="../../public/leadership.png" alt="" className="w-96 h-96" />
        <h1 className="text-3xl mx-8">
          Vui lòng tạo một workspace mới hoặc tham gia vào một workspace
        </h1>
      </div>
    </MainLayout>
  );
};

export default Home;
