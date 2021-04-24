import { camelCase } from 'typeorm/util/StringUtils';

export class PropertyNameMustInCamelCaseError extends Error {
  constructor(propertyName: string) {
    super(
      `Property name must in camel case! Please change ${propertyName} to ${camelCase(
        propertyName,
      )}`,
    );
  }
}
