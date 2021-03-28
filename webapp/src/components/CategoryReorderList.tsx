import React from "react";
import { makeStyles } from "@material-ui/styles";
import { GenericListBuilderProps } from "./generics/GenericListBuilder";
import BusinessIcon from "@material-ui/icons/Business";
import { GenericListSchema } from "../../../@types/generics/GenericListSchema";
import ApiClient from "../helper/ApiClient";
import { ApiExplorerFirebaseApp } from "../devTools/apiExplorerFirebaseConfig";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Button,
  Divider,
} from "@material-ui/core";
import { Container, Draggable } from "react-smooth-dnd";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import arrayMove from "array-move";

declare interface AppProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}
const genericListBuilderProp: GenericListBuilderProps = {
  genericList: [],
  classes: undefined,
};
const apiClient = new ApiClient(ApiExplorerFirebaseApp);
function deleteElement(x: string | undefined) {
  if (x != undefined) apiClient.delete(x);
}
function getElement(x: string | undefined) {
  if (x != undefined) apiClient.get(x);
}
const CategoryReorderList: React.FunctionComponent<AppProps> = ({}) => {
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
  let testItems: GenericListSchema[] = [];
  const [items, setItems] = React.useState<GenericListSchema[]>([]);
  apiClient.get("pm/categories").then((schemas) => {
    schemas.json().then((schemas) => {
      const schemasTyped = schemas as PMCategoryList;
      setItems(
        schemasTyped.prizeCategories.map((value) => {
          return {
            line1: `${value.prizeCategoryName} (${value.approvalStatus})`,
            deleteEndpoint: `pm/categories/${value.prizeCategoryId}`,
            deleteText: "Delete Category",
            detailedViewLink: `pm/categories/${value.prizeCategoryId}`,
            detailedViewText: "Category Detail",
            icon: businessIcon,
            key: `${value.prizeCategoryId}`,
            line2: `${value.prizeCategoryDescription}`,
            multiline: true,
          };
        })
      );
    });
  });
  const onDrop = ({
    removedIndex,
    addedIndex,
  }: {
    removedIndex: any;
    addedIndex: any;
  }) => {
    setItems((items) => arrayMove(items, removedIndex, addedIndex));
  };
  return (
    <List>
      <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
        {items.map(
          ({ key, line1, deleteEndpoint, deleteText, detailedViewText }) => (
            <Draggable key={key}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary={line1} />
                  <ListItemSecondaryAction>
                    <Button
                      onClick={() => {
                        getElement(deleteEndpoint);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      {detailedViewText}
                    </Button>
                    &nbsp; &nbsp; &nbsp;
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        deleteElement(deleteEndpoint);
                      }}
                    >
                      {deleteText}
                    </Button>
                    &nbsp; &nbsp; &nbsp;
                    <ListItemIcon className="drag-handle">
                      <DragHandleIcon />
                    </ListItemIcon>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" variant="inset" />
              </List>
            </Draggable>
          )
        )}
      </Container>
    </List>
  );
};

export default CategoryReorderList;
