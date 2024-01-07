function updateHeaderValue(datas) {
  if (Array.isArray(datas.engineTemperature))
    $("#header-temperature-card .value").html(
      `${datas.engineTemperature[datas.engineTemperature.length - 1]} ℃`
    );
  else
    $("#header-temperature-card .value").html(`${datas.engineTemperature} ℃`);
  if (Array.isArray(datas.pressure))
    $("#header-pressure-card .value").html(
      `${datas.pressure[datas.pressure.length - 1]} hPa`
    );
  else $("#header-pressure-card .value").html(`${datas.pressure} hPa`);
  if (Array.isArray(datas.wind_speed))
    $("#header-windspeed-card .value").html(
      `${datas.wind_speed[datas.wind_speed.length - 1]} m/s`
    );
  else $("#header-windspeed-card .value").html(`${datas.wind_speed} m/s`);
  if (Array.isArray(datas.power_output))
    $("#header-performance-card .value").html(
      `${datas.power_output[datas.power_output.length - 1]} %`
    );
  else $("#header-performance-card .value").html(`${datas.power_output} %`);
}

function updateStatusNetwork(turbine) {
  if (turbine.statusNetwork === "connected")
    $(".header-turbine-statusNetwork").css("color", "#27C927");
  else $(".header-turbine-statusNetwork").css("color", "#C92522");
}
