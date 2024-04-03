# **sag.sqlite**

The fastest and simplest library for SQLite3 in Node.js

![Image](https://img.shields.io/npm/v/sag.sqlite?color=%2351F9C0&label=sag.sqlite)
![Image](https://img.shields.io/npm/dt/sag.sqlite.svg?color=%2351FC0&maxAge=3600)

#

![Image](https://nodei.co/npm/sag.sqlite.png?downloads=true&downloadRank=true&stars=true)
<br>

## <i class="fa-solid fa-download"></i> **Installation**

```bash
$ npm install sag.sqlite
```

## <i class="fa-solid fa-bookmark"></i> **Import**

```ts
import Database, { Settings, DatabaseFilter } from "sag.sqlite";
```

# **Usage**

Default table name is "**local**".

Default folder name is "**sqlite**".

```js
import Database, { Joins, JoinsFilter, DatabaseFilter } from "sag.sqlite";

const userDB = new Database({
  table: "users",
  types: {
    id: "INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT",
    name: "TEXT",
    surname: "TEXT",
    age: "INTEGER",
  },
});
const filter = new DatabaseFilter(userDB);
```

<br>

## <i class="fa-solid fa-terminal"></i> **COMMANDS**

## # Set

```js
userDB.set({ name: "Alex", surname: "Snow", age: 30 });
```

<br>

## # Find One

```js
userDB.findOne({ name: "Alex" }); // -> { name: "Alex", surname: "Snow", age: 30, id: 1 } | undefined

userDB.findOne({ name: "Alex" }, { get: ["name", "surname"] }); // -> { name: "Alex", surname: "Snow" } | undefined

userDB.findOne({}, { filter: { and: ["name = 'Alex'"] } }); // -> { name: "Alex", surname: "Snow", age: 30, id: 1 } | undefined

userDB.findOne({}, { filter: { or: ["surname = 'Snow'"] } }); // -> { name: "Alex", surname: "Snow", age: 30, id: 1 } | undefined

userDB.findOne({}, { filter: { and: ["age > 30"] } }); // -> { name: "Alex", surname: "Snow", age: 30, id: 1 } | undefined
```

<br>

## # Find All

```js
userDB.findAll({ name: "Alex" }); // -> { name: String, surname: String, age: number, id: number }[] | undefined

userDB.findAll({ name: "Alex" }, { get: ["name", "surname"] }); // -> { name: String, surname: String, age: number }[] | undefined

userDB.findAll({}, { filter: { and: ["name = 'Alex'"] } }); // -> { name: String, surname: String, age: number, id: number }[] | undefined

userDB.findAll({}, { filter: { or: ["surname = 'Snow'"] } }); // -> { name: String, surname: String, age: number, id: number }[] | undefined

userDB.findAll({}, { filter: { and: ["age > 30"] } }); // -> { name: String, surname: String, age: number, id: number }[] | undefined
```

```js
//With Filter builder
userDB.findAll({}, { filter: filter.and(["name = 'Alex'"]).build() }); // -> { name: String, surname: String, age: number, id: number }[] | undefined
userDB.findAll({}, { filter: filter.or(["name = 'Alex'"]).build() }); // -> { name: String, surname: String, age: number, id: number }[] | undefined
userDB.findAll({}, { filter: filter.in([{ name: ["Alex", "Bob"] }]).build() }); // -> { name: String, surname: String, age: number, id: number }[] | undefined
```

<br>

## # Update

```js
//Update all elements when name = 'Alex'
userDB.update({ where: { name: "Alex" }, value: { name: "Bob" } }); // -> db

//Update 10 elements, start index 1 and when name = 'Alex'
userDB.update(
  { where: { name: "Alex" }, value: { name: "Bob" } },
  { limit: { max: 10, offSet: 1 } }
); // -> db

//Update all elements
userDB.update({ value: { name: "Bob" } }); // -> db
```

<br>

## # Add

```js
//Add all elements age =  age + 1
userDB.add({ where: { name: "Alex" }, value: { age: "+ 1" } }); // -> db
// Short + 1
userDB.add({ where: { name: "Alex" }, value: { age: "++" } }); // -> db

//Add all elements age = age - 1
userDB.add({ where: { name: "Alex" }, value: { age: "- 1" } }); // -> db
// Short - 1
userDB.add({ where: { name: "Alex" }, value: { age: "--" } }); // -> db

//Add all elements age = age * 2
userDB.add({ where: { name: "Alex" }, value: { age: "* 2" } }); // -> db

//Add all elements age = age * age
userDB.add({ where: { name: "Alex" }, value: { age: "/ 2" } }); // -> db

//Add all elements age = age + age
userDB.add({ where: { name: "Alex" }, value: { age: "+ age" } }); // -> db

//Add all elements age = age - age
userDB.add({ where: { name: "Alex" }, value: { age: "- age" } }); // -> db

//Use with filter
//Add all elements if name = 'Alex'
userDB.add(
  { value: { age: "+ 1" } },
  { filter: filter.and(["name = 'Alex'"]).build() }
); // -> db
```

<br>

## # Delete

```js
//Delete all elements if name = 'Alex'
userDB.delete({ name: "Alex" }); // -> db

//Delete 10 elements and start index 1 and elements if name = 'Alex'
userDB.delete({ name: "Alex" }, { limit: { max: 10, offSet: 1 } }); // -> db
```

```js
//Clear all database
userDB.deleteAll(); // -> db
```

<br>

## # Joins

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

#

#### Find users table items if users.id = cars.ownerId

```js
joins.find({
  get: ["name", "surname"],
  filter: joins_filter.and([["id", "=", "ownerId"]]).build(),
}); // -> { name: String, surname: String }[] | undefined
```

#

#### Find users table items if users.id = cars.ownerId

```js
//Find users table items if users.id > cars.ownerId
joins.find({
  get: ["name", "surname"],
  filter: joins_filter.or([["id", ">", "ownerId"]]).build(),
}); // -> { name: String, surname: String }[] | undefined
```

<br><br>

# License

[MIT](https://choosealicense.com/licenses/mit/)
