/* Add / edit card — Bootstrap modal */
var editId = null;
var bsModal;
var detailModal;
var detailId = null;
var pendingDetailEditId = null;
var $f = function(id){ return document.getElementById(id); };

function openNoteDetails(id){
  return window.noteDetailsReady.then(function(){
    var note = tasks.filter(function(task){ return String(task.id) === String(id); })[0];
    if (!note) throw new Error("The requested note could not be found.");

    detailId = String(note.id);
    var paper = $f("detailPaper");
    paper.className = "note note-detail-paper age-" + ageLevel(note) + " s" + note.style + (note.pin ? " pinned-note" : "");
    $f("detailTitle").textContent = note.title || "";
    $f("detailDesc").textContent = note.desc || "No description yet.";
    $f("detailPin").hidden = !note.pin;
    $f("detailDates").textContent = fmt(note.start) + " → " + fmt(note.due);

    var status = COLS.filter(function(column){ return column[0] === note.status; })[0];
    $f("detailStatus").textContent = status ? status[1] : note.status;

    var tags = $f("detailTags");
    tags.innerHTML = "";
    if (note.tags && note.tags.length){
      note.tags.forEach(function(tag){
        var badge = document.createElement("span");
        var color = Object.prototype.hasOwnProperty.call(TAGCLS, tag) ? TAGCLS[tag] : "secondary";
        badge.className = "badge rounded-pill text-bg-" + color;
        badge.textContent = tag;
        tags.appendChild(badge);
      });
    } else {
      tags.textContent = "No tags";
    }

    detailModal.show();
    return note;
  });
}

function openModal(id, dueDate){
  return window.noteModalReady.then(function(){
    editId = id == null ? null : String(id);
    var t = editId !== null ? tasks.filter(function(x){ return String(x.id) === editId; })[0]
               : {title:"",desc:"",start:iso(0),due:dueDate||iso(3),status:"todo",style:0,tags:[],pin:false,remind:false};
    if (editId === null && dueDate && dueDate < t.start) t.start = dueDate;
    $f("mTitle").textContent = editId !== null ? "Edit note" : "New note";
    $f("fTitle").value = t.title; $f("fDesc").value = t.desc;
    $f("fStart").value = t.start; $f("fDue").value = t.due;
    $f("fStatus").value = t.status; $f("fStyle").value = t.style;
    $f("fPin").checked = !!t.pin; $f("fRemind").checked = !!t.remind;
    $f("mErr").textContent = "";
    document.querySelectorAll("#fTags input").forEach(function(i){ i.checked = t.tags.indexOf(i.value) > -1; });
    bsModal.show();
  });
}

window.noteModalReady.then(function(){
  bsModal = new bootstrap.Modal(document.getElementById("modal"));
  $f("fStatus").innerHTML = COLS.map(function(c){ return '<option value="'+c[0]+'">'+c[1]+'</option>'; }).join("");
  $f("fTags").innerHTML = TAGS.map(function(t){
    return '<input type="checkbox" class="btn-check" id="tg_'+t+'" value="'+t+'" autocomplete="off">'
         + '<label class="btn btn-sm rounded-pill btn-outline-'+TAGCLS[t]+'" for="tg_'+t+'">'+t+'</label>';
  }).join("");

  $f("mSave").onclick = function(){
    var title = $f("fTitle").value.trim(), s = $f("fStart").value, d = $f("fDue").value;
    if (!title){ $f("mErr").textContent = "Give your note a title."; return; }
    if (s && d && d < s){ $f("mErr").textContent = "Due date can’t be before start."; return; }
    var existing = editId === null ? {} : tasks.filter(function(task){ return String(task.id) === editId; })[0];
    var data = Object.assign({}, existing, {
      title: title, desc: $f("fDesc").value.trim(), start: s, due: d,
      status: $f("fStatus").value, style: +$f("fStyle").value, pin: $f("fPin").checked, remind: $f("fRemind").checked,
      tags: Array.prototype.filter.call(document.querySelectorAll("#fTags input"), function(i){ return i.checked; }).map(function(i){ return i.value; })
    });
    if (editId !== null) data.id = editId;
    persistTask(data).then(function(){
      bsModal.hide(); render();
    }).catch(function(error){
      console.error("Could not save the note.", error);
      $f("mErr").textContent = "Could not save your note. Please try again.";
    });
  };
}).catch(function(error){
  console.error("The note editor could not be initialized.", error);
});

window.noteDetailsReady.then(function(){
  var modal = $f("detailModal");
  detailModal = new bootstrap.Modal(modal);
  $f("detailEdit").onclick = function(){
    pendingDetailEditId = detailId;
    detailModal.hide();
  };
  modal.addEventListener("hidden.bs.modal", function(){
    if (pendingDetailEditId === null) return;
    var id = pendingDetailEditId;
    pendingDetailEditId = null;
    openModal(id);
  });
}).catch(function(error){
  console.error("The note details view could not be initialized.", error);
});
