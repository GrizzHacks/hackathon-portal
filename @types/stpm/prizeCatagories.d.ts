type Prize = {
    prizeId: string;
    prizeDisplayName: string;
    prizePrice: number;
    prizeListingName: number;
    prizeUrl: string;
    asin: string;
}

declare interface STPMPrizeCatagories{
    prizeCategoryId: string;
    prizeCategoryName: string;
    prizeCategoryDescription: string;
    eligibility: string;
    prize: Prize;
    companyId: string;
    approvalStatus: "approval" | "rejected" | "inProgress" | "awaitingApproval" | "public";

}

declare interface STPMPrizeCatagoriesUpdateRequest{
    prizeCategoryId?: string;
    prizeCategoryName?: string;
    prizeCategoryDescription?: string;
    eligibility?: string;
    prize?: Prize;
    companyId?: string;
    approvalStatus?: "approval" | "rejected" | "inProgress" | "awaitingApproval" | "public";

}

declare interface STPMPrizeCatagoriesCreateRequest{
    prizeCategoryId: string;
    prizeCategoryName: string;
    prizeCategoryDescription: string;
    eligibility?: string;
    prize: Prize;
    companyId?: string;
    approvalStatus: "approval" | "rejected" | "inProgress" | "awaitingApproval" | "public" ;

}