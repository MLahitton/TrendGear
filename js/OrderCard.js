class OrderCard extends HTMLElement {
  set data(order) {
    this.order = order;
    this.render();
  }

  render() {
    // Título principal
    const orderTitle = `Orden #${this.order.id || ''}`;

    // Diccionario clave-valor:
    const fields = [
      ['Cliente', this.order.customer_id],
      ['Fecha', this.order.order_date],
      ['Producto', this.order.product_name],
      ['Valor total', "$" + parseFloat(this.order.order_total || 0).toFixed(2)],
    ];

    this.innerHTML = `
      <div class="order-card">
        <div class="order-card-title">${orderTitle}</div>
        <div class="order-card-dict">
          ${fields.map(([key, value]) => `
            <div class="order-card-dict-row">
              <div class="order-card-dict-key">${key}:</div>
              <div class="order-card-dict-value">${value ?? '-'}</div>
            </div>
          `).join('')}
        </div>
        <div class="order-card-actions">
          <button class="button edit-btn">✏️ Editar</button>
          <button class="button delete-btn">🗑️ Eliminar</button>
        </div>
      </div>
    `;

    this.querySelector('.edit-btn').onclick = () => {
      this.dispatchEvent(new CustomEvent('edit', { detail: this.order, bubbles: true }));
    };
    this.querySelector('.delete-btn').onclick = () => {
      this.dispatchEvent(new CustomEvent('delete', { detail: this.order, bubbles: true }));
    };
  }
}

window.customElements.define('order-card', OrderCard);