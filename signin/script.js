let fetched = JSON.parse(localStorage.getItem('e-store'));
console.log(fetched);

const signIn = () => {
  // alert('hello');
  if (email.value.trim() === '' || password.value.trim() === '') {
    errorMessage.style.display = "block";
    errorMessage2.style.display = 'none';
  } else {
    errorMessage.style.display = 'none'
    const signinDetails = {
      mail: email.value,
      pass: password.value
    }
    const found = fetched.find(user => user.mail === signinDetails.mail);
    if (found) {
      console.log('go to dashboard');
      localStorage.setItem('user', JSON.stringify(signinDetails));
      console.log(signinDetails);
      btn.innerHTML = `
            <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
            <span role="status">Loading ...</span>
          `
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 2000)
    } else {
      errorMessage2.style.display = 'block';
      errorMessage.style.display = 'none';
      window.location.href = '../signup/index.html';
    }
  }
}