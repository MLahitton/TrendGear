const orderFields = [
    { name: "order_id", label: "ID orden", type: "text" },
    { name: "customer_id", label: "Cliente (ID)", type: "text" },
    { name: "order_date", label: "Fecha orden", type: "date" },
    { name: "product_id", label: "Producto (ID)", type: "text" },
    { name: "product_category", label: "Categoría", type: "text" },
    { name: "product_name", label: "Nombre", type: "text" },
    { name: "price", label: "Precio", type: "number", step: "0.01" },
    { name: "quantity", label: "Cantidad", type: "number" },
    { name: "payment_method", label: "Pago", type: "text" },
    { name: "shipping_method", label: "Envío", type: "text" },
    { name: "shipping_fee", label: "Envío ($)", type: "number", step: "0.01" },
    { name: "delivery_time_days", label: "Días entrega", type: "number" },
    { name: "discount_applied", label: "Descuento aplicado", type: "checkbox" },
    { name: "discount_amount", label: "Descuento ($)", type: "number", step: "0.01" },
    { name: "order_total", label: "Total orden", type: "number", step: "0.01" },
    { name: "customer_age_group", label: "Edad cliente", type: "text" },
    { name: "customer_gender", label: "Género cliente", type: "text" },
    { name: "customer_region", label: "Región cliente", type: "text" },
    { name: "marketing_channel", label: "Canal marketing", type: "text" },
    { name: "device_used", label: "Dispositivo", type: "text" },
    { name: "repeat_customer", label: "Cliente repite", type: "text" },
    { name: "promo_code_used", label: "Promocion", type: "text" }
];

class OrderForm extends HTMLElement {
    set order(val) {
        this._order = val || {};
        this.render();
    }
    get order() {
        return this._order || {};
    }
    render() {
        this.innerHTML = `
        <h2 class="modal-title">${this.order.id ? 'Editar Orden' : 'Crear Nueva Orden'}</h2>
        <form class="order-form">
            ${orderFields.map(f =>
                `<div>
                    <label>${f.label}: 
                        ${f.type === 'checkbox' 
                            ? `<input type="checkbox" name="${f.name}" ${this.order[f.name] === true ? "checked" : ""}/>`
                            : `<input 
                                 type="${f.type}" 
                                 name="${f.name}" 
                                 value="${this.order[f.name] ?? ""}" 
                                 ${f.step ? `step="${f.step}"` : "" }
                               />`
                        }
                    </label>
                </div>`
            ).join('')}
            <div class="form-actions">
                <button type="button" class="button" id="cancelar-btn">Cancelar</button>
                <button type="submit" class="button">Guardar</button>
            </div>
        </form>
        `;
        this.querySelector('.order-form').onsubmit = (e) => {
            e.preventDefault();
            const data = {};
            orderFields.forEach(f => {
                if (f.type === "checkbox")
                    data[f.name] = this.querySelector(`[name="${f.name}"]`).checked;
                else
                    data[f.name] = this.querySelector(`[name="${f.name}"]`).value;
            });
            ["price","order_total","discount_amount","shipping_fee"].forEach(k => {
                if (data[k] !== "") data[k] = parseFloat(data[k]);
            });
            ["quantity","delivery_time_days"].forEach(k => {
                if (data[k] !== "") data[k] = parseInt(data[k]);
            });
            this.dispatchEvent(new CustomEvent('save', { detail: data }));
        };
        this.querySelector('#cancelar-btn').onclick = () => {
            this.dispatchEvent(new CustomEvent('cancel')); 
        }
    }
}
window.customElements.define('order-form', OrderForm);