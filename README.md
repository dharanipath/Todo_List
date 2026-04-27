# 📝 To-Do List App

A simple and lightweight To-Do List application built using **HTML, CSS, and JavaScript**.
This app allows users to add, check, and delete tasks, with data stored in the browser using **localStorage**.

---

## 📁 Project Structure

```
├── index.html      # Main page markup
├── styles.css      # Styling for the app
├── script.js       # Logic for adding, checking, deleting tasks
├── images/         # Icon assets
│   ├── icon.png
│   ├── checked.png
│   └── unchecked.png
```

---

## 🚀 Running Locally

You can run this project locally using a simple static server.

### Option 1: Using http-server (Recommended)

Run the following command in your project directory:

```
npx -y http-server -p 5000 -a 0.0.0.0 -c-1 --cors -d false .
```

Then open your browser and go to:

```
http://localhost:5000
```

---

## 🌐 Deployment

This project is configured for static deployment.

* **publicDir:** `.` (root directory)
* You can deploy directly using platforms like **Replit**, **GitHub Pages**, or any static hosting service.

### Replit Deployment

1. Open your project in Replit
2. Click on **Publish**
3. Your app will be live with a public URL

---

## ✨ Features

* ➕ Add new tasks
* ✅ Mark tasks as completed
* ❌ Delete tasks
* 💾 Persistent storage using localStorage
* 🎨 Simple and clean UI

---

## 📌 Notes

* No backend required — fully client-side application
* Works in any modern browser
* Data is stored locally in the user's browser

---

## 📄 License

This project is open-source and free to use.
