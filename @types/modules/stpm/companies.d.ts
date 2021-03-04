declare interface STPMCompaniesUpdateRequest {
  companyName?: string;
  companyLogoUrl?: string;
  companyAcronym?: string;
  overriddenBenefits?: { [key: string]: string };
}

declare interface STPMCompaniesCreateRequest
  extends STPMCompaniesUpdateRequest {
  companyId: id;
  companyName: string;
  companyLogoUrl?: string;
  companyAcronym?: string;
  sponsorTierId: string;
  overriddenBenefits?: { [key: string]: string };
}

declare interface STPMCompanies extends STPMCompaniesCreateRequest {
  companyId: id;
  companyName: string;
  companyLogoUrl: string;
  companyAcronym: string;
  sponsorTierId: string;
  overriddenBenefits: { [key: string]: string };
}

declare interface STPMCompaniesList {
  sponsorCompanies: STPMCompanies[];
}
