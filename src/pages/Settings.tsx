import React, { useState } from "react";
import { MainLayout } from "@/components";
import { Avatar, Button, Breadcrumb, Input, Upload, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get, patch, post } from "@/services/axios.service";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import { errorToast, successToast } from "@/utils/toast";

const Settings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      return get(`/auth/profile`).then((data) => {
        return data;
      });
    },
  });

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const queryClient = useQueryClient();
  const handleChange: UploadProps["onChange"] = async (
    info: UploadChangeParam<UploadFile>
  ) => {
    const fileUpload = info.file.originFileObj as RcFile;
    const formData = new FormData();
    formData.append("file", fileUpload);

    post("/s3-upload/image?src=avatar", formData)
      .then((data) => {
        patch(`/auth/update`, { avatar: data.url }).then((data) => {
          queryClient.invalidateQueries({
            queryKey: ["profile"],
          });
        });
      })
      .catch((err) => {
      });
    // if (info.file.status === "uploading") {
    //   // setLoading(true);
    //   return;
    // }
    // if (info.file.status === "done") {
    //   console.log("done");
    //   const fileUpload = info.file.originFileObj as RcFile;
    //   const formData = new FormData();
    //   formData.append("file", fileUpload);

    //   post("/s3-upload/image?src=avatar", formData)
    //     .then((data) => {
    //       console.log(data);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
  };
  const handleUpLoadBg: UploadProps["onChange"] = async (
    info: UploadChangeParam<UploadFile>
  ) => {
    const fileUpload = info.file.originFileObj as RcFile;
    const formData = new FormData();
    formData.append("file", fileUpload);

    post("/s3-upload/image?src=user-bg", formData)
      .then((data) => {
        patch(`/auth/update`, { background: data.url }).then((data) => {
          queryClient.invalidateQueries({
            queryKey: ["profile"],
          });
        });
      })
      .catch((err) => {
      });
  };
  const [userName, setUserName] = useState(data?.name!);
  const [bio, setBio] = useState(data?.bio);

  const DoUpdateUSer = async () => {
    try {
      const res = await patch("/auth/update", {
        ...data,
        name: userName,
        bio: bio,
      });

      successToast("Cập nhật thành công.");
      return res;
    } catch (error) {
      errorToast("Cập nhật thất bại.");
    }
  };
  return (
    <MainLayout>
      <div>
        <div className="relative w-full h-52">
          {/* <Upload
            className="absolute bottom-[-30px] right-2 z-50"
            showUploadList={false}
            onChange={handleUpLoadBg}
          >
            <Button
              icon={<UploadOutlined />}
              className="font-bold text-white bg-blue-400"
            >
              Click to Upload
            </Button>
          </Upload> */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-slate-500">
            <img
              // src={data?.background ? data?.background : "/default.png"}
              src="/default.png"
              alt=""
              className="w-full h-full bg-cover"
            />
          </div>
        </div>
        <div className="flex flex-row items-end justify-center ml-6">
          {
            <Upload
              className="z-40 w-32 "
              // name="avatar"
              // listType="picture-circle"
              showUploadList={false}
              // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              // beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {!isLoading && (
                <img
                  // src={data?.avatar ? data?.avatar : "/logot1.jpg"}
                  src={"/logot1.jpg"}
                  alt="avatar"
                  className="bg-blue-200 rounded-full"
                />
              )}
            </Upload>
          }
          <div className="mb-10 ml-2 text-2xl font-semibold">
            {!isLoading && data?.name}
          </div>
          <div className="flex flex-row items-center justify-end flex-1 mb-2 mr-6 space-x-2 flex-end">
            <Button
              onClick={DoUpdateUSer}
              className="font-semibold text-white bg-blue-400 rounded-r-lg "
            >
              Lưu
            </Button>
            <Button className="font-semibold text-black border rounded-r-lg border-slate-200">
              Hủy
            </Button>
          </div>
        </div>
        <Breadcrumb
          className="mt-6 ml-8"
          items={[
            {
              title: <a href="/">Home</a>,
            },
            // {
            //   title: <a href="">Application Center</a>,
            // },
            // {
            //   title: <a href="">Application List</a>,
            // },
            {
              title: "Tài khoản của tôi",
            },
          ]}
        />
        <div className="flex flex-row items-center justify-start mt-6 ml-6 space-x-5">
          {!isLoading && (
            <InputForm
              label="Tên người dùng"
              defaultValue={data?.name}
              setUserName={setUserName}
            />
          )}
          {!isLoading && (
            <InputForm label="Email" defaultValue={data?.email} disable={true} />
          )}
        </div>
        <div className="mt-6 ml-6">
          <div className={`space-y-2`}>
            <div className="font-semibold">Mô tả</div>
            <div>
              {!isLoading && (
                <Input.TextArea
                  defaultValue={data.bio}
                  placeholder="Mô tả"
                  size="large"
                  showCount
                  maxLength={100}
                  style={{ height: 200, marginBottom: 24, width: 440 }}
                  onChange={(e) => setBio(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default Settings;

interface InputFormProps {
  label: string;
  inputStyle?: string;
  defaultValue: string;
  placeholder?: string;
  disable?: boolean;
  setUserName: React.Dispatch<any>;
}
const InputForm = ({
  label,
  inputStyle,
  defaultValue,
  placeholder = "",
  disable = false,
  setUserName,
}: InputFormProps) => {
  return (
    <div className={`${inputStyle} space-y-2`}>
      <div className="font-semibold">{label}</div>
      <div>
        <Input
          size="large"
          defaultValue={defaultValue}
          disabled={disable}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
    </div>
  );
};
