import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { apiClient } from "../../../helper";
import CreateDetailEditPage from "../../pages/CreateDetailsEditPage";
import Error404Page from "../../pages/Error404Page";
import ListPage from "../../pages/ListPage";

const RulesPages: React.FunctionComponent = () => {
  const [attributeOptions, setAttributeOptions] = React.useState<
    {
      label: string;
      value: any;
    }[]
  >([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  if (!loaded) {
    setLoaded(true);
    apiClient
      .get("urm/questions")
      .then((questionsRaw) => {
        questionsRaw.json().then((questions) => {
          const questionsTyped = (questions as URMQuestionsList).questions;
          setAttributeOptions(
            [
              { label: "First Name", value: "firstName" },
              { label: "Last Name", value: "lastName" },
              { label: "Email", value: "email" },
              { label: "Phone Number", value: "phoneNumber" },
            ].concat(
              questionsTyped.map((question) => {
                return {
                  label: question.applicationQuestionLabel,
                  value: question.questionId,
                };
              })
            )
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
    const schemasTyped = schemas as URMRulesList;
    setListItems(
      schemasTyped.rules.map((value) => {
        return {
          line1: value.ruleName,
          deleteEndpoint: `urm/rules/${value.ruleId}`,
          deleteText: "Delete Rule",
          detailedViewLink: `/urm/rules/rule/${value.ruleId}`,
          detailedViewText: "Rule Details",
          icon: LabelImportantIcon,
          key: `${value.ruleId}`,
        };
      })
    );
  };

  const RuleCreateEditDetailsPageComponent = (
    <CreateDetailEditPage<URMRules>
      objectTypeName={"URM Rule"}
      listEndpoint="/urm/rules"
      apiEndpoint={"urm/rules"}
      idAttribute="ruleId"
      attributes={[
        {
          attributeName: "ruleName",
          attributeLabel: "Application Rule Name",
        },
        {
          attributeName: "role",
          attributeLabel: "User Role",
          attributeOptions: [
            { label: "Organizer", value: "organizer" },
            { label: "Sponsor", value: "sponsor" },
            { label: "Mentor", value: "mentor" },
            { label: "Volunteer", value: "volunteer" },
            { label: "Hacker", value: "hacker" },
          ],
        },
        {
          attributeName: "applicationQuestionId",
          attributeLabel: "Application Question",
          attributeOptions: attributeOptions,
        },
        {
          attributeName: "acceptedValues",
          attributeLabel: "Accepted Values (Regular Expression)",
        },
        {
          attributeName: "matchesRemaining",
          attributeLabel:
            "Matches Remaining (how many times can be the rule be applied)",
          attributeTypeIsNumber: true,
        },
        {
          attributeName: "result",
          attributeLabel: "Accept or Reject",
          attributeOptions: [
            { label: "Accept", value: "accepted" },
            { label: "Reject", value: "rejected" },
          ],
        },
      ]}
    />
  );

  return (
    <Switch>
      <Route exact path="/urm/rules">
        <ListPage
          pageTitle="Application Rules"
          objectTypeName="Application Rule"
          apiEndpoint="urm/rules"
          createNewLink="/urm/rules/create"
          listMapFunction={listMapFunction}
        />
      </Route>
      <Route path="/urm/rules/create">
        {RuleCreateEditDetailsPageComponent}
      </Route>
      <Route path="/urm/rules/rule/:ruleId">
        {RuleCreateEditDetailsPageComponent}
      </Route>
      <Route component={Error404Page} />
    </Switch>
  );
};

export default RulesPages;
