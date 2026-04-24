import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api/v1";

const initialAuth = { name: "", email: "", password: "", role: "user" };
const initialTask = { title: "", description: "", status: "todo" };

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export default function App() {
  const [authForm, setAuthForm] = useState(initialAuth);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [taskForm, setTaskForm] = useState(initialTask);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const loadTasks = async () => {
    if (!token) return;
    try {
      const data = await request("/tasks", { headers: authHeader });
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [token]);

  const onRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(authForm)
      });
      setMessage(data.message);
      setAuthForm(initialAuth);
    } catch (err) {
      setError(err.message);
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm)
      });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Logged in successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const onLogout = () => {
    setToken("");
    setUser(null);
    setTasks([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const onCreateTask = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await request("/tasks", {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify(taskForm)
      });
      setTaskForm(initialTask);
      setMessage("Task created");
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await request(`/tasks/${id}`, {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify({ status })
      });
      setMessage("Task updated");
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await request(`/tasks/${id}`, { method: "DELETE", headers: authHeader });
      setMessage("Task deleted");
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container">
      <h1>Backend Assignment Demo UI</h1>
      {message && <p className="ok">{message}</p>}
      {error && <p className="err">{error}</p>}

      <section>
        <h2>Register</h2>
        <form onSubmit={onRegister}>
          <input placeholder="Name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
          <input placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
          <input type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
          <select value={authForm.role} onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button>Register</button>
        </form>
      </section>

      <section>
        <h2>Login</h2>
        <form onSubmit={onLogin}>
          <input placeholder="Email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
          <input type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
          <button>Login</button>
        </form>
      </section>

      {token && (
        <section>
          <h2>Dashboard ({user?.role})</h2>
          <button onClick={onLogout}>Logout</button>
          <form onSubmit={onCreateTask}>
            <input placeholder="Task title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
            <input placeholder="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
            <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
              <option value="todo">todo</option>
              <option value="in_progress">in_progress</option>
              <option value="done">done</option>
            </select>
            <button>Create Task</button>
          </form>
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong> - {task.status}
                <button onClick={() => updateStatus(task._id, "done")}>Mark done</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
