import React from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "antd";
const ActiveAcc = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("invite"));
  return (
    <div className="flex flex-col h-screen space-y-6 justify-center items-center  bg-slate-100">
      <div className="mt-5">
        <img src="/leadership.png" alt="" className="w-80 h-80" />
      </div>
      <div>
        <h1 className="text-2xl font-bold w-[600px] text-center">
          {searchParams.get("invite")
            ? `Tham gia vào workspace thành công `
            : `Đăng ký thành công vui lòng kiểm tra email và kích hoạt tài khoản của bạn`}
        </h1>
      </div>
      <Button size="large" className="bg-blue-500 text-white">
        Chuyển hướng sang hòm thư email
      </Button>
    </div>
  );
};

export default ActiveAcc;
