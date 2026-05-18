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

        console.log("RESPUESTA DEL SERVIDOR:");
        console.log(texto);

        if(!texto || texto.trim() === ""){

            throw new Error("Servidor devolvió respuesta vacía");

        }

        let resultado;

        try {

            resultado = JSON.parse(texto);

        } catch(parseError){

            console.log("NO ES JSON:");
            console.log(texto);

            throw new Error("La respuesta no es JSON válido");

        }

        if(!respuesta.ok){

            throw new Error(resultado.mensaje || "Error del servidor");

        }

        alert(resultado.mensaje);

        formulario.reset();

    } catch(error){

        console.log("ERROR COMPLETO:");
        console.log(error);

        alert(error.message);

    }

});