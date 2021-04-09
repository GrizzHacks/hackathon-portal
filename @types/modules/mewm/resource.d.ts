declare interface MEWMEventResourceUpdateRequest {
  resourceName?: string;
  resourceDescription?: string;
  resourceUrl?: string;
}

declare interface MEWMEventResourceCreateRequest
  extends MEWMEventResourceUpdateRequest {
  resourceId: string;
  resourceName: string;
  resourceDescription: string;
  resourceUrl: string;
}

declare interface MEWMEventResource extends MEWMEventResourceCreateRequest {}

declare interface MEWMResourceList {
  resources: MEWMEventResource[];
}
