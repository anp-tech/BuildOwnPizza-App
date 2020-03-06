//A global var to hold the pizza toppins as returned by GetToppingsAjax
var ToppingsList = [];

window.onload = async ()=>{
    ToppingsList = await GetToppingsAjax();
    ToppingsList = JSON.parse(ToppingsList)
    BuildToppingsTable();
}



//will make an ajax request to query for the list of pizza toppings. We make this request again whenever an item is added to the table.
 async function GetToppingsAjax(){
    //for now we just return the global array of toppings.
    return await $.ajax({
        url: "server/getToppings.php",
        type: "GET"
    });
}


//takes the data stored in the ToppinsList global array, and builds it into the toppings table.
function BuildToppingsTable(){
  $("#toppingsTableBody").html("");

  $("#toppingsTable").find('tbody')
    .append($('<tr>')
        .append($('<th>')

        .text("Topping Name"))
        .append($('<th>')

        .text("Topping Description"))
        .append($('<th>')
        .text("Update"))
        .append($('<th>')
        .text("Delete"))
    )
  for(var i in ToppingsList){
      var top = ToppingsList[i];
      //console.log(top)
      $("#toppingsTable").find('tbody')
        .append($('<tr>')
            .append($('<td>')
                .append($('<span>')
                    .text(top.toppingName)
                    .attr('id', top.toppingID + "_name")
                )
            )
            .append($('<td>')
                .append($('<span>')
                    .text(top.toppingDescription)
                    .attr('id', top.toppingID + "_description")
                )
            )
            .append($('<td>')
                .append($('<button>')
                    .text("Update")
                    .attr('id', top.toppingID + "_update")
                    .attr('class', "btn btn-secondary")
                    .attr('style', "background:#B43A10")
                    .attr('onclick', "UpdateButtonClickAction("+top.toppingID+")")
                )
            )
            .append($('<td>')
                .append($('<button>')
                    .text("Delete")
                    .attr('id', top.toppingID + "_delete")
                    .attr('class', "btn btn-secondary")
                    .attr('style', "background:#B43A10")
                    .attr('onclick', "DeleteButtonClickAction("+top.toppingID+")")
                )
            )
            .attr('id', top.toppingID)
        ).attr('id', "toppingsTableBody");
  }

}


//Makes an ajax post to add a new topping from the input fields. After we update the db, we rebuild the table
async function AddToppingAjax(toppingName, toppingDes){
    data = {toppingName:toppingName,toppingDescription:toppingDes};
    let result;
   try{
      result = await $.ajax({
         url:"server/addTopping.php",
         type:"POST",
         data:data
      });
      return result;
   }
   catch(error){
       console.error(error);
   }
}


//makes ajax request to update a topping when user clicks the update button on the modal
async function UpdateToppingAjax(toppingID, toppingName, toppingDescription){

   var postData = {
     toppingID: toppingID,
     toppingName: toppingName,
     toppingDescription: toppingDescription
   };

    let response = await $.ajax({
        url: "server/updateTopping.php",
        type: "POST",
        data: postData
    });
    return await response
}


//function gets called when user clickes the update button in the Modal
async function SubmitToppingChanges(){

    $('#updateToppingModal').modal('hide');

    let toppingID = $('#updateId').val()
    let newToppingName = $('#updateName').val();
    let newToppingDescription = $('#updateDescription').val();

    //make ajax request to update the db. Then rebuild the table with the new data.
    var res = await UpdateToppingAjax(toppingID, newToppingName, newToppingDescription);
    if(JSON.parse(res) != 'success'){
        alert('failed to update the pizza topping');
        console.log(res)
    }
    else{
        location.reload()
    }
}


//function is called when a update button is clicked in the toppings table.
async function UpdateButtonClickAction(rowId){
     $('#updateToppingModal').modal('show');

     let nameRowId = rowId + "_name"
     let name = document.getElementById(nameRowId).innerText;

     let descriptionRowId = rowId + "_description"
     let description = document.getElementById(descriptionRowId).innerText;

     $("#updateName").val(name)
     $("#updateDescription").val(description)
     $("#updateId").val(rowId) //hiden field to track the id of the updated topping
}


//function is called when a delete button is clicked in the topping table. Then we requery for the table data and build it
async function DeleteButtonClickAction(rowId){
 $('#confirmDeleteModal').modal('show');

 //set the hiden id of the value to be deleted
 $("#toppingIDToDelete").val(rowId);
}


//makes call to ajax function to delete the topping. Also rebuilds the table.
async function DeleteTopping(){
     $('#confirmDeleteModal').modal('hide');
   let res = await DeleteToppingAjax();
   if(JSON.parse(res) == "success"){
       location.reload();
   }
   else{
       console.error("error running delete query");
   }
}


//makes an ajax request to delete a topping
async function DeleteToppingAjax(){
    let toppingID = $("#toppingIDToDelete").val();

    var postData = {
      toppingID: toppingID,
    };

     let response = await $.ajax({
         url: "server/deleteTopping.php",
         type: "POST",
         data: postData
     });
     return await response
}


//This function is called when the Add button is clicked
async function AddToppingButtonClickAction(){
    let name = $("#toppingName").val();
    if(name == undefined || name == null || name == "") return;

    let des = $("#toppingDescription").val();
    if(des == undefined || des == null || des == "") return;

    await AddToppingAjax(name, des);

    //refresh the page so the updated table gets built
    window.location.reload(); FIXME



}


class Topping{
    constructor(id, name, des){
        this.Id = id;
        this.Name = name;
        this.Description = des;
    }
}
