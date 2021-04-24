# Typeorm naming strategies

This package provides a few (one, at the moment) useful custom naming strategies. It alterates the name of columns, relations and other fields in database.

For example, using the snake strategy, if you have a model like this:

```typescript
class User {
  @Column()
  createdAt;
}
```

In the DB the `createdAt` field will be `created_at`

## Naming strategies available

- Snake

## Installation

It's available as an [npm package](https://www.npmjs.com/package/typeorm-postgres-naming-strategies)

```sh
npm install typeorm-postgres-naming-strategies --save
```

Or using yarn

```sh
yarn add typeorm-postgres-naming-strategies
```

## Usage

```typescript
import { createConnection } from 'typeorm';
import { PostgresNamingStrategy } from 'typeorm-postgres-naming-strategies';

await createConnection({
  ...
  namingStrategy: new PostgresNamingStrategy(), // Here you'r using the strategy!
});
```

Alternatively you can use it in combination with a `ormconfig.js`

```js
// Use require instead of import
const PostgresNamingStrategy = require("typeorm-postgres-naming-strategies").PostgresNamingStrategy

module.exports = {
  ...
  namingStrategy: new PostgresNamingStrategy(),
}
```
