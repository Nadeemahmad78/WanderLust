if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

// ROUTES
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

// ==========================
// DATABASE
// ==========================
const dbUrl =
  process.env.LOCAL_DB_URL || "mongodb://127.0.0.1:27017/wanderlust";

let dbConnected = false;

async function main() {
  await mongoose.connect(dbUrl);
  dbConnected = true;
  console.log("✅ connected to DB");
}

main().catch((err) => {
  console.log("❌ DB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  dbConnected = false;
});

// ==========================
// VIEW ENGINE
// ==========================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ==========================
// MIDDLEWARE
// ==========================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      "✅ Finished:",
      req.method,
      req.originalUrl,
      "Status:",
      res.statusCode
    );
  });
  next();
});

// ==========================
// SESSION (FIXED)
// ==========================
const sessionSecret = process.env.SESSION_SECRET || "supersecret";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("⚠ Session store error:", err);
});

app.use(
  session({
    store,
    name: "session",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(flash());

// ==========================
// PASSPORT
// ==========================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========================
// GLOBAL LOCALS
// ==========================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ==========================
// DB GUARD
// ==========================
app.use((req, res, next) => {
  if (!dbConnected) {
    return res.status(503).send("Database not connected");
  }
  next();
});

// ==========================
// ROUTES
// ==========================
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// ==========================
// 404
// ==========================
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// ==========================
// ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500 } = err;
  res.status(statusCode).send(err.message);
});

// ==========================
// SERVER
// ==========================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});