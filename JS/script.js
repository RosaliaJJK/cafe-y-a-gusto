document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('pedidoForm');

    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        const formData = new FormData(form);

        const datos = {
            nombre: formData.get('nombre'),
            producto: formData.get('producto'),
            tamano: formData.get('tamano'),
            metodo_pago: formData.get('metodo_pago')
        };

        try{

            const respuesta = await fetch('/guardar-pedido', {

                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(datos)

            });

            const resultado = await respuesta.json();

            document.getElementById('mensajePopup').innerText =
                `Gracias ${resultado.nombre}, tu pedido fue realizado correctamente ☕`;

            document.getElementById('popup').classList.remove('hidden');

            form.reset();

        }catch(error){

            alert('Error al enviar pedido');

        }

    });

});

function cerrarPopup(){

    document.getElementById('popup').classList.add('hidden');

}