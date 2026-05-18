const formulario = document.querySelector("form");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const datos = new FormData(formulario);

    try {

        const respuesta = await fetch("/guardar-pedido", {

            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(datos)

        });

        const texto = await respuesta.text();

        console.log(texto);

        const resultado = JSON.parse(texto);

        alert(resultado.mensaje);

        formulario.reset();

    } catch(error) {

        console.log(error);
        alert("Error al enviar pedido");

    }

});