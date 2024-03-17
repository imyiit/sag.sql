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
const { Database } = require("sag.sqlite");
```

<br>

```ts
// TypeScript version
import { Database } from "sag.sqlite";
```

## **Usage**

Default table name is "**local**".

Default folder name is "**sqlite**".

```js
const db = new Database({
  types: {
    id: "INTEGER NOT NULL UNIQUE PRIMARY KEY",
    name: "TEXT",
    surname: "TEXT",
    age: "INTEGER",
  },
  replace: false,
  table: "users",
});
```

<br>

## <i class="fa-solid fa-terminal"></i> **COMMANDS**

### **Set**

```js
db.set({
  id: null,
  name: "Mbaye",
  surname: "Diagne",
  age: 32,
}); // -> db
```

<br>

### **Find**

```js
// Find one item where `name = 'Mbaye'`
const user = db.findOne({ name: "Mbaye" }); // -> user | undefined
```

```js
/* 

Find one item where 

(`name = 'Mbaye'` and `age > 30`) & 
(`name = 'Alex'` or `name = 'Mbaye'` or `surname = 'Diagne'`) &
(`name in ["Mbaye", "Alex"]`)

*/

const user = db.findOne(
  {},
  {
    orderBy: {
      and: ["name = 'Mbaye'", "age > 30"],
      or: ["name = 'Alex'", "name = 'Mbaye'", "surname = 'Diagne'"],
      in: [{ key: "name", list: ["Mbaye", "Alex"] }],
    },
  }
); // -> user | undefined
```

```js
/* 

Find all item where 

(`name = 'Mbaye'` and `age > 30`) & 
(`name = 'Alex'` or `name = 'Mbaye'` or `surname = 'Diagne'`) &
(`name in ["Mbaye", "Alex"]`)

*/

const user = db.findAll(
  {},
  {
    orderBy: {
      and: ["name = 'Mbaye'", "age > 30"],
      or: ["name = 'Alex'", "name = 'Mbaye'", "surname = 'Diagne'"],
      in: [{ key: "name", list: ["Mbaye", "Alex"] }],
    },
    limit: 1,
    get: "all" || 1,
  }
); // -> user[] | undefined
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
