declare interface URMQuestionUpdateRequest {
  questionId?: string;
  applicationQuestionLabel?: string;
  inOrganizerApplication?: "required" | "optional" | "no";
  inSponsorApplication?: "required" | "optional" | "no";
  inMentorApplication?: "required" | "optional" | "no";
  inVolunteerApplication?: "required" | "optional" | "no";
  inHackerApplication?: "required" | "optional" | "no";
  type?: "string" | "number" | "enum" | "reference";
  enumLabels?: string;
  enumValues?: string;
  referenceEndpoint?: string;
  referenceCollection?: string;
  referenceLabelAttribute?: string;
  referenceValueAttribute?: string;
}

declare interface URMQuestionCreateRequest extends URMQuestionUpdateRequest {
  questionId: string;
  applicationQuestionLabel: string;
  type: "string" | "number" | "enum" | "reference";
}

declare interface URMQuestion extends URMQuestionCreateRequest {
  inOrganizerApplication: "required" | "optional" | "no";
  inSponsorApplication: "required" | "optional" | "no";
  inMentorApplication: "required" | "optional" | "no";
  inVolunteerApplication: "required" | "optional" | "no";
  inHackerApplication: "required" | "optional" | "no";
}

declare interface URMQuestionsList {
  questions: URMQuestion[];
}
