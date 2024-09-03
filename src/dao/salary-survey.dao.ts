import { RowDataPacket, format } from "mysql2/promise";
import {
  SqlWhere,
  SalarySurveyDto,
  SqlFragment,
  SqlOrder,
} from "./../dto/salary-survey.dto";
import { dbPool } from "../config/db.config";

export class SalarySurveyDao {
  private parse(salarySurvey: SalarySurveyDto) {
    const salarySurveyDto: SalarySurveyDto = {
      timeStamp: salarySurvey.timeStamp || undefined,
      employer: salarySurvey.employer || undefined,
      location: salarySurvey.location || undefined,
      jobTitle: salarySurvey.jobTitle || undefined,
      yearsAtEmployer: salarySurvey.yearsAtEmployer || undefined,
      yearsOfExperience: salarySurvey.yearsOfExperience || undefined,
      salary: salarySurvey.salary || undefined,
      signingBonus: salarySurvey.signingBonus || undefined,
      annualBonus: salarySurvey.annualBonus || undefined,
      annualStockValue: salarySurvey.annualStockValue || undefined,
      gender: salarySurvey.gender || undefined,
      additionalComment: salarySurvey.additionalComment || undefined,
    };
    return salarySurveyDto;
  }

  private parseAll(rows: SalarySurveyDto[]) {
    const salalrySurveys: SalarySurveyDto[] = [];
    rows.forEach((row: SalarySurveyDto) => {
      const salarySurvey = this.parse(row);
      salalrySurveys.push(salarySurvey);
    });
    return salalrySurveys;
  }

  private getWhereStatement(sqlFilters: SqlWhere[]) {
    let whereStatment = "";
    const wheres: string[] = [];

    sqlFilters.forEach((data) => {
      wheres.push(`${data.field} ${data.operator} ${data.value}`);
    });
    if (wheres.length > 0) {
      whereStatment = `WHERE ${wheres.join(", ")}`;
    }
    return whereStatment;
  }

  private getOrderStatement(sqlSorts: SqlOrder[]) {
    let sortStatement = "";
    const sorts: string[] = [];

    sqlSorts.forEach((data) => {
      sorts.push(`${data.sortField} ${data.sortType}`);
    });
    if (sorts.length > 0) {
      sortStatement = `ORDER BY ${sorts.join(", ")}`;
    }
    return sortStatement;
  }

  public async query(sqlFragment: SqlFragment) {
    const columns = sqlFragment.sqlSelects.join(", ");
    const whereStatement = this.getWhereStatement(sqlFragment.sqlWheres);
    const sortStatment = this.getOrderStatement(sqlFragment.sqlOrders);

    const sql = format(
      `SELECT ${columns}
       FROM salary.salary_survey
       ${whereStatement}
       ${sortStatment}`
    );
    console.log(sql);
    const [rows] = await dbPool.query<RowDataPacket[]>(sql);
    return this.parseAll(rows as SalarySurveyDto[]);
  }
}

export const salarySurveyDao = new SalarySurveyDao();
