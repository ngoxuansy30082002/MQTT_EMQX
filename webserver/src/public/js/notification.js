$(document).ready(function () {
  $(".note-item").each(function () {
    var descriptionText = $(this).find(".note-des").text();
    if (descriptionText.includes("Pressure")) {
      $(this)
        .find("td:eq(2)")
        .css("color", "red")
        .append('<i class="fa fa-arrow-up"></i>');
    }
    if (descriptionText.includes("Speed")) {
      $(this)
        .find("td:eq(3)")
        .css("color", "red")
        .append('<i class="fa fa-arrow-up"></i>');
    }
    if (descriptionText.includes("Output power")) {
      $(this)
        .find("td:eq(4)")
        .css("color", "red")
        .append('<i class="fa fa-arrow-up"></i>');
    }
    if (descriptionText.includes("Temperature")) {
      $(this)
        .find("td:eq(1)")
        .css("color", "red")
        .append('<i class="fa fa-arrow-up"></i>');
    }
  });
});
