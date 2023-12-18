import { useAtom } from "jotai";
import { openBoardModal, selectWorkspaceIdAtom } from "@/states/modal.state";
import { useNavigate } from "react-router";

export const BoardTab = ({ board, workspaceId }: any) => {
  const navigation = useNavigate();
  const GetBoard = () => {
    navigation(`/workspaces/${workspaceId}/boards/${board._id}`);
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
      Add new project
    </button>
  );
};
