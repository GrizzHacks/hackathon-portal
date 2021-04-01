import { Category } from "@material-ui/icons";
import { type } from "os";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { apiClient } from "../../../helper";
import CreateDetailEditPage from "../../pages/CreateDetailsEditPage";
import Error404Page from "../../pages/Error404Page";
import ListPage from "../../pages/ListPage";

const TimeslotsPages: React.FunctionComponent = () => {
  const [eventTypeInfo, setEventTypeInfo] = React.useState<
    {
      label: string;
      value: any;
    }[]
  >([]);
  const [eventInfo, setEventInfo] = React.useState<
    {
      label: string;
      value: any;
    }[]
  >([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  if (!loaded) {
    setLoaded(true);
    apiClient
      .get("mewm/events")
      .then((eventsRaw) => {
        eventsRaw.json().then((events) => {
          const eventsTyped = (events as MEWMEventList).events;
          setEventInfo(
            eventsTyped.map((event) => {
              return {
                label: event.eventName,
                value: event.eventId,
              };
            })
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
    apiClient
      .get("mewm/types")
      .then((typesRaw) => {
        typesRaw.json().then((types) => {
          const typesTyped = (types as MEWMEventTypeList).eventTypes;
          setEventInfo(
            typesTyped.map((type) => {
              return {
                label: type.eventTypeName,
                value: type.eventTypeName,
              };
            })
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getEventTypeNameFromEventTypeId = (eventTypeId: string) => {
    for (const event of eventTypeInfo) {
      if (event.value === eventTypeId) {
        return event.label;
      }
    }
    return "";
  };

  const listMapFunction = (
    setListItems: (listItems: GenericListItemInfo[]) => void
  ) => (schemas: any) => {
    const schemasTyped = schemas as MEWMTimeslotList;
    setListItems(
      schemasTyped.timeslots.map((value) => {
        const eventId = value.eventID ? `: ${value.eventID}` : "";
        return {
          line1: `${getEventTypeNameFromEventTypeId(
            value.eventTypeID
          )}${eventId}`,
          deleteEndpoint: `mewm/timeslots/${value.timeslotId}`,
          deleteText: "Delete Time Slot",
          detailedViewLink: `/mewm/timeslots/timeslot/${value.timeslotId}`,
          detailedViewText: "Time Slot Details",
          icon: Category,
          key: `${value.timeslotId}`,
          line2: `${value.startTime} - ${value.endTime}`,
        };
      })
    );
  };

  const TimeslotCreateEditDetailsPageComponent = (
    <CreateDetailEditPage<MEWMTimeslot>
      objectTypeName={"Time Slot"}
      listEndpoint="/mewm/timeslots"
      apiEndpoint={"mewm/timeslots"}
      idAttribute="timeslotId"
      attributes={[
        {
          attributeName: "startTime",
          attributeLabel: "Start Time (ISO String)",
        },
        {
          attributeName: "endTime",
          attributeLabel: "End Time (ISO String)",
        },
        {
          attributeName: "eventTypeID",
          attributeLabel: "Event Type (required)",
          attributeOptions: eventTypeInfo,
        },
        {
          attributeName: "eventID",
          attributeLabel: "Event (optional, can be completed later)",
          attributeOptions: eventInfo,
        },
      ]}
    />
  );

  return (
    <Switch>
      <Route exact path="/mewm/timeslots">
        <ListPage
          pageTitle="Time Slots"
          objectTypeName="Time Slot"
          apiEndpoint="mewm/timeslots"
          createNewLink="/mewm/timeslots/create"
          listMapFunction={listMapFunction}
        />
      </Route>
      <Route path="/mewm/timeslots/create">
        {TimeslotCreateEditDetailsPageComponent}
      </Route>
      <Route path="/mewm/timeslots/timeslot/:timeslotId">
        {TimeslotCreateEditDetailsPageComponent}
      </Route>
      <Route component={Error404Page} />
    </Switch>
  );
};

export default TimeslotsPages;
