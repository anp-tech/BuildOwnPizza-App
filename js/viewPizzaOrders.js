async function UpdatePizzaOrderAjax(pizzaID){
    hasBeenMade = document.getElementById(pizzaID.toString() + "_hasBeenMade").checked;
    data = {pizzaID:pizzaID, hasBeenMade:hasBeenMade};
    let result;

   try{
         result = await $.ajax({
         url:"server/updatePizza.php",
         type:"POST",
         data:data
      });
      console.log(result);
      location.reload()
   }
   catch(error){
       console.error(error);
   }
}

$(document).ready(function(){



function buildTable(data){
    var table = $("#viewCustomerOrders");
    table.html("");
    var tHead = $("<tr>");
    tHead.append($('<th>').text("TimeStamp"))
    tHead.append($('<th>').text("Customer Name"))
    tHead.append($('<th>').text("Size"))
    tHead.append($('<th>').text("Topping"))
    tHead.append($('<th>').text("Has Been Made"))
    tHead.append($('<th>').text("Delete"))
    table.append(tHead);

    if(data.length == 0) return;

    let curPizzaID = data[0].pizzaID;
    let curToppingsList = ""
    for(var i in data){
        //we've moved to the next pizza
        if(data[i].pizzaID != curPizzaID){

            //remove the trailing space and comma in the toppings list
            curToppingsList =  curToppingsList.substring(0, curToppingsList.length - 2)
           console.log(data[i].hasBeenMade)
           let shouldCheck = true;
           if(data[i].hasBeenMade == 0){
               shouldCheck = false;
           }
            //build out the row
            var tRow = $('<tr>');
            tRow.append($('<td>').text(data[i].timeStamp).attr('id', data[i].pizzaID + "_timeStamp"));
            tRow.append($('<td>').text(data[i].customerName).attr('id', data[i].pizzaID + "_customerName"));
            tRow.append($('<td>').text(data[i].sizeName).attr('id', data[i].sizeID + "_sizeName"));
            tRow.append($('<td>').text(curToppingsList).attr('id', data[i].toppingID + "_toppingName"));
            tRow.append($('<td>').append($('<input type="checkbox">').attr('id', data[i].pizzaID + "_hasBeenMade").attr("checked",shouldCheck)
            .attr("onclick", "UpdatePizzaOrderAjax("+data[i].pizzaID+")")));
            tRow.append($('<td>').append($('<button>').text("Delete").attr('id', data[i].pizzaID + "_delete")
            .attr('class', "btn btn-secondary").attr('style', "background:#B43A10")
            .attr('onclick', "DeleteButtonClickAction("+data[i].pizzaID+")")));
            table.append(tRow);

            //reset the toppings list for the next pizza
            curToppingsList = "";
        }

        //we are still on the same pizza so string the toppings list togther
        else{
            curToppingsList += data[i].toppingName + ", "
        }

        //move to the next item in the list
        curPizzaID = data[i].pizzaID;
    }


    for(var i in data) {
    var viewOrders = data[i];
    var tRow = $('<tr>');
    tRow.append($('<td>').text(viewOrders.timeStamp).attr('id', viewOrders.pizzaID + "_timeStamp"));
    tRow.append($('<td>').text(viewOrders.customerName).attr('id', viewOrders.pizzaID + "_customerName"));
    tRow.append($('<td>').text(viewOrders.sizeName).attr('id', viewOrders.sizeID + "_sizeName"));
    tRow.append($('<td>').text(viewOrders.toppingName).attr('id', viewOrders.toppingID + "_toppingName"));
    tRow.append($('<td>').append($('<input type="checkbox">').text(viewOrders.hasBeenMade).attr('id', viewOrders.pizzaID + "_hasBeenMade")
    .attr("onclick", "UpdatePizzaOrder("+viewOrders.pizzaID+")")));
    tRow.append($('<td>').append($('<button>').text("Delete").attr('id', viewOrders.pizzaID + "_delete")
    .attr('class', "btn btn-secondary").attr('style', "background:#B43A10")
    .attr('onclick', "DeleteButtonClickAction("+viewOrders.pizzaID+")")));
    table.append(tRow);
    };
}



$.ajax({
    url: "server/searchFiltering.php?filter=all",
    type: "GET",
    success:function(data) {
        var dt = JSON.parse(data);
        buildTable(dt);
    }
})

$("#filter").on("change", function() {
    var filter = $(this).val();
    $.ajax({
    url: "server/searchFiltering.php?filter="+filter,
    type: "GET",
    success:function(data) {
            var dt = JSON.parse(data);
            buildTable(dt);
    }
    })
})

// HasBeenMade
$("input[type=checkbox]").change(function() {
var checked = this.checked;
    $.ajax({
    url: "server/hasBeenMade.php?",
    type: "POST",
    dataType: 'json',
    data: {
        pizzaID : pizzaID,
        isChecked : checked,

    },
    success: function(data) {
        alert('updated succesfully');
    },
    error: function(data) {
        alert('could not be updated');
    }
});
});

$("input[type=checkbox").change(function() {
var unChecked = !this.checked;
    $.ajax({
    url: "server/hasBeenMade.php",
    type: "POST",
    dataType: 'json',
    data: {
        pizzaID : pizzaID,
        isNotChecked : unChecked,
    },
    success: function(data) {
        alert('updated succesfully');
    },
    error: function(data) {
        alert('could not be updated');
    }
});
});

})


//function is called when a delete button is clicked. Then we requery for the table data and build it
async function DeleteButtonClickAction(rowId){
    $('#confirmDeleteModal').modal('show');

    //set the hiden id of the value to be deleted
    $('#deleteId').val(rowId);
}

//makes an ajax request to delete an order
async function DeletePizzaOrdersAjax(pizzaID){
    let postData = {
        pizzaID : pizzaID
    }

    let response = await $.ajax({
        url: "server/deletePizzaOrders.php",
        type: "POST",
        data: postData
    });
    return await response
}

//makes call to ajax function to delete the order. Also rebuilds the table.
async function DeletePizzaOrders(){
    $('#confirmDeleteModal').modal('hide');

    let pizzaID = $("#deleteId").val();
     res = await DeletePizzaOrdersAjax(pizzaID);

    if(JSON.parse(res) != "success"){
        console.error("Error deleting pizza orders")
    }
    else{
        location.reload()
    }
 }
