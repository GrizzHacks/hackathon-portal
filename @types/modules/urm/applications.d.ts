declare interface URMApplicationUpdateRequest {
  accepted?: "accepted" | "rejected" | "pending";
  otherQuestions?: { [key: string]: string };
}

declare interface URMApplicationCreateRequest
  extends URMApplicationUpdateRequest {
  role: "organizer" | "sponsor" | "mentor" | "volunteer" | "hacker";
}

declare interface URMApplication extends URMApplicationCreateRequest {}

declare interface URMApplicationList {
  application: URMApplication[];
}
