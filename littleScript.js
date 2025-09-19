#!/usr/bin/env node
// todo.js - Einfache ToDo-Liste im Terminal
// ==========================================
// Nutzung:
//   node todo.js add "Milch kaufen"
//   node todo.js list
//   node todo.js done 1
//   node todo.js delete 2
//
// Daten werden in "todos.json" gespeichert.
// ==========================================

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "todos.json");

// Daten laden oder Initialisieren
function loadTodos() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(raw);
    } catch (e) {
        console.error("Fehler beim Laden:", e.message);
        return [];
    }
}

// Daten speichern
function saveTodos(todos) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), "utf-8");
    } catch (e) {
        console.error("Fehler beim Speichern:", e.message);
    }
}

// Befehle
function listTodos(todos) {
    if (todos.length === 0) {
        console.log("Keine Aufgaben vorhanden.");
        return;
    }
    console.log("*** Aktuelle Aufgabenliste ***"); // Unterschied Version B
    todos.forEach((t, i) => {
        const status = t.done ? "[x]" : "[ ]";
        console.log(`${i + 1}. ${status} ${t.text}`);
    });
}

function addTodo(todos, text) {
    todos.push({ text, done: false });
    saveTodos(todos);
    console.log(`Aufgabe erfolgreich hinzugefügt: ${text}`); // Unterschied Version B
}


function markDone(todos, index) {
    if (index < 1 || index > todos.length) {
        console.log("Ungültiger Index.");
        return;
    }
    todos[index - 1].done = true;
    saveTodos(todos);
    console.log(`Aufgabe erledigt: "${todos[index - 1].text}"`);
}

function deleteTodo(todos, index) {
    if (index < 1 || index > todos.length) {
        console.log("Ungültiger Index.");
        return;
    }
    const removed = todos.splice(index - 1, 1);
    saveTodos(todos);
    console.log(`Gelöscht: "${removed[0].text}"`);
}

// Main
const args = process.argv.slice(2);
const todos = loadTodos();

switch (args[0]) {
    case "list":
        listTodos(todos);
        break;
    case "add":
        if (!args[1]) {
            console.log("Bitte eine Aufgabe angeben.");
            break;
        }
        addTodo(todos, args.slice(1).join(" "));
        break;
    case "done":
        markDone(todos, parseInt(args[1], 10));
        break;
    case "delete":
        deleteTodo(todos, parseInt(args[1], 10));
        break;
    default:
        console.log("Befehle: list | add <text> | done <nr> | delete <nr>");
}
