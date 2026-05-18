const formulario = document.querySelector("form");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value,
        producto: document.getElementById("producto").value,
        tamano: document.getElementById("tamano").value,
        metodo_pago: document.getElementById("metodo_pago").value
    };

    try {

        const respuesta = await fetch("/guardar-pedido", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const texto = await respuesta.text();

        console.log(texto);

        const resultado = JSON.parse(texto);

        alert(resultado.mensaje);

        formulario.reset();

    } catch (error) {

        console.log(error);

        alert("Error conectando con servidor");

    }

});