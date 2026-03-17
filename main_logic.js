const todoInput = document.getElementById("todo-input");
const displayAll = document.getElementById("display-all");
const statusText = document.getElementById("status");

async function fetchAllTodo() {
  try {
    const res = await axios.get("/all-todos");
    const todos = res.data.todos || [];
    displayAll.innerHTML = todos.length
      ? todos.map((todo) => `<div>${todo}</div>`).join("")
      : "No todos yet";
    statusText.textContent = "Fetched todos";
  } catch {
    statusText.textContent = "Error fetching todos";
  }
}

async function createTodo() {
  const note = todoInput.value.trim();
  if (!note) {
    statusText.textContent = "Please enter todo";
    return;
  }

  try {
    await axios.post("/create-todo", { note });
    todoInput.value = "";
    statusText.textContent = "Todo created";
    fetchAllTodo();
  } catch {
    statusText.textContent = "Error creating todo";
  }
}
