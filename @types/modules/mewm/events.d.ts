declare interface MEWMEventUpdateRequest {
  eventName?: string;
  eventDescription?: string;
  location?: string;
  virtual?: boolean;
  joinLink?: string;
  joinLinkToPresenters?: number;
  joinLinkToAttendees?: number;
  companyId?: string;
  managers?: string[];
  speakers?: string[];
  approvalStatus?: "approved" | "rejected" | "inProgress" | "awaitingApproval";
}

declare interface MEWMEventCreateRequest extends MEWMEventUpdateRequest {
  eventId: string;
  eventName: string;
  eventDescription: string;
  virtual: boolean;
}

declare interface MEWMEvent extends MEWMEventCreateRequest {
  location: string;
  joinLink: string;
  joinLinkToPresenters: number;
  joinLinkToAttendees: number;
  companyId?: string;
  managers: string[];
  speakers: string[];
  approvalStatus: "approved" | "rejected" | "inProgress" | "awaitingApproval";
}

declare interface MEWMEventList {
  events: MEWMEvent[];
}
