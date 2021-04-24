// Credits to @recurrence
// https://gist.github.com/recurrence/b6a4cb04a8ddf42eda4e4be520921bd2

import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { camelCase, snakeCase } from 'typeorm/util/StringUtils';
import pluralize, { singular } from 'pluralize';
import { TableClassNameMustBeSingularError } from './error/table-class-name-must-be-singular.error';
import { TableNameMustBePluralError } from './error/table-name-must-be-plural.error';
import { TableNameMustInSnakeCaseError } from './error/table-name-must-in-snake-case.error';
import { TableClassNameMustInPascalCaseError } from './error/table-class-name-must-in-pascal-case.error';
import { ColumnNameMustInSnakeCaseError } from './error/column-name-must-in-snake-case.error';
import { PropertyNameMustInCamelCaseError } from './error/property-name-must-in-camel-case.error';
import { pascalCase } from 'pascal-case';
import { ManyToManyPropertyNameMustBePluralError } from './error/many-to-many-property-name-must-be-plural.error';

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  tableName(className: string, customName: string): string {
    // If using custom table name
    if (customName) {
      if (pluralize.isSingular(customName)) {
        throw new TableNameMustBePluralError(customName);
      }

      if (customName !== snakeCase(customName)) {
        throw new TableNameMustInSnakeCaseError(customName);
      }

      return customName;
    }

    // Convert table class name to table name

    if (!pluralize.isSingular(className)) {
      throw new TableClassNameMustBeSingularError(className);
    }

    if (className !== pascalCase(className)) {
      throw new TableClassNameMustInPascalCaseError(className);
    }

    return pluralize.plural(snakeCase(className));
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    if (customName && customName !== snakeCase(customName)) {
      throw new ColumnNameMustInSnakeCaseError(customName);
    }

    if (propertyName !== camelCase(propertyName)) {
      throw new PropertyNameMustInCamelCaseError(propertyName);
    }

    return (
      snakeCase(embeddedPrefixes.concat('').join('_')) +
      (customName ? customName : snakeCase(propertyName))
    );
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + '_' + referencedColumnName);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string,
  ): string {
    if (pluralize.isSingular(firstPropertyName)) {
      throw new ManyToManyPropertyNameMustBePluralError(firstPropertyName);
    }

    const snakePropertyName = snakeCase(firstPropertyName.replace(/\./gi, '_'));

    return snakeCase(
      firstTableName +
        '_' +
        (snakeCase(secondTableName) !== snakePropertyName
          ? snakePropertyName + '_'
          : '') +
        secondTableName,
    );
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(
      pluralize.singular(tableName) +
        '_' +
        (columnName ? columnName : propertyName),
    );
  }

  classTableInheritanceParentColumnName(
    parentTableName: any,
    parentTableIdPropertyName: any,
  ): string {
    return snakeCase(parentTableName + '_' + parentTableIdPropertyName);
  }

  eagerJoinRelationAlias(alias: string, propertyPath: string): string {
    return alias + '__' + propertyPath.replace('.', '_');
  }
}
