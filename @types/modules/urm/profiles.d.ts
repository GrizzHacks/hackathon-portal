declare interface URMProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  university?: string;
  bestSkill?: string;
  email?: string;
  numberOfPreviousHackathons: string;
  studentStatus: "freshman" | "sophomore" | "junior" | "senior";
}

declare interface URMProfileCreateRequest extends URMProfileUpdateRequest {
  profileId: string;
  firstName: string;
  lastName: string;
  email: string;
}

declare interface URMProfile extends URMProfileCreateRequest {
  university: string;
  bestSkill: string;
  numberOfPreviousHackathons: string;
  studentStatus: "freshman" | "sophomore" | "junior" | "senior";
}

declare interface URMProfileList {
  profiles: URMProfile[];
}
