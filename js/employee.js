/* SOURCES: 
  https://stackoverflow.com/questions/13241005/add-delete-row-from-a-table
*/

function toDelete(btn) {

  var byRow = btn.parentNode.parentNode;
  byRow.parentNode.removeChild(byRow);
}



  