const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));
app.use("/vendor", express.static(path.join(__dirname, "node_modules")));

let todos = ["This is my first todo brother."];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Create todo
app.post("/create-todo", (req, res) => {
  const { note } = req.body || {};

  if (!note || typeof note !== "string" || note.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide a non-empty 'note' string in request body.",
    });
  }

  const newTodo = note.trim();
  todos.push(newTodo);

  return res.status(201).json({
    success: true,
    message: "Todo created successfully.",
    todo: newTodo,
    todos,
  });
});

app.get("/all-todos", (req, res) => {
  res.status(200).json({
    success: true,
    count: todos.length,
    todos,
  });
});

app.listen(3001, () => {
  console.log("Server started successfully:", new Date().toLocaleString());
});
