declare interface METMMiniEventUpdateRequest {
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
}

declare interface METMMiniEventCreateRequest extends METMMiniEventUpdateRequest{
    eventId: string;
    eventName: string;
    eventDescription: string;
    virtual: boolean;
}

declare interface METMMiniEvent extends METMMiniEventCreateRequest{
    location?: string;
    joinLink?: string;
    joinLinkToPresenters?: number;
    joinLinkToAttendees?: number;
    companyId?: string;
    managers?: string[];
    speakers?: string[];
}

declare interface METMMiniEventList {
    miniEvents: METMMiniEvent[];
}