/* Drag and drop between columns */
var dragId = null;
function initDragDrop(board){
  board.addEventListener("dragstart", function(e){
    var n = e.target.closest(".note"); if (!n) return;
    dragId = n.dataset.id; n.classList.add("dragging"); e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", dragId); } catch(x){}
  });
  board.addEventListener("dragend", function(){ dragId = null; render(); });
  board.addEventListener("dragover", function(e){
    var c = e.target.closest(".lane"); if (!c) return;
    e.preventDefault();
    document.querySelectorAll(".lane.over").forEach(function(x){ if (x !== c) x.classList.remove("over"); });
    c.classList.add("over");
  });
  board.addEventListener("drop", function(e){
    var c = e.target.closest(".lane"); if (!c || !dragId) return;
    e.preventDefault();
    var id = dragId;
    dragId = null;
    updateTask(id, {status:c.dataset.s}, true);
  });
}
