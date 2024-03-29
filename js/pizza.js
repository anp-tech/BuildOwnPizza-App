//Some global variabes to hold data for the current customer
var PizzaSizes = null;      //array of pizza sizes as defined in the database
var Toppings = null         //array of pizza toppings as defined in the database
var Cart = []               //array of Pizza objects the the user has created.
var CustomerOrders = null;  //an object of type Order that tracks the created pizzas in the cart.


//onload event handler
window.onload = async ()=>{

    //Make AJAX request to load pizza data
    try{
        PizzaSizes = await GetPizzaSizesAJAX();
        PizzaToppings = await GetPizzaToppingsAJAX();
    }
    catch{
        console.log("Error making ajax requests to get pizza data");
        return;
    }

    //A new pizza object for the customer's cart. Goes away if page is reloaded
    CustomerOrders = new Order();

    //Buils the dropdowns from the data returned from the server
    BuildToppingsDropdowns();
    BuildPizzaSizesDropdown();

    //add event listeners and coorisponding actions for the buttons.
    BindButtons();

    //adds event listeners and actions for all dropdowns that need them
    BindDropdowns();

}


//Builds the toppings dropdowns from the list of toppings
function BuildToppingsDropdowns(){

    var toppingDropdowns = ["#topping1Dropdown", "#topping2Dropdown", "#topping3Dropdown",
                            "#updateTopping1Dropdown",  "#updateTopping2Dropdown",
                            "#updateTopping3Dropdown" ];
    for(var d in toppingDropdowns){
        var dropdown = $(toppingDropdowns[d]);
        for(var k in PizzaToppings){
            var top = PizzaToppings[k].toppingName;
            dropdown.append(
                     $('<option></option>').val(top).html(top)
            )
        }
    }
}


//Builds the pizzaSizeDropdown from the data in the PizzaSizes object
function BuildPizzaSizesDropdown(){
      var dropdown1 = $("#pizzaSizeDropdown");
      var dropdown2 = $("#updatePizzaSizeDropdown");

      for(var k in PizzaSizes){
          let p = PizzaSizes[k]
          dropdown1.append(
                   $('<option></option>').val(p.name).html(p.name + " ($" + p.price.toString() + ")")
          )
          dropdown2.append(
                   $('<option></option>').val(p.name).html(p.name + " ($" + p.price.toString() + ")")
          )
          var topping = PizzaSizes[k]
      }
}


//Handles the onclick actions for the buttons.
function BindButtons(){

    //Redirect to home page when closing the confirmation modal
    $("#orderConfirmationModal").on('hidden.bs.modal', function(){
      window.location.href = "index.html"
    });


    //clicking the "createPizzaButton" will reset the dropdowns in the modal. Also disables the "addToCartButton"
    $("#createPizzaButton").click(function(){
        ResetDropdowns();
        $("#addToCartButton").prop('disabled', true);
    });

    //clicking the "addToCartButton" will call the AddPizzaToCart function
    $("#addToCartButton").click(function(){
        AddPizzaToCart();
    });
    $("#savePizzaChanges").click(function(){
        let t1 = $("#updateTopping1Dropdown").val();
        let t2 = $("#updateTopping2Dropdown").val();
        let t3 = $("#updateTopping3Dropdown").val();
        let s = $("#updatePizzaSizeDropdown").val();
        let n = $("#currentPizzaBeingUpdated").val();
        CustomerOrders.updatePizza(n, t1, t2, t3, s)
    });

    //promps the user for the submit modal where they Enter their name and submit to the database
    $("#submitOrderButton").click(function(){
        //don't do anything of no pizzas have been added
        if(CustomerOrders.PizzaCount == 0) return;

         LoadCheckoutModal();
    });


    $("#submitFinalOrderButton").click(function(){

         //add even listener to validate when user clicks away from text area
         $("#customerName").keyup(function(e){
            if(e.keyCode === 13){
                ValidateOrder();
            }
         });

          $("#customerName").blur(function(e){
              ValidateOrder();
          })

          //validate the "I agree textbox"
          $("#agreeCheckbox").change(function(e){
             ValidateOrder();
          });

         //validate the order and submit
         if(ValidateOrder()){
             SubmitOrderAjax();
             $('#checkoutModal').modal('hide');

         }
    });
}


//valiates the order and prompts the user if invalid
function ValidateOrder(){
    var name = $("#customerName").val();
    var check = $("#agreeCheckbox").is(":checked");
    isValid = true;
    if(name != undefined && name != null && name.length > 0){
        isValid = true;
        CustomerOrders.CustomerName = name;
        $("#nameValidationMessage").css("display", "none")
    }
    else{
        $("#nameValidationMessage").css("display", "block")
        isValid = false;
    }
    if(check == true){
        isValid = true;
        $("#checkboxValidationMessage").css("display", "none")
    }
    else{
        isValid = false;
        $("#checkboxValidationMessage").css("display", "block")
    }
    return isValid



}


//Takes the customers order and makes an AJAX post to update the database
async function SubmitOrderAjax(){

    //format the data to submit via ajax
    var pizzasToSubmit = [];
    var customerName = CustomerOrders.CustomerName;
    for(var i in CustomerOrders.Pizzas){

        var sId = _GetSizeIDFromName(CustomerOrders.Pizzas[i].size);
        var t1Id = _GetToppingIDFromName(CustomerOrders.Pizzas[i].topping1);
        var t2Id = _GetToppingIDFromName(CustomerOrders.Pizzas[i].topping2);
        var t3Id = _GetToppingIDFromName(CustomerOrders.Pizzas[i].topping3);
        var toppingInfo = {
            customerName:customerName,
            sizeID:sId,
            topping1ID:t1Id,
            topping2ID:t2Id,
            topping3ID:t3Id,
        };
        pizzasToSubmit.push(toppingInfo);
    }

    //make the ajax post to submit the pizzas
    try{
        let result;
         result = await $.ajax({
            url:"server/addPizzas.php",
            type:"POST",
            data: {data:pizzasToSubmit},
        });
              $("#orderConfirmationModal").modal('show');
         //window.location.href = "index.html"
    }
    catch(error){
        console.error(error);
    }

}


function _GetToppingIDFromName(topping){
    for(var i in PizzaToppings){
        var t = PizzaToppings[i]
        if(PizzaToppings[i].toppingName == topping){
            return PizzaToppings[i].toppingID;
        }
    }
    return -1;
}


function _GetSizeIDFromName(name){
    for(var i in PizzaSizes){
        var p = PizzaSizes[i]
        if(p.name == name){
            return p.id
        }
    }
    return -1; //pizza not found
}


//builds the data for the cart checkout modal.
function LoadCheckoutModal(){

    //show the checkout modal
    $('#checkoutModal').modal('show');

    //load the html data into the modal
    var domRef = $("#orderReview");
    var innerHtml = ""
    for(let key in CustomerOrders.Pizzas){
        let p = CustomerOrders.Pizzas[key];
        var topping1 = (p.topping1 == "default" ? "" : p.topping1)
        var topping2 = (p.topping2 == "default" ? "" : p.topping2)
        var topping3 = (p.topping3 == "default" ? "" : p.topping3)
        innerHtml += '<span>'
        innerHtml += p.Name;
        innerHtml += '<ul>'
        innerHtml += '<li>'
        innerHtml += "Toppings: " + topping1 + ", " + topping2 + ", " + topping3;
        if(innerHtml[innerHtml.length - 2] == ','){
            innerHtml = innerHtml.replace(/,\s*$/, "");
        }
        innerHtml += '</li>'
        innerHtml += '<li>'
        innerHtml += "Size: " + p.size.toString();
        innerHtml += '</li>'
        innerHtml += ' </ul>'
        innerHtml += '</span>'
    }
    domRef.html(innerHtml)

    //remove any showing validation messages
    $("#nameValidationMessage").css("display", "none")
    $("#checkboxValidationMessage").css("display", "none")

}


//adds event listeners for the dropdowns
function BindDropdowns(){

    //selecting a pizza size enables the "addToCartButton"
    $("#pizzaSizeDropdown").change(function(){
        $("#addToCartButton").prop('disabled', false);
    });
}


//Gets the items the user selected in the pizza dropdowns and builds a new cart item.
function AddPizzaToCart(){
     let s = $("#pizzaSizeDropdown option:selected").val();
     let t1 = $("#topping1Dropdown option:selected").val();
     let t2 = $("#topping2Dropdown option:selected").val();
     let t3 = $("#topping3Dropdown option:selected").val();

     let p = new Pizza(s, t1, t2, t3);
     CustomerOrders.addPizza(p)

     BuildCartHtml();

}

//builds the html to display in the cart based on the CustomerOrders object.
function BuildCartHtml(){
    var domRef = $("#cartContents");
    var outerHtml = ""
    for(let k in CustomerOrders.Pizzas){
        var order = CustomerOrders.Pizzas[k];
            var name = order.Name;
            var itemHtml = '<div id="'+name+'">';
            itemHtml += order.Name;
            itemHtml += '<button onclick = UpdatePizza('+name+') class=" btn btn-info" style="font-size:12; padding:1px; background:#B43A10">Update</button>';
            itemHtml += '<button onclick = DeletePizza('+name+') class=" btn btn-info" style="font-size:12; padding:1px; margin-left:2px; background:#B43A10">Delete</button>';
            itemHtml +='</div>'
            outerHtml += itemHtml;


    }
    domRef.html(outerHtml);
}


function UpdatePizza(div){
    pizzaName = div.id

    //show the edit pizza modal
    $('#editPizzaModal').modal('show');

    //get the pizza object with that name
    let p = CustomerOrders.getPizzaByName(pizzaName);
    $("#updateTopping1Dropdown").val(p.topping1);
    $("#updateTopping2Dropdown").val(p.topping2);
    $("#updateTopping3Dropdown").val(p.topping3);
    $("#updatePizzaSizeDropdown").val(p.size);

    //update the hidden field in the modal so we know that this pizza gets updatd when the user clicks the button
    $("#currentPizzaBeingUpdated").val(p.Name)
}


//deletes the pizza from the CustomerOrders list and from the cart html
function DeletePizza(div){
    try{
        $("#" + div.id).remove();
    }
    catch{
        console.log("the div could not be found")
        return;
    }
    CustomerOrders.removePizza(div.id);
}


//resets all the pizza dropdowns in the model. Needs to be called each time the modal is opened
function ResetDropdowns(){
    $("#pizzaSizeDropdown").val("default");
    $("#topping1Dropdown").val("default");
    $("#topping2Dropdown").val("default");
    $("#topping3Dropdown").val("default");
}


//makes ajax GET to get all the pizza sizes. Returns them as an array wher.
async function GetPizzaSizesAJAX(){

     let results
     results = await $.ajax({
         url: "server/getSizes.php",
         type: "GET"
     });
     results = JSON.parse(results)

     var resultsArr = []

     for(var i in results){
         var row = {id:results[i].sizeID, name:results[i].sizeName, price:results[i].price}
    resultsArr.push(row);
     }

      return resultsArr
}


//makes ajax GET request to get all the available pizza toppings. Returns an array
async function GetPizzaToppingsAJAX(){
    //for now we just return the global array of toppings.
    let results;
    results = await $.ajax({
        url: "server/getToppings.php",
        type: "GET"
    });
    results = JSON.parse(results);
    var toppingsList = [];
    for(var i in results){
        var toppingData = {
                      toppingID: results[i].toppingID,
                      toppingName:  results[i].toppingName,
                      toppingDescription: results[i].toppingDescription
                  }
        toppingsList.push(toppingData)
    }

    return toppingsList;
}


//A class to handle the pizzas that have been created by the customer.
class Order{
    constructor(){
        this.PizzaCount = 0;
        this.PizzaIndex = 0;
        this.Pizzas = [];
        this.CustomerName = null;
    }

   addPizza(newPizza){
      this.PizzaCount++;
       this.PizzaIndex++;
       newPizza.Name = "Pizza" + this.PizzaIndex.toString();
       this.Pizzas[this.PizzaCount - 1] = newPizza;

   }

   removePizza(pizzaName){
     let index = 0;
     for(let k in this.Pizzas){
         if(pizzaName == this.Pizzas[k].Name){
             break;
         }
         index++;
     }

     try{
          this.Pizzas.splice(index, 1);
          this.PizzaCount--;
     }
     catch{
         console.log("cannot remove pizza from list")
         return;
     }


   }

   getPizzaByName(pizzaName){
       for(let k in this.Pizzas){
           if(pizzaName == this.Pizzas[k].Name){
               return this.Pizzas[k];
           }
       }
   }

   updatePizza(name, topping1, topping2, topping3, size){
      let p = this.getPizzaByName(name);
      p.name = name;
      p.topping1 = topping1;
      p.topping2 = topping2;
      p.topping3 = topping3;
      p.size = size;
   }
}


//a class that holds all the infomation on a pizza
class Pizza{
   constructor(s, t1, t2, t3){
       this.size = s;
       this.topping1 = t1;
       this.topping2 = t2;
       this.topping3 = t3;
       this.Name = null; //assigned with pizza is added to Orders
   }
}
