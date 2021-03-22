declare interface MEWMEventTypeUpdateRequest {
  eventTypeName?: string;
  eventTypeDescription?: string;
  permissions?: UASPermissionSwitchConfig<boolean>;
}

declare interface MEWMEventTypeCreateRequest
  extends MEWMEventTypeUpdateRequest {
  eventTypeId: string;
  eventTypeName: string;
}

declare interface MEWMEventType extends MEWMEventTypeCreateRequest {
  eventTypeDescription: string;
  permissions: UASPermissionSwitchConfig<boolean>;
}

declare interface MEWMEventTypeList {
  eventTypes: MEWMEventType[];
}
