import EventNoteIcon from '@material-ui/icons/EventNote';
import React from "react";
import { Route, Switch } from "react-router-dom";
import CreateDetailEditPage from "../../pages/CreateDetailsEditPage";
import Error404Page from "../../pages/Error404Page";
import ListPage from "../../pages/ListPage";

const TypesPages: React.FunctionComponent = () => {
  const listMapFunction = (
    setListItems: (listItems: GenericListItemInfo[]) => void
  ) => (schemas: any) => {
    const schemasTyped = schemas as MEWMEventTypeList;
    setListItems(
      schemasTyped.eventTypes.map((value) => {
        return {
          line1: `${value.eventTypeName}`,
          deleteEndpoint: `mewm/types/${value.eventTypeId}`,
          deleteText: "Delete Event Type",
          detailedViewLink: `/mewm/types/type/${value.eventTypeId}`,
          detailedViewText: "Event Type Details",
          icon: EventNoteIcon,
          key: `${value.eventTypeId}`,
          line2: value.eventTypeDescription,
          multiline: true,
        };
      })
    );
  };

  const EventTypeCreateEditDetailsPageComponent = (
    <CreateDetailEditPage<MEWMEventType>
      objectTypeName={"Event Type"}
      listEndpoint="/mewm/types"
      apiEndpoint={"mewm/types"}
      idAttribute="eventTypeId"
      attributes={[
        {
          attributeName: "eventTypeName",
          attributeLabel: "Event Type Name",
        },
        {
          attributeName: "eventTypeDescription",
          attributeLabel: "Event Type Description",
        },
      ]}
    />
  );

  return (
    <Switch>
      <Route exact path="/mewm/types">
        <ListPage
          pageTitle="Event Types"
          objectTypeName="Event Type"
          apiEndpoint="mewm/types"
          createNewLink="/mewm/types/create"
          listMapFunction={listMapFunction}
        />
      </Route>
      <Route path="/mewm/types/create">
        {EventTypeCreateEditDetailsPageComponent}
      </Route>
      <Route path="/mewm/types/type/:eventTypeId">
        {EventTypeCreateEditDetailsPageComponent}
      </Route>
      <Route component={Error404Page} />
    </Switch>
  );
};

export default TypesPages;
