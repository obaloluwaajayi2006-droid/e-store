let addressInfo = JSON.parse(localStorage.getItem('addressData')) || [];

console.log(addressInfo.fName, addressInfo.lName)

deliveryName.innerHTML = addressInfo.fName + ' ' + addressInfo.lName;
deliveryAddress.innerHTML = addressInfo.add;