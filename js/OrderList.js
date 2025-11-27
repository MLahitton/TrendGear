const API_URL = "https://69284bd6b35b4ffc50151481.mockapi.io/Orders";

class OrderList extends HTMLElement {
    connectedCallback() {
        this.orders = [];
        this.filters = {
            id: "",
            customer_id: ""
        };
        this.render();
        this.fetchOrders();
    }

    render() {
        this.innerHTML = `
            <div class="order-list-toolbar" style="display:flex; justify-content:center; gap:1em; margin-bottom:2.2em; padding:1em;">
                <input 
                    type="text" 
                    name="id"
                    placeholder="Buscar por ID de orden..." 
                    class="filter-input"
                    style="min-width:180px; font-size:1em; padding:.7em 1em; border:2px solid #ddd; border-radius:5px; background:white; color:#333;"
                />
                <input 
                    type="text" 
                    name="customer_id"
                    placeholder="Buscar por cliente..." 
                    class="filter-input"
                    style="min-width:180px; font-size:1em; padding:.7em 1em; border:2px solid #ddd; border-radius:5px; background:white; color:#333;"
                />
                <button class="button" id="crear-btn" style="padding:.7em 1.8em; font-size:1em; font-weight:600; background:var(--light-blue); color:white; border:none; border-radius:5px; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.1);">Crear Orden</button>
            </div>
            <div class="order-cards-container" id="cards-container"></div>
        `;
        // Filtros
        this.querySelectorAll('.filter-input').forEach(input => {
            input.oninput = (e) => {
                this.filters[input.name] = e.target.value.trim();
                this.renderCards();
            };
        });
        // Crear
        this.querySelector('#crear-btn').onclick = () => this.openCreate();
    }

    fetchOrders() {
        fetch(API_URL)
            .then(r => r.json())
            .then(orders => {
                this.orders = orders;
                this.renderCards();
            });
    }

    renderCards() {
        const filteredOrders = this.orders.filter(order => {
            // Filtro por ID de orden
            const orderIdMatch = !this.filters.id 
                || (order.id && order.id.toString().toLowerCase().includes(this.filters.id.toLowerCase()));
            // Filtro por cliente
            const clientNameMatch = !this.filters.customer_id
                || (order.customer_id && order.customer_id.toString().toLowerCase().includes(this.filters.customer_id.toLowerCase()));
            return orderIdMatch && clientNameMatch;
        });

        const cont = this.querySelector('#cards-container');
        cont.innerHTML = '';
        filteredOrders.forEach(order => {
            const card = document.createElement('order-card');
            card.data = order;
            card.addEventListener('edit', () => this.openEdit(order));
            card.addEventListener('delete', () => this.deleteOrder(order));
            cont.appendChild(card);
        });
    }

    openCreate() {
        showOrderForm({
            onSave: (newOrder) => {
                fetch(API_URL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(newOrder)
                })
                .then(r => r.json())
                .then(newSavedOrder => {
                    this.orders.push(newSavedOrder);
                    this.renderCards();
                });
            }
        });
    }

    openEdit(order) {
        showOrderForm({
            order,
            onSave: (updated) => {
                fetch(`${API_URL}/${order.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(updated)
                })
                .then(r=>r.json())
                .then(o => {
                    this.orders = this.orders.map(ord => ord.id === o.id ? o : ord);
                    this.renderCards();
                });
            }
        });
    }

    deleteOrder(order) {
        if (!confirm('¿Eliminar esta orden?')) return;
        fetch(`${API_URL}/${order.id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                this.orders = this.orders.filter(ord => ord.id !== order.id);
                this.renderCards();
            } else {
                alert('Error al eliminar la orden');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Error al eliminar la orden');
        });
    }
}
window.customElements.define('order-list', OrderList);

// Función global para el formulario emergente:
window.showOrderForm = function({order = {}, onSave}) {
    let overlay = document.createElement('div');
    overlay.className = 'overlay';
    let modal = document.createElement('div');
    modal.className = 'modal';

    let formElem = document.createElement('order-form');
    formElem.order = order;
    modal.appendChild(formElem);
    overlay.appendChild(modal);

    formElem.addEventListener('cancel', () => document.body.removeChild(overlay));
    formElem.addEventListener('save', (e) => {
        onSave(e.detail);
        document.body.removeChild(overlay);
    });

    document.body.appendChild(overlay);
}