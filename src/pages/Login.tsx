import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
import { useState } from "react";
import { errorToast, successToast } from "../utils/toast";
// import { loginSchema } from "../utils/schema";
import { path } from "../utils/path";
import { Input, Button, Space } from "antd";
import { get, post } from "@/services/axios.service";
import { useAtom } from "jotai";
import { userAtom } from "@/states/user.state";

// login btn
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [email, setEmail] = useState("vutrung26072001@gmail.com");
  const [password, setPassword] = useState("13456");
  const navigation = useNavigate();
  const [, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await get(
          `/auth/login-with-google?access_token=${tokenResponse.access_token}`
        );
        localStorage.setItem("auth", res.access_token);
        setUser(res.user);
        navigation(path.home);
        successToast("Đăng nhập thành công");
      } catch (error) {
        errorToast("Đăng nhập thất bại");
      }
      setLoading(false);
    },
  });

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
          <h2 className="text-3xl font-bold">Task management</h2>
        </div>
        <div className="flex flex-col gap-5"></div>
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
        <div className="flex flex-col space-y-1">
          <Button
            onClick={DoLogin}
            className={"bg-blue-500 w-full text-white "}
            loading={loading}
            disabled={loading}
            size="large"
          >
            Đăng nhập
          </Button>
          <Button
            className={
              "w-full text-black flex flex-row items-center justify-center font-semibold py-1"
            }
            onClick={() => loginWithGoogle()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              className="w-6 h-6 mr-2"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Sign in with Google
          </Button>
          {/* <GoogleLogin
            type="standard"
            size="large"
            onSuccess={() => loginWithGoogle()}
            // onSuccess={(tokenResponse) => {
            //   console.log(tokenResponse);
            // }}
            onError={() => {
              console.log("Login Failed");
            }}
            auto_select={false}
          /> */}
        </div>
        <span className="text-[#1952bd] text-center mt-5">Quên mật khẩu</span>
        <div className="text-center relative p-3 ">
          <span className="">
            Chưa có tài khoản trong hệ thống?{" "}
            <Link className="text-blue-600" to={path.register}>
              Đăng ký
            </Link>
          </span>
          <p className="absolute border z-[-1] border-slate-200 top-[50%] w-full left-0 "></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
