// landing.js - renders 20 random products on the landing page
import { sweatshirt } from '/data/sweatshirt.js';
import { shirt } from '/data/shirt.js';
import { jeans } from '/data/jeans.js';

// Ensure every product has category
sweatshirt.forEach(p => p.category = "sweatshirt");
shirt.forEach(p => p.category = "shirt");
jeans.forEach(p => p.category = "jeans");

// Combine into a single array
const allProducts = [...sweatshirt, ...shirt, ...jeans];

// Randomize array (Fisher–Yates)
function getRandomProducts(array, count) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

const randomProducts = getRandomProducts(allProducts, 20);

// Render homepage product grid
const container = document.querySelector(".js-landing-products");
const productMap = {};
let html = "";

randomProducts.forEach(product => {
  const cartId = `${product.category}-${product.id}`;
  productMap[cartId] = product;

  html += `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="card product-card">
        <div class="badge-wrap"><span class="badge bg-primary">NEW</span></div>

        <div class="product-thumb">
          <img src="${product.image}" class="card-img-top" alt="${product.productName}">
        </div>

        <div class="card-body">
          <h6 class="card-title">${product.productName}</h6>
          <div class="d-flex justify-content-between align-items-center">

            <div class="price">
              $${product.price}
              <small class="text-muted text-decoration-line-through">
                $${product.price + 50}
              </small>
            </div>

            <button class="btn btn-purple btn-sm add-cart" data-cartid="${cartId}">
              <i class="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
});

if (container) container.innerHTML = html;

// Load existing cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart + update navbar (calls global helper if present)
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  if (typeof window.updateCartQuantity === "function") {
    window.updateCartQuantity();
  }
  // notify other scripts/pages that cart changed
  try { window.dispatchEvent(new CustomEvent('cart:updated')); } catch (e) { }
}

// Update navbar cart badges immediately (used when this script updates the cart)
function updateNavbarCart() {
  try {
    // Read cart from localStorage to stay in sync with other pages/scripts.
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = stored.reduce((s, it) => s + (it.quantity || 0), 0);
    const uniqueCount = stored.length;
    const valueToShow = (window.__cartBadgeMode__ === 'unique') ? uniqueCount : totalQty;

    const badges = document.querySelectorAll('.js-cart-quantity');
    badges.forEach(el => el.textContent = valueToShow);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) cartCountEl.textContent = valueToShow;
  } catch (e) {
    // ignore if DOM not ready
  }
}

// Add item to cart
function addToCart(cartId) {
  const product = productMap[cartId];
  if (!product) return;

  const existing = cart.find(item => item.cartId === cartId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, cartId, quantity: 1 });
  }

  saveCart();
  // ensure navbar updates even if the global helper isn't present
  updateNavbarCart();
}

// Expose a simple API to switch badge behavior at runtime:
// - 'total' (default): show sum of item quantities
// - 'unique': show count of unique products in cart
window.setCartBadgeMode = function (mode) {
  if (mode === 'unique') window.__cartBadgeMode__ = 'unique';
  else window.__cartBadgeMode__ = 'total';
  // refresh display immediately
  updateNavbarCart();
}

// initialize default mode
// initialize default mode to show unique product count across the site
if (!window.__cartBadgeMode__) window.__cartBadgeMode__ = 'unique';

// Click handler for add-to-cart buttons
if (container) {
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-cart");
    if (!btn) return;

    addToCart(btn.dataset.cartid);

    // button feedback
    const prevHtml = btn.innerHTML;
    btn.innerHTML = `<i class="bi bi-check-lg"></i>`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = prevHtml;
      btn.disabled = false;
    }, 600);
  });
}
