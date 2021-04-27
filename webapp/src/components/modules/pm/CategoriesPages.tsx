import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import React from "react";
import { Route, Switch } from "react-router-dom";
import { apiClient } from "../../../helper";
import CreateDetailEditPage from "../../pages/CreateDetailsEditPage";
import Error404Page from "../../pages/Error404Page";
import ListPage from "../../pages/ListPage";
import PrizesPages from "./PrizesPages";

const CategoriesPages: React.FunctionComponent = () => {
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
      .get("stpm/companies")
      .then((companiesRaw) => {
        companiesRaw.json().then((companies) => {
          const companiesTyped = (companies as STPMCompanyList)
            .sponsorCompanies;
          setAttributeOptions(
            companiesTyped.map((company) => {
              return {
                label: company.companyName,
                value: company.companyId,
              };
            })
          );
        });
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }

  const getCompanyNameFromCompanyId = (id: string) => {
    for (const company of attributeOptions) {
      if (company.value === id) {
        return company.label;
      }
    }
    return "";
  };

  const listMapFunction = (
    setListItems: (listItems: GenericListItemInfo[]) => void
  ) => (schemas: any) => {
    const schemasTyped = schemas as PMCategoryList;
    setListItems(
      schemasTyped.prizeCategories.map((value) => {
        const prizeSponsor =
          value.companyId !== undefined
            ? ` - Sponsored by ${getCompanyNameFromCompanyId(value.companyId)}`
            : "";
        return {
          line1: `${value.prizeCategoryName}${prizeSponsor}`,
          deleteEndpoint: `pm/categories/${value.prizeCategoryId}`,
          deleteText: "Delete Prize Category",
          detailedViewLink: `/pm/categories/category/${value.prizeCategoryId}`,
          detailedViewText: "Prize Category Details",
          icon: EmojiEventsIcon,
          key: `${value.prizeCategoryId}`,
          line2: value.prizeCategoryDescription,
          multiline: true,
        };
      })
    );
  };

  const PrizeCategoryCreateEditDetailsPageComponent = (
    <CreateDetailEditPage<PMCategory>
      objectTypeName={"Prize Category"}
      listEndpoint="/pm/categories"
      apiEndpoint={"pm/categories"}
      idAttribute="prizeCategoryId"
      attributes={[
        {
          attributeName: "prizeCategoryName",
          attributeLabel: "Prize Category Name",
        },
        {
          attributeName: "prizeCategoryDescription",
          attributeLabel: "prize Category Description",
        },
        {
          attributeName: "eligibility",
          attributeLabel: "Eligibility",
          allowEmptyString: true,
        },
        {
          attributeName: "companyId",
          attributeLabel: "Sponsor Company",
          attributeOptions: attributeOptions.concat({
            label: "None",
            value: undefined,
          }),
        },
      ]}
    />
  );

  return (
    <Switch>
      <Route exact path="/pm/categories">
        <ListPage
          pageTitle="Prize Categories"
          objectTypeName="Prize Category"
          apiEndpoint="pm/categories"
          createNewLink="/pm/categories/create"
          listMapFunction={listMapFunction}
        />
      </Route>
      <Route path="/pm/categories/create">
        {PrizeCategoryCreateEditDetailsPageComponent}
      </Route>
      <Route exact path="/pm/categories/category/:prizeCategoryId">
        {PrizeCategoryCreateEditDetailsPageComponent}
        <PrizesPages />
        {/** TODO: Is there a better way to fix this redundancy? */}
      </Route>
      <Route path="/pm/categories/category/:prizeCategoryId">
        <PrizesPages />
      </Route>
      <Route component={Error404Page} />
    </Switch>
  );
};

export default CategoriesPages;
