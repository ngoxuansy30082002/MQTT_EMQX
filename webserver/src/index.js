const path = require("path"); // lấy đường dẫn thư mục
const express = require("express");
const morgan = require("morgan"); // HTTp logger
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { engine } = require("express-handlebars"); // handle view
const route = require("./routes"); //router
const db = require("./config/db.config"); // mongo database
const moment = require("moment");

// connect to mongodb
db.connect();
const { startMQTTClient } = require("./util/mqtt");
startMQTTClient();

const app = express();

const port = process.env.PORT || 9001;

const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath)); //static file

app.use(express.urlencoded({ extended: true })); //midleware xử lí submit từ thẻ dạng form phía html và chuyển vào req.body
app.use(express.json()); //midleware xử lí dữ liệu từ các thư viện javascript (XMLhttpRequest, fetch, axios, ...)
app.use(cors());
app.use(cookieParser());

// HTTp logger
app.use(morgan("combined"));

// template engine, render views
var preVal = 0;
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
      compare: (param1, param2) => param1 === param2,
      json: (context) => JSON.stringify(context),
      last: (arr) => arr[arr.length - 1],
      convertTime: (timestamp) => {
        var utcMoment = moment(timestamp, "YYYY-MM-DDTHH:mm:ss.SSSZ");
        return utcMoment.format("HH:mm:ss, DD-MM-YYYY");
      },
      comparePreVal: (val) => {
        var compareVal = val - preVal;
        preVal = val;
        return compareVal;
      },
    },
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views")); // chỉ định đường dẫn thư mục views

// Routes init
route(app);

app.listen(port, (request, respond) => {
  console.log(`Our server is live on ${port}. Yay!`);
});
