import React, { Fragment } from "react";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import { Button, Container, Divider } from "@material-ui/core";
import GenericListItem from "../misc/GenericListItem";
import { styles } from "../../styles";
import { useHistory } from "react-router";
import { apiClient } from "../../helper";

declare interface ListPageProps {
  pageTitle: string;
  objectTypeName: string;
  apiEndpoint: string;
  createNewLink: string;
  listMapFunction: (
    setListItems: (listItems: GenericListItemInfo[]) => void
  ) => (items: any) => void;
}

const ListPage: React.FunctionComponent<ListPageProps> = ({
  pageTitle,
  objectTypeName,
  apiEndpoint,
  createNewLink,
  listMapFunction,
}) => {
  const classes = styles();
  const routeHistory = useHistory();

  const [listItems, setListItems] = React.useState<GenericListItemInfo[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  if (!loaded) {
    setLoaded(true);
    apiClient
      .get(apiEndpoint)
      .then((items) => {
        items.json().then(listMapFunction(setListItems));
      })
      .catch((err) => console.log(err));
  }

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h3">{pageTitle}</Typography>
      </Container>
      <List>
        {listItems.map((listItem, index) => {
          return (
            <Fragment key={`list_item-${index}`}>
              {index > 0 && <Divider />}
              <GenericListItem key={`event_${index}`} itemInfo={listItem} />
            </Fragment>
          );
        })}
      </List>
      <Container className={classes.pageTitle}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            routeHistory.push(createNewLink);
          }}
        >
          Create New {objectTypeName}
        </Button>
      </Container>
    </Fragment>
  );
};

export default ListPage;
