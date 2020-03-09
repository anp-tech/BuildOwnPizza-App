
//A global var to hold the pizza sizes as returned by GetSizesAjax
var SizesArr = [];

window.onload = async ()=>{
    SizesArr = await getSizesAjax();
    SizesArr = JSON.parse(SizesArr)
    BuildSizesTable();
}

//will make an ajax request to query for the list of pizza sizes. We make this request again whenever an item is added to the table.
 async function getSizesAjax() {
    //for now we just return the global array of sizes.
    return await $.ajax({
        url: "server/getSizes.php",
        type: "GET"
    });
}

//takes the data stored in the ToppinsList global array, and builds it into the sizes table.
function BuildSizesTable(){
  $("#sizesTableBody").html("");

  $("#sizesTable").find('tbody')
    .append($('<tr>')
        .append($('<th>')

        .text("Size Name"))
        .append($('<th>')

        .text("Price"))
        .append($('<th>')
        .text("Update"))
        .append($('<th>')
        .text("Delete"))
    )

    console.log(SizesArr)
  for(var i in SizesArr){
      var top = SizesArr[i];
      //console.log(top)
      $("#sizesTable").find('tbody')
        .append($('<tr>')
            .append($('<td>')
                .append($('<span>')
                    .text(top.sizeName)
                    .attr('id', top.sizeID + "_name")
                )
            )
            .append($('<td>')
                .append($('<span>')
                    .text(top.price)
                    .attr('id', top.sizeID + "_price")
                )
            )
            .append($('<td>')
                .append($('<button>')
                    .text("Update")
                    .attr('id', top.sizeID + "_update")
                    .attr('class', "btn btn-secondary")
                    .attr('style', "background:#B43A10")
                    .attr('onclick', "UpdateButtonClickAction("+top.sizeID+")")
                )
            )
            .append($('<td>')
                .append($('<button>')
                    .text("Delete")
                    .attr('id', top.sizeID + "_delete")
                    .attr('class', "btn btn-secondary")
                    .attr('style', "background:#B43A10")
                    .attr('onclick', "DeleteButtonClickAction("+top.sizeID+")")
                )
            )
            .attr('id', top.sizeID)
        ).attr('id', "sizesTableBody");
  }
}

//Makes an ajax post to add a new size from the input fields. After we update the db, we rebuild the table
async function AddSizeAjax(Name, Price){
    data = {sizeName:Name, price:Price};
    let result;
   try{
      result = await $.ajax({
         url:"server/addSizes.php",
         type:"POST",
         data:data
      });
      return result;
   }
   catch(error){
       console.error(error);
   }
}


//makes ajax request to update a size when user clicks the update button on the modal
async function UpdateSizeAjax(sizeID, sizeName, price){
    console.log(price)
   let postData = {
       sizeID: sizeID,
       sizeName: sizeName,
       price: price
   };

   let response = await $.ajax({
       url: "server/updateSize.php",
       type: "POST",
       data: postData
   });
   return await response
}


//function gets called when user clickes the update button in the Modal
async function SubmitSizeChanges(){

    $('#updateSizeModal').modal('hide');

    let sizeID = $("#updateId").val();
    let sizeName = $("#updateName").val();
    let price = $("#updatePrice").val();

    //make ajax request to update the db. Then rebuild the table with the new data.
    let res = await UpdateSizeAjax(sizeID, sizeName, price);
    if(JSON.parse(res) != "success"){
        console.error("error updating pizza size")
    }
    location.reload();
}


//function is called when a update button is clicked in the sizes table.
async function UpdateButtonClickAction(rowId){
     $('#updateSizeModal').modal('show');

    //set the hidden value to keep track of the size that is being updated in the modal
    $('#updateId').val(rowId)

     let name = document.getElementById(rowId + "_name").innerText;
     let price = document.getElementById(rowId + "_price").innerText;
     $("#updateName").val(name)
     $("#updatePrice").val(price)
     $("#updateId").val(rowId) //hiden field to track the id of the updated size


}


//function is called when a delete button is clicked in the sizes table. Then we requery for the table data and build it
async function DeleteButtonClickAction(rowId){
 $('#confirmDeleteModal').modal('show');

 //set the hiden id of the value to be deleted
 $('#deleteId').val(rowId);

}


//makes call to ajax function to delete the size. Also rebuilds the table.
async function DeleteSize(){
   $('#confirmDeleteModal').modal('hide');

   let sizeID = $("#deleteId").val();
    res = await DeleteSizeAjax(sizeID);

   if(JSON.parse(res) != "success"){
       console.error("Error deleting size")
   }
   else{
       location.reload()
   }
}


//makes an ajax request to delete a size
async function DeleteSizeAjax(sizeID){
  let postData = {
      sizeID : sizeID
  }

  let response = await $.ajax({
      url: "server/deleteSize.php",
      type: "POST",
      data: postData
  });
  return await response
}

//This function is called when the Add button is clicked
async function AddSizeButtonClickAction(){
    let name = $("#sizeName").val();
    if(name == undefined || name == null || name == "") return;

    let p = $("#sizePrice").val();
    if(p == undefined || p == null || p == "") return;

    await AddSizeAjax(name, p);

    //refresh the page so the updated table gets built
    window.location.reload(); FIXME
}

class Size{
    constructor(id, name, p){
        this.Id = id;
        this.Name = name;
        this.Description = p;
    }
}
