import React from "react";
import { makeStyles } from "@material-ui/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { Fragment } from "react";
import GenericListBuilder, {
  GenericListBuilderProps,
} from "./generics/GenericListBuilder";
import BusinessIcon from "@material-ui/icons/Business";
import CloudIcon from "@material-ui/icons/Cloud";

declare interface AppProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const genericListBuilderProp: GenericListBuilderProps = {
  genericList: [],
  classes: undefined,
};

const genList1: GenericListSchema = {
  key: "key1",
  line1: "Amazon",
  multiline: true,
  line2: "AMZ",
  deleteText: "Delete Entry",
  detailedViewLink: "dummyLink",
  deleteEndpoint: "dummyEndpoint",
  detailedViewText: "View Details",
  icon: BusinessIcon,
};

const genList2: GenericListSchema = {
  key: "key2",
  line1: "Dynatrace",
  multiline: true,
  line2: "DTR",
  deleteText: "Delete Entry",
  detailedViewLink: "dummyLink",
  deleteEndpoint: "dummyEndpoint",
  detailedViewText: "View Details",
  icon: CloudIcon,
};

const genListSchemas: GenericListSchema[] = [genList1, genList2];

genericListBuilderProp.genericList = genListSchemas;

const TestGenericList: React.FunctionComponent<AppProps> = ({}) => {
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
  return (
    <Fragment>
      <GenericListBuilder
        genericList={genListBuilder.genericList}
        classes={genListBuilder.classes}
      />
    </Fragment>
  );
};

export default TestGenericList;
