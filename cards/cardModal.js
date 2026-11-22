/* Add / edit card — Bootstrap modal */
var editId = null;
var bsModal;
var $f = function(id){ return document.getElementById(id); };

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
