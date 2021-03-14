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

declare interface STPMPrizeCatGroupCreateRequest extends STPMPrizeCatagoriesCreateRequest {
    prizeCatagoryName: string;
    prizeCategoryDescription: string;
    prizeCategoryOrder: Array<string>;
}


declare interface STPMPrizeCatGroupList {
    prizeCategorys: STPMPrizeCatagoryGroup[];
  }

