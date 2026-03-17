const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static(__dirname));

app.use("/vendor", express.static(path.join(__dirname, "node_modules")));

let todos = ["This is my first todo brother."];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/creat-todo", (req, res) => {
  const newTodo = req.body.note;
  todos.push(newTodo);
});

app.get("/all-todos", (req, res) => {
  res.status(200).json({ todos });
});

app.listen(3001, () => {
  console.log("Server starteed sucessfully : ", new Date().toLocaleString());
});
