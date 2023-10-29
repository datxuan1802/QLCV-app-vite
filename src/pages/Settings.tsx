import React from "react";
import { MainLayout } from "@/components";
import { Avatar, Button, Breadcrumb, Input, Upload, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get, patch, post } from "@/services/axios.service";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";

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
        console.log(data);
        patch(`/auth/update`, { avatar: data.url }).then((data) => {
          console.log(data);
          queryClient.invalidateQueries({
            queryKey: ["profile"],
          });
        });
      })
      .catch((err) => {
        console.log(err);
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
        console.log(data);
        patch(`/auth/update`, { background: data.url }).then((data) => {
          console.log(data);
          queryClient.invalidateQueries({
            queryKey: ["profile"],
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <MainLayout>
      <div>
        <div className="h-52 w-full relative">
          <Upload
            className="absolute bottom-[-30px] right-2 z-50"
            showUploadList={false}
            onChange={handleUpLoadBg}
          >
            <Button
              icon={<UploadOutlined />}
              className="bg-blue-400 text-white font-bold"
            >
              Click to Upload
            </Button>
          </Upload>
          <div className="bg-slate-500 h-64 absolute top-0 right-0 left-0">
            <img src={data?.background} alt="" className="w-full h-full" />
          </div>
        </div>
        <div className="ml-6 flex flex-row justify-center items-end">
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
                  src={data?.avatar}
                  alt="avatar"
                  className="rounded-full bg-blue-200"
                />
              )}
            </Upload>
          }
          <div className="font-semibold text-2xl ml-2 mb-10">
            {!isLoading && data?.name}
          </div>
          <div className="flex-1 flex flex-row flex-end space-x-2 justify-end items-center mr-6 mb-2">
            <Button className=" rounded-r-lg bg-blue-400 text-white font-semibold">
              Save
            </Button>
            <Button className="border rounded-r-lg border-slate-200 text-black font-semibold">
              Cancel
            </Button>
          </div>
        </div>
        <Breadcrumb
          className="ml-8 mt-6"
          items={[
            {
              title: "Home",
            },
            {
              title: <a href="">Application Center</a>,
            },
            {
              title: <a href="">Application List</a>,
            },
            {
              title: "An Application",
            },
          ]}
        />
        <div className="flex flex-row items-center justify-start space-x-5 ml-6 mt-6">
          {!isLoading && (
            <InputForm label="Tên người dùng" defaultValue={data.name} />
          )}
          {!isLoading && (
            <InputForm label="Email" defaultValue={data.email} disable={true} />
          )}
        </div>
        <div className="ml-6 mt-6">
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
                  style={{ height: 120, marginBottom: 24, width: 440 }}
                  // onChange={onChange}
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
}
const InputForm = ({
  label,
  inputStyle,
  defaultValue,
  placeholder = "",
  disable = false,
}: InputFormProps) => {
  return (
    <div className={`${inputStyle} space-y-2`}>
      <div className="font-semibold">{label}</div>
      <div>
        <Input size="large" defaultValue={defaultValue} disabled={disable} />
      </div>
    </div>
  );
};
