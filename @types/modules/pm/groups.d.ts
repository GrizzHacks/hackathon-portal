declare interface PMGroupUpdateRequest {
    prizeGroupName?: string;
    prizeGroupDescription?: string;
    prizeCategoryOrder?: Array<string>;
  }

  declare interface PMGroupCreateRequest extends PMGroupUpdateRequest {
    prizeGroupId: string;
    prizeGroupName: string;
    prizeCategoryDescription: string;
    prizeCategoryOrder: Array<string>;
  }

  declare interface PMGroup extends PMGroupCreateRequest {
    prizeCategories: { [key: string]: string };
  }

//   declare interface PMGroupList {
//     prizeCategories: STPMCompany[];
//   }
