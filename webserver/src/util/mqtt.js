const mqtt = require("mqtt");
const protocol = "mqtt";
const host = "49.236.210.65";
const port = "1883";
const brokerUrl = `${protocol}://emqx@${host}:${port}/mqtt`;
var client;

const connectToBroker = (clientID) =>
  new Promise((resolve, reject) => {
    const c = mqtt.connect(brokerUrl, {
      clientId: clientID,
    });
    c.on("connect", () => resolve(c));
    c.on("error", (err) => reject(err));
  });

const clientPublish = (topic, message) => {
  client.publish(
    topic,
    JSON.stringify(message),
    { qos: 2, retain: false },
    (err) => {}
  );
};
const startMQTTClient = async () => {
  try {
    client = await connectToBroker("web-dashboard");
    console.log("MQTTS connect successfully");
    // console.log(client);
  } catch (error) {
    console.log(error);
  }
};
module.exports = { startMQTTClient, clientPublish };
