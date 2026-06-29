import './three-scene.js';

document.addEventListener('DOMContentLoaded', () => {
  initSplitText();
  initHeaderScroll();
  initMobileNavigation();
  initTiltCards();
  initProjectsModal();
  initContactForm();
  initScrollSpy();
  initGoogleAuth();
  initThemeToggle();
});

/* -------------------------------------------------------------
 * Text Letter Splitting for Interactive Hover Effects
 * ------------------------------------------------------------- */
function initSplitText() {
  const splitElements = document.querySelectorAll('.split-chars');
  splitElements.forEach(el => {
    const text = el.innerText;
    el.innerHTML = '';
    [...text].forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.className = 'char';
      el.appendChild(span);
    });
  });
}



/* -------------------------------------------------------------
 * Header Scroll Effect
 * ------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* -------------------------------------------------------------
 * Mobile Navigation Menu
 * ------------------------------------------------------------- */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');

  if (!menuBtn || !mobileNav) return;

  function toggleMenu() {
    menuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  }

  menuBtn.addEventListener('click', toggleMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu();
    });
  });
}

/* -------------------------------------------------------------
 * 3D Tilt Card Hover Effect
 * ------------------------------------------------------------- */
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within card
      const y = e.clientY - rect.top;  // y coordinate within card
      
      // Calculate mouse percentage inside card
      const pctX = x / rect.width;
      const pctY = y / rect.height;

      // Update CSS variables for glow gradient positioning
      card.style.setProperty('--mouse-x', `${pctX * 100}%`);
      card.style.setProperty('--mouse-y', `${pctY * 100}%`);

      // Tilt calculations (-15deg to 15deg range)
      const tiltX = (0.5 - pctY) * 15;
      const tiltY = (pctX - 0.5) * 15;

      // Apply tilt transform
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}

/* -------------------------------------------------------------
 * Projects Modal Handling
 * ------------------------------------------------------------- */
function initProjectsModal() {
  const openButtons = document.querySelectorAll('.open-modal-btn');
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const modalPanels = document.querySelectorAll('.modal-content-panel');

  if (!overlay || !closeBtn) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      
      // Deactivate all panels and active target
      modalPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `modal-${projectId}`) {
          panel.classList.add('active');
        }
      });

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    });
  });

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Resume scrolling
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Esc key closure
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* -------------------------------------------------------------
 * Contact Form Logic & Glow
 * ------------------------------------------------------------- */
function initContactForm() {
  const card = document.getElementById('contact-form-card');
  const form = document.getElementById('contact-form');
  const successOverlay = document.getElementById('form-success-overlay');
  const resetBtn = document.getElementById('success-reset-btn');

  if (!card || !form) return;

  // Contact card mouse move glow placement
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--form-mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--form-mouse-y', `${(y / rect.height) * 100}%`);
  });

  // Web3Forms Form Submission Logic
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('form-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    // Trigger the 3D particle explosion
    window.dispatchEvent(new CustomEvent('contact-submit'));

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      
      const json = await response.json();
      
      if (response.status === 200) {
        successOverlay.classList.add('active');
        form.reset();
      } else {
        console.error('Error submitting form:', json.message);
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Network error submitting form:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  if (resetBtn && successOverlay) {
    resetBtn.addEventListener('click', () => {
      successOverlay.classList.remove('active');
    });
  }
}

/* -------------------------------------------------------------
 * ScrollSpy: Navbar Link Activation on Scroll
 * ------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  function activateLink(id) {
    // Desktop Nav update
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${id}`) {
        item.classList.add('active');
      }
    });

    // Mobile Nav update
    mobileNavItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${id}`) {
        item.classList.add('active');
      }
    });
  }

  // Intersection Observer to detect current section on viewport
  const options = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger when section crosses center lines
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activateLink(entry.target.id);
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });
}



// Dismiss preloader and notify 3D scene on window load
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      // Dispatch load-complete event to trigger camera swoop
      window.dispatchEvent(new CustomEvent('load-complete'));
    }, 2000);
  }
});

/* -------------------------------------------------------------
 * Firebase Phone Authentication (OTP Verification)
 * ------------------------------------------------------------- */

// Paste your Firebase web configuration credentials here to enable real SMS OTPs:
const firebaseConfig = {
  apiKey: "AIzaSyDjmORbqh4rh0tjXXy8qsAutKQ2w82J4eI",
  authDomain: "portfolio-49c60.firebaseapp.com",
  projectId: "portfolio-49c60",
  storageBucket: "portfolio-49c60.firebasestorage.app",
  messagingSenderId: "36046642156",
  appId: "1:36046642156:web:ccc79a3a5255c5d39d3053",
  measurementId: "G-91FGP8L5TG"
};

let isRealFirebase = false;
let recaptchaVerifier = null;
let confirmationResult = null;

function initGoogleAuth() {
  // Keep same function hook name to prevent cascading edits in DOMContentLoaded
  initPhoneAuth();
}

function initPhoneAuth() {
  const modal = document.getElementById('phone-auth-modal');
  const closeBtn = document.getElementById('phone-modal-close');
  
  const triggerHeader = document.getElementById('btn-open-otp-header');
  const triggerMobile = document.getElementById('btn-open-otp-mobile');
  const triggerForm = document.getElementById('btn-open-otp-form');
  
  const step1 = document.getElementById('otp-step-1');
  const step2 = document.getElementById('otp-step-2');
  
  const phoneInput = document.getElementById('otp-phone-input');
  const codeInput = document.getElementById('otp-code-input');
  
  const sendBtn = document.getElementById('btn-send-otp');
  const verifyBtn = document.getElementById('btn-verify-otp');
  const resendBtn = document.getElementById('btn-resend-otp');
  const timerText = document.getElementById('otp-timer-text');
  
  let countdownInterval = null;

  // Initialize Firebase if config is valid
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    try {
      firebase.initializeApp(firebaseConfig);
      isRealFirebase = true;
      console.log("Firebase initialized successfully for real Phone Auth.");
    } catch (e) {
      console.warn("Firebase initialization failed, falling back to simulated verification.", e);
    }
  } else {
    console.log("Using simulated Phone Verification (Enter any 10-digit number; OTP is 123456).");
  }

  // Set up Recaptcha for real Firebase Phone Auth
  if (isRealFirebase) {
    try {
      recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {
          sendBtn.disabled = false;
        },
        'expired-callback': () => {
          sendBtn.disabled = true;
        }
      });
      recaptchaVerifier.render();
    } catch (e) {
      console.error("Recaptcha verifier initialization failed:", e);
    }
  }

  // Open Modal Helpers
  function openModal(e) {
    e.preventDefault();
    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (triggerHeader) triggerHeader.addEventListener('click', openModal);
  if (triggerMobile) triggerMobile.addEventListener('click', openModal);
  if (triggerForm) triggerForm.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Send OTP handler
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const phoneNumber = phoneInput.value.trim();
      if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
      }

      const fullPhoneNumber = "+91" + phoneNumber;
      sendBtn.disabled = true;
      sendBtn.textContent = "Sending Code...";

      if (isRealFirebase) {
        // Real Firebase SMS Dispatch
        firebase.auth().signInWithPhoneNumber(fullPhoneNumber, recaptchaVerifier)
          .then((result) => {
            confirmationResult = result;
            switchToStep2(fullPhoneNumber);
          })
          .catch((error) => {
            console.error("Error sending SMS:", error);
            alert("Failed to send code: " + error.message);
            sendBtn.disabled = false;
            sendBtn.textContent = "Send Verification Code";
            if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
          });
      } else {
        // Simulated Code Dispatch (fallback)
        setTimeout(() => {
          console.log(`[SIMULATED SMS] OTP sent to ${fullPhoneNumber}. Enter code: 123456`);
          alert(`[SIMULATING SMS] Verification code sent to ${fullPhoneNumber}!\n\nFor testing, enter the code: 123456`);
          switchToStep2(fullPhoneNumber);
        }, 1000);
      }
    });
  }

  function switchToStep2(fullPhone) {
    step1.classList.remove('active');
    step2.classList.add('active');
    
    // Start countdown timer
    startCountdown();
  }

  function startCountdown() {
    let timeLeft = 30;
    if (resendBtn) {
      resendBtn.classList.add('disabled');
      resendBtn.disabled = true;
    }
    if (timerText) timerText.textContent = `Resend code in ${timeLeft}s`;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      timeLeft--;
      if (timerText) timerText.textContent = `Resend code in ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        if (timerText) timerText.textContent = "Didn't receive code?";
        if (resendBtn) {
          resendBtn.classList.remove('disabled');
          resendBtn.disabled = false;
        }
      }
    }, 1000);
  }

  // Resend OTP handler
  if (resendBtn) {
    resendBtn.addEventListener('click', () => {
      const phoneNumber = phoneInput.value.trim();
      const fullPhoneNumber = "+91" + phoneNumber;
      
      startCountdown();

      if (isRealFirebase && confirmationResult) {
        firebase.auth().signInWithPhoneNumber(fullPhoneNumber, recaptchaVerifier)
          .then((result) => {
            confirmationResult = result;
          })
          .catch((error) => {
            console.error("Resend error:", error);
            alert("Resend failed: " + error.message);
          });
      } else {
        console.log(`[SIMULATED SMS] Code resent. Use code: 123456`);
        alert("[SIMULATION] Code resent! Use code: 123456");
      }
    });
  }

  // Verify OTP Code handler
  if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
      const code = codeInput.value.trim();
      if (code.length !== 6 || isNaN(code)) {
        alert("Please enter a valid 6-digit verification code.");
        return;
      }

      verifyBtn.disabled = true;
      verifyBtn.textContent = "Verifying...";

      if (isRealFirebase && confirmationResult) {
        // Real verification
        confirmationResult.confirm(code)
          .then((result) => {
            const user = result.user;
            const phone = user.phoneNumber;
            handleSuccessfulVerification(phone);
          })
          .catch((error) => {
            console.error("Code verification failed:", error);
            alert("Incorrect verification code. Please try again.");
            verifyBtn.disabled = false;
            verifyBtn.textContent = "Verify Code";
          });
      } else {
        // Simulated Verification
        setTimeout(() => {
          if (code === "123456") {
            const simulatedPhone = "+91 " + phoneInput.value.trim();
            handleSuccessfulVerification(simulatedPhone);
          } else {
            alert("Incorrect verification code! For simulation testing, please enter '123456'.");
            verifyBtn.disabled = false;
            verifyBtn.textContent = "Verify Code";
          }
        }, 1000);
      }
    });
  }

  function handleSuccessfulVerification(phone) {
    localStorage.setItem('verified_phone', phone);
    closeModal();
    displayVerifiedState(phone);
  }

  // Check for existing session in localStorage
  const savedPhone = localStorage.getItem('verified_phone');
  if (savedPhone) {
    displayVerifiedState(savedPhone);
  }

  // Bind logout events
  const logoutBtn = document.getElementById('logout-btn');
  const logoutBtnMobile = document.getElementById('logout-btn-mobile');

  if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
  if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', logoutUser);
}

// Display verified state across UI
function displayVerifiedState(phone) {
  const triggerHeader = document.getElementById('btn-open-otp-header');
  const triggerMobile = document.getElementById('btn-open-otp-mobile');
  
  const profileChip = document.getElementById('user-profile-chip');
  const profileChipMobile = document.getElementById('user-profile-chip-mobile');
  
  const loginOverlay = document.getElementById('form-login-overlay');
  const formPhone = document.getElementById('form-phone');

  // Desktop Update
  if (triggerHeader) triggerHeader.classList.add('hidden');
  if (profileChip) {
    profileChip.classList.remove('hidden');
    document.getElementById('user-name').textContent = phone;
  }

  // Mobile Update
  if (triggerMobile) triggerMobile.style.display = 'none';
  if (profileChipMobile) {
    profileChipMobile.classList.remove('hidden');
    document.getElementById('user-name-mobile').textContent = phone;
  }

  // Unlock contact form
  if (loginOverlay) {
    loginOverlay.classList.add('hidden');
  }
  if (formPhone) {
    formPhone.value = phone;
    formPhone.readOnly = true;
  }
}

// Handle User Logout
function logoutUser() {
  localStorage.removeItem('verified_phone');
  
  const formPhone = document.getElementById('form-phone');
  if (formPhone) {
    formPhone.value = '';
    formPhone.readOnly = false;
  }

  // Lock contact form
  const loginOverlay = document.getElementById('form-login-overlay');
  if (loginOverlay) {
    loginOverlay.classList.remove('hidden');
  }

  window.location.reload();
}

/* -------------------------------------------------------------
 * Theme Selector: Dark and Light Theme Toggling
 * ------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const toggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');
  
  // Set default theme from localStorage or default to light
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  function toggleTheme() {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Dispatch custom theme-change event to update Three.js scene
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: newTheme } }));
  }
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
  if (toggleBtnMobile) {
    toggleBtnMobile.addEventListener('click', toggleTheme);
  }
  
  // Dispatch initial load event to make sure Three.js scene aligns with saved preference
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: currentTheme } }));
  }, 100);
}
