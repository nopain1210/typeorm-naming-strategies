import { camelCase } from 'typeorm/util/StringUtils';

export class TableClassNameMustInPascalCaseError extends Error {
  constructor(tableName: string) {
    super(
      `Table class name must in pascal case! Please change ${tableName} to ${camelCase(
        tableName,
      )}`,
    );
  }
}
