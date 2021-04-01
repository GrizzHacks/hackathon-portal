import { Category } from "@material-ui/icons";
import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import CreateDetailEditPage from "../../pages/CreateDetailsEditPage";
import Error404Page from "../../pages/Error404Page";
import ListPage from "../../pages/ListPage";

const PrizesPages: React.FunctionComponent = () => {
  const routeParams = useParams() as any;

  const getPrizeCategoryId = () => {
    return routeParams.prizeCategoryId as string;
  };

  const listMapFunction = (
    setListItems: (listItems: GenericListItemInfo[]) => void
  ) => (schemas: any) => {
    const schemasTyped = schemas as PMPrizeList;
    setListItems(
      schemasTyped.prizes.map((value) => {
        return {
          line1: `${value.prizeDisplayName}`,
          deleteEndpoint: `pm/categories/${getPrizeCategoryId()}/prizes/${
            value.prizeId
          }`,
          deleteText: "Delete Prize",
          detailedViewLink: `/pm/categories/category/${getPrizeCategoryId()}/prizes/prize/${
            value.prizeId
          }`,
          detailedViewText: "Prize Details",
          icon: Category,
          key: `${value.prizeId}`,
        };
      })
    );
  };

  const PrizeCreateEditDetailsPageComponent = (
    <CreateDetailEditPage<PMPrize>
      objectTypeName={"Prize"}
      listEndpoint={`/pm/categories/category/${getPrizeCategoryId()}`}
      apiEndpoint={`pm/categories/${getPrizeCategoryId()}/prizes/`}
      idAttribute="prizeId"
      attributes={[
        {
          attributeName: "prizeDisplayName",
          attributeLabel:
            "Prize Display Name (the name of the prize to display on the live site)",
        },
        {
          attributeName: "prizeListingName",
          attributeLabel:
            "Prize Listing Name (the name of the product on the site selling it)",
        },
        {
          attributeName: "prizePrice",
          attributeLabel: "Prize Price (USD)",
          attributeTypeIsNumber: true,
        },
        {
          attributeName: "prizeUrl",
          attributeLabel: "Prize Link (to the site selling the prize)",
        },
        {
          attributeName: "prizeASIN",
          attributeLabel:
            "Prize Id (the product id from the site selling it; i.e. the ASIN number on Amazon)",
        },
      ]}
    />
  );

  return (
    <Switch>
      <Route exact path="/pm/categories/category/:prizeCategoryId">
        <ListPage
          pageTitle="Prizes"
          objectTypeName="Prize"
          apiEndpoint={`pm/categories/${getPrizeCategoryId()}/prizes/`}
          createNewLink={`/pm/categories/category/${getPrizeCategoryId()}/prizes/create`}
          listMapFunction={listMapFunction}
        />
      </Route>
      <Route path="/pm/categories/category/:prizeCategoryId/prizes/create">
        {PrizeCreateEditDetailsPageComponent}
      </Route>
      <Route path="/pm/categories/category/:prizeCategoryId/prizes/prize/:prizeId">
        {PrizeCreateEditDetailsPageComponent}
      </Route>
      <Route component={Error404Page} />
    </Switch>
  );
};

export default PrizesPages;
