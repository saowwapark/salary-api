import { Request, Response, NextFunction } from "express";
import {
  SqlOrder,
  SqlWhere,
  SalarySurveyApiKey,
  QueryParam,
  SqlSelect,
  NumberOperator,
  SALARY_SURVEY_API_MODEL_OBJ,
  SortOperator,
  salarySurveyApiToDbHashMap,
} from "./../dto/salary-survey.dto";
import { salarySurveyDao } from "../dao/salary-survey.dao";

// /job_data?fields=job_title,salary&job_title=software_engineer&salary[gte]=120000&sort=job_title,salary&sort_type=DESC,ASC
export class SalarySurveyController {
  sqlWheres: SqlWhere[] = [];
  sqlOrders: SqlOrder[] = [];
  sqlSelects: SqlSelect[] = [];
  private createSqlSelects(queryParam: QueryParam): SqlSelect[] {
    let sqlSelects: SqlSelect[] = [];
    if (queryParam.fields) {
      const queryParamFields: SalarySurveyApiKey = queryParam.fields;
      const tmpFieldArrary = queryParamFields.split(",") as SalarySurveyApiKey[];
      tmpFieldArrary.forEach((field) => {
        if (field in SALARY_SURVEY_API_MODEL_OBJ) {
          const dbField = salarySurveyApiToDbHashMap.get(field)
          if(dbField) {
            sqlSelects.push(dbField)
          } else {
            throw new Error(
              `Invalid mapping db column '${dbField}'`
            )
          }
        } else {
          throw new Error(
            `Invalid query param (fields=): The api doesn't have '${field}'`
          );
        }
      });
      if (sqlSelects.length === 0) sqlSelects = ["*"];
    } else {
      sqlSelects = ["*"];
    }
    return sqlSelects;
  }

  private createSqlWheres(queryParam: QueryParam, field: SalarySurveyApiKey): SqlWhere[] {
    let sqlWheres: SqlWhere[] = [];
    let operator: NumberOperator = "=";
    let value = queryParam[field] as string;

    if (typeof queryParam[field] === "object" && "gte" in queryParam[field]) {
      operator = ">=";
      value = (queryParam[field] as { gte?: string }).gte as string;
    } else if (
      typeof queryParam[field] === "object" &&
      "gt" in queryParam[field]
    ) {
      operator = ">";
      value = (queryParam[field] as { gt?: string }).gt as string;
    } else if (
      typeof queryParam[field] === "object" &&
      "lte" in queryParam[field]
    ) {
      operator = "<=";
      value = (queryParam[field] as {lte?: string}).lte as string;
    } else if (
      typeof queryParam[field] === "object" &&
      "lt" in queryParam[field]
    ) {
      operator = "<";
      value = (queryParam[field] as {lt?: string}).lt as string;
    }
    value = value.replace('_', ' ');
    const dbField = salarySurveyApiToDbHashMap.get(field)
    if (dbField){
      sqlWheres.push({ dbField, operator, value});
    }
    return sqlWheres;
  }



  private createSqlOrders(queryParam: QueryParam): SqlOrder[] {
    let sqlOrders: SqlOrder[] = [];
    const sortKeys = queryParam.sort!.split(",");
    const sortTypes = queryParam.sort_type
      ? queryParam.sort_type.split(",")
      : [];
    for (let i = 0; i < sortKeys.length; i++) {
      const sortField = sortKeys[i] as SalarySurveyApiKey;
      const sortType = (sortTypes[i] ? sortTypes[i] : "ASC") as SortOperator;
      const dbField = salarySurveyApiToDbHashMap.get(sortField)
      if (dbField) {
        sqlOrders.push({ dbField, sortType });
      } else {
        throw new Error(
          `Invalid queryparm (sort=): The api doesn't have '${sortField}'`
        );
      }
    }
    return sqlOrders;
  }

  private createQuery(queryParam: QueryParam) {
    const allQueryKeys = Object.keys(queryParam).map(
      (key) => key as keyof QueryParam
    );

    allQueryKeys.forEach((key) => {
      this.sqlSelects = this.createSqlSelects(queryParam);
      if (key in SALARY_SURVEY_API_MODEL_OBJ) {
        this.sqlWheres = this.createSqlWheres(queryParam, key as SalarySurveyApiKey);
      } else if (queryParam.sort) {
        this.sqlOrders = this.createSqlOrders(queryParam);
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
      const salarySurveys = await salarySurveyDao.query({
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
