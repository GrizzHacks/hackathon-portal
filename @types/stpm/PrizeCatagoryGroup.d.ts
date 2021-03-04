declare interface STPMPrizeCatagoryGroup {
    prizeCategoryId: string;
    prizeCatagoryName: string;
    prizeCategoryDescription: string;
    prizeCategoryOrder: Array<string>;
}

declare interface STPMPrizeCatGroupUpdateRequest {
    prizeCatagoryName?: string;
    prizeCategoryDescription?: string;
    prizeCategoryOrder?: Array<string>;
}

declare interface STPMPrizeCatGroupCreateRequest {
    prizeCatagoryName: string;
    prizeCategoryDescription: string;
    prizeCategoryOrder: Array<string>;
}

