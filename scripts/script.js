import { sweatshirt } from '../data/sweatshirt.js';

// Get cart from localStorage or initialize
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Ensure every cart item has quantity
cart = cart.map(item => ({ ...item, quantity: item.quantity || 1 }));

// Update header cart quantity (unique products only)
const updateCartQuantity = () => {
  const headerQty = document.querySelector('.js-cart-quantity');
  if (headerQty) headerQty.textContent = cart.length;
};
updateCartQuantity();

// ================= PRODUCT PAGE ======================
if (document.querySelector('.js-product-grid')) {
  let productHTML = '';

  sweatshirt.forEach((sweat, index) => {
    productHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card">
          <div class="badge-wrap"><span class="badge bg-primary">NEW</span></div>

          <button class="btn btn-wishlist js-add-to-wishlist">
            <i class="bi bi-heart"></i>
          </button>

          <div class="product-thumb">
            <img src="${sweat.image}" class="card-img-top" alt="${sweat.productName}">
          </div>

          <div class="card-body">
            <h6 class="card-title">${sweat.productName}</h6>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="price">$${sweat.price}
                  <small class="text-muted text-decoration-line-through">$${sweat.price + 50}</small>
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

// ================= ADD TO CART =======================
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
  renderCart();
  renderCheckout();
};

// ================= CART & CHECKOUT CALCULATIONS =========
const taxFee = 2;

const getTotalQuantity = () => cart.reduce((sum, item) => sum + item.quantity, 0);
const getSubTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const getTotalPrice = () => getSubTotalPrice() + taxFee;

// ================= RENDER CART PAGE ======================
function renderCart() {
  const cartContainer = document.querySelector('.js-cart-items');
  if (!cartContainer) return;

  let html = '';
  cart.forEach((item, index) => {
    html += `
      <div class="cart-item d-flex align-items-center gap-3 py-3 border-bottom">
        <button onclick="removeFromCart(${index})" class="btn btn-sm btn-light remove-item">✕</button>
        <img src="${item.image}" alt="${item.productName}" class="product-thumb">
        <div class="flex-fill"><div class="product-title">${item.productName}</div></div>
        <div class="text-end">
          <div class="price">$<span class="item-price">${(item.price * item.quantity).toFixed(2)}</span></div>
          <div class="qty-controls mt-2 d-flex align-items-center justify-content-end gap-2">
            <button class="btn btn-outline-secondary btn-sm" onclick="decreaseQty(${index})">−</button>
            <input class="form-control qty-input text-center" value="${item.quantity}" readonly>
            <button class="btn btn-outline-secondary btn-sm" onclick="increaseQty(${index})">+</button>
          </div>
        </div>
      </div>
    `;
  });

  cartContainer.innerHTML = html;
  updateTotals();
}

// ================= RENDER CHECKOUT =====================
function renderCheckout() {
  const checkoutContainer = document.querySelector('.js-checkout-summary');
  if (!checkoutContainer) return; // Exit if not on checkout page
  updateTotals();
}

// ================= UPDATE TOTALS =======================
function updateTotals() {
  const qtyEl = document.querySelector('.js-total-quantity');
  const subtotalEl = document.querySelector('.js-subtotal-price');
  const totalEl = document.querySelector('.js-total-price');
  const taxEl = document.querySelector('.js-tax-fee');

  if (qtyEl) qtyEl.textContent = getTotalQuantity();
  if (subtotalEl) subtotalEl.textContent = getSubTotalPrice().toFixed(2);
  if (totalEl) totalEl.textContent = getTotalPrice().toFixed(2);
  if (taxEl) taxEl.textContent = taxFee.toFixed(2);

  updateCartQuantity();
}

// ================= QUANTITY BUTTONS ====================
window.removeFromCart = (index) => {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  renderCheckout();
};

window.increaseQty = (index) => {
  cart[index].quantity++;
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  renderCheckout();
};

window.decreaseQty = (index) => {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    renderCheckout();
  }
};

// ================= INITIAL PAGE LOAD ===================
renderCart();
renderCheckout();
