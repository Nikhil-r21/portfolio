// DOM Elements object for centralized element references
const DOM = {
  preloader: document.getElementById('preloader'),
  header: document.getElementById('header'),
  navToggle: document.getElementById('nav-toggle'),
  navMenu: document.getElementById('nav-menu'),
  scrollUp: document.getElementById('scroll-up'),
  sections: document.querySelectorAll('section[id]'),
  contactForm: document.getElementById('contact-form'),
  typingText: document.getElementById('typing-text')
};

// Configuration for typing animation texts
const typingTexts = [
  'AWS Certified Cloud Practitioner',
  'Jr. DevOps Engineer',
  'Cloud Administrator',
  'Server & Network Setup Specialist'
];

/**
* Handles text typing animation effects
* Creates a typewriter effect cycling through multiple texts
*/
class TypingAnimation {
  /**
   * @param {HTMLElement} element - Target element for typing animation
   * @param {string[]} texts - Array of texts to cycle through
   * @param {number} typingSpeed - Speed of typing in milliseconds
   * @param {number} deletingSpeed - Speed of deleting in milliseconds
   * @param {number} pauseDuration - Duration to pause between typing cycles
   */
  constructor(element, texts, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
      this.element = element;
      this.texts = texts;
      this.typingSpeed = typingSpeed;
      this.deletingSpeed = deletingSpeed;
      this.pauseDuration = pauseDuration;
      this.currentTextIndex = 0;
      this.isDeleting = false;
      this.currentText = '';
      this.init();
  }

  /**
   * Initializes the typing animation
   */
  init() {
      this.type();
  }

  /**
   * Handles the typing/deleting animation logic
   */
  type() {
      const fullText = this.texts[this.currentTextIndex];
      
      if (this.isDeleting) {
          this.currentText = fullText.substring(0, this.currentText.length - 1);
      } else {
          this.currentText = fullText.substring(0, this.currentText.length + 1);
      }
      
      this.element.textContent = this.currentText;
      let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
      
      if (!this.isDeleting && this.currentText === fullText) {
          typeSpeed = this.pauseDuration;
          this.isDeleting = true;
      } else if (this.isDeleting && this.currentText === '') {
          this.isDeleting = false;
          this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
      }
      
      setTimeout(() => this.type(), typeSpeed);
  }
}

/**
* Handles all scroll-related functionality
* Including header state, scroll-to-top button, and section highlighting
*/
class ScrollHandler {
  constructor() {
      this.lastScroll = 0;
      this.init();
  }

  /**
   * Initializes scroll event listeners and smooth scroll behavior
   */
  init() {
      window.addEventListener('scroll', () => this.handleScroll());
      this.setupSmoothScroll();
  }

  /**
   * Main scroll event handler
   * Updates UI elements based on scroll position
   */
  handleScroll() {
      const currentScroll = window.scrollY;
      
      // Update header and scroll-up button visibility
      DOM.header.classList.toggle('scroll-header', currentScroll >= 50);
      DOM.scrollUp.classList.toggle('show-scroll', currentScroll >= 350);
      this.updateActiveSection();
      
      // Parallax effect for hero image
      if (currentScroll <= 600) {
          const heroImage = document.querySelector('.hero__image');
          const scrollValue = currentScroll * 0.3;
          heroImage.style.transform = `translateY(${scrollValue}px)`;
      }
      
      this.lastScroll = currentScroll;
  }

  /**
   * Sets up smooth scrolling behavior for anchor links
   */
  setupSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', (e) => {
              e.preventDefault();
              const targetId = anchor.getAttribute('href');
              if (targetId === '#') return;
              
              const targetSection = document.querySelector(targetId);
              targetSection.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
              });
              
              DOM.navMenu.classList.remove('show-menu');
          });
      });
  }

  /**
   * Updates active section in navigation based on scroll position
   */
  updateActiveSection() {
      DOM.sections.forEach(section => {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.offsetHeight;
          const currentScroll = window.scrollY;
          const sectionId = section.getAttribute('id');
          
          if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
              document.querySelector(`.nav__link[href*=${sectionId}]`)?.classList.add('active-link');
          } else {
              document.querySelector(`.nav__link[href*=${sectionId}]`)?.classList.remove('active-link');
          }
      });
  }
}

/**
* Handles project modal functionality
* Creates and manages modal windows for project details
*/
class ProjectModal {
  constructor() {
      this.init();
  }

  /**
   * Initializes project card click listeners
   */
  init() {
      document.querySelectorAll('.project__card').forEach(card => {
          card.addEventListener('click', () => this.openProject(card.dataset));
      });
  }

  /**
   * Creates and displays a modal with project details
   * @param {DOMStringMap} projectData - Dataset containing project information
   */
  openProject(projectData) {
      const modal = document.createElement('div');
      modal.className = 'project-modal';
      modal.innerHTML = `
          <div class="project-modal__content">
              <span class="project-modal__close">&times;</span>
              <h3>${projectData.title}</h3>
              <p class="project-modal__type">${projectData.type}</p>
              <div class="project-modal__skills">${projectData.skills}</div>
              <p class="project-modal__description">${projectData.description}</p>
              <div class="project-modal__links">
                  <a href="${projectData.demo}" target="_blank" class="button button--primary">Live Demo</a>
                  <a href="${projectData.github}" target="_blank" class="button button--ghost">Source Code</a>
              </div>
          </div>
      `;
      
      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('show'), 10);
      
      modal.querySelector('.project-modal__close').addEventListener('click', () => {
          modal.classList.remove('show');
          setTimeout(() => modal.remove(), 300);
      });
  }
}

/**
* Handles contact form functionality
* Including validation and submission
*/
class FormHandler {
  constructor() {
      this.init();
  }

  /**
   * Initializes form event listeners and validation
   */
  init() {
      DOM.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
      this.setupFormValidation();
  }

  /**
   * Sets up real-time form validation
   */
  setupFormValidation() {
      const inputs = DOM.contactForm.querySelectorAll('input, textarea');
      inputs.forEach(input => {
          input.addEventListener('input', () => this.validateInput(input));
          input.addEventListener('blur', () => this.validateInput(input));
      });
  }

  /**
   * Validates individual form inputs
   * @param {HTMLInputElement} input - Input element to validate
   * @returns {boolean} - Validation result
   */
  validateInput(input) {
      const parent = input.parentElement;
      
      if (!input.value.trim()) {
          parent.classList.add('error');
          this.showError(input, 'This field is required');
          return false;
      }
      
      if (input.type === 'email' && !this.isValidEmail(input.value)) {
          parent.classList.add('error');
          this.showError(input, 'Please enter a valid email address');
          return false;
      }
      
      parent.classList.remove('error');
      this.removeError(input);
      return true;
  }

  /**
   * Displays error message for invalid input
   * @param {HTMLInputElement} input - Input element
   * @param {string} message - Error message to display
   */
  showError(input, message) {
      const parent = input.parentElement;
      let errorElement = parent.querySelector('.error-message');
      
      if (!errorElement) {
          errorElement = document.createElement('span');
          errorElement.className = 'error-message';
          parent.appendChild(errorElement);
      }
      
      errorElement.textContent = message;
  }

  /**
   * Removes error message from input
   * @param {HTMLInputElement} input - Input element
   */
  removeError(input) {
      const parent = input.parentElement;
      const errorElement = parent.querySelector('.error-message');
      if (errorElement) errorElement.remove();
  }

  /**
   * Validates email format
   * @param {string} email - Email address to validate
   * @returns {boolean} - Validation result
   */
  isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Handles form submission
   * @param {Event} e - Submit event
   */
  async handleSubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(DOM.contactForm);
      const data = Object.fromEntries(formData.entries());
      
      let isValid = true;
      DOM.contactForm.querySelectorAll('input, textarea').forEach(input => {
          if (!this.validateInput(input)) isValid = false;
      });
      
      if (!isValid) return;
      
      const submitButton = DOM.contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          this.showNotification('Message sent successfully!', 'success');
          DOM.contactForm.reset();
      } catch (error) {
          this.showNotification('Failed to send message. Please try again.', 'error');
      } finally {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
      }
  }

  /**
   * Displays notification messages
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('success' or 'error')
   */
  showNotification(message, type) {
      const notification = document.createElement('div');
      notification.className = `notification notification--${type}`;
      notification.innerHTML = `
          <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
          ${message}
      `;
      
      document.body.appendChild(notification);
      setTimeout(() => notification.classList.add('show'), 10);
      
      setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => notification.remove(), 300);
      }, 3000);
  }
}

/**
* Handles mobile menu functionality
*/
class MobileMenu {
  constructor() {
      this.init();
  }

  /**
   * Initializes mobile menu event listeners
   */
  init() {
      DOM.navToggle.addEventListener('click', () => {
          DOM.navMenu.classList.toggle('show-menu');
      });
      
      document.addEventListener('click', (e) => {
          if (!e.target.closest('.nav__menu') && !e.target.closest('.nav__toggle')) {
              DOM.navMenu.classList.remove('show-menu');
          }
      });
  }
}

/**
* Handles scroll reveal animations
*/
class ScrollReveal {
  constructor() {
      this.init();
  }

  /**
   * Initializes scroll reveal animations for various elements
   */
  init() {
      const sr = ScrollReveal({
          origin: 'top',
          distance: '60px',
          duration: 2000,
          delay: 400
      });
      
      sr.reveal('.hero__content', {});
      sr.reveal('.hero__image', { delay: 600 });
      sr.reveal('.about__box', { interval: 100 });
      sr.reveal('.skills__content', { interval: 100 });
      sr.reveal('.project__card', { interval: 100 });
      sr.reveal('.contact__card', { interval: 100 });
      sr.reveal('.timeline__item', { 
          interval: 200,
          origin: 'left',
          distance: '120px'
      });
  }
}

// Initialize all functionality when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Handle preloader
  setTimeout(() => {
      DOM.preloader.style.opacity = '0';
      setTimeout(() => DOM.preloader.style.display = 'none', 300);
  }, 1000);

  // Setup project card modal triggers
  document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
          const modal = document.getElementById(card.getAttribute('data-modal'));
          modal.style.display = "flex";
          document.body.style.overflow = 'hidden';
      });
  });

  // Setup modal close buttons
  document.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const modal = btn.closest('.modal');
          modal.style.display = "none";
          document.body.style.overflow = 'auto';
      });
  });

  // Close modal on outside click
  window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
          e.target.style.display = "none";
          document.body.style.overflow = 'auto';
      }
  });

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
          document.querySelectorAll('.modal').forEach(modal => {
              modal.style.display = "none";
              document.body.style.overflow = 'auto';
          });
      }
  });

  // Initialize all classes
  new TypingAnimation(DOM.typingText, typingTexts);
  new ScrollHandler();
  new ProjectModal();
  new FormHandler();
  new MobileMenu();
  new ScrollReveal();
});





