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

const TierList: React.FunctionComponent<AppProps> = ({}) => {
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
  apiClient.get("stpm/tiers/").then((schemas) => {
    schemas.json().then((schemas) => {
      const schemasTyped = schemas as STPMTierList;
      setListItems(
        schemasTyped.sponsorTiers.map((value) => {
          return {
            line1: `${value.sponsorTierName}`,
            deleteEndpoint: `stpm/tiers//${value.sponsorTierId}`,
            deleteText: "Delete Sponsor Tier",
            detailedViewLink: `stpm/tiers//${value.sponsorTierId}`,
            detailedViewText: "Sponsor Tier Detail",
            icon: businessIcon,
            key: `${value.sponsorTierId}`,
            line2: `${value.sponsorTierOrder}`,
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

export default TierList;
