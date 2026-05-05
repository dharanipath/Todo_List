// 1. Switch between Login and Signup forms
function showSignupForm() {
	const container = document.getElementById('container');
	if (!container) return;
	container.classList.add("right-panel-active");
}

function showSigninForm() {
	const container = document.getElementById('container');
	if (!container) return;
	container.classList.remove("right-panel-active");
}

// 2. Handle Login Logic 
/**
 * Utility: Helper to get elements safely
 */
const $ = (id) => document.getElementById(id);
const $query = (selector) => document.querySelector(selector);

/**
 * Utility: Toggle error messages and shake effect
 */
const updateFeedback = (msg, isError = true) => {
    const formError = $('signInError');
    const container = $query(".sign-in-container");

    if (!formError) return;

    formError.innerText = msg;
    formError.style.color = isError ? "#ff4d4f" : "#52c41a";
    formError.classList.toggle("show", !!msg);

    if (isError && msg) {
        container.classList.add("error-shake");
        setTimeout(() => container.classList.remove("error-shake"), 300);
    }

    // Auto-hide message after 2 seconds
    if (msg) {
        setTimeout(() => {
            formError.innerText = "";
            formError.classList.remove("show");
        }, 2000);
    }
};

async function handleLogin(event) {
    // It's safer to always prevent default if using fetch
    if (event) event.preventDefault();

		// ✅ CLEAR OLD SESSION FIRST
	localStorage.removeItem("userId");
	localStorage.removeItem("isLoggedIn");

    const email = $('signInEmail').value.trim();
    const password = $('signInPass').value.trim();

    // Reset UI
    clearError("signInEmail", "emailError");
    clearError("signInPass", "passError");

    // Validation logic
    if (!email || !password) {
        if (!email) showError("signInEmail", "emailError", "Email is required");
        if (!password) showError("signInPass", "passError", "Password is required");
        updateFeedback("Please fill all fields");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/get-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.error) {
			localStorage.setItem("isLoggedIn", "true");
            updateFeedback(data.error);
			return;
        } else {
			localStorage.setItem("isLoggedIn", "true");
			console.log("Logged in user:", data);
			localStorage.setItem("userId", data.user.id);
            updateFeedback("Login successful!", false);

            // Smooth transition to main app
            setTimeout(() => {
                showApp();
            }, 200);
        }
    } catch (error) {
        updateFeedback("Server error. Try again later.");
        console.error("Auth Error:", error);
    }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    const container = $('container');
    const pageLoader = $('pageLoader');
    const session = localStorage.getItem("isLoggedIn");
	const listContainer = document.getElementById("list-container");
	const selectAllBtn = document.getElementById("selectAllBtn");
	const deselectAllBtn = document.getElementById("deselectAllBtn");


    if (pageLoader) {
        pageLoader.classList.add("hidden");
    }

    if (session === "true") {
        showApp();
    } else {
        if (container) {
            container.style.display = "block";
            container.classList.remove("right-panel-active");
        }
    }

    // Panel Toggles
    $('signUp')?.addEventListener("click", () => container.classList.add("right-panel-active"));
    $('signIn')?.addEventListener("click", () => container.classList.remove("right-panel-active"));

    // Enable Add button only when there is input
    const inputBox = $('input-box');
    if (inputBox) {
        inputBox.addEventListener('input', updateAddButtonState);
    }
    updateAddButtonState();

	if (listContainer || selectAllBtn || deselectAllBtn) {
		listContainer.addEventListener("change", function (e) {
			if (e.target.classList.contains("task-checkbox")) {
				updateDeleteButtonState();
			}
		});

		selectAllBtn.onclick = () => {
			const checkboxes = document.querySelectorAll(".task-checkbox");
			checkboxes.forEach(cb => cb.checked = true);
			updateDeleteButtonState();
		}

		deselectAllBtn.onclick = () => {
			const checkboxes = document.querySelectorAll(".task-checkbox");
			checkboxes.forEach(cb => cb.checked = false);
			updateDeleteButtonState();
		}
	}

    // Real-time validation cleanup
    ['signInEmail', 'signInPass'].forEach(id => {
        $(id)?.addEventListener("input", () => {
            const errorId = id === 'signInEmail' ? 'emailError' : 'passError';
            clearError(id, errorId);
        });
    });
});

function updateAddButtonState() {
	const input = document.getElementById("input-box");
	const btn = document.getElementById("addTaskBtn");

	if (!input || !btn) return;

	btn.disabled = !input.value.trim();
}

function updateDeleteButtonState() {
	const checkedCount = document.querySelectorAll(".task-checkbox:checked").length;

	const deleteButtons = document.querySelectorAll(".delete-btn");

	const editButtons = document.querySelectorAll(".edit-btn");
	

	editButtons.forEach(btn => {
		btn.disabled = checkedCount > 0;
	});

	deleteButtons.forEach(btn => {
		btn.disabled = checkedCount > 1;
	});
}

function handleSignup(event) {
	if (event) event.preventDefault();

	const name = document.querySelector('.sign-up-container input[type="text"]').value.trim();
	const email = document.querySelector('.sign-up-container input[type="email"]').value.trim();
	const pass = document.getElementById('signUpPass').value.trim();

	if (!name || !email || !pass) {
		const form = document.querySelector('.sign-up-container');
		form.classList.add('error-shake');
		setTimeout(() => form.classList.remove('error-shake'), 500);
		return;
	}
	fetch("http://localhost:3000/save-user", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name : name, email: email, password: pass }),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Error creating account");
			}
			return response.json();
		})
		.then(() => {
			// Mock account creation and login
			localStorage.setItem("isLoggedIn", "true");
			localStorage.setItem("userName", name);

			document.querySelector('.sign-up-container input[type="text"]').value = "";
			document.querySelector('.sign-up-container input[type="email"]').value = "";
			document.getElementById('signUpPass').value = "";

			updateFeedback("Account created! Please log in.", false);
			setTimeout(() => {
				updateFeedback("");
			}, 2000);
			showSigninForm(); // Switch to login form after signup

		})
		.catch((error) => {
			console.error("Error creating account:", error);
		});
}

function showError(inputId, errorId, message) {
	const input = document.getElementById(inputId);
	const error = document.getElementById(errorId);

	input.classList.add("input-error");
	error.innerText = message;
	error.classList.add("show");
}

function clearError(inputId, errorId) {
	const input = document.getElementById(inputId);
	const error = document.getElementById(errorId);

	input.classList.remove("input-error");
	error.innerText = "";
	error.classList.remove("show");
}

// 3. Handle Logout
function handleLogout() {
	localStorage.clear(); // Clear all session data
	localStorage.removeItem("isLoggedIn");
	location.reload(); // Simple way to reset state and show login screen
}

// 4. Switch Views
function showApp() {
	const loginContainer = document.getElementById('container');
    const mainApp = document.getElementById('main-app');

    if (loginContainer) loginContainer.style.display = "none";
    if (mainApp) mainApp.style.display = "block";
    
    // Call your task loader
	showTask();
    // if (typeof loadTasks === "function") loadTasks();
}

function updateTaskStatus(tasks) {
    const countElement = document.querySelector('.task-count');
    const count = Array.isArray(tasks) ? tasks.length : 0;
    if (countElement) {
        countElement.textContent = `${count} task${count === 1 ? '' : 's'}`;
    }
}

function togglePassword(fieldId, icon) {
	const passwordInput = document.getElementById(fieldId);
	if (!passwordInput) return;

	const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
	passwordInput.setAttribute('type', type);

	if (icon) {
		icon.classList.toggle('visible');
	}
}


let deleteId = null; // Global variable to store ID of task to be deleted
let editId = null; // Global variable to store ID of task being edited
let selectionMode = false;

// ================= ADD TASK =================
function addTask() {
	const inputBox = document.getElementById("input-box");
	const userId = localStorage.getItem("userId");


	if (!inputBox.value.trim()) return;

	fetch("http://localhost:3000/save-task", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ task_name: inputBox.value, user_id: userId }),
	})
		.then(() => {
			inputBox.value = ""; // Clear input box after successful addition
			showTask(); // Refresh only after fetch completes
		})
		.catch((error) => console.error("Error adding task:", error));
	console.log(inputBox.value);
}

// ================= SHOW TASKS =================
function showTask() {
	const listContainer = document.getElementById("list-container");
	const userId = localStorage.getItem("userId"); 
	if (!listContainer) return;

	if (!userId) {
		console.error("User not logged in");
		return;
	}
	console.log("Fetching tasks for user ID:", userId);

	fetch(`http://localhost:3000/get-tasks?user_id=${userId}`, { 
		method: "GET" ,
		headers: { "Content-Type": "application/json" },
	})
	.then((response) => {
		 return response.json();
	})
	.then((data) => {
		console.log("Tasks from DB:", data);
		const tasks = Array.isArray(data) ? data : (Array.isArray(data.tasks) ? data.tasks : []);
		updateTaskStatus(tasks);
		if (!tasks.length) {
			listContainer.innerHTML = '<li class="task-item">No tasks found.</li>';
			document.getElementById("toggleSelectBtn").disabled = true;
			return;
		}

		listContainer.innerHTML = tasks.map(task => `
		<li data-id="${task.id}" class="task-item">
			<span class="task-text">${task.task_name}</span>
					
			<div class="actions">
				<input type="checkbox" class="task-checkbox" value="${task.id}"
					style="display: inline-block;">

				<button class="edit-btn" data-id="${task.id}" data-name="${task.task_name}"
				${selectionMode ? 'disabled' : ''}>Edit</button>
				<button class="delete-btn" data-id="${task.id}"
				${selectionMode ? 'disabled' : ''}>Delete</button>
			</div>
		</li>
	`).join("");
	document.getElementById("toggleSelectBtn").disabled = false;
	})
	.catch((error) => console.error("Error fetching tasks:", error));
}

// ================= EVENT DELEGATION =================
document.getElementById("list-container").addEventListener("click", function (e) {
	const target = e.target;

	if (target.classList.contains("edit-btn")) {
		editTask(target.dataset.id, target.dataset.name);
	}

	if (target.classList.contains("delete-btn")) {
		deleteTask(target.dataset.id);
	}
});

// ================= EDIT TASK =================
function editTask(id, currentName) {
	editId = id;

	const input = document.getElementById("editInput");
	const userId = localStorage.getItem("userId");

	if (!userId) {
		console.error("User not logged in");
		return;
	}

	input.value = currentName;

	document.getElementById("editModal").style.display = "block";

	//Run AFTER modal is visible
	setTimeout(() => {
		// Adjust height based on content
		autoResizeTextarea(input);
	}, 0);

	document.getElementById("saveEdit").onclick = function () {
		const updatedValue = document.getElementById("editInput").value;

		fetch("http://localhost:3000/update-task", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: id, task_name: updatedValue }),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Task updated:", data);
				document.getElementById("editModal").style.display = "none"; // close modal
				showTask(); // Refresh the list
			})
			.catch((error) => console.error("Error updating task:", error));
	};
}

// ================= CANCEL EDIT =================
document.getElementById("cancelEdit").onclick = () => closeModal("editModal");


// ================= DELETE TASK =================
function deleteTask(id) {
	deleteId = id;
	openModal("deleteModal");
}

document.getElementById("confirmDelete").onclick = function () {
	fetch("http://localhost:3000/delete-task", {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id: deleteId }),
	})
		.then((response) => response.json())
		.then((data) => {
			closeModal("deleteModal");
			console.log("Task deleted:", data);
			showTask();
		})
		.catch((error) => console.error("Error deleting task:", error));
};

// ================= CANCEL DELETE =================
document.getElementById("cancelDelete").onclick = () => closeModal("deleteModal");

// ================= MODAL HANDLING =================
function openModal(id) {
	document.getElementById(id).style.display = "block";
}

function closeModal(id) {
	document.getElementById(id).style.display = "none";
}

// ================= CLOSE MODAL ON OUTSIDE CLICK =================
window.addEventListener("click", function (e) {
	["editModal", "deleteModal"].forEach(id => {
		const modal = document.getElementById(id);
		if (e.target === modal) modal.style.display = "none";
	});
});

// ================= AUTO RESIZE TEXTAREA =================
function autoResizeTextarea(el) {
	el.style.height = "auto";
	el.style.height = el.scrollHeight + "px";
}

// Attach listener once
const editInput = document.getElementById("editInput");

if (editInput) {
	editInput.addEventListener("input", function () {
		autoResizeTextarea(this);
	});
}

// // ================= INIT =================
// showTask();

// ================= BULK DELETE LOGIC =================

const toggleBtn = document.getElementById("toggleSelectBtn");
const deleteBtn = document.getElementById("deleteSelectedBtn");
const cancelBtn = document.getElementById("cancelSelectBtn");
const selectAllBtn = document.getElementById("selectAllBtn");
const deselectAllBtn = document.getElementById("deselectAllBtn");

function toggleBulkUI(show) {
	selectionMode = show;
	if (show) {
		toggleBtn.style.display = "none";
		selectAllBtn.style.display = "inline-block";
		deselectAllBtn.style.display = "inline-block";
		deleteBtn.style.display = "inline-block";
		cancelBtn.style.display = "inline-block";
	} else {
		toggleBtn.style.display = "inline-block"; // Bring back the main button
		selectAllBtn.style.display = "none";
		deselectAllBtn.style.display = "none";
		deleteBtn.style.display = "none";
		cancelBtn.style.display = "none";
		deleteBtn.textContent = "Delete (0)"; // Reset count
	}
}

// 1. Enter Selection Mode
toggleBtn.onclick = (e) => {
	e.stopPropagation(); // Stop click from bubbling to window
	toggleBulkUI(true);
};

// 2. Cancel Selection
cancelBtn.onclick = () => {
	toggleBulkUI(false);
};

// 3. Select All
selectAllBtn.onclick = () => {
	const checkboxes = document.querySelectorAll(".task-checkbox");
	checkboxes.forEach(cb => {
		cb.checked = true;
		cb.closest(".task-item").classList.add("selected");
	});
	updateCount();
};

// 4. Deselect All
deselectAllBtn.onclick = () => {
	const checkboxes = document.querySelectorAll(".task-checkbox");
	checkboxes.forEach(cb => {
		cb.checked = false;
		cb.closest(".task-item").classList.remove("selected");
	});
	updateCount();
};

// 5. Update Delete Button Count
function updateCount() {
	const selectedCount = document.querySelectorAll(".task-checkbox:checked").length;
	deleteBtn.textContent = `Delete (${selectedCount})`;
}

// 6. Click Outside to Cancel
window.addEventListener("click", function (e) {
	const container = document.querySelector(".todo-app");
	// If we are in selection mode AND clicking outside the app
	if (selectionMode && !container.contains(e.target) && e.target !== toggleBtn) {
		toggleBulkUI(false);
	}
});

// Update listener for individual checkbox changes
document.addEventListener("change", function (e) {
	["editModal", "deleteModal"].forEach(id => {
		const modal = document.getElementById(id);
		if (e.target === modal) modal.style.display = "none";
	});
	const container = document.querySelector(".todo-app");
	if (selectionMode && !container.contains(e.target)) {
		console.log("Clicked outside - minimizing selection mode.");
		toggleBulkUI(false);
	}
});

// Delete selected
deleteBtn.onclick = () => {
	const selected = [...document.querySelectorAll(".task-checkbox:checked")]
		.map(cb => cb.value);

	if (!selected.length) return alert("Select at least one task");

	if (!confirm(`Delete ${selected.length} tasks?`)) return;

	fetch("http://localhost:3000/delete-multiple-tasks", {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ids: selected }),
	})
		.then(() => {
			selectionMode = false;

			toggleBtn.style.display = "inline-block";
			deleteBtn.style.display = "none";
			cancelBtn.style.display = "none";
			selectAllBtn.style.display = "none";
			deselectAllBtn.style.display = "none";
			showTask();
		});
}