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
        <div className="flex flex-row space-x-1">
          <Button
            onClick={DoLogin}
            className={"bg-blue-500 w-full text-white "}
            loading={loading}
            disabled={loading}
            size="large"
          >
            Đăng nhập
          </Button>

          <GoogleLogin
            type="icon"
            size="large"
            onSuccess={() => loginWithGoogle()}
            // onSuccess={(tokenResponse) => {
            //   console.log(tokenResponse);
            // }}
            onError={() => {
              console.log("Login Failed");
            }}
            auto_select={false}
          />
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
