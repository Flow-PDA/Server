var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { db } = require("./modules");
const cors = require("cors");

var indexRouter = require("./routes/index");

var app = express();

// CORS 설정, 클라이언트 HOST와 맞추어야 함
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
  })
);

/**
 * db sync mode
 * - CREATE_IF_NOT_EXISTS
 * - DROP_IF_EXISTS
 * - ALTER_IF_MODIFIED
 */
const CREATE_IF_NOT_EXISTS = {};
const DROP_IF_EXISTS = { force: true };
const ALTER_IF_MODIFIED = { alter: true };

db.sequelize
  .sync(CREATE_IF_NOT_EXISTS) // modify mode here
  .then(() => {
    console.log(`connected to database`);
  })
  .catch((err) => {
    console.log(`failed to connect db\n${err}`);
  });

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
