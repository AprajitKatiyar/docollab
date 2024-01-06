import { atom } from "recoil";

export interface User {
  id: string | null;
  email: string | null;
  name: string | null;
}
export const userState = atom<User>({
  key: "userState",
  default: {
    id: null,
    email: null,
    name: null,
  },
});
