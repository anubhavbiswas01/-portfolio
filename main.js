import './three-scene.js';

document.addEventListener('DOMContentLoaded', () => {
  initSplitText();
  initCustomCursor();
  initHeaderScroll();
  initMobileNavigation();
  initTiltCards();
  initProjectsModal();
  initContactForm();
  initScrollSpy();
  initHoverEffects();
  initGoogleAuth();
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
 * Custom Cursor Implementation
 * ------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const glow = document.getElementById('custom-cursor-glow');

  if (!cursor || !glow) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let glowX = 0;
  let glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animation loop for smooth cursor lag
  function animateCursor() {
    // Fast follow for the core cursor
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    // Slower lag follow for the outer glow ring
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hide cursor on mouse leave
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    glow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    glow.style.opacity = '1';
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

/* -------------------------------------------------------------
 * Handle Cursor Hover States for Buttons / Links
 * ------------------------------------------------------------- */
function initHoverEffects() {
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .tilt-card');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
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
 * Google Authentication Integration (Google Identity Services)
 * ------------------------------------------------------------- */
function initGoogleAuth() {
  // Replace this placeholder with your actual Google Client ID from Google Cloud Console
  const clientID = "1094892408331-5s8kpl9d7k7a493n9r748u3o7m9d1k7b.apps.googleusercontent.com"; 

  if (typeof google === 'undefined') {
    // If client SDK hasn't loaded yet, retry
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
    // Show one-tap prompt overlay
    google.accounts.id.prompt();
  }

  // Bind logout events
  const logoutBtn = document.getElementById('logout-btn');
  const logoutBtnMobile = document.getElementById('logout-btn-mobile');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
  }
  if (logoutBtnMobile) {
    logoutBtnMobile.addEventListener('click', logoutUser);
  }
}

// Handler callback on successful login
function handleCredentialResponse(response) {
  try {
    const userPayload = parseJwt(response.credential);
    // Cache user credentials client-side
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
}

// Handle User Logout
function logoutUser() {
  localStorage.removeItem('google_user');
  google.accounts.id.disableAutoSelect();
  window.location.reload();
}
