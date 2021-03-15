declare interface UserPermission {
  role: PermissionLevel;
  accepted?: boolean;
  companyId?: string;
}

declare type PermissionLevel =
  | "ORGANIZER"
  | "SPONSOR"
  | "MENTOR"
  | "VOLUNTEER"
  | "HACKER"
  | "PUBLIC";

declare interface UASPermissionSwitchConfig<T> {
  organizer?: T | UASPermissionSwitchCallbackConfig<T>;
  sponsor?: T | UASPermissionSwitchCallbackConfig<T>;
  mentor?: T | UASPermissionSwitchCallbackConfig<T>;
  volunteer?: T | UASPermissionSwitchCallbackConfig<T>;
  hacker?: T | UASPermissionSwitchCallbackConfig<T>;
  public?: T;
}

declare interface UASPermissionSwitchCallbackConfig<T> {
  accepted?: T;
  pending?: T;
  rejected?: T;
}
