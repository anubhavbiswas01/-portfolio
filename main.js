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
        
        // Trigger EmailJS Autoresponder if configuration is enabled
        const visitorEmail = formData.get('email');
        const visitorName = formData.get('name');
        if (typeof emailjs !== 'undefined' && emailjsConfig.serviceId && emailjsConfig.serviceId !== "YOUR_SERVICE_ID") {
          try {
            emailjs.init(emailjsConfig.publicKey);
            emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, {
              to_name: visitorName,
              to_email: visitorEmail,
              reply_to: "anubhavbiswas01@gmail.com",
              contact_number: "8292970588"
            });
            console.log('Autoresponder email sent to ' + visitorEmail);
          } catch (err) {
            console.error('EmailJS Autoresponder error:', err);
          }
        }
        
        form.reset();
        
        // Re-prefill logged in user info if still active
        const savedUser = localStorage.getItem('google_user');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            const formName = document.getElementById('form-name');
            const formEmail = document.getElementById('form-email');
            if (formName) { formName.value = user.name; formName.readOnly = true; }
            if (formEmail) { formEmail.value = user.email; formEmail.readOnly = true; }
          } catch (e) {}
        }
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
 * Google Authentication & EmailJS Autoresponder Settings
 * ------------------------------------------------------------- */

// To enable auto-reply emails to visitors who submit the contact form:
// 1. Sign up for a free account at https://www.emailjs.com/
// 2. Create a template and replace these placeholder strings:
const emailjsConfig = {
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
  publicKey: "YOUR_PUBLIC_KEY"
};

function initGoogleAuth() {
  const clientID = "1049553582122-5eheeoeevc13fij5a2u6f9clktas1kpt.apps.googleusercontent.com"; 

  if (typeof google === 'undefined') {
    setTimeout(initGoogleAuth, 100);
    return;
  }

  // Initialize Client
  google.accounts.id.initialize({
    client_id: clientID,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true
  });

  // Render Google buttons
  const signinBtn = document.getElementById('google-signin-btn');
  const signinBtnMobile = document.getElementById('google-signin-btn-mobile');
  const signinBtnForm = document.getElementById('google-signin-btn-form');

  if (signinBtn) {
    google.accounts.id.renderButton(signinBtn, {
      theme: 'outline',
      size: 'medium',
      shape: 'pill',
      text: 'signin_with',
      logo_alignment: 'left'
    });
  }

  if (signinBtnMobile) {
    google.accounts.id.renderButton(signinBtnMobile, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      width: 220
    });
  }

  if (signinBtnForm) {
    google.accounts.id.renderButton(signinBtnForm, {
      theme: 'filled_blue',
      size: 'large',
      shape: 'pill',
      width: 240
    });
  }

  // Check for existing session in localStorage
  const savedUser = localStorage.getItem('google_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      displayUserProfile(user);
    } catch (e) {
      console.error('Failed parsing cached user credentials:', e);
    }
  } else {
    google.accounts.id.prompt();
  }

  // Bind logout events
  const logoutBtn = document.getElementById('logout-btn');
  const logoutBtnMobile = document.getElementById('logout-btn-mobile');

  if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
  if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', logoutUser);
}

// Handler callback on successful login
function handleCredentialResponse(response) {
  try {
    const userPayload = parseJwt(response.credential);
    localStorage.setItem('google_user', JSON.stringify({
      name: userPayload.name,
      picture: userPayload.picture,
      email: userPayload.email
    }));
    
    displayUserProfile(userPayload);
  } catch (error) {
    console.error('Credentials parsing error:', error);
  }
}

// Client-side JWT Token Decoder
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

// Update UI view states
function displayUserProfile(user) {
  const signinBtn = document.getElementById('google-signin-btn');
  const signinBtnMobile = document.getElementById('google-signin-btn-mobile');
  const profileChip = document.getElementById('user-profile-chip');
  const profileChipMobile = document.getElementById('user-profile-chip-mobile');
  const loginOverlay = document.getElementById('form-login-overlay');

  // Desktop UI Update
  if (signinBtn) signinBtn.classList.add('hidden');
  if (profileChip) {
    profileChip.classList.remove('hidden');
    document.getElementById('user-avatar').src = user.picture;
    document.getElementById('user-name').textContent = user.name.split(' ')[0]; // first name
  }

  // Mobile UI Update
  if (signinBtnMobile) signinBtnMobile.style.display = 'none';
  if (profileChipMobile) {
    profileChipMobile.classList.remove('hidden');
    document.getElementById('user-avatar-mobile').src = user.picture;
    document.getElementById('user-name-mobile').textContent = user.name;
  }

  // Unlock contact form and prefill fields
  if (loginOverlay) {
    loginOverlay.classList.add('hidden');
  }
  
  const formName = document.getElementById('form-name');
  const formEmail = document.getElementById('form-email');
  if (formName) {
    formName.value = user.name;
    formName.readOnly = true;
  }
  if (formEmail) {
    formEmail.value = user.email;
    formEmail.readOnly = true;
  }
}

// Handle User Logout
function logoutUser() {
  localStorage.removeItem('google_user');
  
  const formName = document.getElementById('form-name');
  const formEmail = document.getElementById('form-email');
  if (formName) {
    formName.value = '';
    formName.readOnly = false;
  }
  if (formEmail) {
    formEmail.value = '';
    formEmail.readOnly = false;
  }

  // Lock contact form
  const loginOverlay = document.getElementById('form-login-overlay');
  if (loginOverlay) {
    loginOverlay.classList.remove('hidden');
  }

  google.accounts.id.disableAutoSelect();
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
