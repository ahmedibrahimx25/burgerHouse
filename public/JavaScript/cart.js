if (JSON.parse(localStorage.getItem("cartItemsName")) === null) {
  document.getElementById("box").style.display = "none";
  document.getElementById("checkout").style.display = "none";
  document.getElementById("empty").innerHTML = `
    <h2>Hello, your cart is empty!</h2>
    <br>
    <br>
    <a href="/menu">Add items</a>
    `;
} else {
  // console.log(JSON.parse(localStorage))
  for (
    let i = 0;
    i < JSON.parse(localStorage.getItem("cartItemsName")).length;
    i++
  ) {
    if (JSON.parse(localStorage.getItem("cartItemsPrice"))[i] != 0) {
      document.getElementById("box").innerHTML += `
            <div class="item" id="item-number-${i + 1}">
            <div class="number">
            <p id="price-of-item-${i + 1}">Price: ${
        JSON.parse(localStorage.getItem("cartItemsPrice"))[i]
      }EGP</p>
            <button id="decrement-item-${i + 1}">-</button>
            <h1 id="item-pieces-${i + 1}">${JSON.parse(
        localStorage.getItem("cartItemsName")
      )[i].substring(
        JSON.parse(localStorage.getItem("cartItemsName"))[i].charAt(-1),
        JSON.parse(localStorage.getItem("cartItemsName"))[i].indexOf("x")
      )}</h1>
            <button id="increment-item-${i + 1}">+</button>
            </div>
            <p id="name-of-item-${i + 1}">${
        JSON.parse(localStorage.getItem("cartItemsName"))[i]
      }</p>
            </div>
            `;
    }
    if (i === JSON.parse(localStorage.getItem("cartItemsName")).length - 1) {
      let sum = 0;
      for (
        let j = 0;
        j < JSON.parse(localStorage.getItem("cartItemsPrice")).length;
        j++
      ) {
        sum += JSON.parse(localStorage.getItem("cartItemsPrice"))[j];
      }
      document.getElementById("box").innerHTML += `
                <p id="total">total: ${sum}EGP</p>
            `;
    }
  }

  let currentCartItemsPrice = JSON.parse(
    localStorage.getItem("cartItemsPrice")
  );
  let currentCartItemsName = JSON.parse(localStorage.getItem("cartItemsName"));
  let cart = JSON.parse(localStorage.getItem("cart"));
  let sumTotal = JSON.parse(localStorage.getItem("sum"));
  let priceOfItem = [];
  let nameOfItem = [];
  let incrementItem = [];
  let decrementItem = [];
  let itemPieces = [];
  let itemNumber = [];

  for (
    let i = 0;
    i < JSON.parse(localStorage.getItem("cartItemsName")).length;
    i++
  ) {
    if (JSON.parse(localStorage.getItem("cartItemsPrice"))[i] != 0) {
      incrementItem[i] = document.getElementById("increment-item-" + (i + 1));
      decrementItem[i] = document.getElementById("decrement-item-" + (i + 1));
      priceOfItem[i] = document.getElementById("price-of-item-" + (i + 1));
      nameOfItem[i] = document.getElementById("name-of-item-" + (i + 1));
      itemPieces[i] = document.getElementById("item-pieces-" + (i + 1));
      itemNumber[i] = document.getElementById("item-number-" + (i + 1));
      incrementItem[i].onclick = function () {
        increment(i);
      };
      decrementItem[i].onclick = function () {
        decrement(i);
      };
    }
  }

  function increment(i) {
    itemPieces[i].innerHTML = Number(itemPieces[i].innerHTML) + 1;
    currentCartItemsPrice[i] =
      (currentCartItemsPrice[i] / (Number(itemPieces[i].innerHTML) - 1)) *
      itemPieces[i].innerHTML;
    currentCartItemsName[i] =
      itemPieces[i].innerHTML +
      " " +
      currentCartItemsName[i].substring(
        currentCartItemsName[i].indexOf("x"),
        currentCartItemsName[i].length
      );
    cart[i].quantity_ordered = cart[i].quantity_ordered + 1;
    sumTotal = currentCartItemsPrice.reduce((a, b) => a + b);
    localStorage.setItem("sum", JSON.stringify(sumTotal));
    localStorage.setItem(
      "cartItemsPrice",
      JSON.stringify(currentCartItemsPrice)
    );
    localStorage.setItem("cartItemsName", JSON.stringify(currentCartItemsName));
    localStorage.setItem("cart", JSON.stringify(cart));
    nameOfItem[i].innerHTML = JSON.parse(localStorage.getItem("cartItemsName"))[
      i
    ];
    priceOfItem[i].innerHTML =
      "Price: " + JSON.parse(localStorage.getItem("cartItemsPrice"))[i] + "EGP";
    let sum = 0;
    for (
      let j = 0;
      j < JSON.parse(localStorage.getItem("cartItemsPrice")).length;
      j++
    ) {
      sum += JSON.parse(localStorage.getItem("cartItemsPrice"))[j];
    }
    document.getElementById("total").innerHTML = "total: " + sum + "EGP";
  }

  function decrement(i) {
    itemPieces[i].innerHTML = Number(itemPieces[i].innerHTML) - 1;
    if (itemPieces[i].innerHTML == 0) {
      itemNumber[i].style.display = "none";
      currentCartItemsPrice.splice(i, 1, 0);
      cart.splice(i, 1);
      sumTotal = currentCartItemsPrice.reduce((a, b) => a + b);
      localStorage.setItem("sum", JSON.stringify(sumTotal));
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem(
        "cartItemsPrice",
        JSON.stringify(currentCartItemsPrice)
      );
      let sum = 0;
      for (
        let j = 0;
        j < JSON.parse(localStorage.getItem("cartItemsPrice")).length;
        j++
      ) {
        sum += JSON.parse(localStorage.getItem("cartItemsPrice"))[j];
      }
      if (sum === 0) {
        localStorage.clear();
        document.getElementById("box").style.display = "none";
        document.getElementById("checkout").style.display = "none";
        document.getElementById("empty").innerHTML = `
                <h2>Hello, your cart is empty!</h2>
                <br>
                <br>
                <a href="/menu">Add items</a>
                
                `;
      } else {
        document.getElementById("total").innerHTML = "total: " + sum + "EGP";
      }
    } else {
      currentCartItemsPrice[i] =
        (currentCartItemsPrice[i] / (Number(itemPieces[i].innerHTML) + 1)) *
        itemPieces[i].innerHTML;
      currentCartItemsName[i] =
        itemPieces[i].innerHTML +
        " " +
        currentCartItemsName[i].substring(
          currentCartItemsName[i].indexOf("x"),
          currentCartItemsName[i].length
        );
      cart[i].quantity_ordered = cart[i].quantity_ordered - 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      sumTotal = currentCartItemsPrice.reduce((a, b) => a + b);
      localStorage.setItem("sum", JSON.stringify(sumTotal));
      localStorage.setItem(
        "cartItemsPrice",
        JSON.stringify(currentCartItemsPrice)
      );
      localStorage.setItem(
        "cartItemsName",
        JSON.stringify(currentCartItemsName)
      );
      nameOfItem[i].innerHTML = JSON.parse(
        localStorage.getItem("cartItemsName")
      )[i];
      priceOfItem[i].innerHTML =
        "Price: " +
        JSON.parse(localStorage.getItem("cartItemsPrice"))[i] +
        "EGP";
      let sum = 0;
      for (
        let j = 0;
        j < JSON.parse(localStorage.getItem("cartItemsPrice")).length;
        j++
      ) {
        sum += JSON.parse(localStorage.getItem("cartItemsPrice"))[j];
      }
      document.getElementById("total").innerHTML = "total: " + sum + "EGP";
    }
  }
}

let cart = JSON.parse(localStorage.getItem("cart"));
let sumTotal = JSON.parse(localStorage.getItem("sum"));
const data = {"cart":cart, "sum":sumTotal}

const sendData = (data) =>{
  fetch('http://localhost:3000/cart',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(response => console.log(response.json()))
  .then(data =>{
    console.log("success:", data);
  }).catch((err)=>{
    console.error(err);
  })
}

function clearCart() {
  sendData(data);
  localStorage.clear();
}