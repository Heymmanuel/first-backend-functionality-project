import express from "express";

const app = express();
const port = 3000;

const tasks = [];
const menus = [];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    let d = new Date();
    res.render("index.ejs", { 
        day: d,
        tasks,
        menus
    });
});

app.post("/", (req, res) => {
    const newTask = req.body.task;
    if (newTask) {
        tasks.push(newTask);
    }
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const taskToDelete = req.body.task;
    const taskIndex = tasks.indexOf(taskToDelete);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        res.json({ success: true }); // Respond with JSON indicating successful deletion
    } else {
        res.json({ success: false }); // Respond with JSON indicating failure to find task
    }
});

app.post("/submit", (req, res) => {
    // Save tasks to the menu
    if (tasks.length > 0) {
        menus.push([...tasks]); // Save a copy of the tasks array to the menu
        tasks.length = 0; // Clear the tasks array
    }
    res.redirect("/");
});

app.get("/menu/:menuIndex", (req, res) => {
    const menuIndex = req.params.menuIndex;
    if (menus[menuIndex]) {
        res.render("menu.ejs", { tasks: menus[menuIndex] });
    } else {
        res.status(404).send("Menu not found");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
