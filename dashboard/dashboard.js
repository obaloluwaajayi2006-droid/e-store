// =========================
// GET ORDERS
// =========================
const orders = JSON.parse(localStorage.getItem("orders")) || [];

// SORT ORDERS BY DATE DESCENDING (newest first)
orders.sort((a, b) => new Date(b.date) - new Date(a.date));

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

orders.forEach(order => {
  totalRevenue += Number(order.totalPrice);
});

const revenueElement = document.getElementById("totalRevenue");
if (revenueElement) revenueElement.textContent = totalRevenue.toFixed(2);

const revenueElement2 = document.getElementById("totalRevenue2");
if (revenueElement2) revenueElement2.textContent = totalRevenue.toFixed(2);

// =========================
// TOTAL SALES THIS MONTH
// =========================
const now = new Date();
const currentMonth = now.getMonth(); // 0-11
const currentYear = now.getFullYear();

let totalThisMonth = 0;

orders.forEach(order => {
  const orderDate = new Date(order.date);
  if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
    totalThisMonth += Number(order.totalPrice);
  }
});

const monthlyRevenueElement = document.getElementById("totalThisMonth");
if (monthlyRevenueElement) monthlyRevenueElement.textContent = totalThisMonth.toFixed(2);

// =========================
// TOTAL PRODUCTS SOLD THIS YEAR
// =========================
let totalQuantityThisYear = 0;

orders.forEach(order => {
  const orderDate = new Date(order.date);
  if (orderDate.getFullYear() === currentYear) {
    // If each order has a quantity property
    totalQuantityThisYear += Number(order.quantity || 0);

    // OR, if each order has multiple items: 
    // order.items.forEach(item => totalQuantityThisYear += Number(item.quantity));
  }
});

const quantityYearElement = document.getElementById("totalQuantityYear");
if (quantityYearElement) quantityYearElement.textContent = totalQuantityThisYear;

// =========================
// GET TOTAL SALES PER DAY
// =========================
function getDailySales(orders) {
  const daily = {};
  orders.forEach(order => {
    const day = order.date; // saved as YYYY-MM-DD
    if (!daily[day]) daily[day] = 0;
    daily[day] += Number(order.totalPrice);
  });
  return daily;
}

const dailySales = getDailySales(orders);

// =========================
// CONVERT DATE → WEEKDAY
// =========================
function getWeekday(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

// Convert labels to weekdays
const labels = Object.keys(dailySales).map(date => getWeekday(date));
const salesData = Object.values(dailySales);

// =========================
// DISPLAY CHART.JS AS BAR CHART
// =========================
const ctx = document.getElementById('dailyChart').getContext('2d');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,  // now Mon, Tue, Wed...
    datasets: [{
      label: 'Total Sales Per Day (₦)',
      data: salesData,
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      borderColor: 'blue',
      pointRadius: 2,
      pointHoverRadius: 7
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

