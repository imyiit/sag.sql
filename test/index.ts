import { Database } from "../src";

const db = new Database({
  types: {
    id: "INTEGER NOT NULL PRIMARY KEY",
    name: "TEXT",
    age: "INTEGER",
  },
});

db.set({ name: "Drogba" });
db.add({ where: { name: "Drogba" }, value: { age: "+ 2" } });
