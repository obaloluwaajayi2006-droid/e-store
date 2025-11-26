// landing.js
import { sweatshirt } from '/data/sweatshirt.js';
import { shirt } from '/data/shirt.js';
import { jeans } from '/data/jeans.js';

// ------------------------
// 1. Ensure every product has category
// ------------------------
sweatshirt.forEach(p => p.category = "sweatshirt");
shirt.forEach(p => p.category = "shirt");
jeans.forEach(p => p.category = "jeans");

// ------------------------
// 2. Combine into a single array
// ------------------------
const allProducts = [...sweatshirt, ...shirt, ...jeans];

// ------------------------
// 3. Randomize array (Fisher–Yates)
// ------------------------
function getRandomProducts(array, count) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

const randomProducts = getRandomProducts(allProducts, 20);

// ------------------------
// 4. Render homepage product grid
// ------------------------
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



// ------------------------
// 5. Load existing cart
// ------------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ------------------------
// 6. Save cart + update navbar instantly
// ------------------------
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));

  // 🔥 updates navbar IMMEDIATELY
  if (typeof window.updateCartQuantity === "function") {
    window.updateCartQuantity();
  }
}

// ------------------------
// 7. Add item to cart
// ------------------------
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
}

// ------------------------
// 8. Add-to-cart click handler
// ------------------------
container.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-cart");
  if (!btn) return;

  addToCart(btn.dataset.cartid);

  // button feedback
  btn.innerHTML = `<i class="bi bi-check-lg"></i>`;
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = `<i class="bi bi-cart-plus"></i>`;
    btn.disabled = false;
  }, 600);
});
