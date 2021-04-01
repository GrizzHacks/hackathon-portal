declare interface MEWMTimeslotUpdateRequest {
    startTime?: string;
    endTime?: string;
    eventTypeID? : string;
    eventID? : string;
}

declare interface MEWMTimeslotCreateRequest extends MEWMTimeslotUpdateRequest {
    timeslotId: string;
    eventTypeID : string;
    eventID? : string;
    startTime: string;
    endTime: string;
}

declare interface MEWMTimeslot extends MEWMTimeslotCreateRequest{
    startTime: string;
    endTime: string;
}

declare interface MEWMTimeslotList {
    timeslots: MEWMTimeslot[];
} 
