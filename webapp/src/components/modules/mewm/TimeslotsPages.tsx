import ScheduleIcon from '@material-ui/icons/Schedule';
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
        alert(err);
      });
    apiClient
      .get("mewm/types")
      .then((typesRaw) => {
        typesRaw.json().then((types) => {
          const typesTyped = (types as MEWMEventTypeList).eventTypes;
          setEventTypeInfo(
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
        alert(err);
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
        const eventId = value.eventId ? `: ${value.eventId}` : "";
        return {
          line1: `${getEventTypeNameFromEventTypeId(
            value.eventTypeId
          )}${eventId}`,
          deleteEndpoint: `mewm/timeslots/${value.timeslotId}`,
          deleteText: "Delete Time Slot",
          detailedViewLink: `/mewm/timeslots/timeslot/${value.timeslotId}`,
          detailedViewText: "Time Slot Details",
          icon: ScheduleIcon,
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
          attributeName: "eventTypeId",
          attributeLabel: "Event Type (required)",
          attributeOptions: eventTypeInfo,
        },
        {
          attributeName: "eventId",
          attributeLabel: "Event (optional, can be completed later)",
          attributeOptions: eventInfo.concat([
            { label: "None", value: undefined },
          ]),
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
