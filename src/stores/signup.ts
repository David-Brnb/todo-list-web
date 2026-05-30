import type { RegisterUserInfo } from "@/types/users/registerUserInfo";
import { create } from "zustand";

// Carries the multi-step sign-up data across the 3 step routes. In-memory only
// (mirrors the RN store) — a hard refresh resets it, so the step routes guard on
// `email` and bounce back to step 1 if the flow wasn't started in order.
type SignupState = RegisterUserInfo & {
  setField: <K extends keyof RegisterUserInfo>(
    key: K,
    value: RegisterUserInfo[K],
  ) => void;
  reset: () => void;
};

const initial: RegisterUserInfo = {
  email: "",
  password: "",
  full_name: "",
  rol: "",
  interests: "",
  description: "",
  firebaseImageUuid: "",
  firebaseUuid: "",
};

export const useSignupStore = create<SignupState>((set) => ({
  ...initial,
  setField: (key, value) =>
    set({ [key]: value } as Pick<RegisterUserInfo, typeof key>),
  reset: () => set(initial),
}));
