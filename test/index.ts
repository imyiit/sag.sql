import { Database } from "../src";

const db = new Database({
  types: {
    id: "INTEGER NOT NULL UNIQUE PRIMARY KEY",
    name: "TEXT",
    surname: "TEXT",
    age: "INTEGER NOT NULL",
    code: "TEXT UNIQUE",
  },
  replace: true,
});

db.set({ name: "Yiğit", surname: "İğci", age: 22 });
db.add({ value: { age: "++" } });
const val = db.findOne({ name: "Yiğit" });
