import { PostgresNamingStrategy } from '../src';
import { TableClassNameMustBeSingularError } from '../src/error/table-class-name-must-be-singular.error';
import { TableNameMustBePluralError } from '../src/error/table-name-must-be-plural.error';
import { TableNameMustInSnakeCaseError } from '../src/error/table-name-must-in-snake-case.error';
import { ColumnNameMustInSnakeCaseError } from '../src/error/column-name-must-in-snake-case.error';
import { ManyToManyPropertyNameMustBePluralError } from '../src/error/many-to-many-property-name-must-be-plural.error';

describe('postgresNamingStrategy', () => {
  let strategy: PostgresNamingStrategy;

  beforeAll(() => {
    strategy = new PostgresNamingStrategy();
  });

  describe('tableName', () => {
    describe('when custom name was not set', () => {
      it('should returns table name in snake format', () => {
        const className = 'TestTableName';

        const result = strategy.tableName(className, '');

        expect(result).toEqual('test_table_names');
      });

      it('should returns error when table class name is not singular', () => {
        const className = 'TestTableNames';

        expect(() => strategy.tableName(className, '')).toThrow(
          new TableClassNameMustBeSingularError(className),
        );
      });
    });

    describe('when custom name was set', () => {
      it('should returns table name as customName', () => {
        const className = 'TestTableName123';
        const customTableName = 'test_table_names';

        const result = strategy.tableName(className, customTableName);

        expect(result).toEqual(customTableName);
      });

      it('should returns error when custom table name is not plural', () => {
        const className = 'TestTableName';
        const customTableName = 'test_table_name';

        expect(() => strategy.tableName(className, customTableName)).toThrow(
          new TableNameMustBePluralError(customTableName),
        );
      });

      it('should returns error when custom table name is not snake case', () => {
        const className = 'TestTableName';
        const customTableName = 'TestTableNames';

        expect(() => strategy.tableName(className, customTableName)).toThrow(
          new TableNameMustInSnakeCaseError(customTableName),
        );
      });
    });
  });

  describe('columnName', () => {
    describe('when embeddedPrefixes was not set', () => {
      describe('when customName was not set', () => {
        it('should returns column name in snake format', () => {
          const propertyName = 'propertyName';

          const result = strategy.columnName(propertyName, '', []);

          expect(result).toBe('property_name');
        });
      });

      describe('when customName was set', () => {
        it('should returns column name as customName', () => {
          const propertyName = 'propertyName123123';
          const columnName = 'column_name';

          const result = strategy.columnName(propertyName, columnName, []);

          expect(result).toBe(columnName);
        });

        it('should returns error when customName is not in snake case', () => {
          const propertyName = 'propertyName123123';
          const columnName = 'columnName';

          expect(() =>
            strategy.columnName(propertyName, columnName, []),
          ).toThrow(new ColumnNameMustInSnakeCaseError(columnName));
        });
      });
    });

    describe('should add prefixes to column name when embeddedPrefixes was set', () => {
      describe('when customName was not set', () => {
        it('should returns column name in snake format', () => {
          const propertyName = 'propertyName';
          const embeddedPrefixes = ['testPrefix1', 'testPrefix2'];

          const result = strategy.columnName(
            propertyName,
            '',
            embeddedPrefixes,
          );

          expect(result).toBe('test_prefix1_test_prefix2_property_name');
        });
      });

      describe('when customName was set', () => {
        it('should returns column name as customName', () => {
          const propertyName = 'propertyName123123';
          const columnName = 'column_name';
          const embeddedPrefixes = ['testPrefix1', 'testPrefix2'];

          const result = strategy.columnName(
            propertyName,
            columnName,
            embeddedPrefixes,
          );

          expect(result).toBe(`test_prefix1_test_prefix2_${columnName}`);
        });

        it('should returns error when customName is not in snake case', () => {
          const propertyName = 'propertyName123123';
          const columnName = 'columnName';
          const embeddedPrefixes = ['testPrefix1', 'testPrefix2'];

          expect(() =>
            strategy.columnName(propertyName, columnName, embeddedPrefixes),
          ).toThrow(new ColumnNameMustInSnakeCaseError(columnName));
        });
      });
    });
  });

  describe('joinColumnName', () => {
    it('should returns relation name and referenced column name joined by "_" as snake case', () => {
      const result = strategy.joinColumnName(
        'testRelationName',
        'testReferencedColumnName',
      );
      expect(result).toBe('test_relation_name_test_referenced_column_name');
    });
  });

  describe('joinTableName', () => {
    it('should returns table names and first property name as snake case', () => {
      const result = strategy.joinTableName(
        'first_tables',
        'second_tables',
        'first.propertyNames',
        'secondProperties',
      );
      expect(result).toBe('first_tables_first_property_names_second_tables');
    });

    it('should not include firstPropertyName if is same as secondTable', () => {
      const result = strategy.joinTableName('users', 'posts', 'posts', 'users');
      expect(result).toBe('users_posts');
    });

    it('should returns error when property is not plural', () => {
      const firstPropertyName = 'first.propertyName';

      expect(() =>
        strategy.joinTableName(
          'first_tables',
          'second_tables',
          firstPropertyName,
          'secondProperties',
        ),
      ).toThrow(new ManyToManyPropertyNameMustBePluralError(firstPropertyName));
    });
  });

  describe('joinTableColumnName', () => {
    it('should returns table name and column name as snake case when columnName was set', () => {
      const result = strategy.joinTableColumnName(
        'tableName',
        'propertyName',
        'columnName',
      );
      expect(result).toBe('table_name_column_name');
    });

    it('should returns table name and property name as snake case when columnName was not set', () => {
      const result = strategy.joinTableColumnName(
        'tableName',
        'propertyName',
        undefined,
      );
      expect(result).toBe('table_name_property_name');
    });
  });

  describe('eagerJoinRelationAlias', () => {
    it('should join alias and property path by "__"', () => {
      const result = strategy.eagerJoinRelationAlias(
        'testAlias',
        'test.propertyPath',
      );
      expect(result).toBe('testAlias__test_propertyPath');
    });
  });

  describe('classTableInheritanceParentColumnName', () => {
    it('should join parent table name and property name by "_" and returns as snake case', () => {
      const result = strategy.classTableInheritanceParentColumnName(
        'parentTableName',
        'testPropertyName',
      );
      expect(result).toBe('parent_table_name_test_property_name');
    });
  });
});
