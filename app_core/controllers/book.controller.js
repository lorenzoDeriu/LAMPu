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

		Book.create(request.body.settings).then(async (res) => {
			if(res.err) {
				response.status(res.err.status).render('error', {
					"message": "HTTP error status " + res.err.status,
					"error": res.err
				})
				return;
			}

			var userToReadList = [];
			var userReadList = [];
			if (request.user?.username) {
				await User.findOne({ username: request.user.username }, (err, user) => {
					if (err) {
						response.status(500).render('error', {
							"message": "Database error",
							"error": err
						});
						return;
					} else {
						userToReadList = user.to_read_list;
						userReadList = user.read_list;
					}
				});
			}
			
			res.data.forEach( (book) => {
				book.toRead = ( userToReadList.includes(book.isbn[0].identifier) ||
								userToReadList.includes(book.isbn[1]?.identifier) ) 
								? true : false;

				book.read = ( userReadList.includes(book.isbn[0].identifier) ||
								userReadList.includes(book.isbn[1]?.identifier) ) 
								? true : false;
			});

			response.status(200).render('search', {
				name: request.user?.username,
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
					"message": "HTTP error status" + res.err.status,
					"error": res.err
				})

			response.status(200).render('infoBook',{
				"name": request.user.username,
				"book": res.data
			})
		})
	}

}

