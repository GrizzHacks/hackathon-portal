import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Error404Page from "../../pages/Error404Page";
import ListPage from "../../pages/ListPage";
import QuestionCreateDetailEditPage from "./QuestionsCreateEditDetailsPage";

const QuestionPages: React.FunctionComponent = () => {
  const listMapFunction = (
    setListItems: (listItems: GenericListItemInfo[]) => void
  ) => (schemas: any) => {
    const schemasTyped = schemas as URMQuestionsList;
    setListItems(
      schemasTyped.questions.map((value) => {
        return {
          line1: value.applicationQuestionLabel,
          line2: {
            string: "Text",
            number: "Number",
            enum: "Dropdown",
            reference: "Reference",
          }[value.type],
          deleteEndpoint: `urm/questions/${value.questionId}`,
          deleteText: "Delete Question",
          detailedViewLink: `/urm/questions/question/${value.questionId}`,
          detailedViewText: "Rule Details",
          icon: QuestionAnswerIcon,
          key: `${value.questionId}`,
        };
      })
    );
  };

  return (
    <Switch>
      <Route exact path="/urm/questions">
        <ListPage
          pageTitle="Application Questions"
          objectTypeName="Application question"
          apiEndpoint="urm/questions"
          createNewLink="/urm/questions/create"
          listMapFunction={listMapFunction}
        />
      </Route>
      <Route path="/urm/questions/create">
        <QuestionCreateDetailEditPage />
      </Route>
      <Route path="/urm/questions/question/:questionId">
        <QuestionCreateDetailEditPage />
      </Route>
      <Route component={Error404Page} />
    </Switch>
  );
};

export default QuestionPages;
