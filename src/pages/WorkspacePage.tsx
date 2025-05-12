// import React from "react";
import { MainLayout } from "@/components";
import { useDefaultPage } from "@/hooks/localStorage.hook";
import { Button } from "antd";
import { useAtom } from "jotai";
import { openBoardModal, openWorkspaceModal } from "@/states/modal.state";
import { useWorkspace } from "@/hooks/workspace.hook";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
const ProjectPage = () => {
      const {workspaceId } = useParams();
          const navigation = useNavigate();
  const [, setOpen] = useAtom(openBoardModal); 
   const Users= JSON.parse(localStorage.getItem('user') as string);
    const { workspaces }:any = useWorkspace();
console.log(workspaces,'ws');

  return (
    <MainLayout workspaceId={workspaceId}>
      {/* <div className="flex flex-col items-center justify-center h-full space-y-4">
        <img src="/leadership.png" alt="" className="w-80 h-80" />
        <h1 className="text-3xl w-[600px] font-semibold text-center">
          Tạo không gian làm việc mới
        </h1>
        <div>
          <Button
            size="large"
            className="text-white bg-blue-500"
            onClick={() => setOpen(true)}
          >
            Tạo không gian làm việc mới
          </Button>
        </div>
      </div> */}
      <div className="flex flex-col p-6 px-48 h-fit">
        <div></div>
        <div className="pb-12"><div className="text-3xl font-semibold ">Danh sách dự án</div></div>
        <div className="flex flex-wrap justify-start w-full h-fit gap-x-6 gap-y-6">
  {workspaces.find((data:any)=>data?._id===workspaceId)?.workspace?.boards?.map((data: any) => {
    return (
     <div></div>
    );
  })}
 
</div>
      </div>
    </MainLayout>
  );
};

export default ProjectPage;
