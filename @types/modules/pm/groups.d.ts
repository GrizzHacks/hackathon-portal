declare interface PMGroupUpdateRequest {
    prizeGroupName?: string;
    prizeGroupDescription?: string;
    prizeGroupOrder?: Array<string>;
  }

  declare interface PMGroupCreateRequest extends PMGroupUpdateRequest {
    prizeGroupId: string;
    prizeGroupName: string;
    prizeGroupDescription: string;
    prizeGroupOrder: Array<string>;
  }

  declare interface PMGroup extends PMGroupCreateRequest {
    prizeGroupId: string;
    prizeGroupName: string;
    prizeGroupDescription: string;
    prizeGroupOrder: Array<string>;
  }

   declare interface PMGroupList {
    prizegroups: PMGroup[];
   }