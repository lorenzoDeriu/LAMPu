module.exports = { 
	Options: class {
		constructor(settings) {
			if(settings.isbn == null && settings.inauthor == null && settings.intitle == null && settings.subject == null) 
				throw new this.MissingInfoError();

			this.isbn = standardizeString(settings.isbn);
			this.inauthor = standardizeString(settings.inauthor);
			this.intitle = standardizeString(settings.intitle);
			this.subject = standardizeString(settings.subject);
		}
	},

	queryBuilder: function(options) {
		if(options == undefined || options == "" || options == " ") throw new this.MissingInfoError();

		if(typeof options == 'string')
			return 'https://www.googleapis.com/books/v1/volumes?q=' + standardizeString(options);
		else {
			var query = 'https://www.googleapis.com/books/v1/volumes?q=';
			if(options.isbn) 
				query += "isbn:" + options.isbn + "+";
			if(options.inauthor) 
				query += "inauthor:" + options.inauthor + "+";
			if(options.intitle) 
				query += "intitle:" + options.intitle + "+";
			if(options.subject)
				query += "subject" + options.subject;

			return query + "&maxResult=40";
		}
	},

	MissingInfoError: class extends Error {
		constructor() {	
			super();
			this.description = 'queryBuilder() received no parameters.';
		}
	},
}


standardizeString = function(string) {
	if(string != null) return string.split(" ").join("+");
	return null;
}