const Book = require("../models/book.models.js")

module.exports = {
	search: function(request, response) {
		if(!request.body) {
			response.status(400).send({
				"message": "content can not be empty",
			})
			return;
		}

		Book.create(request.body.settings).then((res) => {
			if(res.err) {
				response.status(res.err.status).render('error', {
					"message": "HTTP error status " + res.err.status
				})
				return;
			}

			response.status(200).render('search_page', {
				"bookList": res.data
			})
		})
	},

	viewInfoBook: function(request, response) {
		if(!request.body) {
			response.status(400).send({
				"message": "content can not be empty",
			})
			return;
		}

		Book.foundByISBN(request.body.isbn).then((res) => {
			if(res.err)
				response.status(res.err.status).send({
					"message": "HTTP error status" + res.err.status;
				})

			response.status(200).render('infoBook_page',{
				"book": res.data
			})
		})
	}

}
