const User = require("../models/user");

// Render Signup Form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

// Signup Logic (NO wrapAsync here)
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log("Signup POST data:", req.body);
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    console.log("User registered:", registeredUser);

    req.login(registeredUser, (err) => {
      if (err) {
        console.error("Login after signup error:", err);
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    console.error("Signup error:", e);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

// Login
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/listings";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// Logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};
