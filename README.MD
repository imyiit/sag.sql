# **sag.sqlite**

![Image](https://img.shields.io/npm/v/sagdb?color=%2351F9C0&label=sag.sqlite)
![Image](https://img.shields.io/npm/dt/sag.sqlite.svg?color=%2351FC0&maxAge=3600)

#

![Image](https://nodei.co/npm/sag.sqlite.png?downloads=true&downloadRank=true&stars=true)
<br>

## <i class="fa-solid fa-download"></i> **Installation**

```bash
$ npm install sag.sqlite
```

## <i class="fa-solid fa-bookmark"></i> **Import**

```js
// JavaScript version
const Database = require("sag.sqlite");
```

<br>

```ts
// TypeScript version
import Database, { Settings, Filter } from "sag.sqlite";
```

## **Usage**

Default table name is "**local**".

Default folder name is "**sqlite**".

```js
const setting = new Settings({
  types: {
    id: "INTEGER NOT NULL UNIQUE PRIMARY KEY",
    name: "TEXT",
    surname: "TEXT",
    age: "INTEGER NOT NULL",
  },
});

const db = new Database(setting);
const filter = new Filter(setting);
```

<br>

## <i class="fa-solid fa-terminal"></i> **COMMANDS**

### **Set**

```js
db.set({
  name: "Mbaye",
  surname: "Diagne",
  age: 32,
}); // -> db
```

<br>

### **Find**

```js
// Find one item where `name = 'Mbaye'`
const user = db.findAll({ age: 32 }); // user[] | undefined;
```

```js
const user = db.findAll({ age: 32 }, { limit: { max: 10, offSet: 2 } }); // user[] | undefined;
```

```js
const user = db.findAll(
  { age: 32 },
  {
    filter: {
      or: ["age > 30", "age < 50"],
      and: ["age > 32"],
      in: [{ key: "age", list: [1, 2, 3, 4, 30, 32] }],
    },
  }
); // user[] | undefined;
```

```js
const user = db.findAll(
  { age: 32 },
  {
    filter: filter
      .and(["age > 32"])
      .or(["age > 30", "age < 50"])
      .in({ age: [1, 2, 3, 4, 30, 32] })
      .build(),
  }
); // user[] | undefined;
```

<br><br>

### **Update**

```js
// Find all item where `name = 'Mbaye'` and update to `name = 'Alex'`
// If there is no limit it changes them all

db.update({
  where: {
    name: "Mbaye",
  },
  value: {
    name: "Alex",
  },
  limit: 1,
}); // -> db
```

<br><br>

### **Delete**

Delete item from database.

```js
// Find all item where `name = 'Mbaye'` and delete it
// If there is no limit it delete them all

db.delete({
  where: {
    name: "Mbaye",
  },
  limit: 1,
}); // -> db
```

```js
// Clear all database

db.deleteAll(); // -> db
```

<br>

### **All**

Return all items.

```js
db.all(); // -> users[]
```

<br><br>

# License

[MIT](https://choosealicense.com/licenses/mit/)
