import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { apiClient } from "../../../helper";
import CreateDetailEditPage from "../../pages/CreateDetailsEditPage";
import Error404Page from "../../pages/Error404Page";
import ListPage from "../../pages/ListPage";

const QuestionPages: React.FunctionComponent = () => {
  const [attributeOptions, setAttributeOptions] = React.useState<
    {
      label: string;
      value: any;
    }[]
  >([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [questionUsage, setQuestionUsage] = React.useState<
    {
      label: string;
      value: any;
    }[]
  >([]);

  if (!loaded) {
    setLoaded(true);
    apiClient
      .get("urm/questions")
      .then((questionsRaw) => {
        questionsRaw.json().then((questions) => {
          const questionsTyped = (questions as URMQuestionsList).urmquestions;
          setAttributeOptions(
            questionsTyped.map((question) => {
              return {
                label: question.applicationQuestionLabel,
                value: question.questionsId,
              };
            })
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const listMapFunction = (
    setListItems: (listItems: GenericListItemInfo[]) => void
  ) => (schemas: any) => {
    const schemasTyped = schemas as URMQuestionsList;
    setListItems(
      schemasTyped.urmquestions.map((value) => {
        return {
          line1: value.applicationQuestionLabel,
          deleteEndpoint: `urm/questions/${value.questionsId}`,
          deleteText: "Delete Question",
          detailedViewLink: `urm/questions/${value.questionsId}`,
          detailedViewText: "Rule Details",
          icon: LabelImportantIcon,
          key: `${value.questionsId}`,
        };
      })
    );
  };

  const QuestionCreateEditDetailsPageComponent = (
    <CreateDetailEditPage<URMQuestion>
      objectTypeName={"URM Question"}
      listEndpoint="/urm/questions"
      apiEndpoint={"urm/questions"}
      idAttribute="questionsId"
      attributes={[
        {
          attributeName: "applicationQuestionLabel",
          attributeLabel: "Question",
        },
        {
          attributeName: "applicationQuestionUsage",
          attributeLabel: "Question Usage",
          attributeOptions: questionUsage.concat([
            { label: "organizer", value: undefined },
            { label: "hacker", value: undefined },
            { label: "sponsor", value: undefined },
            { label: "mentor", value: undefined },
            { label: "volenteer", value: undefined },
          ]),
        },
        {
          attributeName: "values",
          attributeLabel: "Accepted Values",
        },
      ]}
    />
  );

  return (
    <Switch>
      <Route exact path="/urm/questions">
        <ListPage
          pageTitle="Application questions"
          objectTypeName="Application question"
          apiEndpoint="urm/questions"
          createNewLink="/urm/questions/createQuestion"
          listMapFunction={listMapFunction}
        />
      </Route>
      <Route path="/urm/questions/createQuestion">
        {QuestionCreateEditDetailsPageComponent}
      </Route>
      <Route path="/urm/questions/URMquestions/:questionsId">
        {QuestionCreateEditDetailsPageComponent}
      </Route>
      <Route component={Error404Page} />
    </Switch>
  );
};

export default QuestionPages;
