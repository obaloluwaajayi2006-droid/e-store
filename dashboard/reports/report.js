const orders = JSON.parse(localStorage.getItem("orders")) || [];


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
    const day = order.date; // saved as YYYY-MM-DD

    if (!daily[day]) {
      daily[day] = 0;
    }

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
  type: 'bar',  // <-- CHANGED TO BAR CHART
  data: {
    labels: labels,  // Mon, Tue, Wed...
    datasets: [{
      label: 'Revenue (₦)',
      data: salesData,
      backgroundColor: '#6b4eff',
      borderWidth: 2
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
