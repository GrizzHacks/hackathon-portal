import { Business } from "@material-ui/icons";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { apiClient } from "../../../helper";
import ListPage from "../../pages/ListPage";
import CreateDetailEditPage from "../../pages/CreateDetailsEditPage";
import Error404Page from "../../pages/Error404Page";

const CompaniesPages: React.FunctionComponent = () => {
  const [attributeOptions, setAttributeOptions] = React.useState<
    {
      label: string;
      value: any;
    }[]
  >([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  if (!loaded) {
    setLoaded(true);
    apiClient
      .get("stpm/tiers")
      .then((tiersRaw) => {
        tiersRaw.json().then((tiers) => {
          const tiersTyped = (tiers as STPMTierList).sponsorTiers;
          setAttributeOptions(
            tiersTyped.map((tier) => {
              return {
                label: tier.sponsorTierName,
                value: tier.sponsorTierId,
              };
            })
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const listMapFunction = (
    setListItems: (listItems: GenericListItemInfo[]) => void
  ) => (schemas: any) => {
    const schemasTyped = schemas as STPMCompanyList;
    setListItems(
      schemasTyped.sponsorCompanies.map((value) => {
        const companyAcronym = value.companyAcronym
          ? ` (${value.companyAcronym})`
          : "";
        return {
          line1: `${value.companyName}${companyAcronym}`,
          deleteEndpoint: `stpm/companies/${value.companyId}`,
          deleteText: "Delete Sponsor",
          detailedViewLink: `/stpm/companies/company/${value.companyId}`,
          detailedViewText: "Sponsor Details",
          icon: Business,
          key: `${value.companyId}`,
          line2: value.companyWebsite,
          multiline: false,
        };
      })
    );
  };

  const CompanyCreateEditDetailsPageComponent = (
    <CreateDetailEditPage<STPMCompany>
      objectTypeName={"Sponsor Company"}
      listEndpoint="/stpm/companies"
      apiEndpoint={"stpm/companies"}
      idAttribute="companyId"
      attributes={[
        { attributeName: "companyName", attributeLabel: "Company Name" },
        {
          attributeName: "companyLogoUrl",
          attributeLabel: "Company Logo Url",
          allowEmptyString: true,
        },
        {
          attributeName: "companyWebsite",
          attributeLabel: "Company Website",
          allowEmptyString: true,
        },
        {
          attributeName: "companyAcronym",
          attributeLabel: "Company Acronym",
          allowEmptyString: true,
        },
        {
          attributeName: "sponsorTierId",
          attributeLabel: "Sponsor Tier",
          attributeOptions: attributeOptions,
        },
      ]}
    />
  );

  return (
    <Switch>
      <Route exact path="/stpm/companies">
        <ListPage
          pageTitle="Sponsor Companies"
          objectTypeName="Sponsor Company"
          apiEndpoint="stpm/companies"
          createNewLink="/stpm/companies/create"
          listMapFunction={listMapFunction}
        />
      </Route>
      <Route path="/stpm/companies/create">
        {CompanyCreateEditDetailsPageComponent}
      </Route>
      <Route path="/stpm/companies/company/:id">
        {CompanyCreateEditDetailsPageComponent}
      </Route>
      <Route component={Error404Page} />
    </Switch>
  );
};

export default CompaniesPages;
