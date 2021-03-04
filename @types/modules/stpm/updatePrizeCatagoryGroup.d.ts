declare interface STPMPrizeCatagoryGroup {
    prizeCategoryId: string;
    prizeCatagoryName: string;
    prizeCategoryDescription: string;
    prizeCategoryOrder: Array<string>;
}

declare interface STPMPrizeCatGroupUpdateRequest {
    prizeCategoryId: string;
    prizeCatagoryName?: string;
    prizeCategoryDescription?: string;
    prizeCategoryOrder?: Array<string>;
}

