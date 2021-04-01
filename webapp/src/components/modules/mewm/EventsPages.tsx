import { CalendarToday, Category } from "@material-ui/icons";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { apiClient } from "../../../helper";
import CreateDetailEditPage from "../../pages/CreateDetailsEditPage";
import Error404Page from "../../pages/Error404Page";
import ListPage from "../../pages/ListPage";
import ResourcesPages from "./ResourcesPages";

const EventsPages: React.FunctionComponent = () => {
  const [companyInfo, setCompanyInfo] = React.useState<
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
    apiClient
      .get("stpm/companies")
      .then((companiesRaw) => {
        companiesRaw.json().then((companies) => {
          const companiesTyped = (companies as STPMCompanyList)
            .sponsorCompanies;
          setCompanyInfo(
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
      });
  }

  const getCompanyNameFromCompanyId = (companyId: string) => {
    for (const company of companyInfo) {
      if (company.value === companyId) {
        return company.label;
      }
    }
    return "";
  };

  const getEventTypeNameFromEventTypeId = (eventTypeId: string) => {
    for (const event of eventInfo) {
      if (event.value === eventTypeId) {
        return event.label;
      }
    }
    return "";
  };

  const listMapFunction = (
    setListItems: (listItems: GenericListItemInfo[]) => void
  ) => (schemas: any) => {
    const schemasTyped = schemas as MEWMEventList;
    setListItems(
      schemasTyped.events.map((value) => {
        const eventSponsor =
          value.companyId !== undefined
            ? ` - Presented by ${getCompanyNameFromCompanyId(value.companyId)}`
            : "";
        return {
          line1: `${value.eventName}${eventSponsor}`,
          deleteEndpoint: `mewm/events/${value.eventId}`,
          deleteText: "Delete Event",
          detailedViewLink: `/mewm/events/event/${value.eventId}`,
          detailedViewText: "Event Details",
          icon: CalendarToday,
          key: `${value.eventId}`,
          line2: value.eventDescription,
          multiline: true,
        };
      })
    );
  };

  const EventCreateEditDetailsPageComponent = (
    <CreateDetailEditPage<MEWMEvent>
      objectTypeName={"Event"}
      listEndpoint="/mewm/events"
      apiEndpoint={"mewm/events"}
      idAttribute="eventId"
      attributes={[
        { attributeName: "eventName", attributeLabel: "Event Name" },
        {
          attributeName: "eventDescription",
          attributeLabel: "Event Description",
        },
        {
          attributeName: "virtual",
          attributeLabel: "Is this event virtual?",
          attributeOptions: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        {
          attributeName: "location",
          attributeLabel: "Event Location (optional)",
          allowEmptyString: true,
        },
        {
          attributeName: "joinLink",
          attributeLabel: "Virtual Event Join Link (optional)",
          allowEmptyString: true,
        },
        {
          attributeName: "joinLinkToPresenters",
          attributeLabel:
            "How many minutes before the event starts can presenters join?",
          attributeTypeIsNumber: true,
          allowEmptyString: true,
        },
        {
          attributeName: "joinLinkToAttendees",
          attributeLabel:
            "How many minutes before the event starts can attendees join?",
          attributeTypeIsNumber: true,
          allowEmptyString: true,
        },
        {
          attributeName: "companyId",
          attributeLabel: "Sponsor Company",
          attributeOptions: companyInfo.concat({
            label: "None",
            value: undefined,
          }),
        },
      ]}
    />
  );

  return (
    <Switch>
      <Route exact path="/mewm/events">
        <ListPage
          pageTitle="Events"
          objectTypeName="Event"
          apiEndpoint="mewm/events"
          createNewLink="/mewm/events/create"
          listMapFunction={listMapFunction}
        />
      </Route>
      <Route path="/mewm/events/create">
        {EventCreateEditDetailsPageComponent}
      </Route>
      <Route exact path="/mewm/events/event/:eventId">
        {EventCreateEditDetailsPageComponent}
        <ResourcesPages />
        {/** TODO: Is there a better way to fix this redundancy? */}
      </Route>
      <Route path="/mewm/events/event/:eventId">
        <ResourcesPages />
      </Route>
      <Route component={Error404Page} />
    </Switch>
  );
};

export default EventsPages;
