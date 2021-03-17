import React from "react";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import { Container } from "@material-ui/core";
import GenericList from "./GenericList";
import { GenericListSchema } from "../../../../@types/generics/GenericListSchema";

export interface GenericListBuilderProps {
  genericList: GenericListSchema[];
  classes: any;
}

const GenericListBuilder: React.FunctionComponent<GenericListBuilderProps> = ({
  genericList,
  classes,
}) => {
  return (
    <div>
      <Container className={classes.pageTitle}>
        <Typography variant="h5"></Typography>
      </Container>
      <List>
        {genericList.map((genericList, index) => {
          return (
            <GenericList
              key={`event_${index}`}
              genericList={genericList}
              classes={classes}
            />
          );
        })}
      </List>
    </div>
  );
};

export default GenericListBuilder;
