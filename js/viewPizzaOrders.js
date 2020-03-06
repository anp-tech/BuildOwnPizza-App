//A global var to hold the pizza as returned by GetPizzasAjax
var viewCustomerOrdersArr = [];

window.onload = async ()=>{
    viewCustomerOrdersArr = await getOrdersAjax();
    viewCustomerOrdersArr = JSON.parse(viewCustomerOrdersArr)
    BuildViewCustomerOrdersTable();
}



//will make an ajax request to query for the list of pizza sizes. We make this request again whenever an item is added to the table.
 async function getOrdersAjax() {
    //for now we just return the global array of sizes.
    return await $.ajax({
        url: "server/getPizzaOrders.php",
        type: "GET"
    });
}

//takes the data stored in the ToppinsList global array, and builds it into the sizes table.
function BuildViewCustomerOrdersTable() {
  $("#viewCustomerOrdersTableBody").html("");

  $("#viewCustomerOrders").find('tbody')
    .append($('<tr>')
        .append($('<th>')
        .text("TimeStamp"))

        .append($('<th>')
        .text("Customer Name"))

        .append($('<th>')

        .text("Size"))
        .append($('<th>')

        .text("Topping"))
        .append($('<th>')

        .text("Has Been Made"))
        .append($('<th>')

        .text("Delete"))
    )

  for(var i in viewCustomerOrdersArr){
      var top = viewCustomerOrdersArr[i];
      console.log(top)
      $("#viewCustomerOrders").find('tbody')
        .append($('<tr>')
            .append($('<td>')
                .append($('<span>')
                    .text(top.timeStamp)
                    .attr('pd', top.pizzaID + "_timeStamp")
                )
            )
            .append($('<td>')
                .append($('<span>')
                    .text(top.customerName)
                    .attr('pid', top.pizzaID + "_customerName")
                )
            )

            .append($('<td>')
                .append($('<span>')
                    .text(top.sizeName)
                    .attr('pid', top.pizzaID + "_sizeName")
                )
            )

            .append($('<td>')
                .append($('<span>')
                    .text(top.toppingName)
                    .attr('id', top.toppingID + "_toppingName")
                )
            )

            .append($('<td>')
                .append($('<input type="checkbox">')
                    .append($('<span>')
                        .text(top.hasBeenMade)
                        .attr('id', top.pizzaID + "_hasBeenMade")
                    )
                )
            )

            .append($('<td>')
                .append($('<button>')
                    .text("Delete")
                    .attr('id', top.pizzaID + "_delete")
                    .attr('class', "btn btn-secondary")
                    .attr('style', "background:#B43A10")
                    .attr('onclick', "DeleteButtonClickAction("+top.pizzaID+")")
                )
            )

            .attr('id', top.pizzaID)
        ).attr('id', "viewCustomerOrdersTableBody");
  }
}
