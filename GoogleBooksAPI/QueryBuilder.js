module.exports = { 
	Options: class {
		constructor(settings) {
			if(settings.isbn == null && settings.inauthor == null && settings.intitle == null) 
				throw new this.MissingInfoError();

			this.isbn = this.standardizeString(settings.isbn);
			this.inauthor = this.standardizeString(settings.inauthor);
			this.intitle = this.standardizeString(settings.intitle);
		}
	},

	queryBuilder: function(options) {
		if(options == undefined || options == "" || options == " ") throw new this.MissingInfoError();

		if(typeof options == 'string')
			return 'https://www.googleapis.com/books/v1/volumes?q=' + this.standardizeString(options);
		else {
			var query = 'https://www.googleapis.com/books/v1/volumes?q=';
			if(options.isbn) 
				query += "isbn:" + options.isbn + "+";
			if(options.inauthor) 
				query += "inauthor:" + options.inauthor + "+";
			if(options.intitle) 
				query += "intitle:" + options.intitle;

			return query;
		},

		MissingInfoError: class extends Error {
			constructor() {
				super();
				this.description = 'queryBuilder() received no parameters.';
			}
		},

		standardizeString: function(str) {
			if(str != null) return str.split(" ").join("+");
			return null;
		}
	}
}




