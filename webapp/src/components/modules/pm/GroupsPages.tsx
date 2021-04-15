import { Category } from "@material-ui/icons";
import React from "react";
import { Route, Switch } from "react-router-dom";
import CreateDetailEditPage from "../../pages/CreateDetailsEditPage";
import Error404Page from "../../pages/Error404Page";
import ListPage from "../../pages/ListPage";

const GroupsPages: React.FunctionComponent = () => {
  const listMapFunction = (
    setListItems: (listItems: GenericListItemInfo[]) => void
  ) => (schemas: any) => {
    const schemasTyped = schemas as PMGroupList;
    setListItems(
      schemasTyped.prizeGroups.map((value) => {
        return {
          line1: `${value.prizeGroupName}`,
          deleteEndpoint: `pm/groups/${value.prizeGroupId}`,
          deleteText: "Delete Prize Group",
          detailedViewLink: `/pm/groups/group/${value.prizeGroupId}`,
          detailedViewText: "Prize Group Details",
          icon: Category,
          key: `${value.prizeGroupId}`,
          line2: value.prizeGroupDescription,
          multiline: true,
        };
      })
    );
  };

  const PrizeGroupCreateEditDetailsPageComponent = (
    <CreateDetailEditPage<PMGroup>
      objectTypeName={"Prize Group"}
      listEndpoint="/pm/groups"
      apiEndpoint={"pm/groups"}
      idAttribute="prizeGroupId"
      attributes={[
        {
          attributeName: "prizeGroupName",
          attributeLabel: "Prize Group Name",
        },
        {
          attributeName: "prizeGroupDescription",
          attributeLabel: "Prize Group Description",
        },
      ]}
    />
  );

  return (
    <Switch>
      <Route exact path="/pm/groups">
        <ListPage
          pageTitle="Prize Groups"
          objectTypeName="Prize Group"
          apiEndpoint="pm/groups"
          createNewLink="/pm/groups/create"
          listMapFunction={listMapFunction}
        />
      </Route>
      <Route path="/pm/groups/create">
        {PrizeGroupCreateEditDetailsPageComponent}
      </Route>
      <Route path="/pm/groups/group/:prizeGroupId">
        {PrizeGroupCreateEditDetailsPageComponent}
      </Route>
      <Route component={Error404Page} />
    </Switch>
  );
};

export default GroupsPages;
