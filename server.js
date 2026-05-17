const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname));

const db = mysql.createConnection({

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});

db.connect((err) => {

    if(err){
        console.log('Error conexión MySQL:', err);
    } else {
        console.log('Conectado a Railway MySQL');
    }

});

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'index.html'));

});

app.post('/guardar-pedido', (req, res) => {

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
            console.log(err);
            return res.send('Error producto');
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
                console.log(err);
                return res.send('Error tamaño');
            }

            const id_tamano = tamanoResult[0].id_tamano;

            const buscarPago = `
                SELECT id_metodo_pago
                FROM Metodos_Pago
                WHERE nombre = ?
            `;

            db.query(buscarPago, [metodo_pago], (err, pagoResult) => {

                if(err){
                    console.log(err);
                    return res.send('Error pago');
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
                            console.log(err);
                            return res.send('Error pedido');
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
                                    console.log(err);
                                    return res.send('Error detalle');
                                }

                        res.json({
                                mensaje: 'Pedido realizado correctamente',
                                nombre: nombre
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

    console.log('Servidor corriendo');

});