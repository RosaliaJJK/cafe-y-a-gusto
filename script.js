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

        // VERIFICAR SI EL SERVIDOR RESPONDIÓ BIEN
        if (!respuesta.ok) {

            const errorTexto = await respuesta.text();

            console.log("ERROR DEL SERVIDOR:");
            console.log(errorTexto);

            alert("Error en servidor");

            return;
        }

        // CONVERTIR DIRECTAMENTE A JSON
        const resultado = await respuesta.json();

        console.log(resultado);

        alert(resultado.mensaje);

        formulario.reset();

    } catch(error) {

        console.log("ERROR COMPLETO:");
        console.log(error);

        alert("Error al enviar pedido");

    }

});