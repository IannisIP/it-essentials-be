const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
var cors = require("cors");

require("events").EventEmitter.prototype._maxListeners = 100;

const pool = mysql.createPool({
	host: "eu-cdbr-west-03.cleardb.net",
	port: "3306",
	user: "b53d1b77b77251",
	password: "ad885c10",
	database: "heroku_af3913d320e405e",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

pool.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const whitelist = [
	"http://localhost:8080",
	"https://itessentials-basic-web-app.herokuapp.com",
	"https://it-essentials-basic-backend.herokuapp.com",
];
const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS, origin: " + origin));
		}
	},
};

app.get("/", cors(corsOptions), (req, res, next) => {
	console.log("Test");
	res.send("<h1>Some html</h1>");
});

app.post("/orders", cors(corsOptions), (req, res) => {
	const body = req.body;
	const userId = body.userId;
	const deliveryMethod = body.deliveryMethod;
	const dateFacturare = body.dateFacturare;
	const metodaPlata = body.metodaPlata;

	pool.query(
		"INSERT INTO `orders`(`userId`, `deliveryMethod`, `dateFacturare`, `metodaPlata`, `created_at`, `updated_at`) " +
			"VALUES (?,?,?,?,NOW(),NOW())",
		[userId, deliveryMethod, dateFacturare, metodaPlata],
		function (err, result, fields) {
			pool.on("error", function (err) {
				console.log("MySQL ERROR", err);
			});
			res.status(200);
		}
	);
});

app.get("/carts/:id", cors(corsOptions), (req, res) => {
	const userId = parseInt(req.params.id);
	pool.query(
		"SELECT * FROM carts WHERE userId=?",
		[userId],
		function (err, result, fields) {
			pool.on("error", function (err) {
				console.log("[MySQL ERROR]", err);
			});
			if (result && result.length) {
				console.log(result);
				res.json(result);
			} else {
				res.json([]);
			}
		}
	);
});

app.post("/carts", cors(corsOptions), (req, res) => {
	const body = req.body;
	const userId = body.userId;
	const cartProducts = body.products;

	pool.query(
		"SELECT * FROM carts where userId=?",
		[userId],
		function (err, result, fields) {
			pool.on("error", function (err) {
				console.log("[MySQL ERROR", err);
			});
			if (result && result.length) {
				result.forEach((order) => {
					const sql = "DELETE FROM carts WHERE userId=? AND id=?";
					pool.query(sql, [userId, order.id], function (err, result) {
						if (err) throw err;
						console.log("Product deleted from chart: " + result.affectedRows);
						console.log("Deleted" + result);
					});
				});
			}
			cartProducts.forEach((product) => {
				pool.query(
					"INSERT INTO `carts`(`userId`, `productId`, `quantity`,`created_at`, `updated_at`) " +
						"VALUES (?,?,?,NOW(),NOW())",
					[userId, product.productId, product.quantity],
					function (err, result, fields) {
						pool.on("error", function (err) {
							console.log("MySQL ERROR", err);
						});
						console.log("Added cart" + result);
						res.status(200);
						res.end("Success");
					}
				);
			});
		}
	);
});

app.put("/carts", cors(corsOptions), (req, res) => {
	const body = req.body;
	const userId = body.userId;
	const productQuantity = body.quantity;
	const productId = body.productId;

	const sql =
		"UPDATE carts SET quantity=? , updated_at=NOW() WHERE userId=? && productId=?";

	pool.query(sql, [productQuantity, userId, productId], function (err, result) {
		if (err) throw err;
		console.log("Cart updated: " + result.affectedRows);
		console.log("Updated" + result);
		res.status(200);
		res.end("Success");
	});
});

app.delete("/carts", cors(corsOptions), (req, res) => {
	const body = req.body;
	const userId = body.userId;
	const productId = body.productId;

	const sql = "DELETE FROM carts WHERE userId=? && productId=?";

	pool.query(sql, [userId, productId], function (err, result) {
		if (err) throw err;
		console.log("Product deleted from chart: " + result.affectedRows);
		console.log("Deleted" + result);
		res.status(200);
		res.end("Success");
	});
});

app.get("/products", cors(), (req, res) => {
	pool.query("SELECT * FROM products", function (err, result, fields) {
		pool.on("error", function (err) {
			console.log("[MySQL ERROR]", err);
		});
		if (result && result.length) {
			console.log(result);
			res.status(200);
			res.json(result);
		} else {
			res.status(200);
			res.json([]);
		}
	});
});

const port = process.env.PORT || 3001;

app.listen(port, () => console.log("Server started."));
