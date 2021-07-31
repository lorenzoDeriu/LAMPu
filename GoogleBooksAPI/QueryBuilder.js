module.exports = { 
	Options: class {
		constructor(settings) {
			if(settings.isbn == null && settings.inauthor == null && settings.intitle == null) 
				throw new MissingInfoError();

			this.isbn = standardizeString(settings.isbn);
			this.inauthor = standardizeString(settings.inauthor);
			this.intitle = standardizeString(settings.intitle);
		}
	},

	MissingInfoError: class extends Error {
		constructor() {
			super();
			this.description = 'queryBuilder() received no parameters.';
		}
	},

	queryBuilder: function(options) {
		if(options == undefined || options == "" || options == " ") throw new MissingInfoError();

		if(typeof options == 'string')
			return 'https://www.googleapis.com/books/v1/volumes?q=' + standardizeString(options);
		else {
			var query = 'https://www.googleapis.com/books/v1/volumes?q=';
			if(options.isbn) 
				query += "isbn:" + options.isbn + "+";
			if(options.inauthor) 
				query += "inauthor:" + options.inauthor + "+";
			if(options.intitle) 
				query += "intitle:" + options.intitle;

			return query;
		}
	}
}

function standardizeString(str) {
	if(str != null) return str.split(" ").join("+");
	return null;
}