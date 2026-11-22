/* Sticky-note card HTML + 3D tilt */
var TAGCLS = {Important:"danger", Pending:"primary", Urgent:"warning", Bug:"dark", Feature:"success"};

function cardHTML(t){
  var late = t.due && t.due < iso(0) && t.status !== "done" && t.status !== "cancel";
  return '<div class="note s'+t.style+(t.pin?' pinned-note':'')+'" data-bs-theme="light" draggable="true" data-id="'+t.id+'" style="--r:'+((t.id%5)-2)*0.8+'deg">'
    + (t.pin ? '<span class="note-pin" role="img" aria-label="Pinned"></span>' : '')
    + '<h5 class="mb-1">'+esc(t.title)+'</h5>'
    + '<p class="small mb-2">'+esc(t.desc)+'</p>'
    + '<div class="meta d-flex flex-wrap gap-1 my-2">'
    + t.tags.map(function(x){ return '<span class="badge rounded-pill text-bg-'+TAGCLS[x]+'">'+x+'</span>'; }).join("")+'</div>'
    + '<div class="time small fw-semibold"><i class="bi bi-calendar-event me-1"></i>'+fmt(t.start)+' → '+fmt(t.due)
    + (late ? ' <span class="badge text-bg-light text-danger">overdue</span>' : '')+'</div>'
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
