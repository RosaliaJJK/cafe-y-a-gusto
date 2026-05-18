const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

    if(err){
        console.log(err);
    } else {
        console.log("MYSQL CONECTADO");
    }

});

app.post("/guardar-pedido", (req, res) => {

    console.log(req.body);

    const sql = `
        INSERT INTO Pedidos
        (nombre_cliente, producto, tamano, metodo_pago)
        VALUES (?, ?, ?, ?)
    `;

    const valores = [
        req.body.nombre,
        req.body.producto,
        req.body.tamano,
        req.body.metodo_pago
    ];

    db.query(sql, valores, (err, result) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                mensaje: "Error guardando"
            });

        }

        return res.json({
            mensaje: "Pedido guardado correctamente"
        });

    });

});

app.listen(PORT, () => {
    console.log("Servidor iniciado");
});