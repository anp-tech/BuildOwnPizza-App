//
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

        //get array of all unique pizza Ids in the list
        var ids = [];
        for(var i in data){
            ids[data[i].pizzaID] = data[i].pizzaID
        }
        for(var k in ids){
            toppingList = "";
            var cur = null;
            for(var a in data){
                if(ids[k] == data[a].pizzaID){
                    cur = data[a]
                    toppingList += ", " + " ("+ data[a].quantity.toString() + ") " + data[a].toppingName;
                }
            }
            toppingList = toppingList.slice(2)
            var shouldCheck = true;
            if(cur.hasBeenMade == 0){
                shouldCheck = false
            }

            var tRow = $('<tr>');
            tRow.append($('<td>').text(cur.timeStamp).attr('id', cur.pizzaID + "_timeStamp"));
            tRow.append($('<td>').text(cur.customerName).attr('id', cur.pizzaID + "_customerName"));
            tRow.append($('<td>').text(cur.sizeName).attr('id', cur.sizeID + "_sizeName"));
            tRow.append($('<td>').text(toppingList).attr('id', cur.toppingID + "_toppingName"));
            tRow.append($('<td>').append($('<input type="checkbox">').attr('id', cur.pizzaID + "_hasBeenMade").attr("checked",shouldCheck)
            .attr("onclick", "UpdatePizzaOrderAjax("+cur.pizzaID+")")));
            tRow.append($('<td>').append($('<button>').text("Delete").attr('id', cur.pizzaID + "_delete")
            .attr('class', "btn btn-secondary").attr('style', "background:#B43A10")
            .attr('onclick', "DeleteButtonClickAction("+cur.pizzaID+")")));
            table.append(tRow);
            toppings = "";
        }
    }

$.ajax({
    url: "server/searchFiltering.php?sF=allOrders",
    type: "GET",
    success:function(data) {
        var dt = JSON.parse(data);
        if(dt == "error"){
            console.error("Server error getting pizzas using search filter");
        }
        else{
            buildTable(dt);
        }
    }
})

$("#searchFilter").on("change", function() {
    console.log("changed")
    var searchFilter = $(this).val();
    $.ajax({
    url: "server/searchFiltering.php?sF="+searchFilter,
    type: "GET",
    success:function(data) {
            var dt = JSON.parse(data);

            buildTable(dt);

    },
    error:function(e){
        console.error(e)
    }
    })
})
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
