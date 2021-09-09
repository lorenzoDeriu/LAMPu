const Query = require("../googleBooks/QueryBuilder");
const Google_Books = require("../googleBooks/SearchInfoBooks");

module.exports = {
	Book: class {
		constructor(obj) { //obj: response.body.items[i];
			this.title = obj.volumeInfo.title;
			this.authors = obj.volumeInfo.authors;
			this.publisher = obj.volumeInfo.publisher;
			this.publishedDate = obj.volumeInfo.publishedDate;
			this.categories = obj.volumeInfo.categories;
			this.isbn = obj.volumeInfo.industryIdentifiers
			this.thumbnail = obj.volumeInfo.imageLinks;
			this.language = obj.volumeInfo.language;
			this.description = obj.volumeInfo.description;
			this.pageCount = obj.volumeInfo.pageCount;
		}	
	},

	create: async function(settings) { //settings: string -•- settings: {"isbn": isbn, "inauthor": author, "intitle": title, "subject": subject}
		var query;

		if(settings.constructor === Object) query = Query.queryBuilder(new Query.Options(settings)); // advanced search
		else query = Query.queryBuilder(settings); // generic search

		response = await Google_Books.getInfo(query);
		console.log('found books: ' + response.data.length);
		if(response.err)
			return response;
		else response.data = await this.bookParser(response.data);

		return response;
	},

	foundByISBN: async function(isbn) {
		var query = Query.queryBuilder(new Query.Options({"isbn": isbn, "inauthor": null, "intitle": null}));
		var response = await Google_Books.getInfo(query);
		response.data = this.bookParser(response.data);
		return response;
	},

	bookParser: async function(rowBooksArray) {
		if(!rowBooksArray) return null;
		var array = [];

		for(let rowBook of rowBooksArray) {
			let selfLink = undefined;
			if (!rowBook.volumeInfo.industryIdentifiers) {
				selfLink = rowBook.selfLink;
			} else {
				for(let index = 0; index < rowBook.volumeInfo.industryIdentifiers.length; index++) {
					if(rowBook.volumeInfo.industryIdentifiers[index].type != "ISBN_10" && rowBook.volumeInfo.industryIdentifiers[index].type != "ISBN_13") {
						selfLink = rowBook.selfLink;
					}
				}
			}
			
			if(selfLink) {
				var res = await Google_Books.getSelfLink(selfLink);
				rowBook.volumeInfo = res.data.volumeInfo;
			}

			if(rowBook.volumeInfo.title && rowBook.volumeInfo.industryIdentifiers) {
				array.push(new this.Book(rowBook));
			}
		}

		return array;
	}

}