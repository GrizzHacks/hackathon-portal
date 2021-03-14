declare interface PMGroupUpdateRequest {
    prizeCategoryId: string;
    prizeCatagoryName?: string;
    prizeCategoryDescription?: string;
    prizeCategoryOrder?: Array<string>;
  }

  declare interface PMGroupCreateRequest extends PMGroupUpdateRequest {
    prizeCatagoryName: string;
    prizeCategoryDescription: string;
    prizeCategoryOrder: Array<string>;
  }

  declare interface PMGroup extends PMGroupCreateRequest {
    prizeCategories: { [key: string]: string };
  }

   declare interface PMGroupList {
    prizeCategories: STPMCompany[];
   }