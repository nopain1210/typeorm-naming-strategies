import { snakeCase } from 'typeorm/util/StringUtils';

export class ColumnNameMustInSnakeCaseError extends Error {
  constructor(columnName: string) {
    super(
      `Column name must in snake case! Please change ${columnName} to ${snakeCase(
        columnName,
      )}`,
    );
  }
}
