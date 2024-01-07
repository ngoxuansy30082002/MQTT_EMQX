$(document).ready(() => {
  updateHeaderValue(lastestData);
  $("#header-turbine-id").html(`ID: ${turbines[0]._id}`);
  updateStatusNetwork(turbines[0]);
  $(".list-turbine-item").first().addClass("active");

  $(".list-turbine-item").on("click", function () {
    $(".list-turbine-item").removeClass("active");
    $(this).addClass("active");

    var turbineId = $(this).find(".text-sm").text();
    $("#header-turbine-id").html(`ID: ${turbineId}`);
    const index = lastestDatas.findIndex(
      (item) => item.turbine_id === turbineId
    );
    lastestData = lastestDatas[index];
    updateHeaderValue(lastestData);
    updateStatusNetwork(turbines[index]);
  });
});
