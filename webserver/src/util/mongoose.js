module.exports = {
  multipleMongooseToObject: function (mongooses) {
    return mongooses.map((mongoose) => mongoose.toObject());
  },
  singleMongooseToObject: function (mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
  },
  convertTo_id: function (object) {
    object._id = object.clientid;
    delete object.clientid;
    return object;
  },
  handleReqConnect: (object) => {
    object = module.exports.convertTo_id(object);
    object.statusNetwork = object.statusNetwork.replace("client.", "");
    return object;
  },
  handleReqData: (object) => {
    object.turbine_id = object.clientid;
    return object;
  },
  handleTimestamp: (object) => {
    const timestamp = new Date(object.timestamp);
    object.timestamp = timestamp;
    return object;
  },
};
