const express = require('express');
const mysql = require('mysql2');
const path = require('path');

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
    database: process.env.MYSQLDATABASE,

    ssl: {
        rejectUnauthorized: false
    }

});

db.connect((err) => {

    if(err){

        console.log('ERROR CONEXIÓN MYSQL:');
        console.log(err);

    } else {

        console.log('Conectado correctamente a Railway MySQL');

    }

});

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'index.html'));

});

app.post('/guardar-pedido', (req, res) => {

    try {

        console.log("BODY RECIBIDO:");
        console.log(req.body);

        const {
            nombre,
            producto,
            tamano,
            metodo_pago
        } = req.body;

        const buscarProducto = `
            SELECT id_producto, precio
            FROM Productos
            WHERE nombre = ?
        `;

        db.query(buscarProducto, [producto], (err, productoResult) => {

            if(err){

                console.log("ERROR PRODUCTO:");
                console.log(err);

                return res.status(500).json({
                    mensaje: "Error buscando producto",
                    error: err.message
                });
            }

            if(productoResult.length === 0){

                return res.status(404).json({
                    mensaje: "Producto no encontrado",
                    producto: producto
                });
            }

            const id_producto = productoResult[0].id_producto;
            const precio = productoResult[0].precio;

            const buscarTamano = `
                SELECT id_tamano
                FROM Tamanos
                WHERE nombre = ?
            `;

            db.query(buscarTamano, [tamano], (err, tamanoResult) => {

                if(err){

                    console.log("ERROR TAMAÑO:");
                    console.log(err);

                    return res.status(500).json({
                        mensaje: "Error buscando tamaño",
                        error: err.message
                    });
                }

                if(tamanoResult.length === 0){

                    return res.status(404).json({
                        mensaje: "Tamaño no encontrado",
                        tamano: tamano
                    });
                }

                const id_tamano = tamanoResult[0].id_tamano;

                const buscarPago = `
                    SELECT id_metodo_pago
                    FROM Metodos_Pago
                    WHERE nombre = ?
                `;

                db.query(buscarPago, [metodo_pago], (err, pagoResult) => {

                    if(err){

                        console.log("ERROR PAGO:");
                        console.log(err);

                        return res.status(500).json({
                            mensaje: "Error buscando método de pago",
                            error: err.message
                        });
                    }

                    if(pagoResult.length === 0){

                        return res.status(404).json({
                            mensaje: "Método de pago no encontrado",
                            metodo_pago: metodo_pago
                        });
                    }

                    const id_metodo_pago = pagoResult[0].id_metodo_pago;

                    const insertarPedido = `
                        INSERT INTO Pedidos
                        (nombre_cliente, id_metodo_pago, total)
                        VALUES (?, ?, ?)
                    `;

                    db.query(
                        insertarPedido,
                        [nombre, id_metodo_pago, precio],
                        (err, pedidoResult) => {

                            if(err){

                                console.log("ERROR PEDIDO:");
                                console.log(err);

                                return res.status(500).json({
                                    mensaje: "Error insertando pedido",
                                    error: err.message
                                });
                            }

                            const id_pedido = pedidoResult.insertId;

                            const insertarDetalle = `
                                INSERT INTO Detalles_Pedido
                                (id_pedido, id_producto, id_tamano, cantidad, subtotal)
                                VALUES (?, ?, ?, ?, ?)
                            `;

                            db.query(
                                insertarDetalle,
                                [id_pedido, id_producto, id_tamano, 1, precio],
                                (err) => {

                                    if(err){

                                        console.log("ERROR DETALLE:");
                                        console.log(err);

                                        return res.status(500).json({
                                            mensaje: "Error insertando detalle",
                                            error: err.message
                                        });
                                    }

                                    return res.status(200).json({
                                        mensaje: "Pedido realizado correctamente"
                                    });

                                }
                            );

                        }
                    );

                });

            });

        });

    } catch(error){

        console.log("ERROR GENERAL:");
        console.log(error);

        return res.status(500).json({
            mensaje: "Error interno del servidor",
            error: error.message
        });

    }

});

app.listen(PORT, () => {

    console.log(`Servidor corriendo en puerto ${PORT}`);

});