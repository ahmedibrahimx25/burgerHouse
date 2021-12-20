let incrementItem = []
let decrementItem = []
let priceOfItem = []
let nameOfItem = []
let countItem = []
let addItem = []
let cartItemName = JSON.parse(localStorage.getItem("cartItemsName")) || []
let cartItemPrice = JSON.parse(localStorage.getItem("cartItemsPrice")) || []
let cart = JSON.parse(localStorage.getItem("cart")) || []

for (let i = 0; i < 14; i++) {
    incrementItem[i] = document.getElementById("increment-item-" + (i + 1))
    decrementItem[i] = document.getElementById("decrement-item-" + (i + 1))
    priceOfItem[i] = document.getElementById("price-of-item-" + (i + 1))
    nameOfItem[i] = document.getElementById("name-of-item-" + (i + 1))
    countItem[i] = document.getElementById("count-item-" + (i + 1))
    addItem[i] = document.getElementById("add-item-" + (i + 1))
    incrementItem[i].onclick = function () { afterIncrement(i) }
    decrementItem[i].onclick = function () { afterDecrement(i) }
    addItem[i].onclick = function () { afterAdding(i) }
}

function check(i) {
    if (Number(countItem[i].innerHTML) == 1) {
        decrementItem[i].disabled = true;
    } else {
        decrementItem[i].disabled = false;
    }
}

function afterIncrement(i) {
    countItem[i].innerHTML = Number(countItem[i].innerHTML) + 1
    check(i)
}

function afterDecrement(i) {
    countItem[i].innerHTML = Number(countItem[i].innerHTML) - 1
    check(i)
}

function afterAdding(i) {
    cartItemName.push(countItem[i].innerHTML + " x " + nameOfItem[i].innerHTML)
    cartItemPrice.push(Number(priceOfItem[i].innerHTML * countItem[i].innerHTML))
    var nameItem = nameOfItem[i].innerHTML;
    var priceItem = priceOfItem[i].innerHTML
    var itemCount = Number(countItem[i].innerHTML)
    var sum = cartItemPrice.reduce((a,b)=>a+b)
    cart.push({"name":nameItem,"price": priceItem, "quantity_ordered":itemCount})
    localStorage.setItem("cart", JSON.stringify(cart))
    localStorage.setItem("sum",JSON.stringify(sum))
    localStorage.setItem("cartItemsName", JSON.stringify(cartItemName))
    localStorage.setItem("cartItemsPrice", JSON.stringify(cartItemPrice))
    countItem[i].innerHTML = 1
    check(i)
}