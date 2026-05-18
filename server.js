const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE
});

db.connect((err) => {

    if (err) {
        console.log("MYSQL ERROR:");
        console.log(err);
    } else {
        console.log("MYSQL CONECTADO");
    }

});

app.post("/guardar-pedido", (req, res) => {

    console.log("DATOS:");
    console.log(req.body);

    const nombre = req.body.nombre;
    const producto = req.body.producto;
    const tamano = req.body.tamano;
    const metodo_pago = req.body.metodo_pago;

    const sql = `
        INSERT INTO Pedidos
        (nombre_cliente, producto, tamano, metodo_pago)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [nombre, producto, tamano, metodo_pago],
        (err, result) => {

            if (err) {

                console.log("ERROR SQL:");
                console.log(err);

                return res.status(500).json({
                    mensaje: "Error SQL",
                    error: err.message
                });

            }

            return res.status(200).json({
                mensaje: "Pedido guardado correctamente"
            });

        }
    );

});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
    console.log("SERVIDOR INICIADO");
});