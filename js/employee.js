/* SOURCES: 
  https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_checkbox_checked2
  https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_table_deleterow
*/

function check() {
    document.getElementById("hasBeenMade").checked = true;
  }
  
  function uncheck() {
    document.getElementById("hasBeenMade").checked = false;
  }

function toDelete() {
    document.getElementById("deleteByRow").deleteRow(0);
  }



  