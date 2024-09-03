export interface SalarySurveyApiModel {
  time_stamp?: string,
  employer?: string,
  location?: string,
  job_title?: string;
  years_at_employer?: string;
  years_of_experience?: string;
  salary?: string;
  signing_bonus?: string;
  annual_bonus?: string;
  annual_stock_value?: string;
  gender?: string;
  additional_comments?: string;
}
export const SALARY_SURVEY_API_MODEL_OBJ: SalarySurveyApiModel = {
  time_stamp: undefined,
  employer: undefined,
  location: undefined,
  job_title: undefined,
  years_at_employer: undefined,
  years_of_experience: undefined,
  salary: undefined,
  signing_bonus: undefined,
  annual_bonus: undefined,
  annual_stock_value: undefined,
  gender: undefined,
  additional_comments: undefined,
};
export type SalarySurveyApiKey = keyof SalarySurveyApiModel;
export type SqlSelect = SalarySurveyDbKey | "*";
export interface QueryParam extends SalarySurveyApiModel {
  sort?: string;
  sort_type?: string;
  fields?: SalarySurveyApiKey;
}
export type NumberOperator = ">=" | "<=" | "=" | ">" | "<";
export type SortOperator = "DESC" | "ASC";
interface OperationParam {
  [key: string]: {
    gte?: string;
    lte?: string;
    eq?: string;
    // Add other possible operators as needed
  };
}

export interface SqlWhere {
  dbField: SalarySurveyDbKey;
  operator: NumberOperator;
  value: string;
}

export interface SqlOrder {
  dbField: SalarySurveyDbKey;
  sortType: SortOperator;
}

export type SqlFragment = {
  sqlOrders: SqlOrder[];
  sqlWheres: SqlWhere[];
  sqlSelects: SqlSelect[];
};

/* All properties need to be string due to the given db dataset */
export interface SalarySurveyModel{
  timeStamp?: string;         // Date
  employer?: string;          // number
  location?: string;
  jobTitle?: string;
  yearsAtEmployer?: string;
  yearsOfExperience?: string; // Date
  salary?: string;            // number
  signingBonus?: string;      // number
  annualBonus?: string;       // number
  annualStockValue?: string;  // number
  gender?: string;
  additionalComment?: string;
}

export interface SalarySurveyDto {
  'Timestamp': string;
  'Employer': string;
  'Location': string;
  'Job Title': string;
  'Years at Employer': string;
  'Years of Experience': string;
  'Salary': string;
  'Signing Bonus': string;
  'Annual Bonus': string;
  'Annual Stock Value/Bonus': string;
  'Gender': string;
  'Additional Comments': string;
}
export type SalarySurveyDbKey = keyof SalarySurveyDto;
export const salarySurveyApiToDbHashMap: Map<string, SalarySurveyDbKey> = new Map();
salarySurveyApiToDbHashMap.set('time_stamp', 'Timestamp')
salarySurveyApiToDbHashMap.set('employer', 'Employer')
salarySurveyApiToDbHashMap.set('job_title', 'Job Title')
salarySurveyApiToDbHashMap.set('years_at_employer', 'Years at Employer')
salarySurveyApiToDbHashMap.set('years_of_experience', 'Years of Experience')
salarySurveyApiToDbHashMap.set('salary', 'Salary')
salarySurveyApiToDbHashMap.set('signing_bonus', 'Signing Bonus')
salarySurveyApiToDbHashMap.set('annual_bonus', 'Annual Bonus')
salarySurveyApiToDbHashMap.set('annual_stock_value', 'Annual Stock Value/Bonus')
salarySurveyApiToDbHashMap.set('gender', 'Gender')
salarySurveyApiToDbHashMap.set('additional_comments', 'Additional Comments')
