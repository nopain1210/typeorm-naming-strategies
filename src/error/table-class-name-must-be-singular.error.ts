import pluralize from 'pluralize';

export class TableClassNameMustBeSingularError extends Error {
  constructor(className: string) {
    super(
      `Table class name must be a singular! Please change ${className} to ${pluralize.singular(
        className,
      )}`,
    );
  }
}
