const emqxRoute = require("./emqx.routes");
const webRoute = require("./web.routes");
const authRoute = require("./auth.routes");

function route(app) {
  app.use("/emqx", emqxRoute);
  app.use("/auth", authRoute);
  app.use("/", webRoute);
}
module.exports = route;
