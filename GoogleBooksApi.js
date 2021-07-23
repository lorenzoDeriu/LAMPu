const Gbooks = require("google-books-search");

var title = "Homo Deus";

Gbooks.search(title, function(error, results) {
    if ( ! error ) {
        console.log(results);
    } else {
        console.log(error);
    }
});