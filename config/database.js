const express = require("express")
const app = express();

const mysql = require("mysql");
// create database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "thedatabase",
});
module.exports = db;
// connect to mysql environment
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});

// create Database
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE thedatabase";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("database created");
  });
});
// create tables
//customers table
app.get("/createCustomers", (req, res) => {
  let sql =
    "CREATE TABLE customers(customer_id int AUTO_INCREMENT, first_name VARCHAR(50),last_name VARCHAR(50),phone VARCHAR(50),email VARCHAR(50),address VARCHAR(100),city VARCHAR(50),password VARCHAR(255),PRIMARY KEY (customer_id))";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("customers created");
  });
});
//insert customer
app.post("/insertCustomers", (req, res) => {
  let customers = req.body;
  console.log(customers);
  let sql = "INSERT INTO customers SET ?";
  customers.map((customer) => {
    db.query(sql, customer, (err) => {
      if (err) {
        res.send(err.message);
        throw err;
      }
    });
  });
  res.send("customer added");
});
// get customer info
app.get("/getCustomer/:id", (req, res) => {
  let id = req.params.id;
  let sql = `SELECT * FROM customers WHERE customer_id = ${id}`;
  db.query(sql, (err, results) => {
    if (err) {
      res.send(err.message);
      throw err;
    }
    console.log(results);
    res.send(results);
  });
});
//items table
app.get("/createItems", (req, res) => {
  let sql =
    "CREATE TABLE items(item_id int AUTO_INCREMENT, item_name VARCHAR(50),price int, PRIMARY KEY(item_id))";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("items created");
  });
});
// insert items'
app.post("/insertItems", (req, res) => {
  let items = req.body;
  console.log(items);
  let sql = "INSERT INTO items SET ?";
  items.map((item) => {
    db.query(sql, item, (err) => {
      if (err) {
        res.send(err.message);
        throw err;
      }
    });
  });
  res.send("items added");
});
//orders table
app.get("/createOders", (req, res) => {
  let sql =
    "CREATE TABLE orders(order_id int AUTO_INCREMENT, customer_id int ,total_price int , order_date DATETIME DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (order_id), FOREIGN KEY (customer_id) REFERENCES customers(customer_id))";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("orders created");
  });
});
// insert orders
app.post("/insertOrders", (req, res) => {
  let orders = req.body;
  console.log(orders);
  let sql = "INSERT INTO orders SET ?";
  orders.map((order) => {
    db.query(sql, order, (err) => {
      if (err) {
        res.send(err.message);
        throw err;
      }
    });
  });
  res.send("orders added");
});
//order_items table
app.get("/createOrderItems", (req, res) => {
  let sql =
    "CREATE TABLE orderItem(order_id int NOT NULL, item_id int NOT NULL, quantity_ordered int, FOREIGN KEY (order_id) REFERENCES orders(order_id), FOREIGN KEY (item_id) REFERENCES items(item_id))";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("order_item created");
  });
});
app.post("/insertInOrderItem", (req, res) => {
  let orderItems = req.body;
  console.log(orderItems);
  let sql = "INSERT INTO orderItem SET ?";
  orderItems.map((orderItem) => {
    db.query(sql, orderItem, (err) => {
      if (err) {
        res.send(err.message);
        throw err;
      }
    });
  });
  res.send("orderItem added");
});
