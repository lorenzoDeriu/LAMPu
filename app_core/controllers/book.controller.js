const Book = require("../models/book.models.js");
const User = require("../models/user.model");

module.exports = {
	search: function(request, response) {
		if(!request.body) {
			response.status(400).render('error', {
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
			var userToReadList = [];
			var userReadList = [];
			if (request.user?.username) {
				User.findOne({ username: request.user.username }, (err, user) => {
					if (err) {
						response.status(500).render('error', {
							"message": "Database error"
						});
						return;
					} else {
						userToReadList.push(user.to_read_list);
						userReadList.push(user.read_list);
					}
				});
			}

			res.data.forEach( (book) => {
				book.toRead = ( userToReadList.includes(book.isbn[0].identifier) ||
								userToReadList.includes(book.isbn[0].identifier) ) 
								? true : false;

				book.read = ( userReadList.includes(book.isbn[0].identifier) ||
								userReadList.includes(book.isbn[0].identifier) ) 
								? true : false;
				console.log(book);
			});

			response.status(200).render('search', {
				search: request.body.settings,
				list: JSON.stringify(res.data)
			})
		})
	},

	viewInfoBook: function(request, response) {
		if(!request.body) {
			response.status(400).render('error', {
				"message": "content can not be empty",
			})
			return;
		}

		Book.foundByISBN(request.body.isbn).then((res) => {
			if(res.err)
				response.status(res.err.status).render('error', {
					"message": "HTTP error status" + res.err.status
				})

			response.status(200).render('infoBook_page',{
				"book": res.data
			})
		})
	}

}

