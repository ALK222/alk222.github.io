function change404language() {
    var lj = `../languages/es.json`;
    if (!window.navigator.language.includes("es-")) {
        lj = `../languages/en.json`; // load dictionary for specific language
    }
    $.getJSON(lj, function (id) {
        // load the json file
        $("#title").text(id.title_404); // load all language changes
        $("#err_msj").text(id.err_msj);
        $("#desc").text(id.desc_404);
        $("#home-button").text(id.home_button_404);
    });
}
