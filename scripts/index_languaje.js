var lang = "es";

function changeLanguage() {
  if (lang === "es") {
    $.getJSON("en.json", function (en) {
      //$("#about_me").text(en.about_me);
    });
    lang = "en";
  } else {
    $("p").empty().append("es.about_me");
    $.getJSON("es.json", function (es) {
      $("p").empty().append("yay");
    });
    $.getJSON("url", data, function (data, textStatus, jqXHR) {});
    lang = "es";
  }
}
