const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos en Render
// Render nos dará la URL de la base de datos en la variable DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Requerido por Render
    }
});

// Configurar Express para entender los datos del formulario y servir los archivos HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para recibir el formulario
app.post('/guardar-pedido', async (req, res) => {
    // Extraer los datos que mandó el HTML
    const { nombre, producto, tamano, metodo_pago } = req.body;

    try {
        // 1. Buscar los IDs correspondientes en la base de datos
        const prodResult = await pool.query('SELECT id_producto, precio FROM Productos WHERE nombre = $1', [producto]);
        const tamResult = await pool.query('SELECT id_tamano FROM Tamanos WHERE nombre = $1', [tamano]);
        const pagoResult = await pool.query('SELECT id_metodo_pago FROM Metodos_Pago WHERE nombre = $1', [metodo_pago]);

        // Verificar que todo exista
        if (prodResult.rows.length === 0 || tamResult.rows.length === 0 || pagoResult.rows.length === 0) {
            return res.send("Error: Producto, tamaño o método de pago no encontrado.");
        }

        const id_producto = prodResult.rows[0].id_producto;
        const precio_producto = prodResult.rows[0].precio;
        const id_tamano = tamResult.rows[0].id_tamano;
        const id_metodo_pago = pagoResult.rows[0].id_metodo_pago;

        // 2. Insertar el Pedido (Cabecera)
        const pedidoQuery = `
            INSERT INTO Pedidos (nombre_cliente, id_metodo_pago, total) 
            VALUES ($1, $2, $3) RETURNING id_pedido
        `;
        const pedidoResult = await pool.query(pedidoQuery, [nombre, id_metodo_pago, precio_producto]);
        const id_pedido = pedidoResult.rows[0].id_pedido;

        // 3. Insertar el Detalle del Pedido
        const detalleQuery = `
            INSERT INTO Detalles_Pedido (id_pedido, id_producto, id_tamano, cantidad, subtotal) 
            VALUES ($1, $2, $3, $4, $5)
        `;
        await pool.query(detalleQuery, [id_pedido, id_producto, id_tamano, 1, precio_producto]);

        // 4. Mostrar mensaje de éxito y regresar al inicio
        res.send(`
            <div style="text-align:center; padding: 50px; font-family: sans-serif;">
                <h2 style="color: #6F4E37;">¡Pedido recibido con éxito, ${nombre}!</h2>
                <p>Tu <b>${producto}</b> se está preparando.</p>
                <a href="/" style="display:inline-block; padding:10px 20px; background:#6F4E37; color:white; text-decoration:none; border-radius:5px;">Volver al inicio</a>
            </div>
        `);

    } catch (error) {
        console.error("Error al guardar en la base de datos:", error);
        res.status(500).send("Ocurrió un error al procesar tu pedido. Intenta nuevamente.");
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});