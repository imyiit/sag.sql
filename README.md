# sag.sqlite

The fastest and simplest wrapper for SQLite3 in Node.js

![Image](https://img.shields.io/npm/v/sag.sqlite?color=%2351F9C0&label=sag.sqlite)
![Image](https://img.shields.io/npm/dt/sag.sqlite.svg?color=%2351FC0&maxAge=3600)

![Image](https://nodei.co/npm/sag.sqlite.png?downloads=true&downloadRank=true&stars=true)

## Installation

```sh
npm install sag.sqlite
```

## Import
```js
import Database, { Settings, DatabaseFilter } from "sag.sqlite";
```

## Usage
Defaults are "**local**" for table and "**sqlite**" for folder.
```js
const userDB = new Database({
  table: "users",
  types: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    name: "TEXT",
    surname: "TEXT",
    age: "INTEGER",
  },
});
const filter = new DatabaseFilter(userDB);
```

## Commands

### set

```js
userDB.set({ name: "Alex", surname: "Snow", age: 30 });
```

### findOne
```js
userDB.findOne({ name: "Alex" });
    // -> { name: "Alex", surname: "Snow", age: 30, id: 1 } | undefined

userDB.findOne({ name: "Alex" }, { get: ["name", "surname"] });
    // -> { name: "Alex", surname: "Snow" } | undefined

userDB.findOne({}, { filter: { and: ["name = 'Alex'"] } });
    // -> { name: "Alex", surname: "Snow", age: 30, id: 1 } | undefined

userDB.findOne({}, { filter: { or: ["surname = 'Snow'"] } });
    // -> { name: "Alex", surname: "Snow", age: 30, id: 1 } | undefined

userDB.findOne({}, { filter: { and: ["age > 30"] } });
    // -> { name: "Alex", surname: "Snow", age: 30, id: 1 } | undefined
```

### findAll
```js
userDB.findAll({ name: "Alex" });
    // -> { name: String, surname: String, age: number, id: number }[] | undefined

userDB.findAll({ name: "Alex" }, { get: ["name", "surname"] });
    // -> { name: String, surname: String, age: number }[] | undefined

userDB.findAll({}, { filter: { and: ["name = 'Alex'"] } });
    // -> { name: String, surname: String, age: number, id: number }[] | undefined

userDB.findAll({}, { filter: { or: ["surname = 'Snow'"] } });
    // -> { name: String, surname: String, age: number, id: number }[] | undefined

userDB.findAll({}, { filter: { and: ["age > 30"] } });
    // -> { name: String, surname: String, age: number, id: number }[] | undefined
```

```js
// With filter builder
userDB.findAll({}, { filter: filter.and("name = 'Alex'").build() });
    // -> { name: String, surname: String, age: number, id: number }[] | undefined
userDB.findAll({}, { filter: filter.or("name = 'Alex'").build() });
    // -> { name: String, surname: String, age: number, id: number }[] | undefined
userDB.findAll({}, { filter: filter.in({ name: ["Alex", "Bob"] }).build() });
    // -> { name: String, surname: String, age: number, id: number }[] | undefined
```

### update

```js
// Update every row's name to Bob where the name is equal the Alex
userDB.update({ where: { name: "Alex" }, value: { name: "Bob" } }); // -> db

// Update 10 rows's name to Bob where the name is equal to Alex while offsetting by 1
userDB.update(
  { where: { name: "Alex" }, value: { name: "Bob" } },
  { limit: { max: 10, offSet: 1 } }
); // -> db

// Update every row's names to Bob
userDB.update({ value: { name: "Bob" } }); // -> db
```

### add
```js
// Increase every row's age by 1 where the name equals to Alex
userDB.add({ where: { name: "Alex" }, value: { age: "+ 1" } }); // -> db
userDB.add({ where: { name: "Alex" }, value: { age: "++" } }); // -> db

// Decrease every row's age by 1 where the name equals to Alex
userDB.add({ where: { name: "Alex" }, value: { age: "- 1" } }); // -> db
userDB.add({ where: { name: "Alex" }, value: { age: "--" } }); // -> db

// Multiply every row's age by 2 where the name equals to Alex
userDB.add({ where: { name: "Alex" }, value: { age: "* 2" } }); // -> db

// Divide every row's age by 2 where the name equals to Alex
userDB.add({ where: { name: "Alex" }, value: { age: "/ 2" } }); // -> db

// Increase every row's age by itself where the name equals to Alex
userDB.add({ where: { name: "Alex" }, value: { age: "+ age" } }); // -> db

// Decrease every row's age by itself where the name equals to Alex
userDB.add({ where: { name: "Alex" }, value: { age: "- age" } }); // -> db

// With filter builder
// Increase every row's age by 1 where the name equals to Alex
userDB.add(
  { value: { age: "+ 1" } },
  { filter: filter.and("name = 'Alex'").build() }
); // -> db
```

### delete

```js
// Delete every row where the name is equal to Alex
userDB.delete({ name: "Alex" }); // -> db

// Delete 10 rows where the name is equal to Alex while offsetting by 1
userDB.delete({ name: "Alex" }, { limit: { max: 10, offSet: 1 } }); // -> db
```

```js
// Delete every row
userDB.deleteAll(); // -> db
```

## Joins

```js
const carDB = new Database({
  types: {
    name: "TEXT",
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    ownerId: "INTEGER",
  },
  table: "cars",
});

const joins = new Joins(userDB, carDB, "INNER JOIN");
const joins_filter = new JoinsFilter(joins);
```

```js
// Select name and surname from users table inner joined with cars table where users.id equals to cars.ownerId
joins.find({
  get: ["name", "surname"],
  filter: joins_filter.and("id = ownerId", "age > id").build(),
}); // -> { name: String, surname: String }[] | undefined
```
