/* ============================================
   詹逸诚 YiCheng Zhan — Personal Portfolio
   Black-Gold Tech Art — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ============================================
  // 1. Canvas Particle Network Background
  // ============================================
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let canvasWidth, canvasHeight;

  function resizeCanvas() {
    canvasWidth = canvas.width = window.innerWidth;
    canvasHeight = canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.goldHue = Math.random() * 30 + 35; // Gold-ish hue
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        this.x -= dx * force * 0.02;
        this.y -= dy * force * 0.02;
      }

      // Wrap around edges
      if (this.x < 0) this.x = canvasWidth;
      if (this.x > canvasWidth) this.x = 0;
      if (this.y < 0) this.y = canvasHeight;
      if (this.y > canvasHeight) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.goldHue}, 100%, 60%, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Initialize particles
  const particleCount = Math.min(100, Math.floor(canvasWidth * canvasHeight / 15000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Draw connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animateParticles() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animateParticles);
  }

  // Only run on non-mobile
  if (window.innerWidth > 768) {
    animateParticles();
  }

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // ============================================
  // 2. Cursor Glow Effect
  // ============================================
  const cursorGlow = document.getElementById('cursorGlow');
  
  if (cursorGlow && window.innerWidth > 768) {
    let glowX = 0, glowY = 0;
    let targetX = 0, targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function animateGlow() {
      glowX += (targetX - glowX) * 0.1;
      glowY += (targetY - glowY) * 0.1;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ============================================
  // 3. Navbar Scroll Effect
  // ============================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const backToTop = document.getElementById('backToTop');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar style
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Back to top
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================
  // 4. Mobile Nav Toggle
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // ============================================
  // 5. Scroll Reveal Animation
  // ============================================
  const revealItems = document.querySelectorAll('.reveal-item');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });

  revealItems.forEach(item => revealObserver.observe(item));

  // ============================================
  // 6. Skill Bar Animation
  // ============================================
  const skillFills = document.querySelectorAll('.skill-fill');
  
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.width = width;
        }, 100);
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  // ============================================
  // 7. Counter Animation for Stats
  // ============================================
  const statNums = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseInt(target.dataset.target);
        animateCounter(target, finalValue);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(stat => counterObserver.observe(stat));

  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, stepTime);
  }

  // ============================================
  // 8. 3D Tilt Card Effect
  // ============================================
  const tiltCards = document.querySelectorAll('.tilt-card');

  if (window.innerWidth > 1024) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ============================================
  // 9. Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // 10. Parallax Effect on Scroll
  // ============================================
  const heroCore = document.querySelector('.hero-core');
  const heroVisual = document.querySelector('.hero-visual');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (heroCore && scrollY < window.innerHeight) {
      const translateY = scrollY * 0.3;
      const scale = 1 - scrollY * 0.0005;
      heroCore.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) scale(${Math.max(0.8, scale)})`;
    }

    if (heroVisual && scrollY < window.innerHeight) {
      heroVisual.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
  }, { passive: true });

  // ============================================
  // 11. Typing Effect for Hero Subtitle (optional enhancement)
  // ============================================
  // Subtle text shimmer effect for gold text
  const goldTexts = document.querySelectorAll('.gold-text');
  
  goldTexts.forEach(text => {
    text.style.position = 'relative';
  });

  // ============================================
  // 12. Magnetic Button Effect
  // ============================================
  const magneticBtns = document.querySelectorAll('.btn-gold');

  if (window.innerWidth > 768) {
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15 - 2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ============================================
  // 13. Glitch Effect on Title (subtle)
  // ============================================
  const heroTitle = document.querySelector('.hero-title');
  
  if (heroTitle && window.innerWidth > 768) {
    let glitchInterval;
    let isGlitching = false;

    function randomGlitch() {
      if (isGlitching) return;
      isGlitching = true;
      
      heroTitle.style.textShadow = `
        2px 0 rgba(255, 215, 0, 0.7),
        -2px 0 rgba(79, 195, 247, 0.5)
      `;
      
      setTimeout(() => {
        heroTitle.style.textShadow = '';
        isGlitching = false;
      }, 100);
    }

    // Random glitch every 5-10 seconds
    function scheduleGlitch() {
      const delay = Math.random() * 5000 + 5000;
      glitchInterval = setTimeout(() => {
        randomGlitch();
        scheduleGlitch();
      }, delay);
    }
    
    scheduleGlitch();
  }

  // ============================================
  // 14. Console Welcome Message
  // ============================================
  console.log('%c⚡ 詹逸诚 YiCheng Zhan', 'font-size: 22px; font-weight: 900; color: #FFD700;');
  console.log('%c机械工程 · 智能设备研发 · 技术创新', 'font-size: 14px; color: #4FC3F7;');
  console.log('%c欢迎来到我的个人网站 🚀', 'font-size: 12px; color: #888;');

  // ============================================
  // 15. Floating Tag Orbit
  // ============================================
  const floatingTags = document.querySelectorAll('.floating-tag');
  
  floatingTags.forEach((tag, index) => {
    tag.addEventListener('mouseenter', () => {
      tag.style.animationPlayState = 'paused';
      tag.style.transform = 'scale(1.1)';
      tag.style.zIndex = '10';
    });
    
    tag.addEventListener('mouseleave', () => {
      tag.style.animationPlayState = 'running';
      tag.style.transform = '';
      tag.style.zIndex = '';
    });
  });

  // ============================================
  // 16. Progress Bar (Top of page)
  // ============================================
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #FFD700, #FFA500, #FF8C00);
    z-index: 1000;
    width: 0%;
    transition: width 0.1s ease;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  }, { passive: true });

  // ============================================
  // 17. Skill Chip Hover Glow
  // ============================================
  const skillChips = document.querySelectorAll('.skill-chip');
  
  skillChips.forEach(chip => {
    chip.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.4)';
    });
    
    chip.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
    });
  });

  // ============================================
  // 18. Patent Item Hover Effect
  // ============================================
  const patentItems = document.querySelectorAll('.patent-item');
  
  patentItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 0 25px rgba(255, 215, 0, 0.15)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
    });
  });

  // ============================================
  // 19. Typing Effect for Hero Subtitle
  // ============================================
  const typingElement = document.getElementById('typingText');
  const typingTexts = [
    '机械工程 · 智能设备研发 · 技术创新',
    'MECHANICAL ENGINEER · INNOVATOR',
    '以机械为骨 · 以代码为魂',
    '国家级金奖获得者 · 12项专利持有者'
  ];
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;
  let deletingDelay = 50;
  let pauseDelay = 2000;

  function typeEffect() {
    if (!typingElement) return;
    
    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(typeEffect, pauseDelay);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % typingTexts.length;
      setTimeout(typeEffect, 500);
      return;
    }

    setTimeout(typeEffect, isDeleting ? deletingDelay : typingDelay);
  }

  // Start typing effect after a short delay
  setTimeout(typeEffect, 800);

  // ============================================
  // 20. Gold Text Shimmer - Set data-text attributes
  // ============================================
  goldTexts.forEach(text => {
    text.setAttribute('data-text', text.textContent);
    text.style.position = 'relative';
  });

  // ============================================
  // 21. AI Tool Cards Staggered Hover Effect
  // ============================================
  const aiToolCards = document.querySelectorAll('.ai-tool-card');
  
  aiToolCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.03}s`;
    
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '';
    });
  });

  // ============================================
  // 22. Mouse Parallax for Hero Elements
  // ============================================
  if (window.innerWidth > 768) {
    const heroVisual = document.querySelector('.hero-visual');
    const floatingTags = document.querySelectorAll('.floating-tag');
    
    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      if (heroVisual) {
        heroVisual.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
      }
      
      floatingTags.forEach((tag, i) => {
        const depth = (i + 1) * 0.5;
        tag.style.transform = `translate(${mouseX * depth * 15}px, ${mouseY * depth * 15}px)`;
      });
    });
  }

  // ============================================
  // 23. Section Background Glow Follow Mouse
  // ============================================
  if (window.innerWidth > 768) {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
      section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        section.style.setProperty('--glow-x', x + 'px');
        section.style.setProperty('--glow-y', y + 'px');
      });
    });
  }

  // ============================================
  // 24. Random Particle Burst on Click
  // ============================================
  if (window.innerWidth > 768) {
    document.addEventListener('click', (e) => {
      // Skip if clicking on interactive elements
      if (e.target.closest('a, button, input, textarea')) return;
      
      createClickParticles(e.clientX, e.clientY);
    });
  }

  function createClickParticles(x, y) {
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 6px;
        height: 6px;
        background: var(--gold-1);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
      `;
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 50 + Math.random() * 50;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      let posX = 0;
      let posY = 0;
      let opacity = 1;
      
      function animate() {
        posX += vx * 0.016;
        posY += vy * 0.016 + 1; // gravity
        opacity -= 0.02;
        
        particle.style.transform = `translate(${posX}px, ${posY}px)`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      }
      
      requestAnimationFrame(animate);
    }
  }

  // ============================================
  // 25. Advantage Item Staggered Reveal
  // ============================================
  const advantageItems = document.querySelectorAll('.advantage-item');
  
  const advObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, index * 100);
        advObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  advantageItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.5s ease';
    advObserver.observe(item);
  });

  // ============================================
  // 26. Initialize page state
  // ============================================
  // Trigger initial scroll handler
  setTimeout(() => {
    handleScroll();
  }, 100);

  // Performance: Reduce particle count on low-performance devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    particles = particles.slice(0, Math.floor(particles.length * 0.5));
  }

});
