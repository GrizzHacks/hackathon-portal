declare interface URMRulesUpdateRequest {
  ruleName?: string;
  ruleOrder?: number;
  role?: "organizer" | "sponsor" | "mentor" | "volunteer" | "hacker";
  applicationQuestionId?: string;
  acceptedValues?: string;
  matchesRemaining?: number;
  result?: "accepted" | "rejected";
}

declare interface URMRulesCreateRequest extends URMRulesUpdateRequest {
  ruleId: string;
  ruleName: string;
  role: "organizer" | "sponsor" | "mentor" | "volunteer" | "hacker";
  applicationQuestionId: string;
  acceptedValues: string;
}

declare interface URMRules extends URMRulesCreateRequest {
  ruleOrder: number;
  matchesRemaining: number;
  result: "accepted" | "rejected";
}

declare interface URMRulesList {
  rules: URMRules[];
}
