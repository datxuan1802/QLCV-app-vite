"use client";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { errorToast, successToast } from "../utils/toast";
import { path } from "../utils/path";
import { Input, Button, Space } from "antd";
import { post } from "@/services/axios.service";
const Register = () => {
  const [username, setUsername] = useState("Mananger");
  const [email, setEmail] = useState("Manager01@gmail.com");
  const [password, setPassword] = useState("123456");
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const DoRegister = async () => {
    setLoading(true);
    try {
      const res = await post("/auth/register", {
        name: username,
        email,
        password,
        roles: ["Manager"],
        // isActivated: true,
      });
      //   localStorage.setItem("auth", res.access_token);
      //   setUser(res.user);
      setLoading(false);
      navigation(path.activeAccount); //push page active account email
      // navigation(path.login);
      successToast("Đăng ký thành công");
    } catch (error) {
      errorToast("Đăng ký thất bại");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen p-3 bg-slate-100">
      <div
        // onSubmit={handleSubmit(handleLogin)}
        className="w-[430px] rounded-lg border p-10 flex justify-center flex-col border-slate-300 bg-white mx-auto space-y-6"
      >
        <div className="flex flex-row justify-center">
          <img src="/leadership.png" alt="" className="w-32 h-32" />
        </div>
        <div className="mx-auto my-2 text-center">
          <h2 className="text-3xl font-bold">Quản lý dự án </h2>
        </div>
        <div className="flex flex-col gap-5">
          {/* <Button className="border-none text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2">
            <svg
              className="w-4 h-4 mr-2 -ml-1"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign in with Google
          </Button> */}
          {/* <Button
            type="button"
            className="text-white border-none text-center bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center mr-2 mb-2"
          >
            <svg
              className="w-4 h-4 mr-2 -ml-1"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="facebook-f"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"
              ></path>
            </svg>
            Sign in with Facebook
          </Button> */}
        </div>

        <div className="flex flex-row items-center mb-3 space-x-2 gap-y-5">
          <label className="w-24 text-base font-medium">Tên</label>
          {/* <Input {...register("email")} /> */}
          {/* <label className="py-0 my-0 text-red-500">
            {errors?.email?.message}
          </label> */}
          <Input
            placeholder="Tên"
            size="large"
            className="w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-row items-center mb-3 space-x-2 gap-y-5">
          <label className="w-24 text-base font-medium">Email</label>
          {/* <Input {...register("email")} /> */}
          {/* <label className="py-0 my-0 text-red-500">
            {errors?.email?.message}
          </label> */}
          <Input
            placeholder="email"
            size="large"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-row items-center mb-3 space-x-2 gap-y-5">
          <label className="w-24 text-base font-medium">Mật khẩu</label>
          <Input.Password
            placeholder="Mật khẩu"
            className="w-full bg-white"
            size="large"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          onClick={DoRegister}
          className={"bg-blue-500 w-full text-white "}
          loading={loading}
          disabled={loading}
          size="large"
        >
          Đăng ký tài khoản
        </Button>
        <span className="text-[#1952bd] text-center mt-5">
          Quên mật khẩu
        </span>
        <div className="relative p-3 text-center ">
          <span className="">
            Đã có tài khoản đi đến để {" "}
            <Link className="text-blue-600" to={path.login}>
              Đăng nhập
            </Link>
          </span>
          <p className="absolute border z-[-1] border-slate-200 top-[50%] w-full left-0 "></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
