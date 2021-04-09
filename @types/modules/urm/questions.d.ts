declare interface URMQuestionsUpdateRequest {
  questionsId?: string;
  applicationQuestionLabel?: string;
  applicationQuestionUsage?: {
    organizer?: boolean;
    sponsor?: boolean;
    mentor?: boolean;
    volenteer?: boolean;
    hacker?: boolean;
  };
  values?: string[];
}

declare interface URMQuestionsCreateRequest extends URMQuestionsUpdateRequest {
  questionsId: string;
  applicationQuestionLabel: string;
}

declare interface URMQuestion extends URMQuestionsCreateRequest {
  applicationQuestionUsage: {
    organizer?: boolean;
    sponsor?: boolean;
    mentor?: boolean;
    volenteer?: boolean;
    hacker?: boolean;
  };
  values: string[];
}

declare interface URMQuestionsList {
  urmquestions: URMQuestion[];
}
