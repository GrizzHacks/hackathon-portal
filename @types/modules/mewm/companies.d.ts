declare interface STPMCompanyUpdateRequest {
  companyName?: string;
  companyLogoUrl?: string;
  companyWebsite?: string;
  companyAcronym?: string;
  sponsorTierId?: string;
  overriddenBenefits?: { [key: string]: string };
}

declare interface STPMCompanyCreateRequest extends STPMCompanyUpdateRequest {
  companyId: string;
  companyName: string;
  sponsorTierId: string;
}

declare interface STPMCompany extends STPMCompanyCreateRequest {
 overriddenBenefits: { [key: string]: string };
}

declare interface STPMCompanyList {
  sponsorCompanies: STPMCompany[];
}
