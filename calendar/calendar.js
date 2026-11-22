/* Month calendar: shows cards on their due date, tick to complete, drag to reschedule */
var calDate = new Date(); calDate.setDate(1);
var calDrag = null;

function renderCalendar(list){
  var y = calDate.getFullYear(), m = calDate.getMonth();
  var lead = (new Date(y, m, 1).getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate(), today = iso(0);
  var h = '<div class="calhead"><h2>' + calDate.toLocaleDateString(undefined, {month:"long", year:"numeric"}) + '</h2>'
    + '<div class="ms-auto d-flex gap-2">'
    + '<button class="btn btn-sm btn-outline-secondary rounded-pill" data-cal="-1"><i class="bi bi-chevron-left"></i></button>'
    + '<button class="btn btn-sm btn-outline-secondary rounded-pill px-3" data-cal="0">Today</button>'
    + '<button class="btn btn-sm btn-outline-secondary rounded-pill" data-cal="1"><i class="bi bi-chevron-right"></i></button></div></div><div class="calgrid">';
  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach(function(d){ h += '<div class="dow">'+d+'</div>'; });
  for (var i = 0; i < lead; i++) h += '<div class="day blank"></div>';
  for (var d = 1; d <= n; d++){
    var ds = y + "-" + String(m+1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
    var items = list.filter(function(t){ return t.due === ds; });
    h += '<div class="day'+(ds===today?" today":"")+'" data-d="'+ds+'"><span class="dn">'+d+'</span>';
    items.slice(0,3).forEach(function(t){
      h += '<div class="cchip st-'+t.status+(t.status==="done"?" done":"")+'" draggable="true" data-id="'+t.id+'">'
        + '<button class="ck" data-ck="'+t.id+'" title="Mark complete"><i class="bi bi-check-lg"></i></button>'
        + '<span>'+esc(t.title)+'</span>'+(t.pin?'<i class="bi bi-pin-angle-fill"></i>':'')+'</div>';
    });
    if (items.length > 3) h += '<div class="more">+'+(items.length-3)+' more</div>';
    h += '</div>';
  }
  document.getElementById("cal").innerHTML = h + '</div>';
}

function initCalendar(){
  var cal = document.getElementById("cal");
  cal.addEventListener("click", function(e){
    var nav = e.target.closest("[data-cal]");
    if (nav){
      calDate = nav.dataset.cal === "0" ? new Date() : new Date(calDate.getFullYear(), calDate.getMonth() + +nav.dataset.cal, 1);
      calDate.setDate(1); render(); return;
    }
    var ck = e.target.closest("[data-ck]");
    if (ck){
      var task = tasks.filter(function(t){ return String(t.id) === String(ck.dataset.ck); })[0];
      if (task) updateTask(task.id, {status:task.status === "done" ? "todo" : "done"});
      return;
    }
    var chip = e.target.closest(".cchip");
    if (chip){ openModal(chip.dataset.id); return; }
    var day = e.target.closest(".day");
    if (day && day.dataset.d) openModal(null, day.dataset.d);
  });
  cal.addEventListener("dragstart", function(e){
    var c = e.target.closest(".cchip"); if (!c) return;
    calDrag = c.dataset.id; try { e.dataTransfer.setData("text/plain", calDrag); } catch(x){}
  });
  cal.addEventListener("dragover", function(e){
    var d = e.target.closest(".day"); if (!d || !d.dataset.d || !calDrag) return;
    e.preventDefault();
    document.querySelectorAll(".day.over").forEach(function(x){ x.classList.remove("over"); });
    d.classList.add("over");
  });
  cal.addEventListener("drop", function(e){
    var d = e.target.closest(".day"); if (!d || !d.dataset.d || !calDrag) return;
    e.preventDefault();
    var task = tasks.filter(function(t){ return String(t.id) === String(calDrag); })[0];
    calDrag = null; render();
    if (task) updateTask(task.id, {due:d.dataset.d, start:task.start > d.dataset.d ? d.dataset.d : task.start});
  });
  cal.addEventListener("dragend", function(){ calDrag = null; render(); });
}
