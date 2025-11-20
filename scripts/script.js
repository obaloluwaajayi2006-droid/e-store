import { sweatshirt } from '../data/sweatshirt.js';

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Ensure all cart items have quantity
cart = cart.map(item => {
  if (!item.quantity) item.quantity = 1;
  return item;
});

// Update header cart quantity (unique products)
const updateCartQuantity = () => {
  document.querySelector('.js-cart-quantity').textContent = cart.length;
};
updateCartQuantity();

// Helper functions for total quantity and total price
const getTotalQuantity = () => cart.reduce((sum, item) => sum + item.quantity, 0);
const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// PRODUCT PAGE CODE
if (document.querySelector('.js-product-grid')) {
  let productHTML = '';

  sweatshirt.forEach((sweat, index) => {
    productHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card">
          <div class="badge-wrap">
            <span class="badge bg-primary">NEW</span>
          </div>
          <button class="btn btn-wishlist js-add-to-wishlist" aria-label="Add to wishlist">
            <i class="bi bi-heart"></i>
          </button>
          <div class="product-thumb">
            <img src="${sweat.image}" class="card-img-top" alt="product">
          </div>
          <div class="card-body">
            <h6 class="card-title">${sweat.productName}</h6>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="price">$${sweat.price} 
                  <small class="text-muted text-decoration-line-through">$240</small>
                </div>
              </div>
              <button onclick="addToCartBtn(${index})" class="btn btn-purple btn-sm add-cart js-add-to-cart">
                <i class="bi bi-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-product-grid').innerHTML = productHTML;
}

// ADD TO CART FUNCTION
window.addToCartBtn = (index) => {
  const product = sweatshirt[index];

  const existingIndex = cart.findIndex(item => item.id === product.id);
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartQuantity();

  if (document.querySelector('.js-cart-items')) renderCart();
};

// CART PAGE CODE
if (document.querySelector('.js-cart-items')) {

  function renderCart() {
    let cartProduct = '';

    cart.forEach((item, index) => {
      cartProduct += `
        <div class="cart-item d-flex align-items-center gap-3 py-3 border-bottom">
          <button onclick="removeFromCart(${index})" class="btn btn-sm btn-light remove-item" aria-label="remove">✕</button>
          <img src="${item.image}" alt="${item.productName}" class="product-thumb">
          <div class="flex-fill">
            <div class="product-title">${item.productName}</div>
          </div>
          <div class="text-end">
            <div class="price">$<span class="item-price">${item.price * item.quantity}</span></div>
            <div class="qty-controls mt-2 d-flex align-items-center justify-content-end gap-2">
              <button class="btn btn-outline-secondary btn-sm qty-minus" onclick="decreaseQty(${index})">−</button>
              <input class="form-control qty-input text-center" value="${item.quantity}" size="2" readonly>
              <button class="btn btn-outline-secondary btn-sm qty-plus" onclick="increaseQty(${index})">+</button>
            </div>
          </div>
        </div>
      `;
    });

    document.querySelector('.js-cart-items').innerHTML = cartProduct;

    // Update totals
    if (document.querySelector('.js-total-quantity')) {
      document.querySelector('.js-total-quantity').textContent = getTotalQuantity();
    }
    if (document.querySelector('.js-total-price')) {
      document.querySelector('.js-total-price').textContent = getTotalPrice().toFixed(2);
    }

    updateCartQuantity();
  }

  // Remove item
  window.removeFromCart = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  };

  // Increase quantity
  window.increaseQty = (index) => {
    cart[index].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  };

  // Decrease quantity
  window.decreaseQty = (index) => {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
  };

  renderCart();
}
