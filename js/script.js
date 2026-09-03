/* ==========================================================================
   WON HYUNGYEONG — PORTFOLIO SCRIPT
   1) Scroll reveal (IntersectionObserver)
   2) Header state + progress bar (rAF)
   3) Active nav highlighting
   4) Mobile nav toggle
   5) Project detail modal (index.html only)
   6) Detail page — section dot navigator
   7) Detail page in modal — link interception (postMessage to parent)
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Scroll Reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target); // reveal once, stay visible
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- 2. Header State + Progress Bar ---------- */
  var header = document.getElementById('header');
  var progressBar = document.getElementById('progressBar');
  var ticking = false;

  function onScrollFrame() {
    var scrollY = window.scrollY || window.pageYOffset;
    var docH = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle('is-scrolled', scrollY > 10);
    progressBar.style.width = (docH > 0 ? (scrollY / docH) * 100 : 0) + '%';

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  }, { passive: true });

  onScrollFrame();

  /* ---------- 3. Active Nav Highlighting ---------- */
  var navLinks = document.querySelectorAll('.nav__link');
  var sections = document.querySelectorAll('section[id]');

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.dataset.nav === id);
    });
  }

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- 4. Mobile Nav Toggle ----------
     detail-*.html 페이지는 헤더 nav/햄버거 버튼 자체가 없으므로(HTML에서
     제거됨) 이 블록은 그런 페이지에서 조용히 스킵된다. */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    });

    // close menu after choosing a link (mobile)
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 5. Project Detail Modal (index.html 전용) ----------
     project-card의 DETAIL 버튼/썸네일(href="detail-*.html")을 누르면
     새 창 대신 iframe 모달로 띄운다. 모달이 없는 페이지(detail-*.html
     자체)에서는 이 블록이 그냥 조용히 스킵된다. */
  var modal = document.getElementById('projectModal');

  if (modal) {
    var modalFrame = document.getElementById('projectModalFrame');
    var modalClose = document.getElementById('projectModalClose');
    var modalLastFocused = null;

    function openProjectModal(url, triggerEl) {
      modalLastFocused = triggerEl || document.activeElement;
      modalFrame.src = url;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      modalClose.focus();
      document.addEventListener('keydown', onModalKeydown);
    }

    function closeProjectModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onModalKeydown);
      // 닫힌 뒤 iframe을 비워서 다음에 열 때 항상 새로 로드되고 스크롤도 초기화되게 함
      window.setTimeout(function () { modalFrame.src = 'about:blank'; }, 300);
      if (modalLastFocused) modalLastFocused.focus();
    }

    function onModalKeydown(e) {
      if (e.key === 'Escape') closeProjectModal();
    }

    document.querySelectorAll('a[href^="detail-"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        // 새 탭으로 열려는 시도(⌘/Ctrl/Shift/휠클릭)는 그대로 브라우저 기본 동작에 맡김
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        openProjectModal(link.getAttribute('href'), link);
      });
    });

    modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
      el.addEventListener('click', closeProjectModal);
    });
    modalClose.addEventListener('click', closeProjectModal);

    // iframe(detail 페이지) 안에서 "index.html…" 링크를 눌렀을 때 보내는 신호를 받아,
    // 모달을 닫고 필요하면 해당 섹션까지 부드럽게 스크롤한다.
    window.addEventListener('message', function (e) {
      if (!e.data || e.data.type !== 'wgy-detail-nav') return;
      closeProjectModal();
      var hash = e.data.hash;
      if (hash) {
        window.setTimeout(function () {
          var target = document.querySelector(hash);
          if (target) target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
        }, 350);
      }
    });
  }

  /* ---------- 6. Detail 페이지 — 우측 섹션 점(dot) 내비게이터 ----------
     헤더 nav를 통째로 바꿔치우던 이전 방식은 너무 길어지고 공간을 많이
     차지해서 제거했다. 대신 화면 우측에 조용히 떠 있는 점 내비게이터로
     대체한다. 콘텐츠를 읽는 흐름을 방해하지 않으면서(과한 텍스트 없이
     점 하나 + hover 시에만 라벨 노출) 원하는 섹션으로 바로 이동할 수 있고,
     현재 보고 있는 섹션이 어디인지 스크롤에 따라 자동으로 표시된다.
     독립 열람이든 index.html의 모달(iframe) 안이든 동일하게 동작한다. */
  if (document.body.classList.contains('page-detail')) {
    var dotSections = document.querySelectorAll('main section[id]');

    if (dotSections.length > 1) {
      var dotNav = document.createElement('nav');
      dotNav.className = 'section-dots';
      dotNav.setAttribute('aria-label', '섹션 바로가기');

      dotSections.forEach(function (section) {
        var id = section.id;
        var eyebrow = section.querySelector('.section__eyebrow');
        var label = id === 'hero' ? 'TOP' : (eyebrow ? eyebrow.textContent.trim() : id.toUpperCase());

        var item = document.createElement('a');
        item.href = '#' + id;
        item.className = 'section-dots__item';
        item.dataset.dotFor = id;
        item.setAttribute('aria-label', label);

        var dot = document.createElement('span');
        dot.className = 'section-dots__dot';
        var tip = document.createElement('span');
        tip.className = 'section-dots__tip';
        tip.textContent = label;

        item.appendChild(dot);
        item.appendChild(tip);
        dotNav.appendChild(item);
      });

      document.body.appendChild(dotNav);

      var dotItems = dotNav.querySelectorAll('.section-dots__item');

      function setActiveDot(id) {
        dotItems.forEach(function (item) {
          item.classList.toggle('is-active', item.dataset.dotFor === id);
        });
      }
      setActiveDot(dotSections[0].id);

      if ('IntersectionObserver' in window) {
        var dotObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) setActiveDot(entry.target.id);
            });
          },
          { rootMargin: '-40% 0px -55% 0px' }
        );
        dotSections.forEach(function (section) { dotObserver.observe(section); });
      }

      dotItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          var target = document.getElementById(item.dataset.dotFor);
          if (target) target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
        });
      });
    }
  }

  /* ---------- 7. Detail 페이지가 모달(iframe) 안에서 열려 있을 때 — 링크 가로채기 ----------
     헤더 로고·"ALL PROJECTS" 등 index.html로 향하는 링크를 그대로 두면
     좁은 iframe 안에 메인 페이지 전체가 로드되어 보인다. 대신 부모 창에
     postMessage로 "모달 닫고 이 섹션으로 스크롤해줘"라고 알린다.
     독립적으로(iframe 밖에서) 직접 열었을 때는 원래대로 정상 이동한다. */
  if (window.self !== window.top) {
    document.querySelectorAll('a[href^="index.html"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        var href = link.getAttribute('href');
        var hashIndex = href.indexOf('#');
        var hash = hashIndex > -1 ? href.slice(hashIndex) : '';
        window.parent.postMessage({ type: 'wgy-detail-nav', hash: hash }, '*');
      });
    });
  }
})();
