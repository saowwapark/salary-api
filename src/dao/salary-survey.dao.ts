import { RowDataPacket, format } from "mysql2/promise";
import {
  SqlWhere,
  SalarySurveyApiModel,
  SqlFragment,
  SqlOrder,
  SalarySurveyModel,
  SalarySurveyDto,
  SqlSelect
} from "./../dto/salary-survey.dto";
import { dbPool } from "../config/db.config";

export class SalarySurveyDao {
  private parse(salarySurvey: SalarySurveyDto) {
    const salarySurveyModel: SalarySurveyModel = {
      timeStamp: salarySurvey['Timestamp'] || undefined,
      employer: salarySurvey['Employer'] || undefined,
      location: salarySurvey['Location'] || undefined,
      jobTitle: salarySurvey['Job Title'] || undefined,
      yearsAtEmployer: salarySurvey['Years at Employer'] || undefined,
      yearsOfExperience: salarySurvey['Years of Experience'] || undefined,
      salary: salarySurvey['Salary'] || undefined,
      signingBonus: salarySurvey['Signing Bonus'] || undefined,
      annualBonus: salarySurvey['Annual Bonus'] || undefined,
      annualStockValue: salarySurvey['Annual Stock Value/Bonus'] || undefined,
      gender: salarySurvey['Gender'] || undefined,
      additionalComment: salarySurvey['Additional Comments'] || undefined,
    };
    return salarySurveyModel;
  }

  private parseAll(rows: SalarySurveyDto[]) {
    const salalrySurveys: SalarySurveyModel[] = [];
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
      wheres.push(`\`${data.dbField}\` ${data.operator} '${data.value}'`);
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
      sorts.push(`\`${data.dbField}\` ${data.sortType}`);
    });
    if (sorts.length > 0) {
      sortStatement = `ORDER BY ${sorts.join(", ")}`;
    }
    return sortStatement;
  }

  private getColumnStatment(columns: SqlSelect[]) {
    const newColomns = columns.map(column => `\`${column}\``)
    return newColomns.join(', ');
  }

  public async query(sqlFragment: SqlFragment) {
    const columns = this.getColumnStatment(sqlFragment.sqlSelects);
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
