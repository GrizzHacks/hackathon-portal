import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Fragment } from "react";
import GenericListBuilder, {
  GenericListBuilderProps,
} from "./generics/GenericListBuilder";
import BusinessIcon from "@material-ui/icons/Business";
import { GenericListSchema } from "../../../@types/generics/GenericListSchema";
import ApiClient from "../helper/ApiClient";
import { ApiExplorerFirebaseApp } from "../devTools/apiExplorerFirebaseConfig";

declare interface AppProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const genericListBuilderProp: GenericListBuilderProps = {
  genericList: [],
  classes: undefined,
};

const MiniEventsList: React.FunctionComponent<AppProps> = ({}) => {
  const apiClient = new ApiClient(ApiExplorerFirebaseApp);

  const businessIcon = BusinessIcon as any;

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "25%",
      maxWidth: "36ch",
    },
    inline: {
      display: "inline",
    },
  }));
  const genListBuilder: GenericListBuilderProps = genericListBuilderProp;
  genListBuilder.classes = useStyles;
  const [listItems, setListItems] = React.useState<GenericListSchema[]>([]);
  apiClient.get("mewm/events").then((schemas) => {
    schemas.json().then((schemas) => {
      const schemasTyped = schemas as MEWMEventList;
      setListItems(
        schemasTyped.events.map((value) => {
          return {
            line1: `${value.eventName}`,
            deleteEndpoint: `mewm/events/${value.eventId}`,
            deleteText: "Delete Mini-Event",
            detailedViewLink: `mewm/events/${value.eventId}`,
            detailedViewText: "Mini-Event Detail",
            icon: businessIcon,
            key: `${value.eventId}`,
            line2: `${value.eventDescription}`,
            multiline: true,
          };
        })
      );
    });
  });
  return (
    <Fragment>
      <GenericListBuilder
        genericList={listItems}
        classes={genListBuilder.classes}
      />
    </Fragment>
  );
};

export default MiniEventsList;
