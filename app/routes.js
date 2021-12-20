// app/routes.js
const db = require("../config/database");
module.exports = function (app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get("/", isLoggedIn, function (req, res) {
    res.render("public.ejs"); // load the index.ejs file
  });

  app.get("/home", isLoggedIn, function (req, res) {
    res.render("home.ejs"); // load the index.ejs file
  });
  app.get("/thankyou", isLoggedIn, function (req, res) {
    res.render("thankyou.ejs"); // load the index.ejs file
  });
  

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get("/login", function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/home", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    }),
    function (req, res) {
      console.log("hello");

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect("/home");
    }
  );

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get("/register", function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render("register.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/register",
    passport.authenticate("local-signup", {
      successRedirect: "/account", // redirect to the secure profile section
      failureRedirect: "/register", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =====================================
  // PROFILE SECTION =========================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get("/account", isLoggedIn, function (req, res) {
    res.render("profile.ejs", {
      user: req.user, // get the user out of session and pass to template
    });
  });

  app.get("/menu", isLoggedIn, function (req, res) {
    res.render("menu.ejs");
  });

  app.get("/cart", isLoggedIn, function (req, res) {
    res.render("cart.ejs");
  });

  app.post("/cart", isLoggedIn, function (req, res) {
    //   cart: [ { name: 'Classic Beef Burger', price: '30', quantity_ordered: 3 } ],
    // sum: 90
    let cart = req.body.cart;
    let sum = req.body.sum;
    let order = {
      customer_id: req.user.customer_id,
      total_price: sum,
    };
    let sql = "INSERT INTO orders SET ?";
    db.query(sql, order, (err, results) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
      let orderId = results.insertId;
      cart.map((item) => {
        let sql = `SELECT * FROM items WHERE item_name = "${item.name}"`;
        db.query(sql, (err, results) => {
          if (err) {
            console.log(err.message);
            throw err;
          }
          let itemId = results[0].item_id;

          let sql = "INSERT INTO orderItem SET ?";
          let orderItem = {
            "order_id": orderId,
            "item_id": itemId,
            "quantity_ordered": item.quantity_ordered
          }
          db.query(sql, orderItem, (err) => {
            if (err) {
              console.log(err.message);
              throw err;
            }
          });
        });
      });
    });

    res.send("ok");
  });

  app.get("/resturantmenu", function (req, res) {
    res.render("publicmenu.ejs");
  });
  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/login");
  });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect("/login");
}
