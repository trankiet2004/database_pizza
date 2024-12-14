let orderQuantities = [];

function updateQuantity(itemId, change) {
    let item = orderQuantities.find(item => item.IDLuaChon === itemId);

    if (item) {
        item.SoLuong = Math.max(0, item.SoLuong + change);
        if (item.SoLuong === 0) {
            orderQuantities = orderQuantities.filter(item => item.IDLuaChon !== itemId);
        }
    } else if (change > 0) {
        orderQuantities.push({ IDLuaChon: itemId, SoLuong: 1 });
    }

    updateQuantityDisplay(itemId);
}

function updateQuantityDisplay(itemId) {
    const itemElement = document.querySelector(`[data-id="${itemId}"] .quantity-display`);
    const item = orderQuantities.find(item => item.IDLuaChon === itemId);
    itemElement.textContent = item ? item.SoLuong : 0;
}

document.addEventListener('click', function (event) {
    if (event.target.matches('.btn-increase')) {
        const itemId = event.target.closest('.col').dataset.id;
        updateQuantity(itemId, 1);
    }

    if (event.target.matches('.btn-decrease')) {
        const itemId = event.target.closest('.col').dataset.id;
        updateQuantity(itemId, -1);
    }
});

try {
    fetch(
        "http://localhost:8000/pizza", {
            method: "GET"
        }
    ).then(response => {
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        response.json().then(res => {
            
        });
    });
} catch (error) {
    console.error(error.message);
}