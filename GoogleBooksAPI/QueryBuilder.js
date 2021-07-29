class Options {
	constructor(isbn = "", inauthor = "", intitle = "") {
		this.isbn = standardizeString(isbn);
		this.inauthor = standardizeString(inauthor);
		this.intitle = standardizeString(intitle);
	}
}

function standardizeString(str) {
	return str.split(" ").join("+");
}

class MissingInfoError extends Error {
	constructor() {
		super();
		this.description = 'queryBuilder() received no parameters.';
	}
}

function queryBuilder(options) {
	if(options == undefined || options == "" || options == " ") throw new MissingInfoError();

	if(typeof options == 'string')
		return 'https://www.googleapis.com/books/v1/volumes?q=' + standardizeString(options);
	else {
		var query = 'https://www.googleapis.com/books/v1/volumes?q=';
		if(options.isbn != "") 
			query += "isbn:" + options.isbn + "+";
		if(options.inauthor != "") 
			query += "inauthor:" + options.inauthor + "+";
		if(options.intitle != "") 
			query += "intitle:" + options.intitle;

		return query;
	}

}

console.log(queryBuilder(new Options("", "seth godin", "marketing")))
console.log(queryBuilder(new Options("", "taleb", "il cigno nero")))
console.log(queryBuilder(new Options("9788832118483", "", "")))
console.log(queryBuilder("homo deus"))
console.log(queryBuilder("sapiens"))
