declare interface URMUserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  photoUrl?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

declare interface URMUserCreateRequest extends URMUserUpdateRequest {
  userId: string;
  firstName: string;
  lastName: string;
  email: string; // TODO: Update if supporting phone login/TFA in the future
  password: string; // TODO: Update if supporting phone login/TFA in the future
  confirmPassword: string; // TODO: Update if supporting phone login/TFA in the future
}

declare interface URMUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string;
}

declare interface URMMinimalUser {
  userId: string;
  firstName: string;
  email: string;
  photoUrl: string;
}

declare interface URMUserList {
  users: URMUser[];
}
