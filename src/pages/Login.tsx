import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { errorToast, successToast } from "../utils/toast";
// import { loginSchema } from "../utils/schema";
import { path } from "../utils/path";
import { Input, Button, Space } from "antd";
import { post } from "@/services/axios.service";
import { useAtom } from "jotai";
import { userAtom } from "@/states/user.state";

const LoginPage = () => {
  const [email, setEmail] = useState("vutrung26072001@gmail.com");
  const [password, setPassword] = useState("13456");
  const navigation = useNavigate();
  const [, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const DoLogin = async () => {
    setLoading(true);
    try {
      const res = await post("/auth/login", { email, password });
      localStorage.setItem("auth", res.access_token);
      setUser(res.user);
      navigation(path.home);
      successToast("Đăng nhập thành công");
    } catch (error) {
      errorToast("Đăng nhập thất bại");
    }
    setLoading(false);
  };

  return (
    <div className="p-3 h-screen flex justify-center items-center bg-slate-100">
      <div
        // onSubmit={handleSubmit(handleLogin)}
        className="w-[420px] rounded-lg border p-10 flex justify-center flex-col border-slate-300 bg-white mx-auto space-y-6"
      >
        <div className="flex flex-row justify-center">
          <img src="/leadership.png" alt="" className="w-32 h-32" />
        </div>
        <div className="mx-auto text-center my-2">
          <h2 className="text-3xl font-bold">Welcome to my website</h2>
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

        <div className="mb-3 gap-y-5  items-center flex flex-row space-x-2">
          <label className="font-medium text-base w-20">Email</label>
          {/* <Input {...register("email")} /> */}
          {/* <label className="my-0 py-0 text-red-500">
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
        <div className="mb-3 gap-y-5  items-center flex flex-row space-x-2">
          <label className="font-medium text-base w-16">Password</label>
          <Input.Password
            placeholder="password"
            className="bg-white w-full"
            size="large"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          onClick={DoLogin}
          className={"bg-blue-500 w-full text-white "}
          loading={loading}
          disabled={loading}
          size="large"
        >
          Đăng nhập
        </Button>
        <span className="text-[#1952bd] text-center mt-5">
          I forgot my password
        </span>
        <div className="text-center relative p-3 ">
          <span className="">
            Don't have an account yet?{" "}
            <Link className="text-blue-600" to={path.register}>
              Register
            </Link>
          </span>
          <p className="absolute border z-[-1] border-slate-200 top-[50%] w-full left-0 "></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
