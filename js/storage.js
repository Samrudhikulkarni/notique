/* Shared helpers: storage, constants, formatting */
var mem = {};
function get(k, d){ try { var v = localStorage.getItem(k); if (v !== null) return JSON.parse(v); } catch(e){} return mem[k] !== undefined ? mem[k] : d; }
function write(k, v){ localStorage.setItem(k, JSON.stringify(v)); mem[k] = v; }
function set(k, v){ try { write(k, v); } catch(e){ mem[k] = v; } }

var COLS = [["todo","To Do","bi-journal-text"],["progress","In Progress","bi-hourglass-split"],["done","Completed","bi-check-circle-fill"],["cancel","Cancelled","bi-x-circle-fill"]];
var TAGS = ["Important","Pending","Urgent","Bug","Feature"];

function getSession(){ return get("sb_session", null); }
function setSession(u){ set("sb_session", u); }
function getUsers(){ return get("sb_users", []); }
function saveUsers(u){ set("sb_users", u); }
function encode(p){ return btoa(unescape(encodeURIComponent(p))); }

function getNotes(){
  return Promise.resolve().then(function(){
    var session = getSession();
    if (!session) throw new Error("A signed-in user is required to load notes.");
    var notes = get("sb_tasks_" + session.email, []);
    if (!Array.isArray(notes)) throw new Error("The saved notes are invalid.");
    return notes;
  });
}

function saveNote(note){
  return Promise.resolve().then(function(){
    var session = getSession();
    if (!session) throw new Error("A signed-in user is required to save notes.");
    if (!note || typeof note !== "object") throw new Error("A valid note is required.");

    var key = "sb_tasks_" + session.email;
    var notes = get(key, []);
    if (!Array.isArray(notes)) throw new Error("The saved notes are invalid.");
    var saved = Object.assign({}, note);
    if (saved.id == null) saved.id = Date.now();

    var index = notes.findIndex(function(item){ return String(item.id) === String(saved.id); });
    if (index < 0) notes.push(saved);
    else notes[index] = saved;
    write(key, notes);
    return saved;
  });
}

function deleteNote(id){
  return Promise.resolve().then(function(){
    var session = getSession();
    if (!session) throw new Error("A signed-in user is required to delete notes.");

    var key = "sb_tasks_" + session.email;
    var notes = get(key, []);
    if (!Array.isArray(notes)) throw new Error("The saved notes are invalid.");
    write(key, notes.filter(function(item){ return String(item.id) !== String(id); }));
  });
}

function esc(s){ var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
function iso(n){ var d = new Date(); d.setDate(d.getDate()+n); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function fmt(s){ return s ? new Date(s+"T00:00").toLocaleDateString(undefined,{day:"numeric",month:"short"}) : "—"; }

/* Apply saved (or system) Bootstrap theme on every page */
(function(){
  var t = get("sb_theme", matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-bs-theme", t);
})();
