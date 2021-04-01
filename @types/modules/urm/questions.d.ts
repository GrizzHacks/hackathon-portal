declare interface URMQuestionsUpdateRequest {
    applicationQuestionId?: string;
    applicationQuestionLabel?: string;
    applicationQuestionUsage?: 1 | 2 | 3 | 4 | 5;
    values?: Array<string>;
  }

  declare interface URMQuestionsCreateRequest extends URMQuestionsUpdateRequest {
    applicationQuestionId: string;
    applicationQuestionLabel: string;
    applicationQuestionUsage: 1 | 2 | 3 | 4 | 5;
    values: Array<string>;
  }

  declare interface URMQuestion extends URMQuestionsCreateRequest{
    applicationQuestionId: string;
    applicationQuestionLabel: string;
    applicationQuestionUsage: 1 | 2 | 3 | 4 | 5;
    values: Array<string>;
  }

  declare interface URMQuestionsList {
      urmquestions: URMQuestion [];
  }