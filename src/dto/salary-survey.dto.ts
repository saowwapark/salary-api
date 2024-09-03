export interface SalarySurveyDto {
  timeStamp?: Date;
  employer?: number;
  location?: string;
  jobTitle?: string;
  yearsAtEmployer?: string[];
  yearsOfExperience?: Date;
  salary?: number;
  signingBonus?: number;
  annualBonus?: number;
  annualStockValue?: number;
  gender?: string;
  additionalComment?: string;
}
export const SALARY_SURVEY_DTO_OBJ: SalarySurveyDto = {
  timeStamp: undefined,
  employer: undefined,
  location: undefined,
  jobTitle: undefined,
  yearsAtEmployer: undefined,
  yearsOfExperience: undefined,
  salary: undefined,
  signingBonus: undefined,
  annualBonus: undefined,
  annualStockValue: undefined,
  gender: undefined,
  additionalComment: undefined,
};
export type SalarySurveyField = keyof SalarySurveyDto;
export type SqlSelect = SalarySurveyField | "*";
export interface QueryParam extends SalarySurveyDto {
  sort?: string;
  sort_type?: string;
  fields?: SalarySurveyField;
}
export type NumberOperator = ">=" | "<=" | "=" | ">" | "<";
export type SortOperator = "DESC" | "ASC";

export interface SqlWhere {
  field: SalarySurveyField;
  operator: NumberOperator;
  value: string;
}

export interface SqlOrder {
  sortField: SalarySurveyField;
  sortType: SortOperator;
}

export type SqlFragment = {
  sqlOrders: SqlOrder[];
  sqlWheres: SqlWhere[];
  sqlSelects: SqlSelect[];
};
