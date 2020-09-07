var lang = "es";

function loadLanguage(lg) {
  lang = lg;
  var lj = `../languages/${lg}.json`; // load dictionary for specific language
  $.getJSON(lj, function (id) {
    // load the json file
    $("#spanish").text(id.spanish); // load all language changes
    $("#english").text(id.english);
    $("#title").text(id.title);
    $("#about_me").text(id.about_me);
    $("#language-switch-inner").attr("content-before", id.spanish);
    $("#language-switch-inner").attr("content-after", id.english);
  });
}

function changeLanguage() {
  if (lang === "es") {
    loadLanguage("en");
  } else {
    loadLanguage("es");
  }
}
