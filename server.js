// Imports for Node packages
var express = require("express"); // Handles routing
var app = express(); // Server for handling routes, the heart of our app
var axios = require("axios"); // Handles GET, POST etc request and responses
const bodyParser = require("body-parser"); // Middleware for dealing with form input data

// Express server setup (boilerplate code from the docs)
app.set("view engine", "ejs");

// BodyParser middleware setup (boilerplate code from the docs)
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

// Tells express where to find any static files like images
app.use(express.static("public"));

/// ** -- ROUTES -- ** ///

// GET Home page which renders the index.ejs template. No data needed for plain HTML.
app.get("/", function (req, res) {
	res.render("pages/index");
});

// GET static about page
app.get("/about", function (req, res) {
	res.render("pages/about");
});






// POST a new employee route
app.post("/create_employee", function (req, res) {
	// Useful for console logging the form inputs
	// console.log(console.log(req.body))
	// Example of form data for adding a new user
	var data = 
		`{"email":"${req.body.user.email}",
		"firstName":"${req.body.user.firstName}",
		"id":"${req.body.user.id}",
		"lastName":"${req.body.user.lastName}",
		"picture":"${req.body.user.picture}",
		"title":"${req.body.user.title}"}`;
		//DATA is where we input the form data for the new employee we'd like to create. 
		//REQ.BODY.USER._______ is the location of our data being inputed within the form. 

		var config = {
			method: 'post',
			url: 'https://spa-project-lab-default-rtdb.firebaseio.com/data.json',
			headers: { 
				"Content-Type": "text/plain"
			},
			data : data
		  };
		  
		  axios(config)
		  .then(function (response) {
			console.log(JSON.stringify(response.data));
		  })
		  .catch(function (error) {
			console.log(error);
		  });
		  res.redirect("/directory");
});






// GET Form to add new employee (GET the form first, then the forms "submit" button handles the POST request.
app.get("/create_employee", function (req, res) {	  
	res.render("pages/create_employee"); 
});








// GET Directory of employees, returns an array of objects from the server.
app.get("/directory", function (req, res) {

	var config = {
	method: 'get',
	url: 'https://spa-project-lab-default-rtdb.firebaseio.com/.json',
	headers: { }
	};

	axios(config)
	.then(function (response) {
	console.log(Object.entries(response.data.data));
	return Object.entries(response.data.data);
	})
	.then((employee) => {
		console.log(employee)
		res.render("pages/directory", {
			employees: employee
		});
	})
	.catch(function (error) {
	console.log(error);
	});
});








// Single Employee
// "Render" the person view here!
app.get("/directory/:uid", function (req, res) {
 let id = req.params.uid;

	var config = {
		method: 'get',
		url: `https://spa-project-lab-default-rtdb.firebaseio.com//data/${id}.json`,
		headers: { }
	  };
	  
	  axios(config)
	  .then((response) => {
		let dataFromAPI = response.data;
		return dataFromAPI
	  })
	  .then((response) => {
		res.render("pages/person",{ 
			employee: response });
		})
	  .catch(function (error) {
		console.log(error);
	  });
});








// DELETE user
app.get("/delete/:uid", function (req, res) {
	let id = req.params.uid;

		var config = {
			method: 'delete',
			url: `https://spa-project-lab-default-rtdb.firebaseio.com/data/${id}.json`,
			headers: { }
		  };
		  
		  axios(config)
		  .then((response) => {
			let dataFromAPI = response.data;
			return dataFromAPI
		  })

		  .catch(function (error) {
			console.log(error);
		  });

		  res.redirect("/directory");
});








//UPDATE User
app.post("/update", function(req, res) {
	let pattern = /-\w{3,}\D\w+/g;
	let idLocation = req.headers.referer;
	let id = pattern.exec(idLocation)
	//Our RegEx is used to grab the id from within the object Headers: Referer
	var data = `{"firstName":"${req.body.user.firstName}"}`;

	var config = {
		method: 'patch',
		url: `https://spa-project-lab-default-rtdb.firebaseio.com/data/${id}.json`,
		headers: { 
			"Content-Type": "text/plain"
		},
		data : data
	  };
	  
	  axios(config)
	  .then(function (response) {

	  })
	  .catch(function (error) {
		console.log(error);
	  });
	res.redirect("/directory");
});







app.get("/update/:uid", function (req, res) {
	let id = req.params.uid;
	
	var config = {
		method: 'get',
		url: `https://spa-project-lab-default-rtdb.firebaseio.com/data/${id}.json`,
		headers: { }
	  };
	  axios(config)
	  .then((response) => {
		let dataFromAPI = response.data;
		return dataFromAPI
	  })
	  .then((response) => {
		res.render("pages/update",{ 
			employee: response });
		})
	  .catch(function (error) {
		console.log(error);
	  }); 
});


// Express's .listen method is the final part of Express that fires up the server on the assigned port and starts "listening" for request from the app! (boilerplate code from the docs)

app.listen(2001);
console.log("Port 2001 is open");


