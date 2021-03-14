declare interface PMCategoryUpdateRequest {
    prizeCategoryName?: string;
    prizeCategoryDescription?: string;
    eligibility?: string;
    companyId?: string;
    approvalStatus?: "approved" | "rejected" | "inProgress" | "awaitingApproval" | "public";
  }
  
  declare interface PMCategoryCreateRequest extends PMCategoryUpdateRequest {
    categoryId: string;
    prizeCategoryName: string;
    prizeCategoryDescription: string;
  }
  
  declare interface PMCategory extends PMCategoryCreateRequest {
    eligibility: string;
    companyId: string;
    approvalStatus: "approved" | "rejected" | "inProgress" | "awaitingApproval" | "public";
  }
  
  declare interface PMCategoryList {
    prizeCategories: PMCategory[];
  }
  