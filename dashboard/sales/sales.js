const orders = JSON.parse(localStorage.getItem("orders")) || [];



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
  `
})

document.getElementById("salesOrder").innerHTML = salesHTML;