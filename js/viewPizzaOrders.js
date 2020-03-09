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
    for(var i in data) {
    var viewOrders = data[i];
    var tRow = $('<tr>');
    tRow.append($('<td>').text(viewOrders.timeStamp).attr('id', viewOrders.pizzaID + "_timeStamp"));
    tRow.append($('<td>').text(viewOrders.customerName).attr('id', viewOrders.pizzaID + "_customerName"));
    tRow.append($('<td>').text(viewOrders.sizeName).attr('id', viewOrders.sizeID + "_sizeName"));
    tRow.append($('<td>').text(viewOrders.toppingName).attr('id', viewOrders.toppingID + "_toppingName"));
    tRow.append($('<td>').append($('<input type="checkbox">').text(viewOrders.hasBeenMade).attr('id', viewOrders.pizzaID + "_hasBeenMade")));
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
