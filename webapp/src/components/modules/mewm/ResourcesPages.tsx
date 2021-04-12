import { Category } from "@material-ui/icons";
import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import CreateDetailEditPage from "../../pages/CreateDetailsEditPage";
import Error404Page from "../../pages/Error404Page";
import ListPage from "../../pages/ListPage";

const ResourcesPages: React.FunctionComponent = () => {
  const routeParams = useParams() as any;

  const getEventId = () => {
    return routeParams.eventId as string;
  };

  const listMapFunction = (
    setListItems: (listItems: GenericListItemInfo[]) => void
  ) => (schemas: any) => {
    const schemasTyped = schemas as MEWMResourceList;
    setListItems(
      schemasTyped.resources.map((value) => {
        return {
          line1: `${value.resourceName}`,
          deleteEndpoint: `mewm/events/${getEventId()}/resources/${
            value.resourceId
          }`,
          deleteText: "Delete Resource",
          detailedViewLink: `/mewm/events/event/${getEventId()}/resources/resource/${
            value.resourceId
          }`,
          detailedViewText: "Resource Details",
          icon: Category,
          key: `${value.resourceId}`,
          line2: `${value.resourceDescription}\n${value.resourceUrl}`,
          multiline: true,
        };
      })
    );
  };

  const ResourceCreateEditDetailsPageComponent = (
    <CreateDetailEditPage<MEWMEventResource>
      objectTypeName={"Resource"}
      listEndpoint={`/mewm/events/event/${getEventId()}`}
      apiEndpoint={`mewm/events/${getEventId()}/resources`}
      idAttribute="resourceId"
      attributes={[
        {
          attributeName: "resourceName",
          attributeLabel: "Resource Name",
        },
        {
          attributeName: "resourceDescription",
          attributeLabel: "Resource Description",
        },
        {
          attributeName: "resourceUrl",
          attributeLabel: "Resource Link",
        },
      ]}
    />
  );

  return (
    <Switch>
      <Route exact path="/mewm/events/event/:eventId">
        <ListPage
          pageTitle="Resources"
          objectTypeName="Resource"
          apiEndpoint={`mewm/events/${getEventId()}/resources/`}
          createNewLink={`/mewm/events/event/${getEventId()}/resources/create`}
          listMapFunction={listMapFunction}
        />
      </Route>
      <Route path="/mewm/events/event/:eventId/resources/create">
        {ResourceCreateEditDetailsPageComponent}
      </Route>
      <Route path="/mewm/events/event/:eventId/resources/resource/:resourceId">
        {ResourceCreateEditDetailsPageComponent}
      </Route>
      <Route component={Error404Page} />
    </Switch>
  );
};

export default ResourcesPages;
