-- Crear la base de datos y usarla
CREATE DATABASE CafeAromaDulce;
USE CafeAromaDulce;

-- ==========================================
-- CREACIÓN DE TABLAS
-- ==========================================

-- Tabla de Categorías (Para los optgroups del menú)
CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de Productos
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    imagen_url VARCHAR(255),
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria)
);

-- Tabla de Promociones
CREATE TABLE Promociones (
    id_promocion INT AUTO_INCREMENT PRIMARY KEY,
    descripcion TEXT NOT NULL,
    activa BOOLEAN DEFAULT TRUE
);

-- Tabla de Tamaños (Del formulario)
CREATE TABLE Tamanos (
    id_tamano INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL
);

-- Tabla de Métodos de Pago (Del formulario)
CREATE TABLE Metodos_Pago (
    id_metodo_pago INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de Pedidos (La cabecera del formulario)
CREATE TABLE Pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    id_metodo_pago INT,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2),
    FOREIGN KEY (id_metodo_pago) REFERENCES Metodos_Pago(id_metodo_pago)
);

-- Tabla de Detalles del Pedido (El cuerpo del formulario)
CREATE TABLE Detalles_Pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_producto INT,
    id_tamano INT,
    cantidad INT DEFAULT 1,
    subtotal DECIMAL(10, 2),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto),
    FOREIGN KEY (id_tamano) REFERENCES Tamanos(id_tamano)
);


-- ==========================================
-- INSERCIÓN DE DATOS INICIALES
-- ==========================================

-- Insertar Categorías
INSERT INTO Categorias (nombre) VALUES 
('Cafés'), 
('Frappés'), 
('Snacks & Croissants'), 
('Combos');

-- Insertar Tamaños
INSERT INTO Tamanos (nombre) VALUES 
('Chico'), 
('Mediano'), 
('Grande');

-- Insertar Métodos de Pago
INSERT INTO Metodos_Pago (nombre) VALUES 
('Efectivo'), 
('Tarjeta');

-- Insertar Promociones del Mes
INSERT INTO Promociones (descripcion) VALUES 
('2x1 en Frappés todas las tardes y Combos de Desayuno desde $75.'),
('Viernes de Frappé: todos a $59'),
('Frappé grande al precio de chico'),
('2 cafés americanos por $70'),
('Café + pan dulce por $65'),
('Refill de americano por $20'),
('Lunes de Latte: todos al 20%'),
('Combo desayuno desde $75 antes de las 12 PM'),
('Combo pareja con descuento los domingos'),
('Compra un combo y agrega un postre por $20'),
('Martes estudiantil: 15% con credencial'),
('Tarjeta de cliente frecuente: "Compra 5 cafés y el 6° gratis"'),
('Happy Hour de 5 PM a 7 PM'),
('Miércoles de snacks al 2x1');

-- Insertar Productos (Asignando el ID de categoría correspondiente)

-- 1. Cafés (id_categoria = 1)
INSERT INTO Productos (id_categoria, nombre, precio, imagen_url) VALUES 
(1, 'Capuchino', 55.00, 'Imagenes/capuchino.jpg'),
(1, 'Latte Vainilla', 60.00, 'Imagenes/latte-vainilla.jpg'),
(1, 'Latte Caramelo', 65.00, 'Imagenes/latte-caramelo.jpg'),
(1, 'Moka', 68.00, 'Imagenes/moka.jpg'),
(1, 'Americano', 45.00, 'Imagenes/americano.jpg'),
(1, 'Espresso Doble', 40.00, 'Imagenes/espresso-doble.jpg'),
(1, 'Café Helado', 60.00, 'Imagenes/cafe-helado.jpg'),
(1, 'Latte Frío', 70.00, 'Imagenes/latte-frio.jpg'),
(1, 'Dirty Chai', 75.00, 'Imagenes/dirty-chai.jpg'),
(1, 'Matcha Latte', 75.00, 'Imagenes/matcha-latte.jpg'),
(1, 'Chocolate Caliente', 55.00, 'Imagenes/chocolate-caliente.jpg'),
(1, 'Café Avellana', 68.00, 'Imagenes/cafe-avellana.jpg'),
(1, 'Café Oreo', 72.00, 'Imagenes/cafe-oreo.jpg');

-- 2. Frappés (id_categoria = 2)
INSERT INTO Productos (id_categoria, nombre, precio, imagen_url) VALUES 
(2, 'Frappé Cookies', 65.00, 'Imagenes/frappe-cookies.jpg'),
(2, 'Frappé Oreo', 70.00, 'Imagenes/frappe-oreo.jpg'),
(2, 'Frappé Moka', 72.00, 'Imagenes/frappe-moka.jpg'),
(2, 'Frappé Caramelo', 72.00, 'Imagenes/frappe-caramelo.jpg'),
(2, 'Frappé Cajeta', 75.00, 'Imagenes/frappe-cajeta.jpg'),
(2, 'Frappé Mazapán', 75.00, 'Imagenes/frappe-mazapan.jpg'),
(2, 'Frappé Nutella', 80.00, 'Imagenes/frappe-nutella.jpg'),
(2, 'Frappé Ferrero', 85.00, 'Imagenes/frappe-ferrero.jpg'),
(2, 'Frappé Fresa Cheesecake', 78.00, 'Imagenes/frappe-fresa.jpg'),
(2, 'Frappé Chocolate Blanco', 75.00, 'Imagenes/frappe-blanco.jpg'),
(2, 'Frappé Chai', 72.00, 'Imagenes/frappe-chai.jpg'),
(2, 'Frappé Matcha', 75.00, 'Imagenes/frappe-matcha.jpg'),
(2, 'Frappé Kinder', 85.00, 'Imagenes/frappe-kinder.jpg');

-- 3. Snacks & Croissants (id_categoria = 3)
INSERT INTO Productos (id_categoria, nombre, precio, imagen_url) VALUES 
(3, 'Croissant Clásico', 20.00, 'Imagenes/croissant-clasico.jpg'),
(3, 'Croissant de Chocolate', 35.00, 'Imagenes/croissant-chocolate.jpg'),
(3, 'Croissant de Cajeta', 38.00, 'Imagenes/croissant-cajeta.jpg'),
(3, 'Croissant de Nutella', 42.00, 'Imagenes/croissant-nutella.jpg'),
(3, 'Croissant Jamón y Queso', 55.00, 'Imagenes/croissant-jamon-queso.jpg'),
(3, 'Croissant Pepperoni', 60.00, 'Imagenes/croissant-pepperoni.jpg'),
(3, 'Croissant Pollo Chipotle', 65.00, 'Imagenes/croissant-pollo.jpg'),
(3, 'Croissant Jamón Serrano', 75.00, 'Imagenes/croissant-serrano.jpg'),
(3, 'Croissant Hawaiano', 65.00, 'Imagenes/croissant-hawaiano.jpg'),
(3, 'Brownie', 35.00, 'Imagenes/brownie.jpg'),
(3, 'Galletas Oreo', 25.00, 'Imagenes/galletas-oreo.jpg'),
(3, 'Cheesecake', 55.00, 'Imagenes/cheesecake.jpg'),
(3, 'Muffin de Chocolate', 38.00, 'Imagenes/muffin-chocolate.jpg'),
(3, 'Papas Gajo', 45.00, 'Imagenes/papas-gajo.jpg'),
(3, 'Panini Italiano', 85.00, 'Imagenes/panini-italiano.jpg'),
(3, 'Sándwich Club', 75.00, 'Imagenes/sandwich-club.jpg'),
(3, 'Molletes', 65.00, 'Imagenes/molletes.jpg');

-- 4. Combos (id_categoria = 4)
INSERT INTO Productos (id_categoria, nombre, precio, imagen_url) VALUES 
(4, 'Combo Desayuno Clásico', 75.00, 'Imagenes/combo-clasico.jpg'),
(4, 'Combo Sandwich', 115.00, 'Imagenes/combo-sandwich.jpg'),
(4, 'Combo Panini', 135.00, 'Imagenes/combo-panini.jpg'),
(4, 'Combo Pareja', 149.00, 'Imagenes/combo-pareja.jpg'),
(4, 'Combo Estudiante', 95.00, 'Imagenes/combo-estudiante.jpg'),
(4, 'Combo Dulce', 99.00, 'Imagenes/combo-dulce.jpg'),
(4, 'Combo Ejecutivo', 140.00, 'Imagenes/combo-ejecutivo.jpg'),
(4, 'Combo Morning', 110.00, 'Imagenes/combo-morning.jpg');