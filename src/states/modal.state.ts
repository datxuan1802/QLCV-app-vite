import { atom } from "jotai";

export const openWorkspaceModal = atom<boolean>(false);
export const openBoardModal = atom<boolean>(false);
export const openTaskModal = atom<boolean>(false);
export const openAddMemberModal = atom<boolean>(false);

export const selectWorkspaceIdAtom = atom<string>("");
export const selectBoardIdAtom = atom<string>("");
