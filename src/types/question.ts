// types.ts
export interface Question {
    questionId: string;
    questionType: string;
    questionName: string;
    questionMark: string;
    options: {
      optionId: string;
      optionName: string;
    }[];
  }
  
  export interface Section {
    subject: string;
    sectionDesc: string;
    questions: Question[];
  }
  
  export interface Assessment {
    assessmentId: string;
    title: string;
    sections: Section[];
  }
  
  export interface QuestionState {
    answered: boolean;
    markedForReview: boolean;
    visited: boolean;
  }