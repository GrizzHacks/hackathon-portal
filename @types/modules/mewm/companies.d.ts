declare interface STPMCompanyUpdateRequest {
  companyName?: string;
  companyLogoUrl?: string;
  companyWebsite?: string;
  companyAcronym?: string;
  sponsorTierId?: string;
  overriddenBenefits?: STPMTierUpdateRequest;
}

declare interface STPMCompanyCreateRequest extends STPMCompanyUpdateRequest {
  companyId: string;
  companyName: string;
  sponsorTierId: string;
}

declare interface STPMCompany extends STPMCompanyCreateRequest {
  overriddenBenefits: STPMTierUpdateRequest;
}

declare interface STPMCompanyList {
  sponsorCompanies: STPMCompany[];
}
