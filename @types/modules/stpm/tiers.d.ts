declare interface STPMTierUpdateRequest {
  sponsorTierName?: string;
  sponsorTierOrder?: number;
  logoSize?: "xs" | "sm" | "m" | "lg" | "xl";
  sponsorshipExpo?: boolean;
  techTalk?: boolean;
  officeHours?: boolean;
  prizeBudget?: number;
  attendeeData?: "none" | "pre" | "post";
  numberOfMentors?: number;
  numberOfRecruiters?: number;
  distributionOfSwag?: boolean;
  openingSessionTalkLength?: number;
  closingSessionTalkLength?: number;
  otherBenefits?: { [key: string]: string };
}

declare interface STPMTierCreateRequest extends STPMTierUpdateRequest {
  sponsorTierId: string;
  sponsorTierName: string;
  logoSize: "xs" | "sm" | "m" | "lg" | "xl";
  sponsorshipExpo: boolean;
  techTalk: boolean;
  officeHours: boolean;
  prizeBudget: number;
  attendeeData: "none" | "pre" | "post";
  numberOfMentors: number;
  numberOfRecruiters: number;
  distributionOfSwag: boolean;
  openingSessionTalkLength: number;
  closingSessionTalkLength: number;
}

declare interface STPMTier extends STPMTierCreateRequest {
  sponsorTierOrder: number;
  otherBenefits: { [key: string]: string };
}

declare interface STPMTierList {
  sponsorTiers: STPMTier[];
}
