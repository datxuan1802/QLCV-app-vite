import { useAtom } from "jotai";
import { openBoardModal, selectWorkspaceIdAtom } from "@/states/modal.state";
import { useNavigate } from "react-router";

export const BoardTab = ({ board }: any) => {
  const navigation = useNavigate();
  const GetBoard = () => {
    navigation(`/boards/${board._id}`);
  };
  return <div onClick={GetBoard}>{board.name}</div>;
};
export const AddBoardTab = ({ workspaceId }: { workspaceId: string }) => {
  const [, setOpen] = useAtom(openBoardModal);
  const [, setSelectWorkspaceId] = useAtom(selectWorkspaceIdAtom);

  return (
    <button
      onClick={() => {
        setOpen(true);
        setSelectWorkspaceId(workspaceId);
      }}
      className="border-none outline-none "
    >
      Thêm board mới
    </button>
  );
};
