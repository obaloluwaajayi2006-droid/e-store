// GET ORDERS
const orders = JSON.parse(localStorage.getItem("orders")) || [];

// =========================
// DISPLAY ORDERS IN TABLE
// =========================
let salesHTML = '';

orders.forEach((sales, index) => {
  salesHTML += `
    <tr>
      <td>${index + 1}</td>
      <td>${sales.name}</td>
      <td>₦${sales.totalPrice}</td>
      <td>${sales.date}</td>
      <td>${sales.reference}</td>
    </tr>
  `;
});

document.getElementById("salesOrder").innerHTML = salesHTML;


// =========================
// TOTAL REVENUE (ALL-TIME)
// =========================
let totalRevenue = 0;

orders.forEach((balance) => {
  totalRevenue += Number(balance.totalPrice);
});

const revenueElement = document.getElementById("totalRevenue");
if (revenueElement) {
  revenueElement.textContent = totalRevenue.toFixed(2);
}


// =========================
// GET TOTAL SALES PER DAY
// =========================
function getDailySales(orders) {
  const daily = {};

  orders.forEach(order => {
    const day = order.date;  // Already saved as "YYYY-MM-DD"

    if (!daily[day]) {
      daily[day] = 0;
    }
    
    daily[day] += Number(order.totalPrice);
  });

  return daily;
}

const dailySales = getDailySales(orders);

// Prepare data for Chart.js
const labels = Object.keys(dailySales);       // Example: ["2025-01-01", "2025-01-02"]
const salesData = Object.values(dailySales);  // Example: [8000, 9000]


// =========================
// DISPLAY CHART.JS
// =========================
const ctx = document.getElementById('dailyChart').getContext('2d');

new Chart(ctx, {
  type: 'bar',   // Change to "line" if you want
  data: {
    labels: labels,
    datasets: [{
      label: 'Total Sales Per Day (₦)',
      data: salesData,
      borderWidth: 2,
      backgroundColor: 'rgba(75, 192, 192, 0.3)',
      borderColor: 'rgba(75, 192, 192, 1)'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
