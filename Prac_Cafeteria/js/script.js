        document.addEventListener('DOMContentLoaded', () => {
            const filterBtns = document.querySelectorAll('.filter-btn');
            const productCards = document.querySelectorAll('.product-card');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filterValue = btn.getAttribute('data-filter');

                    productCards.forEach(card => {
                        const productCategory = card.getAttribute('data-category');
                        A
                        if (filterValue === 'todos' || filterValue === productCategory) {
                            card.classList.remove('hidden'); 
                        } else {
                            card.classList.add('hidden'); 
                        }
                    });
                });
            });
        });

const form = document.querySelector('form');

if(form){
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        alert('¡Pedido realizado con éxito!');

        form.reset();
    });
}