const toast = (text, background, color) => {
    Toastify({
        text: text,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: background,
            color: color,
        },
        onClick: function () { }, // Callback after click
    }).showToast();
};
const users = new Set(JSON.parse(localStorage.getItem("users")) || []);
let currentUser = null;

function signup() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!username || !password || !email) {
        toast("The fields input required!", "red", "#fff");
        sub.innerHTML = "...loading";
        setTimeout(() => {
            sub.innerHTML = "Submit";
        }, 1000);

        return;
    }

    if (users.has(email)) {
        toast("User already exists!", "red", "#fff");
        setTimeout(() => {
            sub.innerHTML = "Submit";
        }, 1000);
        document.getElementById("username").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
    } else {
        sub.innerHTML = "...loading";
        users.add(email);
        localStorage.setItem("users", JSON.stringify([...users]));
        toast("Sign up successful😁", "#006400", "#fff");
        localStorage.setItem(`user_${email}`, JSON.stringify({ email, password, todos: [] }));
        setTimeout(() => {
            window.location.href = "signin.html";
        }, 2000);
    }
    // Clear input fields only
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

function signin() {
    const password = document.getElementById("password").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!password || !email) {
        toast("The fields input required!", "red", "#fff");
        sub.innerHTML = "...loading";
        setTimeout(() => {
            sub.innerHTML = "Submit";
        }, 1000);

        return;
    }
    const userDataRaw = localStorage.getItem(`user_${email}`);
    const userData = userDataRaw ? JSON.parse(userDataRaw) : null;

    if (!userData) {
        toast("User not found!", "red", "#fff");
        sub.innerHTML = "...loading";
        setTimeout(() => {
            sub.innerHTML = "Submit";
        }, 1000);
        return;
    }
    // Check password
    if (!userData.password || userData.password !== password) {
        toast("Incorrect password!", "red", "#fff");
        sub.innerHTML = "...loading";
        setTimeout(() => {
            sub.innerHTML = "Submit";
        }, 1000);
        return;
    }
    else {
        toast("Sign in successful😁", "#006400", "#fff");
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        currentUser = email;
        localStorage.setItem("currentUser", email);
        showTodo();
    }

}

function showTodo() {
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("todo").classList.remove("hidden");
    loadTasks();
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value.trim();
    if (!task) return;

    const userData = JSON.parse(localStorage.getItem(`user_${currentUser}`));
    // Check for duplicate task
    if (userData.todos.includes(task)) {
        toast("Task already exists!", "red", "#fff");
        return;
    }
    userData.todos.push(task);
    localStorage.setItem(`user_${currentUser}`, JSON.stringify(userData));
    taskInput.value = "";
    loadTasks();
}

function loadTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const userData = JSON.parse(localStorage.getItem(`user_${currentUser}`));
    userData.todos.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task;
        li.className = "flex justify-between items-center mb-2";

        const btn = document.createElement("button");
        btn.textContent = "❌";
        btn.className = "ml-2 text-red-500";
        btn.onclick = () => deleteTask(index);

        li.appendChild(btn);
        taskList.appendChild(li);
    });
}

function deleteTask(index) {
    const userData = JSON.parse(localStorage.getItem(`user_${currentUser}`));
    userData.todos.splice(index, 1);
    localStorage.setItem(`user_${currentUser}`, JSON.stringify(userData));
    loadTasks();
}

function logout() {
    currentUser = null;
    document.getElementById("todo").classList.add("hidden");
    document.getElementById("auth").classList.remove("hidden");
}