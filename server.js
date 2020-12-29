const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
var cors = require("cors");

require("events").EventEmitter.prototype._maxListeners = 100;

const con = mysql.createConnection({
	host: "localhost",
	port: "3306",
	user: "root",
	password: "admin",
	database: "itessentials",
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const whitelist = ["http://localhost:8080", "http://iteseentialshosted.com"];
const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
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

	con.query(
		"INSERT INTO `orders`(`userId`, `deliveryMethod`, `dateFacturare`, `metodaPlata`, `created_at`, `updated_at`) " +
			"VALUES (?,?,?,?,NOW(),NOW())",
		[userId, deliveryMethod, dateFacturare, metodaPlata],
		function (err, result, fields) {
			con.on("error", function (err) {
				console.log("MySQL ERROR", err);
			});
			res.status(200);
		}
	);
});

app.get("/carts/:id", cors(corsOptions), (req, res) => {
	const userId = parseInt(req.params.id);
	con.query(
		"SELECT * FROM carts WHERE userId=?",
		[userId],
		function (err, result, fields) {
			con.on("error", function (err) {
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

	con.query(
		"SELECT * FROM carts where userId=?",
		[userId],
		function (err, result, fields) {
			con.on("error", function (err) {
				console.log("[MySQL ERROR", err);
			});
			if (result && result.length) {
				result.forEach((order) => {
					const sql = "DELETE FROM carts WHERE userId=? AND id=?";
					con.query(sql, [userId, order.id], function (err, result) {
						if (err) throw err;
						console.log("Product deleted from chart: " + result.affectedRows);
						console.log("Deleted" + result);
					});
				});
			}
			cartProducts.forEach((product) => {
				con.query(
					"INSERT INTO `carts`(`userId`, `productId`, `quantity`,`created_at`, `updated_at`) " +
						"VALUES (?,?,?,NOW(),NOW())",
					[userId, product.productId, product.quantity],
					function (err, result, fields) {
						con.on("error", function (err) {
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

	con.query(sql, [productQuantity, userId, productId], function (err, result) {
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

	con.query(sql, [userId, productId], function (err, result) {
		if (err) throw err;
		console.log("Product deleted from chart: " + result.affectedRows);
		console.log("Deleted" + result);
		res.status(200);
		res.end("Success");
	});
});

app.get("/products", cors(corsOptions), (req, res) => {
	con.query("SELECT * FROM products", function (err, result, fields) {
		con.on("error", function (err) {
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

app.listen(3001);
