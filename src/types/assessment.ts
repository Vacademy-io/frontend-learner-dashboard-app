export interface Option {
    optionId: string;
    optionName: string;
  }
  
  export interface Question {
    questionType: string;
    questionId: string;
    questionName: string;
    questionMark: string;
    imageDetails: any[];
    options: Option[];
  }
  
  export interface MarkingRule {
    checked: boolean;
    value: string;
  }
  
  export interface Section {
    assesmentDuration: string;
    subject: string;
    sectionDesc: string;
    sectionDuration: string;
    negativeMarking: MarkingRule;
    partialMarking: boolean;
    cutoffMarking: MarkingRule;
    totalMark: string;
    questions: Question[];
  }
  
  export interface Assessment {
    assessmentId: string ;
    title: string;
    mode: string;
    status: string;
    startDate: string;
    endDate: string;
    assessmentDuration: string;
    subject: string;
    assessmentInstruction: string;
    assessmentPreview: string;
    canSwitchSections: boolean;
    sections: Section[];
  }
  