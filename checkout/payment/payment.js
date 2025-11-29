import { updateTotals } from '/scripts/script.js';

let addressInfo = JSON.parse(localStorage.getItem('addressData')) || [];

console.log(addressInfo.fName, addressInfo.lName)

deliveryName.innerHTML = addressInfo.fName + ' ' + addressInfo.lName;
deliveryAddress.innerHTML = addressInfo.add;

// Paystack and firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7RJNXJvCyxJW59ge_30HcpDQrS3SGYCQ",
  authDomain: "e-store-project-24928.firebaseapp.com",
  projectId: "e-store-project-24928",
  storageBucket: "e-store-project-24928.firebasestorage.app",
  messagingSenderId: "108352256578",
  appId: "1:108352256578:web:9abfa1487e033c09668bdb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
    document.getElementById('profileImg').innerHTML = `<img src="${user.photoURL}" alt="Profile" style="width: 32px; height: 32px; border-radius: 50%;">
      `
  } else {
    setTimeout(() => {
      window.location.href = '/signup/index.html';
    }, 1000)
  }
});

// const confirmBtn = document.getElementById("confirmPayment");

// // Replace with your real Paystack public key
// const PAYSTACK_PUBLIC_KEY = "YOUR_PUBLIC_KEY_HERE";

// // Assuming you have total amount displayed in .js-total-price
// confirmBtn.addEventListener("click", async () => {

//   const user = auth.currentUser;
//   if (!user) {
//     alert("You must be logged in to pay.");
//     return;
//   }

//   // Get the total amount from your cart display (assume number only)
//   const totalEl = document.querySelector(".js-total-price");
//   const totalAmount = Number(totalEl.textContent.replace(/[^0-9]/g, "")) * 100; // convert to kobo

//   // Initialize Paystack
//   let handler = PaystackPop.setup({
//     key: PAYSTACK_PUBLIC_KEY,
//     email: user.email,
//     amount: totalAmount,
//     currency: "NGN",
//     ref: "order_" + Date.now(), // unique reference

//     callback: function (response) {
//       console.log("Payment successful!", response);

//       // OPTIONAL: Save payment to Firestore or mark order complete
//       // Example: saveOrderToFirestore(response.reference);

//       // Redirect to success page
//       window.location.href = "../order-success.html";
//     },

//     onClose: function () {
//       alert("Payment cancelled.");
//     }
//   });

//   handler.openIframe();
// });

const confirmBtn = () => {
  // console.log(qtyEl);
  alert('hi!');
}
// updateTotals.forEach(() => {

// })

console.log(updateTotals);
window.confirmBtn = confirmBtn;