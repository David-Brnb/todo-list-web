import type { RegisterUserInfo } from "@/types/users/registerUserInfo";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth } from "./auth";
import { storage } from "./storage";

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential":
    "Incorrect email or password. Please check your details and try again.",
  "auth/invalid-email": "The email address is invalid.",
  "auth/user-not-found": "No account exists with this email address.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests":
    "Too many failed attempts. Please try again later.",
  "auth/network-request-failed":
    "Connection error. Check your internet connection.",
};

const REGISTER_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use":
    "An account with this email address already exists.",
  "auth/invalid-email": "The email address is invalid.",
  "auth/weak-password": "The password is too weak. Use at least 8 characters.",
  "auth/network-request-failed":
    "Connection error. Check your internet connection.",
};

function mapAuthError(
  err: unknown,
  messages: Record<string, string>,
  fallback: string,
): Error {
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? String((err as { code: unknown }).code)
      : "";
  return new Error(messages[code] ?? fallback);
}

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    const token = await user.getIdToken();
    return token;
  } catch (err) {
    throw mapAuthError(
      err,
      LOGIN_ERROR_MESSAGES,
      "Couldn't sign in. Please try again.",
    );
  }
};

export const logout = async () => {
  await signOut(auth);
};

export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    const token = await user.getIdToken();
    return token;
  } catch (err) {
    throw mapAuthError(
      err,
      REGISTER_ERROR_MESSAGES,
      "Couldn't create the account. Please try again.",
    );
  }
};

/**
 * Creates a new Firebase Auth account, uploads the profile photo to Storage,
 * and compiles the RegisterUserInfo payload containing the Auth Uid and image URL.
 *
 * Web swaps the RN XHR-to-blob workaround for a direct `File` (from
 * `<input type="file">`) passed straight to `uploadBytes`.
 */
export const registerUserWithDetails = async (
  userInfo: Omit<RegisterUserInfo, "firebaseUuid" | "firebaseImageUuid">,
  imageFile: File | null,
): Promise<{ token: string; userPayload: RegisterUserInfo }> => {
  try {
    // 1. Create User in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userInfo.email,
      userInfo.password,
    );
    const user = userCredential.user;

    // 2. Upload Profile Image to Firebase Storage if provided
    let imageUrl = "";
    if (imageFile) {
      try {
        const storageRef = ref(storage, `profiles/${user.uid}.jpg`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      } catch (storageError) {
        console.warn("Storage upload failed, falling back...", storageError);
      }
    }

    const token = await user.getIdToken();

    // 3. Compile the completed RegisterUserInfo payload
    const userPayload: RegisterUserInfo = {
      email: userInfo.email,
      password: userInfo.password,
      full_name: userInfo.full_name,
      rol: userInfo.rol,
      interests: userInfo.interests,
      description: userInfo.description,
      firebaseImageUuid: imageUrl,
      firebaseUuid: user.uid,
    };

    return { token, userPayload };
  } catch (err) {
    throw mapAuthError(
      err,
      REGISTER_ERROR_MESSAGES,
      "Couldn't complete user registration. Please try again.",
    );
  }
};
