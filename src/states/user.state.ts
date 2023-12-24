import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import dayjs from "dayjs";
export const userAtom = atomWithStorage<User | null>("user", null);

export const reportDataAtom = atom(null);
export const startDateAtom = atom(dayjs().format("YYYY-MM-DD"));
export const dueDateAtom = atom(dayjs().format("YYYY-MM-DD"));
