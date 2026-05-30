export interface CreateUserDTO {
  fullName: string;
  email: string;
  role: string;
  interest: string;
  description: string;
  firebaseUuid: string;
  firebaseImageUuid?: string;
}
