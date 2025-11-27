export function router(hash) {
    const app = document.getElementById('app');
    const route = hash.replace('#', '').split('/')[0];

    switch (route) {
        case '':
        case 'ordenes':
            app.innerHTML = `<order-list></order-list>`;
            break;
        default:
            app.innerHTML = `<p>No encontrada</p>`;
    }
}

export function setRoute(newRoute) {
    window.location.hash = newRoute;
}