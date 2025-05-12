// import React from "react";
import { MainLayout } from "@/components";
import { useAtom } from "jotai";
import { openBoardModal, selectWorkspaceIdAtom } from "@/states/modal.state";
import { useWorkspace } from "@/hooks/workspace.hook";
import { useNavigate, useParams } from "react-router-dom";
const ProjectPage = () => {
      const {workspaceId } = useParams();
          const navigation = useNavigate();
          const [, setOpen] = useAtom(openBoardModal);
          const [, setSelectWorkspaceId] = useAtom(selectWorkspaceIdAtom);
    const { workspaces }:any = useWorkspace();
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
        <div className="flex items-center justify-between pb-12"><div className="text-3xl font-semibold ">Danh sách dự án</div><button onClick={()=>{setOpen(true);setSelectWorkspaceId(workspaceId!)}} className="p-2 bg-blue-500 rounded cursor-pointer">+ Tạo dự án mới</button></div>
        <div className="flex flex-wrap justify-start w-full h-fit gap-x-6 gap-y-6">
  {workspaces.find((data:any)=>data?._id===workspaceId)?.workspace?.boards?.map((data: any,index:number) => {
    return (
     <div onClick={()=>navigation(`/workspaces/${workspaceId}/boards/${data?._id}`)} key={index} className="flex flex-col w-full py-4 bg-white border-t border-b"><div>{data?.name}</div><div>{data?.description}</div></div>
    );
  })}
 
</div>
      </div>
    </MainLayout>
  );
};

export default ProjectPage;
