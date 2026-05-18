const express = require("express");
const mysql = require("mysql2");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE
});

db.connect((err) => {

    if (err) {
        console.log("ERROR MYSQL:");
        console.log(err);
    } else {
        console.log("MYSQL CONECTADO");
    }

});

app.post("/guardar-pedido", (req, res) => {

    console.log(req.body);

    const {
        nombre,
        producto,
        tamano,
        metodo_pago
    } = req.body;

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

                console.log(err);

                return res.status(500).json({
                    mensaje: "Error guardando pedido"
                });

            }

            return res.json({
                mensaje: "Pedido guardado correctamente"
            });

        }
    );

});

app.listen(PORT, () => {
    console.log("Servidor corriendo");
});