async function fetchAllTodo() {
  const response = await axios.get("http://localhost:3001/all-todos");
  const todos = response.data.todos;
  document.getElementById("display-all").innerHTML = todos
    .map((t) => `<div>${t}</div>`)
    .join("");
}
