declare interface UserPermission {
  role: PermissionLevel;
  accepted: boolean;
  company?: string;
}

declare type PermissionLevel =
  | "ORGANZIER"
  | "SPONSOR"
  | "MENTOR"
  | "VOLUNTEER"
  | "HACKER"
  | "PUBLIC";
