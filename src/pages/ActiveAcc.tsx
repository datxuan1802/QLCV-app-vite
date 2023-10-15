import React from "react";

const ActiveAcc = () => {
  return (
    <div className="flex flex-col h-screen space-y-6 justify-center items-center  bg-slate-100">
      <div className="mt-5">
        <img src="../../public/leadership.png" alt="" className="w-80 h-80" />
      </div>
      <div>
        <h1 className="text-2xl font-bold w-[600px] text-center">
          {`Đăng ký thành công vui lòng kiểm tra email và kích hoạt tài khoản của bạn`}
        </h1>
      </div>
    </div>
  );
};

export default ActiveAcc;
