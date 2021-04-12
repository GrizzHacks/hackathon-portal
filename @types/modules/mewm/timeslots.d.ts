declare interface MEWMTimeslotUpdateRequest {
  startTime?: string;
  endTime?: string;
  eventTypeId?: string;
  eventId?: string;
}

declare interface MEWMTimeslotCreateRequest extends MEWMTimeslotUpdateRequest {
  timeslotId: string;
  eventTypeId: string;
  eventId?: string;
  startTime: string;
  endTime: string;
}

declare interface MEWMTimeslot extends MEWMTimeslotCreateRequest {}

declare interface MEWMTimeslotList {
  timeslots: MEWMTimeslot[];
}
