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
    // Case 1: each order has a single quantity property
    if (order.quantity) {
      totalQuantityThisYear += Number(order.quantity);
    }

    // Case 2: each order has multiple items with quantity
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        totalQuantityThisYear += Number(item.quantity || 0);
      });
    }
  }
});

const quantityYearElement = document.getElementById("totalQuantityYear");
if (quantityYearElement) quantityYearElement.textContent = totalQuantityThisYear;

// =========================
// GET TOTAL SALES FOR EACH WEEKDAY
// =========================
function getSalesByWeekday(orders) {
  const weekdays = {
    "Mon": 0,
    "Tue": 0,
    "Wed": 0,
    "Thu": 0,
    "Fri": 0,
    "Sat": 0,
    "Sun": 0
  };

  orders.forEach(order => {
    const dateObj = new Date(order.date);
    const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });

    weekdays[weekday] += Number(order.totalPrice);
  });

  return weekdays;
}

const weekdaySales = getSalesByWeekday(orders);


// =========================
// ROTATE LABELS SO TODAY IS LAST
// =========================
const baseLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Get today's weekday (Mon, Tue, Wed...)
const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

// Find index of today
const todayIndex = baseLabels.indexOf(today);

// Rotate so today is LAST, not first
const rotatedLabels = [
  ...baseLabels.slice(todayIndex + 1),
  ...baseLabels.slice(0, todayIndex + 1)
];

// Now convert weekdaySales into rotated order
const rotatedData = rotatedLabels.map(day => weekdaySales[day]);


// =========================
// DISPLAY CHART.JS (BAR CHART)
// =========================
const ctx = document.getElementById('dailyChart').getContext('2d');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: rotatedLabels,
    datasets: [{
      label: 'Total Sales Per Day (₦)',
      data: rotatedData,
      borderWidth: 2,
      tension: 0.4,
      backgroundColor: 'rgba(0, 123, 255, 0.6)',
      borderColor: 'blue'
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

