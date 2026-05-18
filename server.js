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
    database: process.env.MYSQL_DATABASE,

    ssl: {
        rejectUnauthorized: false
    }

});
db.connect((err) => {

    if(err){
        console.log('Error conexión MySQL:', err);
    } else {
        console.log('Conectado a Railway MySQL');
    }

});

console.log(process.env.MYSQLHOST);
console.log(process.env.MYSQLPORT);
console.log(process.env.MYSQLUSER);
console.log(process.env.MYSQL_DATABASE);

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'index.html'));

});

app.post('/guardar-pedido', (req, res) => {

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
            console.log("Error producto:", err);

            return res.status(500).json({
                mensaje: "Error en la base de datos producto"
            });
        }

        if(productoResult.length === 0){

            console.log("Producto NO encontrado:", producto);

            return res.status(404).json({
                mensaje: "Producto no encontrado en MySQL"
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

                console.log("Error tamaño:", err);

                return res.status(500).json({
                    mensaje: "Error tamaño"
                });
            }

            if(tamanoResult.length === 0){

                return res.status(404).json({
                    mensaje: "Tamaño no encontrado"
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

                    console.log("Error pago:", err);

                    return res.status(500).json({
                        mensaje: "Error método pago"
                    });
                }

                if(pagoResult.length === 0){

                    return res.status(404).json({
                        mensaje: "Método de pago no encontrado"
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

                            console.log("Error pedido:", err);

                            return res.status(500).json({
                                mensaje: "Error insertando pedido"
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

                                    console.log("Error detalle:", err);

                                    return res.status(500).json({
                                        mensaje: "Error insertando detalle"
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

});

app.listen(PORT, () => {

    console.log(`Servidor corriendo en puerto ${PORT}`);

});