const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use("/vendor", express.static(path.join(__dirname, "node_modules")));

let todos = [
    {
        username: "test",
        userNotes:
            "I'm going to play this game today so i will be playing this game today",
    },
    {
        username: "happy-singh",
        userNotes: "Yo bro what shitt are you gonna do To-night Huh ?",
    },
];

let users = [
    {
        username: "test",
        password: "1234",
    },
    {
        username: "happy-singh",
        password: "1111",
    },
];

const signInKey = "123Prawesh#@mandal_Testing_Here";

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "signup_page.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login_page.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "signup_page.html"));
});

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.static(__dirname));

app.post("/signup", (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "username and password are required" });
    }

    const userExists = users.find((user) => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "user already exists" });
    }

    users.push({ username, password });

    return res.status(200).json({ message: "You have signed up sucessfully." });
});

app.post("/sign-in", (req, res) => {
    const { username, password } = req.body || {};

    const userExists = users.find(
        (user) => user.username === username && user.password === password,
    );

    if (!userExists) {
        return res.status(403).json({ message: "Incorrect Credentials" });
    }

    const token = jwt.sign({ username }, signInKey);

    return res.status(200).json({ token });
});

function getTokenFromRequest(req) {
    const authHeader = req.headers.authorization || "";
    const bodyToken = req.body && req.body.token ? req.body.token : null;
    const queryToken = req.query && req.query.token ? req.query.token : null;

    if (authHeader.startsWith("Bearer ")) {
        return authHeader.slice(7);
    }

    if (authHeader) return authHeader;
    if (bodyToken) return bodyToken;
    if (queryToken) return queryToken;

    return null;
}

function authMiddleware(req, res, next) {
    const token = getTokenFromRequest(req);

    if (!token) {
        return res.status(403).json({ message: "You are not logged in" });
    }

    let decoded;

    try {
        decoded = jwt.verify(token, signInKey);
    } catch (error) {
        return res
            .status(403)
            .json({ message: "Invalid token or expired session" });
    }

    const username = decoded.username;

    if (!username) {
        return res
            .status(403)
            .json({ message: "Invalid Token bro? wtf you are trynna hack ?" });
    }

    const exists = users.find((user) => user.username === username);

    if (!exists) {
        return res
            .status(403)
            .json({ message: "Invalid Token bro? wtf you are trynna hack ?" });
    }

    req.username = username;
    next();
}

app.post("/create-todo", authMiddleware, (req, res) => {
    const { note } = req.body || {};

    if (!note || typeof note !== "string" || note.trim() === "") {
        return res.status(400).json({
            success: false,
            message:
                "Please provide a non-empty 'note' string in request body.",
        });
    }

    const newNote = note.trim();

    const todo = {
        username: req.username,
        userNotes: newNote,
    };

    todos.push(todo);

    return res.status(201).json({
        success: true,
        message: "Todo created successfully.",
        todo,
    });
});

app.get("/all-todos", authMiddleware, (req, res) => {
    const allTodosOfUser = todos.filter(
        (todo) => todo.username === req.username,
    );

    return res.status(200).json({
        success: true,
        count: allTodosOfUser.length,
        todos: allTodosOfUser,
    });
});

app.listen(3002, () => {
    console.log("Server started successfully:", new Date().toLocaleString());
});
