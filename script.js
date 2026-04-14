// Select elements
const signupForm     = document.getElementById('signup-form');
const emailInput     = document.getElementById('email');
const formGroup      = emailInput.closest('.form-group');
const confirmedEmail = document.getElementById('confirmed-email');
const modalOverlay   = document.getElementById('modal-overlay');
const dismissBtn     = document.getElementById('dismiss-btn');

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show error state
function showError() {
  formGroup.classList.add('has-error');
  emailInput.setAttribute('aria-invalid', 'true');
}

// Clear error state
function clearError() {
  formGroup.classList.remove('has-error');
  emailInput.removeAttribute('aria-invalid');
}

// Open the success modal
function openModal(email) {
  confirmedEmail.textContent = email;
  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('is-open');
  dismissBtn.focus();
}

// Close the success modal and reset the form
function closeModal() {
  modalOverlay.classList.remove('is-open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  signupForm.reset();
  clearError();
  emailInput.focus();
}

// Handle form submission
signupForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();

  if (!email || !isValidEmail(email)) {
    showError();
    emailInput.focus();
    return;
  }

  clearError();
  openModal(email);
});

// Clear error as user types
emailInput.addEventListener('input', function () {
  if (formGroup.classList.contains('has-error')) {
    clearError();
  }
});

// Dismiss button closes the modal
dismissBtn.addEventListener('click', closeModal);

// Close modal when clicking the backdrop
modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
    closeModal();
  }
});


