// Select the form element
const form = document.querySelector('form');

// Add event listener to form submission
form.addEventListener('submit', (e) => {
  // Prevent default form submission
  e.preventDefault();

  // Validate form fields
  validateForm();
});

// Validate form function
function validateForm() {
  // Select form fields
  const username = document.querySelector('#username');
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');

  // Username validation
  if (username.value.trim() === '') {
    alert('Username is required');
    return false;
  }

  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.value)) {
    alert('Invalid email address');
    return false;
  }

  // Password validation
  if (password.value.length < 8) {
    alert('Password must be at least 8 characters');
    return false;
  }

  // Form is valid, submit
  form.submit();
}
