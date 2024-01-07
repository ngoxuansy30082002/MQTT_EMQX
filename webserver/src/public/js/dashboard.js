function updateStatus(text, color) {
  $("#dashboard-status").html(text);
  $("#dashboard-status").css("color", color);
}
$(document).ready(() => {
  var status = turbine.operatingStatus;

  if (status === "Active") {
    updateStatus("Active", "#2FBD2C");
    $("#switch").prop("checked", true);
  }
  if (status === "Inactive") {
    updateStatus("Inactive", "#BA2020");
    $("#switch").prop("checked", false);
  }
  if (status === "Maintenance") {
    updateStatus("Maintenance", "#BABA20");
    $("#switch").prop("disabled", true);
  }

  updateHeaderValue(datas);

  var currentCardHeader = "temperature";
  $("#header-temperature-card").on("click", () => {
    currentCardHeader = "temperature";
    updateChartData(
      $chart.data("chart"),
      datas.timestamp,
      datas.engineTemperature,
      "#E23E3E",
      "Temperature (℃)"
    );
    updateChartAvg(
      $chart_avg.data("chart"),
      dates,
      avg_temperatures,
      "#E23E3E"
    );
  });
  $("#header-pressure-card").on("click", () => {
    currentCardHeader = "pressure";
    updateChartData(
      $chart.data("chart"),
      datas.timestamp,
      datas.pressure,
      "#D96D3E",
      "Pressure (hPa)"
    );
    updateChartAvg($chart_avg.data("chart"), dates, avg_pressures, "#D96D3E");
  });

  $("#header-windspeed-card").on("click", () => {
    currentCardHeader = "windspeed";
    updateChartData(
      $chart.data("chart"),
      datas.timestamp,
      datas.wind_speed,
      "#EFCF2B",
      "Windspeed (m/s)"
    );
    updateChartAvg($chart_avg.data("chart"), dates, avg_windspeeds, "#EFCF2B");
  });

  $("#header-performance-card").on("click", () => {
    currentCardHeader = "performance";
    updateChartData(
      $chart.data("chart"),
      datas.timestamp,
      datas.power_output,
      "#2BD5EF",
      "Performance (%)"
    );
    updateChartAvg(
      $chart_avg.data("chart"),
      dates,
      avg_performances,
      "#2BD5EF"
    );
  });

  $("#customSelect").on("change", function () {
    const selectedDate = $(this).val();
    const selectedIndex = dates.indexOf(selectedDate);
    datas = allDatas[selectedIndex];
    // updateHeaderValue(datas);
    switch (currentCardHeader) {
      case "temperature":
        updateChartData(
          $chart.data("chart"),
          datas.timestamp,
          datas.engineTemperature,
          "#E23E3E",
          "Temperature (℃)"
        );
        break;
      case "pressure":
        updateChartData(
          $chart.data("chart"),
          datas.timestamp,
          datas.pressure,
          "#D96D3E",
          "Pressure (hPa)"
        );
        break;
      case "windspeed":
        updateChartData(
          $chart.data("chart"),
          datas.timestamp,
          datas.wind_speed,
          "#EFCF2B",
          "Windspeed (m/s)"
        );
        break;
      case "performance":
        updateChartData(
          $chart.data("chart"),
          datas.timestamp,
          datas.power_output,
          "#2BD5EF",
          "Performance (%)"
        );
        break;
    }
  });

  // active button
  $("#switch").on("click", () => {
    if (status === "Active") {
      updateStatus("Inactive", "#BA2020");
      $("#switch").prop("checked", false);
      statusReq(turbine._id, "Inactive");
    }
    if (status === "Inactive") {
      updateStatus("Active", "#2FBD2C");
      $("#switch").prop("checked", true);
      statusReq(turbine._id, "Active");
    }
    status = $("#dashboard-status").html();
  });
});

async function statusReq(turbine_id, status) {
  try {
    const res = await fetch(`/dashboard/status/${turbine_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        turbine_id: turbine_id,
        operatingStatus: status,
      }),
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
