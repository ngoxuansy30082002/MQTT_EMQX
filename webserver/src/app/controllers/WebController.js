const Turbine = require("../models/Turbine");
const Data = require("../models/Data");
const Maintenance = require("../models/Maintenance");
const Alert = require("../models/alert");
const moment = require("moment");
const { clientPublish } = require("../../util/mqtt");

const {
  multipleMongooseToObject,
  singleMongooseToObject,
} = require("../../util/mongoose");
class WebController {
  //[GET] /notification
  async notification(req, res) {
    try {
      const Alerts = multipleMongooseToObject(
        await Alert.find({}).sort({ timestamp: -1 })
      );
      res.render("pages/notification", { Alerts });
    } catch (error) {
      console.log(error);
    }
  }

  //[GET] /list
  async list(req, res) {
    try {
      const turbines = multipleMongooseToObject(await Turbine.find({}));

      //Lấy giá trị mới nhất của từng id để đẩy vào header
      var lastestDatas = [];
      for (const turbine of turbines) {
        let lastestData = await Data.find({ turbine_id: turbine._id })
          .sort({ timestamp: -1 })
          .limit(1);
        lastestData = singleMongooseToObject(lastestData[0]);
        lastestDatas.push(lastestData);
      }
      res.render("pages/list", {
        turbines: turbines,
        lastestDatas,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //[GET] /dashboard/:id
  async dashboard(req, res) {
    try {
      const turbine = await Turbine.findOne({ _id: req.params._id }).exec();
      const maintenance = await Maintenance.find({
        _id: { $in: turbine.maintenanceHistory },
      });
      const endDate = moment().utc().endOf("day"); // Lấy thời điểm cuối ngày hôm nay ở UTC
      const startDate = moment().utc().subtract(6, "days").startOf("day"); // Lấy thời điểm đầu ngày của 7 ngày trước ở UTC
      const arrDate = Array.from({ length: 8 }, (_, i) =>
        startDate.clone().add(i, "days").toDate()
      );

      var allDatas = await Data.aggregate([
        {
          $match: {
            turbine_id: req.params._id,
            timestamp: {
              $gte: new Date(startDate),
              $lt: new Date(endDate),
            },
          },
        },
        {
          $bucket: {
            groupBy: "$timestamp",
            boundaries: arrDate,
            default: "Other",
            output: {
              engineTemperature: { $push: "$engineTemperature" },
              pressure: { $push: "$pressure" },
              wind_speed: { $push: "$wind_speed" },
              power_output: { $push: "$power_output" },
              timestamp: { $push: "$timestamp" },
              avg_temperature: { $avg: "$engineTemperature" },
              avg_pressure: { $avg: "$pressure" },
              avg_wind_speed: { $avg: "$wind_speed" },
              avg_power_output: { $avg: "$power_output" },
            },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            engineTemperature: 1,
            pressure: 1,
            wind_speed: 1,
            power_output: 1,
            timestamp: 1,
            avg_temperature: 1,
            avg_pressure: 1,
            avg_wind_speed: 1,
            avg_power_output: 1,
          },
        },
      ]);
      //chuyển sang định dạng giờ phút
      allDatas.forEach((data) => {
        data.timestamp = data.timestamp.map(function (utc) {
          var utcMoment = moment(utc, "YYYY-MM-DDTHH:mm:ss.SSSZ");
          return utcMoment.format("HH:mm");
        });
        data.date = moment(data.date, "YYYY-MM-DDTHH:mm:ss.SSSZ").format(
          "DD/MM/YYYY"
        );
      });
      // console.log(allDatas);
      res.render("pages/dashboard", {
        allDatas: allDatas,
        turbine: singleMongooseToObject(turbine),
        maintenance: multipleMongooseToObject(maintenance),
      });
    } catch (error) {
      console.log(error);
    }
  }

  // [POST] /maintenance/:id
  async maintenance(req, res) {
    try {
      const turbine = await Turbine.findOne({ _id: req.params._id });
      const maintenanceHistory = turbine.maintenanceHistory;

      // nếu số lượng maintenanceHistory sắp vượt quá 5 thì xóa mục cũ nhất
      if (maintenanceHistory.length === 5) {
        await Maintenance.deleteOne({ _id: maintenanceHistory[0] });
        await Turbine.updateOne(
          { _id: req.params._id },
          { $pop: { maintenanceHistory: -1 } }
        );
      }

      const maintenance = await Maintenance.create(req.body);
      await Turbine.updateOne(
        { _id: req.params._id },
        { $push: { maintenanceHistory: maintenance._id } }
      );
      res.redirect("back");
    } catch (error) {
      console.log(error);
    }
  }

  //[GET] /table/:_id
  async table(req, res) {
    try {
      const turbine = await Turbine.findOne({ _id: req.params._id }).exec();
      const endDate = moment().utc().endOf("day"); // Lấy thời điểm cuối ngày hôm nay ở UTC
      const startDate = moment().utc().subtract(6, "days").startOf("day"); // Lấy thời điểm đầu ngày của 7 ngày trước ở UTC
      var arrDate = [];

      //Tìm tất cả dữ liệu của turbine_id
      var allDatas = await Data.aggregate([
        {
          $match: {
            turbine_id: req.params._id,
            timestamp: {
              $gte: new Date(startDate),
              $lt: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%d/%m/%Y", date: "$timestamp" } },
            data: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            data: 1,
          },
        },
      ]);

      // Lấy mảng các ngày và sort nó giảm dần
      allDatas.forEach((allData) => {
        arrDate.push(allData.date);
      });
      function parseDate(str) {
        var parts = str.split("/");
        return new Date(parts[2], parts[1] - 1, parts[0]);
      }
      arrDate.sort(function (a, b) {
        return parseDate(b) - parseDate(a);
      });

      //Tìm dữ liệu theo ngày
      const dateSelect = req.query.dateSelect || arrDate[0];
      function findDataByDate(dateToFind) {
        return allDatas.find(function (data) {
          return data.date === dateToFind;
        });
      }
      var allData = findDataByDate(dateSelect);

      res.render("pages/table", {
        turbine: singleMongooseToObject(turbine),
        arrDate,
        allData,
      });
    } catch (error) {
      console.log(error);
    }
  }
  //[GET] /profile
  async about(req, res) {
    try {
      res.render("pages/about");
    } catch (error) {
      console.log(error);
    }
  }
  //[PUT] /dashboard/status/:_id
  async updateStatus(req, res) {
    try {
      await Turbine.updateOne(
        { _id: req.body.turbine_id },
        { operatingStatus: req.body.operatingStatus }
      );
      clientPublish(`/control/${req.body.turbine_id}`, {
        turbine_id: req.body.turbine_id,
        operatingStatus: req.body.operatingStatus,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new WebController();
