declare interface URMProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  photoUrl?: string;
  email?: string;
  otherQuestions?: string[];
}

declare interface URMProfileCreateRequest extends URMProfileUpdateRequest {
  profileId: string;
  firstName: string;
  lastName: string;
  email: string;
}

declare interface URMProfile extends URMProfileCreateRequest {
  phoneNumber: string;
  photoUrl: string;
  otherQuestions: string[];
}

declare interface URMProfileList {
  profiles: URMProfile[];
}
