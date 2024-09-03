import { Request, Response, NextFunction } from "express";
import {
  SqlOrder,
  SqlWhere,
  SalarySurveyField,
  QueryParam,
  SqlSelect,
  NumberOperator,
  SALARY_SURVEY_DTO_OBJ,
  SortOperator,
} from "./../dto/salary-survey.dto";
import { salarySurveyDao } from "../dao/salary-survey.dao";

// /job_data?salary[gte]=120000&experience=10&sort=job_title,salary&sort_type=DESC,ASC
export class SalarySurveyController {
  sqlWheres: SqlWhere[] = [];
  sqlOrders: SqlOrder[] = [];
  sqlSelects: SqlSelect[] = [];

  private createSqlSelects(queryParam: QueryParam) {
    this.sqlSelects = ["*"];
    if (queryParam.fields) {
      const queryParamFields: SalarySurveyField = queryParam.fields;
      const tmpFieldArrary = queryParamFields.split(",") as SalarySurveyField[];
      tmpFieldArrary.forEach((field) => {
        if (field in SALARY_SURVEY_DTO_OBJ) {
          this.sqlSelects.push(field);
        } else {
          throw new Error(
            `Invalid query param (fields=): The api doesn't have '${field}'`
          );
        }
      });
      if (this.sqlSelects.length === 0) this.sqlSelects = ["*"];
    }
  }

  private createSqlWheres(queryParam: QueryParam, field: SalarySurveyField) {
    let operator: NumberOperator = "=";
    let value = queryParam[field] as string;

    if (typeof queryParam[field] === "object" && "gte" in queryParam[field]) {
      operator = ">=";
      value = queryParam[field].gte as string;
    } else if (
      typeof queryParam[field] === "object" &&
      "gt" in queryParam[field]
    ) {
      operator = ">";
      value = queryParam[field].gt as string;
    } else if (
      typeof queryParam[field] === "object" &&
      "lte" in queryParam[field]
    ) {
      operator = "<=";
      value = queryParam[field].lte as string;
    } else if (
      typeof queryParam[field] === "object" &&
      "lt" in queryParam[field]
    ) {
      operator = "<";
      value = queryParam[field].lt as string;
    }
    this.sqlWheres.push({ field, operator, value });
  }

  private createSqlOrders(queryParam: QueryParam) {
    const sortKeys = queryParam.sort!.split(",");
    const sortTypes = queryParam.sort_type
      ? queryParam.sort_type.split(",")
      : [];
    for (let i = 0; i < sortKeys.length; i++) {
      const sortField = sortKeys[i] as SalarySurveyField;
      const sortType = (sortTypes[i] ? sortTypes[i] : "ASC") as SortOperator;
      if (sortField in SALARY_SURVEY_DTO_OBJ) {
        this.sqlOrders.push({ sortField, sortType });
      } else {
        throw new Error(
          `Invalid queryparm (sort=): The api doesn't have '${sortField}'`
        );
      }
    }
  }

  private createQuery(queryParam: QueryParam) {
    const allQueryKeys = Object.keys(queryParam).map(
      (key) => key as keyof QueryParam
    );

    allQueryKeys.forEach((key) => {
      this.createSqlSelects(queryParam);
      if (key in SALARY_SURVEY_DTO_OBJ) {
        this.createSqlWheres(queryParam, key as SalarySurveyField);
      } else if (queryParam.sort) {
        this.createSqlOrders(queryParam);
      } else {
        throw new Error(`Invalid query param: '${key}'`);
      }
    });
  }

  public getJobData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const queryParam = req.query as QueryParam;
      this.createQuery(queryParam);
      console.log(this.sqlWheres);
      const salarySurveys = salarySurveyDao.query({
        sqlSelects: this.sqlSelects,
        sqlWheres: this.sqlWheres,
        sqlOrders: this.sqlOrders,
      });
      res.status(200).json({
        payload: salarySurveys,
      });
    } catch (err) {
      next(err);
    }
  };
}

export const salarySurveryController = new SalarySurveyController();
