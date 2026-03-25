const todoInput = document.getElementById("todo-input");
const displayAll = document.getElementById("display-all");
const statusText = document.getElementById("status");

function getAuthToken() {
    return localStorage.getItem("token");
}

function handleAuthFailure(message) {
    localStorage.removeItem("token");
    statusText.textContent = message || "Session expired. Please sign in again";
    window.location.href = "/login";
}

async function fetchAllTodo() {
    const token = getAuthToken();

    if (!token) {
        statusText.textContent = "Please sign in first";
        return;
    }

    try {
        const res = await axios.get("/all-todos", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const todos = res.data.todos || [];

        displayAll.innerHTML = todos.length
            ? todos
                  .map(
                      (todo, index) =>
                          `<div class="todo-item">
                <span class="todo-index">${index + 1}.</span>
                <p class="todo-text">${todo.userNotes || ""}</p>
              </div>`,
                  )
                  .join("")
            : '<p class="empty">No todos yet</p>';

        statusText.textContent = "Fetched todos";
    } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message;

        if (status === 401 || status === 403) {
            handleAuthFailure(message);
            return;
        }

        statusText.textContent = message || "Failed to fetch todos";
    }
}

async function createTodo() {
    const note = todoInput.value.trim();

    if (!note) {
        statusText.textContent = "Please enter todo";
        return;
    }

    const token = getAuthToken();

    if (!token) {
        statusText.textContent = "Please sign in first";
        return;
    }

    try {
        await axios.post(
            "/create-todo",
            { note },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        todoInput.value = "";
        statusText.textContent = "Todo created";
        fetchAllTodo();
    } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message;

        if (status === 401 || status === 403) {
            handleAuthFailure(message);
            return;
        }

        statusText.textContent = message || "Failed to create todo";
    }
}
