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

const MiniEventTypesList: React.FunctionComponent<AppProps> = ({}) => {
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
  apiClient.get("mewm/types").then((schemas) => {
    schemas.json().then((schemas) => {
      const schemasTyped = schemas as MEWMEventTypeList;
      setListItems(
        schemasTyped.eventTypes.map((value) => {
          return {
            line1: `${value.eventTypeName}`,
            deleteEndpoint: `mewm/types/${value.eventTypeId}`,
            deleteText: "Delete Mini-Event Type",
            detailedViewLink: `mewm/types/${value.eventTypeId}`,
            detailedViewText: "Mini-Event Detail",
            icon: businessIcon,
            key: `${value.eventTypeId}`,
            line2: `${value.eventTypeDescription}`,
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

export default MiniEventTypesList;
