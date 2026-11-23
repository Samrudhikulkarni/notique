/* Load the note details modal markup */
window.noteDetailsReady = fetch("modals/noteDetailsModal.html")
  .then(function(response){
    if (!response.ok) throw new Error("Unable to load the note details modal: " + response.status);
    return response.text();
  })
  .then(function(markup){
    var container = document.createElement("div");
    container.innerHTML = markup;
    var modal = container.firstElementChild;
    if (!modal || modal.id !== "detailModal") throw new Error("The note details modal markup is invalid.");
    document.body.appendChild(modal);
  });
