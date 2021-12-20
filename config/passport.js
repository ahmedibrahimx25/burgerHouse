// config/passport.js

// load all the things we need
const LocalStrategy = require("passport-local").Strategy;

// load up the user model
const bcrypt = require("bcrypt");
const db = require("./database");
// expose this function to our app using module.exports
module.exports = function (passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        // by default, local strategy uses email and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (req, email, password, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        db.query(
          "SELECT * FROM customers WHERE email = ?",
          [email],
          async function (err, rows) {
            if (err) {
              console.log(err);
              return done(err);
            }
            if (rows.length) {
              console.log(rows);
              return done(null, false, {
                message: "That email already exists.",
              });
            } else {
              // if there is no user with that username
              // create the user

              const hashedPassword = await bcrypt.hash(password, 10);
              const user = {
                username: email,
                password: hashedPassword,
              };
              let customer = req.body;
              customer.password = hashedPassword;
              let sql = "INSERT INTO customers SET ?";
              db.query(sql, customer, (err, results) => {
                if (err) {
                  console.log(err.message);
                }
                customer.customer_id = results.insertId;
                return done(null, customer);
              });
            }
          }
        );
      }
    )
  );

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (req, email, password, done) {
        // callback with email and password from our form
        db.query(
          "SELECT * FROM customers WHERE email = ?",
          [email],
          function (err, rows) {
            if (err) return done(err);
            if (!rows.length) {
              return done(null, false, { message: "No user found." }); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password))
              return done(null, false, { message: "Oops! Wrong password." }); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user

            return done(null, rows[0]);
          }
        );
      }
    )
  );
};
