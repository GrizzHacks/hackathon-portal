declare interface MEWMTimeslotUpdateRequest {
    startTime?: string;
    endTime?: string;
}

declare interface MEWMTimeslotCreateRequest extends MEWMTimeslotUpdateRequest {
    timeslotId: string;
    startTime: string;
    endTime: string;
    
}

declare interface MEWMTimeslot extends MEWMTimeslotCreateRequest{
    startTime: string;
    endTime: string;
}

declare interface MEWMTimeslotList {
    miniTimeslot: MEWMTimeslot[];
} 