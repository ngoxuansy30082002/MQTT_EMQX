const Turbine = require("../models/Turbine");
const Data = require("../models/Data");
const Alert = require("../models/alert");
const { sendMail } = require("../../util/mailer");

const {
  handleReqConnect,
  convertTo_id,
  handleReqData,
  handleTimestamp,
} = require("../../util/mongoose");
class EMQXController {
  //[PUT] /emqx/clientData
  async clientData(req, res) {
    // console.log(req.body);
    try {
      // const _id = req.body.clientid;
      const message = handleTimestamp(handleReqData(req.body));
      await Data.insertMany([message]); // đẩy dữ liệu vào datas collection
      // await Turbine.updateOne({ _id: _id }, { $push: { datas: message._id } }); // cầm cái _id của datas collection ném vào mảng datas để lưu trữ các document data liên quan
      const thresholdValues = {
        engineTemperatureThreshold: 68,
        pressureThreshold: 1018,
        windSpeedThreshold: 23,
        powerOutputThreshold: 88,
      };

      var description = "exceeds allowable limit!!!";

      if (
        message.engineTemperature > thresholdValues.engineTemperatureThreshold
      ) {
        description = "Temperature " + description;
      }
      if (message.pressure > thresholdValues.pressureThreshold) {
        description = "Pressure " + description;
      }
      if (message.wind_speed > thresholdValues.windSpeedThreshold) {
        description = "Speed " + description;
      }
      if (message.power_output > thresholdValues.powerOutputThreshold) {
        description = "Output power " + description;
      }
      if (description !== "exceeds allowable limit!!!") {
        var notice = {
          turbine_id: message.turbine_id,
          engineTemperature: message.engineTemperature,
          pressure: message.pressure,
          wind_speed: message.wind_speed,
          power_output: message.power_output,
          timestamp: message.timestamp,
          description: description,
        };
        await Alert.insertMany([notice]);
        var subject = "MQTT Alert: " + description;
        var text = `
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; text-transform: uppercase;">Information about system parameters!!!</h2>
                    <p>Hello,</p>
                    <p>Your device's parameters have exceeded the preset limit.</p>

                    <hr style="border: 0.5px solid #ddd;">

                    <h3 style="color: #333;">Details:</h3>
                    <ul>
                        <li><strong>Turbine ID : </strong> ${message.turbine_id}</li>
                        <li><strong>Time: </strong> ${message.timestamp}</li>
                        <li><strong>Temperature: </strong> ${message.engineTemperature} ℃</li>
                        <li><strong>Pressure: </strong> ${message.pressure} hPa</li>
                        <li><strong>Wind speed: </strong> ${message.wind_speed} m/s</li>
                        <li><strong>Power output: </strong> ${message.power_output} %</li>
                    </ul>

                    <hr style="border: 0.5px solid #ddd;">

                    <p>Please check the parameters to ensure the system operates stably and effectively!.</p>
                    <p>Best regards,</p>
                    <p>MQTT dashboard</p>
                </div>
            </body>
        `;
        sendMail("lephamcong.ete.dut@gmail.com", subject, text);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //[POST] /emqx/connectStatus
  async connectStatus(req, res) {
    try {
      const message = handleReqConnect(req.body); // xử lý lại request cho chuẩn (VD: { status: 'disconnected', _id: 'QN001' })
      const findResult = await Turbine.findById(message._id).exec();
      if (findResult != null)
        await Turbine.updateOne({ _id: message._id }, message);
      else await Turbine.create(message);
      // res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  }
  //[POST] /emqx/init
  async init(req, res) {
    try {
      const message = convertTo_id(req.body); // xử lí lại thành _id
      // có thay đổi 1 chút ở Model, maintenanceHistory ko truyền lên từ Src nữa
      // mà sẽ được nhập từ web, nên cần xóa trường maintenanceHistory
      // ở tin nhắn truyền lên, để tránh bị lỗi
      delete message.maintenanceHistory;
      await Turbine.updateOne({ _id: message._id }, message);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new EMQXController();
