import { snakeCase } from 'typeorm/util/StringUtils';

export class TableNameMustInSnakeCaseError extends Error {
  constructor(tableName: string) {
    super(
      `Table name must in snake case! Please change ${tableName} to ${snakeCase(
        tableName,
      )}`,
    );
  }
}
