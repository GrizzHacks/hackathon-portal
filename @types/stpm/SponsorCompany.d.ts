declare interface STPMSponsorCompany {
    companyId: string;
    companyName: string;
    companyLogoUrl: string;
    companyWebsite: string;
    companyAcronym: string;
    sponsorTierId: string;
    overriddenBenefits: {[key: string]: string}
}

declare interface STPMSponsorCompanyUpdateRequest {
    companyName?: string;
    companyLogoUrl?: string;
    companyWebsite?: string;
    companyAcronym?: string;
    sponsorTierId: string;
    overriddenBenefits: {[key: string]: string};

}

declare interface STPMSponsorCompanyCreateRequest {
    companyId: string;
    companyName: string;
    companyLogoUrl: string;
    companyWebsite?: string;
    companyAcronym?: string;
    sponsorTierId: string;
    overriddenBenefits: {[key: string]: string};
}