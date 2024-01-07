const mqtt = require("mqtt"); // thư viện mqtt
const { updateCSV } = require("./turbinesInformation");
const opt = require("minimist")(process.argv.slice(2)); // thư viện dùng cho lấy arguments
// Lấy Arguments từ lệnh nhập terminal
opt.submode = opt.submode || false;
opt.message = opt.message || JSON.stringify({ msg: "Hello" });
opt.topic = opt.topic || "/mqttjs-bench";
opt.clients = opt.clients || 10;
module.exports = opt.clients;

var clientDatas;
var turbinesInformations;
const {
  getTurbinesInformations,
  getClientDatas,
  startdataset,
} = require("./dataset"); //lấy dữ liệu mô phỏng bên file dataset.js

const protocol = "mqtt";
const host = "49.236.210.65";
const port = "1883";
const brokerUrl = `${protocol}://emqx@${host}:${port}/mqtt`;

// Array lưu giá trị các clients được trả về từ hàm connectToClients()
let clients = [];
let failedClients = 0;

// const brokerUrl = "ws://emqx@127.0.0.1:8083/mqtt"; // Config link broker, nếu nó chạy trên chính 1 host đó
// const subtopic = "/sub";
const pubtopic = "/pub";

const startApp = async () => {
  await startdataset();
  clientDatas = getClientDatas();
  turbinesInformations = getTurbinesInformations();
  // trying to connect to all clients before starting the test
  console.log(`\nTrying to conenct to ${opt.clients} clients ...`);
  let i = 0;
  while (clients.length < opt.clients && failedClients < opt.clients) {
    try {
      const index = clients.push(
        await connectToClients(clientDatas[i].clientID)
      );
    } catch (err) {
      failedClients++;
    }
    i++;
  }
  if (!(failedClients < opt.clients)) {
    console.log(
      "Please check the broker address, Could not connect to clients"
    );
    process.exit(1);
  }
  console.log(`Connected to ${opt.clients} sucessfully`);
  // const action = opt.submode ? clientSubscribe : clientPublishData;
  var action = clientSubscribe;
  for (let count = 3; count > 0; count--) {
    switch (action) {
      case clientPublishData:
        setInterval(() => {
          for (let i = 0; i < clients.length; i++) {
            action(clients[i]);
          }
          console.log("Publish Data successfully!");
        }, 10000);
        break;

      case clientPublishInit:
        for (let i = 0; i < clients.length; i++) {
          action(clients[i]);
        }
        console.log("Publish Init successfully!");
        action = clientPublishData;
        break;

      case clientSubscribe:
        for (let i = 0; i < clients.length; i++) {
          clients[i].index = i; // thêm thuộc tính index cho mỗi phần tử của mảng với giá trị là index của chính nó
          action(clients[i]);
        }
        clients.forEach((client) =>
          client.on("message", (topic, payload) => {
            let objMessage = JSON.parse(payload.toString()); //chuyển payload nhận được thành string
            //update các trạng thái hoạt động khi nhận được message điều khiển.
            // for (const key in objMessage) {
            //   if (clientDatas[client.index].hasOwnProperty(key)) {
            //     clientDatas[client.index][key] = objMessage[key];
            //   }
            // }

            console.log(client.index, objMessage);
            updateCSV(objMessage);
          })
        );
        console.log("Subscribe successfully!");
        action = clientPublishInit;
        break;
    }
  }
};
startApp();

console.log("waiting..........");

const connectToClients = (clientID) =>
  new Promise((resolve, reject) => {
    const c = mqtt.connect(brokerUrl, {
      clientId: clientID,
    });
    c.on("connect", () => resolve(c));
    c.on("error", (err) => reject(err));
  });

const clientSubscribe = (c) => {
  //các clients sub các topic theo chính ID của nó, VD: /stations01
  const subtopic = "/control/" + clientDatas[c.index].clientID;
  c.subscribe([subtopic], (err) => {});
};

const clientPublishData = (c) => {
  opt.message = JSON.stringify(clientDatas[c.index]); //lấy dữ liệu từ file dataset.js
  c.publish("/clientData", opt.message, { qos: 0, retain: false }, (err) => {});
};

const clientPublishInit = (c) => {
  opt.message = JSON.stringify(turbinesInformations[c.index]); //lấy dữ liệu từ file turbinesInformation.js
  c.publish("/clientInit", opt.message, { qos: 2, retain: false }, (err) => {});
};
