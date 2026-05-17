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

        const resultado = await respuesta.json();

        document.getElementById("mensajePopup").innerText =
            `${resultado.mensaje}, ${resultado.nombre}`;

        document.getElementById("popup").classList.remove("hidden");

        formulario.reset();

    } catch(error) {

        alert("Error al enviar pedido");
        console.log(await respuesta.text());
        
    }

});

function cerrarPopup() {

    document.getElementById("popup").classList.add("hidden");

}