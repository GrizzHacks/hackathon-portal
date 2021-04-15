declare interface URMRulesUpdateRequest {
  ruleOrder?: number;
  ruleName?: string;
  applicationQuestionId?: string;
  acceptedValues?: string;
  matchesRemaining?: number;
}

declare interface URMRulesCreateRequest extends URMRulesUpdateRequest {
  ruleId: string;
  ruleOrder: number;
  ruleName: string;
  applicationQuestionId: string;
  acceptedValues: string;
}

declare interface URMRules extends URMRulesCreateRequest {
  matchesRemaining: number;
}

declare interface URMRulesList {
  rules: URMRules[];
}
