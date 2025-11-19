import { sweatshirt } from '../data/sweatshirt.js';
import { cart, addToCart } from '../data/cart.js';

let productHTML = '';
sweatshirt.forEach((sweat) => {
  productHTML += `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="card product-card">
        <div class="badge-wrap">
          <span class="badge bg-primary">NEW</span>
        </div>
        <button class="btn btn-wishlist js-add-to-wishlist" aria-label="Add to wishlist" id="wishBtn">
          <i class="bi bi-heart"></i>
        </button>
        <div class="product-thumb">
          <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=60"
            class="card-img-top" alt="product">
        </div>
        <div class="card-body">
          <h6 class="card-title">${sweat.productName}</h6>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="price">$${sweat.price} <small class="text-muted text-decoration-line-through">$240</small></div>
            </div>
            <button class="btn btn-purple btn-sm add-cart js-add-to-cart" data-product-id="${sweat.id}"><i class="bi bi-cart-plus"></i></button>
          </div>
        </div>
      </div>
    </div>
  `;
});

document.querySelector('.js-product-grid').innerHTML = productHTML;


// Wishlist add button
function updateWishlistQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
    wishBtn.innerHTML = `
      
    `
  });


  document.querySelector('.js-wishlist-quantity').innerHTML = cartQuantity;
}


document.querySelectorAll('.js-add-to-wishlist').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;

    addToCart(productId);

    updateWishlistQuantity();

  });
});