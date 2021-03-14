declare interface MEWMEventResourcesUpdateRequest {
    resourceName?: string;
    resourceDescription?: string;
    resourceUrl?: string;
}

declare interface MEWMEventResourcescreateRequest extends MEWMEventResourcesUpdateRequest {
    resourceId: string;
    resourceName: string;
    resourceDescription: string;
    resourceUrl: string;
}

declare interface MEWMEventResources extends MEWMEventResourcescreateRequest {
    resourceId: string;
    resourceName: string;
    resourceDescription: string;
    resourceUrl: string;
}


