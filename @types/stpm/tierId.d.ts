declare interface STPMTier{
    sponsorTierId: string;
    sponsorTierName: string; 
    sponsorTierOrder: number; 
    logoSize: "xs" | "sm" | "m" | "lg" | "xl";
    sponsorshipExpo: boolean;
    techTalk: boolean;
    officeHours: boolean;
    prize: boolean;
    prizeBudget: number;
    attendeeData: "none" | "pre" | "post";
    numberOfMentors: number;
    numberOfRecruiters: number;
    distributionOfSwag: boolean;
    openingSessionTalk: boolean;
    openingSessionTalkLength?: number;
    closingSessionTalk: boolean;
    closingSessionTalkLength?: number;
    otherBenifits?: {[key: string]: string};
}

declare interface STPMTierUpdateRequest {
    sponsorTierName?: string; 
    sponsorTierOrder?: number; 
    logoSize?: "xs" | "sm" | "m" | "lg" | "xl";
    sponsorshipExpo?: boolean;
    techTalk?: boolean;
    officeHours?: boolean;
    prize?: boolean;
    prizeBudget?: number;
    attendeeData?: "none" | "pre" | "post";
    numberOfMentors?: number;
    numberOfRecruiters?: number;
    distributionOfSwag?: boolean;
    openingSessionTalk?: boolean;
    openingSessionTalkLength?: number;
    closingSessionTalk?: boolean;
    closingSessionTalkLength?: number;
    otherBenifits?: {[key: string]: string}
}

declare interface STPMTierCreateRequest {
    sponsorTierName: string; 
    sponsorTierOrder: number; 
    logoSize: "xs" | "sm" | "m" | "lg" | "xl";
    sponsorshipExpo: boolean;
    techTalk: boolean;
    officeHours: boolean;
    prize: boolean;
    prizeBudget: number;
    attendeeData: "none" | "pre" | "post";
    numberOfMentors: number;
    numberOfRecruiters: number;
    distributionOfSwag: boolean;
    openingSessionTalk: boolean;
    openingSessionTalkLength: number;
    closingSessionTalk: boolean;
    closingSessionTalkLength: number;
    otherBenifits: {[key: string]: string}
}

declare interface STPMTierDeleteRequest {
    sponsorTierName?: string; 
    sponsorTierOrder?: number; 
    logoSize?: "xs" | "sm" | "m" | "lg" | "xl";
    sponsorshipExpo?: boolean;
    techTalk?: boolean;
    officeHours?: boolean;
    prize?: boolean;
    prizeBudget?: number;
    attendeeData?: "none" | "pre" | "post";
    numberOfMentors?: number;
    numberOfRecruiters?: number;
    distributionOfSwag?: boolean;
    openingSessionTalk?: boolean;
    openingSessionTalkLength?: number;
    closingSessionTalk?: boolean;
    closingSessionTalkLength?: number;
    otherBenifits?: {[key: string]: string}
}