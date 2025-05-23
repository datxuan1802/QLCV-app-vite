import React from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "antd";
const ActiveAcc = () => {
  const [searchParams] = useSearchParams();
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 bg-slate-100">
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
      <Button size="large" className="text-white bg-blue-500">
        Chuyển hướng sang hòm thư email
      </Button>
    </div>
  );
};

export default ActiveAcc;
