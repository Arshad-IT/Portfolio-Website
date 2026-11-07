/**
 * form.js — Contact Form Handling for Portfolio Website
 * Handles validation, error display, focus effects, and simulated submission.
 */

document.addEventListener('DOMContentLoaded', () => {

  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  // ============================================================
  // Validation Rules
  // ============================================================
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      message: 'Name must be at least 2 characters.'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address.'
    },
    subject: {
      required: true,
      minLength: 3,
      message: 'Subject must be at least 3 characters.'
    },
    message: {
      required: true,
      minLength: 10,
      message: 'Message must be at least 10 characters.'
    }
  };


  // ============================================================
  // Helper: Show Validation Error on a Field
  // ============================================================
  /**
   * Display an error message beneath a form field.
   * Adds the `.error` class to the parent `.form-group`.
   *
   * @param {HTMLElement} field   — The input/textarea element.
   * @param {string}      message — The error text to display.
   */
  const showError = (field, message) => {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    // Remove any existing error message first
    clearError(field);

    formGroup.classList.add('error');

    const errorSpan = document.createElement('span');
    errorSpan.classList.add('error-message');
    errorSpan.textContent = message;
    formGroup.appendChild(errorSpan);
  };


  // ============================================================
  // Helper: Clear Validation Error from a Field
  // ============================================================
  /**
   * Remove the error state and message from a form field.
   *
   * @param {HTMLElement} field — The input/textarea element.
   */
  const clearError = (field) => {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.remove('error');

    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  };


  // ============================================================
  // Validate a Single Field
  // ============================================================
  /**
   * Validate a single field against its rules.
   *
   * @param {HTMLElement} field    — The input/textarea element.
   * @param {Object}      rules   — The validation rules for this field.
   * @returns {boolean}            — true if valid, false otherwise.
   */
  const validateField = (field, rules) => {
    const value = field.value.trim();

    // Required check
    if (rules.required && value.length === 0) {
      showError(field, 'This field is required.');
      return false;
    }

    // Minimum length check
    if (rules.minLength && value.length < rules.minLength) {
      showError(field, rules.message);
      return false;
    }

    // Pattern (regex) check
    if (rules.pattern && !rules.pattern.test(value)) {
      showError(field, rules.message);
      return false;
    }

    clearError(field);
    return true;
  };


  // ============================================================
  // Form Submission Handler
  // ============================================================
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;

    // Validate each field
    Object.keys(validationRules).forEach((fieldName) => {
      const field = contactForm.querySelector(`[name="${fieldName}"]`);
      if (!field) return;

      const isValid = validateField(field, validationRules[fieldName]);
      if (!isValid) {
        isFormValid = false;
      }
    });

    if (!isFormValid) return;

    // ============================================================
    // Submit Form Data to itproarshad@gmail.com via W3Forms
    // ============================================================
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn ? submitBtn.innerHTML : '<i class="fa-solid fa-paper-plane"></i> Send Message';

    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
    }

    const formData = new FormData(contactForm);
    if (!formData.get('access_key')) {
      formData.append('access_key', 'w3f_c2c310dbacc462acb2f25f9102d81c488ba00ecbe4c4dc76');
    }
    const data = Object.fromEntries(formData.entries());

    fetch('https://api.w3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent! ✓';
          submitBtn.classList.add('success');
        }
        contactForm.reset();
        contactForm.querySelectorAll('.form-group').forEach((group) => {
          group.classList.remove('focused');
        });
      } else {
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error sending message';
        }
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.classList.remove('success');
          submitBtn.disabled = false;
        }
      }, 4000);
    })
    .catch((error) => {
      console.error('Submission error:', error);
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed to send. Please retry.';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.classList.remove('success');
          submitBtn.disabled = false;
        }
      }, 4000);
    });
  });


  // ============================================================
  // Clear Errors on Input / Focus
  // ============================================================
  const allInputs = contactForm.querySelectorAll('.form-input, .form-textarea');

  allInputs.forEach((input) => {
    // Clear error as user starts typing
    input.addEventListener('input', () => {
      clearError(input);
    });

    // Clear error on focus
    input.addEventListener('focus', () => {
      clearError(input);
    });
  });


  // ============================================================
  // Input Focus Effects (Floating Label Support)
  // ============================================================
  allInputs.forEach((input) => {
    // Add .focused class when input is focused
    input.addEventListener('focus', () => {
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        formGroup.classList.add('focused');
      }
    });

    // Remove .focused class on blur only if input is empty
    input.addEventListener('blur', () => {
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        if (input.value.trim() === '') {
          formGroup.classList.remove('focused');
        }
        // Keep .focused if input has a value (for floating label)
      }
    });

    // Handle pre-filled inputs on load
    if (input.value.trim() !== '') {
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        formGroup.classList.add('focused');
      }
    }
  });

});
