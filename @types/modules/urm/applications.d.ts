
  declare interface URMApplicationUpdateRequest {
    firstName?: string;
    lastName?: string;
    university?: string;
    bestSkill?: string;
    email?: string;
    numberOfPreviousHackathons: string;
    studentStatus: "freshman" | "sophomore" | "junior" | "senior";
    approved: "accepted" | "rejected" |  "pending" ;
  }
  
  declare interface URMApplicationCreateRequest extends URMApplicationUpdateRequest {
    applicationId: string;
    firstName: string;
    lastName: string;
    email: string;
    
  }
  
  declare interface URMApplication extends URMApplicationCreateRequest {
    university: string;
    bestSkill: string;
    numberOfPreviousHackathons: string;
    studentStatus: "freshman" | "sophomore" | "junior" | "senior";
  }
  
  declare interface URMApplicationList {
    application: URMApplication[];
  }