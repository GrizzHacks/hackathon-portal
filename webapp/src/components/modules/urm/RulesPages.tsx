import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import CreateDetailEditPage from "../../pages/CreateDetailsEditPage";
import Error404Page from "../../pages/Error404Page";
import ListPage from "../../pages/ListPage";

const RulesPages: React.FunctionComponent = () => {
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
            detailedViewLink: `/stpm/tiers/tier/${value.ruleId}`,
            detailedViewText: "Rule Details",
            icon: LabelImportantIcon,
            key: `${value.ruleId}`,
          };
        })
      );
    };
  
    const TierCreateEditDetailsPageComponent = (
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
            attributeName: "ruleOrder",
            attributeLabel: "Rule Order",
            attributeTypeIsNumber: true,
          },
          {
            attributeName: "applicationQuestionId",
            attributeLabel: "Application Question",
            // TODO: logic pairing component to application question
          },
          {
            attributeName: "acceptedValues",
            attributeLabel: "Accepted Values",
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
          {TierCreateEditDetailsPageComponent}
        </Route>
        <Route path="/urm/rules/rule/:ruleId">
          {TierCreateEditDetailsPageComponent}
        </Route>
        <Route component={Error404Page} />
      </Switch>
    );
  };
  
export default RulesPages;
