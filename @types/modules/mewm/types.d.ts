declare interface MEWMEventTypeUpdateRequest {
  eventTypeName?: string;
  eventTypeDescription?: string;
}

declare interface MEWMEventTypeCreateRequest
  extends MEWMEventTypeUpdateRequest {
  eventTypeId: string;
  eventTypeName: string;
}

declare interface MEWMEventType extends MEWMEventTypeCreateRequest {
  eventTypeDescription: string;
}

declare interface MEWMEventTypeList {
  eventTypes: MEWMEventType[];
}
