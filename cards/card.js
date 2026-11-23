/* Sticky-note card HTML + 3D tilt */
var TAGCLS = {Important:"danger", Pending:"primary", Urgent:"warning", Bug:"dark", Feature:"success"};

function daysUntilDue(t){
  if (!t.due) return null;
  var today = iso(0).split("-"), due = t.due.split("-");
  var todayDate = Date.UTC(+today[0], +today[1]-1, +today[2]);
  var dueDate = Date.UTC(+due[0], +due[1]-1, +due[2]);
  return Math.round((dueDate-todayDate)/86400000);
}

function ageLevel(t){
  if (!t.due || t.status === "done" || t.status === "cancel") return 0;
  var daysLeft = daysUntilDue(t);
  if (daysLeft < 0) return 3;
  if (daysLeft === 0) return 2;
  if (daysLeft <= 3) return 1;
  return 0;
}

function cardHTML(t){
  var desc = t.desc || "";
  var age = ageLevel(t), daysLeft = daysUntilDue(t);
  var ageTitle = age === 1 ? "Due in " + daysLeft + " day" + (daysLeft === 1 ? "" : "s")
    : age === 2 ? "Due today"
    : age === 3 ? "Overdue by " + Math.abs(daysLeft) + " day" + (Math.abs(daysLeft) === 1 ? "" : "s") : "";
  var stamp = age === 2 ? "Due today" : age === 3 ? "Overdue · " + Math.abs(daysLeft) + "d" : "";
  var id = String(t.id), tilt = 0;
  for (var i = 0; i < id.length; i++) tilt = (tilt * 31 + id.charCodeAt(i)) % 5;
  return '<div class="note age-'+age+' s'+t.style+(t.pin?' pinned-note':'')+'" data-bs-theme="light" draggable="true" data-id="'+id+'"'+(ageTitle?' title="'+ageTitle+'"':'')+' style="--r:'+((tilt-2)*0.8)+'deg">'
    + '<span class="age-layer" aria-hidden="true"></span>'
    + (t.pin ? '<span class="note-pin" role="img" aria-label="Pinned"></span>' : '')
    + '<h5 class="mb-1">'+esc(t.title)+'</h5>'
    + '<p class="note-desc small mb-1">'+esc(desc)+'</p>'
    + (desc.length > 90 ? '<button type="button" class="note-more" data-more="'+id+'" aria-label="Read full note">…more</button>' : '')
    + '<div class="meta d-flex flex-wrap gap-1 my-2">'
    + t.tags.map(function(x){ return '<span class="badge rounded-pill text-bg-'+TAGCLS[x]+'">'+x+'</span>'; }).join("")
    + (stamp ? '<span class="age-stamp">'+stamp+'</span>' : '')
    + '</div>'
    + '<div class="time small fw-semibold"><i class="bi bi-calendar-event me-1"></i>'+fmt(t.start)+' → '+fmt(t.due)+'</div>'
    + '<div class="d-flex gap-1 mt-2">'
    + '<select class="form-select form-select-sm" data-mv="'+t.id+'">'
    + COLS.map(function(x){ return '<option value="'+x[0]+'"'+(x[0]===t.status?" selected":"")+'>'+x[1]+'</option>'; }).join("")+'</select>'
    + '<button class="ib'+(t.pin?" on":"")+'" data-pin="'+t.id+'" title="Pin"><i class="bi bi-pin-angle'+(t.pin?"-fill":"")+'"></i></button>'
    + '<button class="ib bell'+(t.remind?" on":"")+'" data-bell="'+t.id+'" title="Remind me"><i class="bi bi-bell'+(t.remind?"-fill":"")+'"></i></button>'
    + '<button class="ib" data-ed="'+t.id+'" title="Edit"><i class="bi bi-pencil"></i></button>'
    + '<button class="ib" data-del="'+t.id+'" title="Delete"><i class="bi bi-trash3"></i></button>'
    + '</div></div>';
}

function initTilt(board){
  board.addEventListener("mousemove", function(e){
    var n = e.target.closest(".note"); if (!n || dragId) return;
    var r = n.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
    n.style.setProperty("--ry", (x*16)+"deg"); n.style.setProperty("--rx", (-y*16)+"deg");
  });
  board.addEventListener("mouseout", function(e){
    var n = e.target.closest(".note");
    if (n){ n.style.setProperty("--rx","0deg"); n.style.setProperty("--ry","0deg"); }
  });
}
