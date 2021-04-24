import pluralize from 'pluralize';

export class ManyToManyPropertyNameMustBePluralError extends Error {
  constructor(propertyName: string) {
    super(
      `Many to many Property name must be a plural! Please change ${propertyName} to ${pluralize.plural(
        propertyName,
      )}`,
    );
  }
}
