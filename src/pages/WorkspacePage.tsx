// import React from "react";
import { MainLayout } from "@/components";
import { useAtom } from "jotai";
import { openBoardModal, openDetailTaskModal, selectWorkspaceIdAtom } from "@/states/modal.state";
import { useWorkspace } from "@/hooks/workspace.hook";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Modal } from "antd";
import { MdMoreVert } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBoard } from "@/services/axios.service";
import { successToast } from "@/utils/toast";
import { useBoard } from "@/hooks/board.hook";
import { queryKey } from "@/utils/queryKey";
import UpdateBoardModal from "@/components/updateBoardModal";
const ProjectPage = () => {
    const {workspaceId } = useParams();
    const navigation = useNavigate();
    const [, setOpen] = useAtom(openBoardModal);
    const [, setSelectWorkspaceId] = useAtom(selectWorkspaceIdAtom);
    const { workspaces }:any = useWorkspace();
   const { setBoards } = useBoard();
    const [isOpen, setIsOpen] = useState(false);
const [dataBorad, setDataBorad] = useState<any>();
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const [select, setSelect] = useState<any>();
    const userId=JSON.parse(localStorage.getItem('user') as string);
    const isOwnerBoards= workspaces.find((data:any)=>data?.workspace?._id===workspaceId)?.owner === userId?._id
    // Click outside để đóng popup
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const { mutate:DelBoard} = useMutation({
      mutationFn: async ({boardId}: any) => {
        return await deleteBoard(`board/delete?boardId=${boardId}`,boardId);
      },
      onSuccess: (data) => {
        successToast("Xóa dự án thành công");
        setIsModalVisible(false);
        setIsOpen(false);
         queryClient.invalidateQueries({ queryKey: [queryKey.workspace] });
         setBoards((preBoards: any) => [...preBoards, data]);
      },
    });
    const [selectedId, setSelectedId] = useState<string|undefined>();
      const [isModalVisible, setIsModalVisible] = useState(false);
    
      const showModal = () => {
        setIsModalVisible(true);
        setIsOpen(false);
      };
      const handleOk = () => {
        DelBoard({boardId:selectedId});
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };
  return (
    <>
    <UpdateBoardModal open={isOpenUpdate} close={()=>{setIsOpenUpdate(false)} } dataBoard={dataBorad}/>
    <Modal
        title="Xóa dự án"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận xóa"
        cancelText="Hủy"
        okButtonProps={{
          className:
            "hover:bg-blue-600 hover:text-white hover:border-none text-black border border-black ",
        }}
        cancelButtonProps={{
          className:
            "border border-black text-black hover:bg-red-100 hover:text-red-500 hover:border-none",
        }}
      >
        Bạn có chắc chắn muốn Xóa dự án này không?
      </Modal>
    <MainLayout workspaceId={workspaceId}>
      
     
      <div className="flex flex-col p-6 px-48 h-fit">
        <div></div>
        <div className="flex items-center justify-between pb-12"><div className="text-3xl font-semibold ">Danh sách dự án</div>{isOwnerBoards&&<button onClick={()=>{setOpen(true);setSelectWorkspaceId(workspaceId!)}} className="p-2 bg-blue-500 rounded cursor-pointer">+ Tạo dự án mới</button>}</div>
        <div className="flex flex-wrap justify-start w-full h-fit gap-x-6 gap-y-2">
  {workspaces.find((data:any)=>data?.workspace?._id===workspaceId)?.workspace?.boards?.map((data: any,index:number) => {
    return (
     <div  key={index} className="flex items-center justify-between w-full px-4 py-2 bg-white border-t border-b rounded-lg cursor-pointer hover:bg-blue-300 gap-x-4">
     <div onClick={()=>navigation(`/workspaces/${workspaceId}/boards/${data?._id}`)}> <Avatar shape='square' className={` bg-green-500`}>
      {data?.name?.charAt(0).toUpperCase()}
    </Avatar></div> 
      <div onClick={()=>navigation(`/workspaces/${workspaceId}/boards/${data?._id}`)} className="flex flex-col w-full text-xs"><div className="font-semibold">{data?.name}</div><div>{data?.description}</div></div>
      <div>
      <button onClick={()=>{setIsOpen(true);setSelect(index)}} title="more" className="p-2">
      <MdMoreVert className="w-6 h-6 text-gray-600" />
    </button>
    {isOpen &&select===index&& (
        <div
          ref={popupRef}
          className="absolute z-50 w-40 bg-white border rounded-lg shadow-lg"
        >
          <ul className="text-sm text-gray-700">
            {isOwnerBoards&&<li onClick={()=>{setIsOpenUpdate(true);setIsOpen(false);setDataBorad(data)}} className="px-4 py-2 cursor-pointer hover:bg-blue-200 hover:text-[#1922FF]">Sửa</li>}
            <li onClick={()=>{setIsOpen(false);navigation(`/workspaces/${workspaceId}/boards/${data?._id}`)}} className="px-4 py-2 cursor-pointer hover:bg-blue-200 hover:text-[#1922FF]">Chi tiết</li>
            {isOwnerBoards&&<li onClick={()=>{showModal();setSelectedId(data?._id)}} className="px-4 py-2 text-red-400 cursor-pointer hover:bg-red-100">Xoá</li>}
          </ul>
        </div>
      )}
    </div>
    
      </div>
    );
  })}
  {workspaces.find((data:any)=>data?.workspace?._id===workspaceId)?.workspace?.boards?.length===0&&(<div  onClick={()=>{setOpen(true);setSelectWorkspaceId(workspaceId!)}} className="flex flex-col items-center justify-center w-full h-full pt-24 text-xl gap-y-4">
    <div>Chưa có dự án nào trong không gian làm việc này tạo ngay thôi</div>
    <div className=" bg-blue-300 text-xl text-[#1922FF] rounded-lg p-4 cursor-pointer">+ Tạo dự án mới</div>
    </div>)}
 
</div>
      </div>
    </MainLayout>
    </>
  );
};

export default ProjectPage;
