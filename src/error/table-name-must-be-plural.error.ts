import pluralize from 'pluralize';

export class TableNameMustBePluralError extends Error {
  constructor(tableName: string) {
    super(
      `Table name must be a plural! Please change ${tableName} to ${pluralize.plural(
        tableName,
      )}`,
    );
  }
}
