/* ========================================================================== 
   The Traveller — shared application logic
   - Injects reusable navbar/footer components.
   - Renders shared destination/package/theme data.
   - Handles filtering and booking flow with localStorage.
   - Initializes AOS after dynamic content is in the DOM.
   ========================================================================== */

(() => {
  'use strict';

  const page = document.body.dataset.page || 'home';
  const isHome = page === 'home';
  const rootPrefix = isHome ? '' : '../';
  const STORAGE_KEY = 'theTravellerBooking';
  const CONFIRMATION_KEY = 'theTravellerConfirmation';

  const packages = [
    {
      id: 'kerala-backwaters',
      name: 'Kerala Backwaters & Hills',
      destination: 'Kerala, India',
      category: 'domestic', theme: 'family', days: 6, duration: 'medium', price: 42900,
      image: 'package-1.jpg', tag: 'Family favourite',
      summary: 'Tea-country mornings, wildlife edges, and a relaxed houseboat finale through Kerala.',
      itinerary: ['Arrive Kochi and explore Fort Kochi', 'Drive to Munnar and tea-country viewpoints', 'Munnar nature day and local experiences', 'Thekkady wildlife and spice-country visit', 'Alleppey houseboat cruise', 'Departure transfer from Kochi']
    },
    {
      id: 'bali-slow-escape',
      name: 'Bali Slow Escape',
      destination: 'Bali, Indonesia',
      category: 'international', theme: 'honeymoon', days: 7, duration: 'medium', price: 68900,
      image: 'package-2.jpg', tag: 'Couples',
      summary: 'A balanced Bali itinerary pairing Ubud culture and rice terraces with a calm coastal stay.',
      itinerary: ['Arrival and private transfer to Ubud', 'Temples, rice terraces and waterfall loop', 'Free day for spa or café hopping', 'Transfer to south Bali', 'Clifftop temple and sunset experience', 'Beach leisure day', 'Departure transfer']
    },
    {
      id: 'himalayan-trails',
      name: 'Himalayan Trails',
      destination: 'Himachal Pradesh, India',
      category: 'group', theme: 'adventure', days: 8, duration: 'medium', price: 35900,
      image: 'package-3.jpg', tag: 'Small group',
      summary: 'Mountain roads, pine forests, scenic hikes, and social evenings in a guided small-group format.',
      itinerary: ['Meet the group in Chandigarh', 'Drive to Manali', 'Acclimatisation walk and old-town visit', 'Solang Valley activity day', 'Scenic mountain excursion', 'Local village hike', 'Leisure and café evening', 'Return transfer']
    },
    {
      id: 'rajasthan-royal',
      name: 'Rajasthan Royal Circuit',
      destination: 'Rajasthan, India',
      category: 'domestic', theme: 'senior', days: 9, duration: 'long', price: 54900,
      image: 'package-4.jpg', tag: 'Comfort pace',
      summary: 'A measured cultural circuit through forts, palaces and lakes with comfortable travel days.',
      itinerary: ['Arrive Jaipur', 'Jaipur forts and old city', 'Drive to Pushkar', 'Continue to Jodhpur', 'Mehrangarh and blue city', 'Drive to Udaipur', 'Udaipur lakes and palace', 'Leisure day', 'Departure']
    },
    {
      id: 'dubai-city-desert',
      name: 'Dubai City & Desert',
      destination: 'Dubai, UAE',
      category: 'international', theme: 'family', days: 5, duration: 'medium', price: 62900,
      image: 'package-5.jpg', tag: 'Easy getaway',
      summary: 'Modern city highlights, a desert evening and plenty of flexible family time.',
      itinerary: ['Arrival and marina evening', 'City highlights tour', 'Desert safari experience', 'Free day for theme parks or shopping', 'Departure transfer']
    },
    {
      id: 'goa-weekend',
      name: 'Goa Coastal Weekend',
      destination: 'Goa, India',
      category: 'domestic', theme: 'honeymoon', days: 4, duration: 'short', price: 24900,
      image: 'package-6.jpg', tag: 'Short break',
      summary: 'A compact beach break with relaxed mornings, heritage corners, and sunset time.',
      itinerary: ['Arrival and beach sunset', 'North Goa highlights', 'Old Goa and Panjim', 'Departure']
    },
    {
      id: 'vietnam-discovery',
      name: 'Vietnam Discovery',
      destination: 'Vietnam',
      category: 'international', theme: 'adventure', days: 10, duration: 'long', price: 89900,
      image: 'package-7.jpg', tag: 'Explorer',
      summary: 'A north-to-central journey combining city energy, limestone scenery, and heritage streets.',
      itinerary: ['Arrive Hanoi', 'Hanoi city discovery', 'Ninh Binh landscapes', 'Ha Long Bay cruise', 'Fly to Da Nang', 'Hoi An heritage day', 'Countryside cycling', 'Ba Na Hills option', 'Leisure day', 'Departure']
    },
    {
      id: 'sikkim-serenity',
      name: 'Sikkim Serenity',
      destination: 'Sikkim, India',
      category: 'group', theme: 'senior', days: 7, duration: 'medium', price: 39900,
      image: 'package-8.jpg', tag: 'Scenic group',
      summary: 'A gentle group itinerary through mountain towns, monasteries and panoramic viewpoints.',
      itinerary: ['Arrive Gangtok', 'Gangtok local sights', 'Tsomgo Lake excursion', 'Transfer to Pelling', 'Monasteries and viewpoints', 'Leisure morning', 'Departure transfer']
    }
  ];

  const destinations = [
    { name: 'Kerala', copy: 'Backwaters, tea hills and tropical coast.', image: 'destination-kerala.jpg', packageId: 'kerala-backwaters' },
    { name: 'Bali', copy: 'Temple trails, green interiors and warm shores.', image: 'destination-bali.jpg', packageId: 'bali-slow-escape' },
    { name: 'Himachal', copy: 'Mountain roads, pine forests and highland air.', image: 'destination-himachal.jpg', packageId: 'himalayan-trails' },
    { name: 'Vietnam', copy: 'Lively cities, limestone bays and heritage towns.', image: 'destination-vietnam.jpg', packageId: 'vietnam-discovery' }
  ];

  const themes = [
    { id: 'family', name: 'Family Holidays', copy: 'Balanced days, flexible pacing and shared experiences.', image: 'theme-family.jpg' },
    { id: 'honeymoon', name: 'Honeymoon', copy: 'Private moments, scenic stays and time to slow down.', image: 'theme-honeymoon.jpg' },
    { id: 'adventure', name: 'Adventure', copy: 'Active days, mountain trails and memorable detours.', image: 'theme-adventure.jpg' },
    { id: 'senior', name: 'Senior-Friendly Tours', copy: 'Comfort-led pacing with thoughtfully planned transfers.', image: 'theme-senior.jpg' }
  ];

  const componentFallbacks = {
    navbar: `<div class="topbar"><div class="container d-flex justify-content-between flex-wrap gap-2"><span>◉ Travel assistance: +91 90000 00000</span><span>✉ hello@thetraveller</span></div></div><nav class="navbar navbar-expand-lg navbar-dark fixed-top main-nav" id="mainNav" aria-label="Primary navigation"><div class="container"><a class="navbar-brand fw-bold" data-route="home" href="#"><span class="brand-mark" aria-hidden="true">✦</span> The Traveller</a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navMenu"><ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1"><li class="nav-item"><a class="nav-link" data-route="home" href="#">Home</a></li><li class="nav-item"><a class="nav-link" data-route="packages" href="#">Tour Packages</a></li><li class="nav-item"><a class="nav-link" data-route="themes" href="#">Travel Themes</a></li><li class="nav-item"><a class="nav-link" data-route="details" href="#">Package Details</a></li><li class="nav-item"><a class="nav-link" data-route="summary" href="#">Booking Summary</a></li><li class="nav-item ms-lg-2"><a class="btn btn-brand btn-sm px-3" data-route="home-custom" href="#">Plan My Trip</a></li></ul></div></div></nav>`,
    footer: `<footer class="site-footer"><div class="container"><div class="row g-4"><div class="col-lg-5"><a class="navbar-brand text-white" data-route="home" href="#"><span class="brand-mark" aria-hidden="true">✦</span> The Traveller</a><p class="mt-3">Curated journeys for curious people. Thoughtful packages, flexible planning, and a clear booking journey across every screen.</p></div><div class="col-6 col-lg-2"><h2 class="footer-heading">Discover</h2><a data-route="packages" href="#">Packages</a><a data-route="home-destinations" href="#">Destinations</a><a data-route="themes" href="#">Themes</a></div><div class="col-6 col-lg-2"><h2 class="footer-heading">Plan</h2><a data-route="details" href="#">Select a package</a><a data-route="summary" href="#">Booking summary</a><a data-route="home-custom" href="#">Custom trip</a></div><div class="col-lg-3"><h2 class="footer-heading">Connect</h2><p class="small">hello@thetraveller<br>+91 90000 00000</p></div></div><hr><div class="d-flex justify-content-between flex-wrap gap-2 small"><span>© <span data-current-year></span> The Traveller. Official website.</span><span>Privacy · Terms · Accessibility</span></div></div></footer>`
  };

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function money(value) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  }

  function imagePath(filename) {
    return `${rootPrefix}assets/images/${filename}`;
  }

  function routeMap() {
    return {
      home: `${rootPrefix}index.html`,
      packages: `${rootPrefix}pages/packages.html`,
      themes: `${rootPrefix}pages/themes.html`,
      details: `${rootPrefix}pages/package-details.html`,
      summary: `${rootPrefix}pages/booking-summary.html`,
      confirmation: `${rootPrefix}pages/booking-confirmation.html`,
      'home-custom': `${rootPrefix}index.html#custom`,
      'home-destinations': `${rootPrefix}index.html#destinations`
    };
  }

  function resolveComponentRoutes(scope = document) {
    const routes = routeMap();
    scope.querySelectorAll('[data-route]').forEach(link => {
      const route = link.dataset.route;
      if (routes[route]) link.setAttribute('href', routes[route]);
    });
    scope.querySelectorAll('[data-current-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

    const currentRoute = { home: 'home', packages: 'packages', themes: 'themes', details: 'details', summary: 'summary', confirmation: 'confirmation' }[page];
    scope.querySelectorAll(`[data-route="${currentRoute}"]`).forEach(link => link.classList.add('active'));
  }

  async function injectComponent(slotId, fileName, fallbackKey) {
    const slot = document.getElementById(slotId);
    if (!slot) return;

    // fetch() is used when the site is served over HTTP(S). A DOM fallback keeps
    // direct file:// previews functional, where browsers commonly block local fetch.
    if (location.protocol !== 'file:') {
      try {
        const response = await fetch(`${rootPrefix}components/${fileName}`, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`Unable to load ${fileName}`);
        slot.innerHTML = await response.text();
        resolveComponentRoutes(slot);
        return;
      } catch (error) {
        console.warn(error.message);
      }
    }

    slot.innerHTML = componentFallbacks[fallbackKey];
    resolveComponentRoutes(slot);
  }

  async function injectSharedComponents() {
    await Promise.all([
      injectComponent('navbar-slot', 'navbar.html', 'navbar'),
      injectComponent('footer-slot', 'footer.html', 'footer')
    ]);
    bindNavScroll();
  }

  function bindNavScroll() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    const update = () => nav.classList.toggle('scrolled', window.scrollY > 35);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function packageCard(pkg, options = {}) {
    const href = `${rootPrefix}pages/package-details.html?package=${encodeURIComponent(pkg.id)}`;
    return `<div class="col-md-6 col-xl-${options.compact ? '4' : '4'} package-item" data-category="${pkg.category}" data-theme="${pkg.theme}" data-name="${escapeHtml((pkg.name + ' ' + pkg.destination).toLowerCase())}">
      <article class="package-card" data-aos="fade-up">
        <img src="${imagePath(pkg.image)}" alt="${escapeHtml(pkg.destination)} travel landscape" loading="lazy">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-2"><span class="tag">${escapeHtml(pkg.tag)}</span><span class="package-meta">${pkg.days} days</span></div>
          <h3>${escapeHtml(pkg.name)}</h3>
          <p class="package-meta mb-3">${escapeHtml(pkg.destination)} · ${escapeHtml(pkg.category)}</p>
          <p>${escapeHtml(pkg.summary)}</p>
          <div class="d-flex justify-content-between align-items-center gap-3"><span class="price">${money(pkg.price)}</span><a class="btn btn-outline-brand btn-sm" href="${href}" aria-label="View ${escapeHtml(pkg.name)} details">View trip</a></div>
        </div>
      </article>
    </div>`;
  }

  function renderHome() {
    const destinationGrid = document.getElementById('destinationGrid');
    if (destinationGrid) {
      destinationGrid.innerHTML = destinations.map(dest => `<div class="col-md-6 col-xl-3"><article class="destination-card" data-aos="fade-up"><img src="${imagePath(dest.image)}" alt="${escapeHtml(dest.name)} travel scene" loading="lazy"><div class="card-body"><h3>${escapeHtml(dest.name)}</h3><p class="text-muted">${escapeHtml(dest.copy)}</p><a class="text-link" href="pages/package-details.html?package=${encodeURIComponent(dest.packageId)}">Explore destination →</a></div></article></div>`).join('');
    }

    const packageGrid = document.getElementById('packageGrid');
    if (packageGrid) packageGrid.innerHTML = packages.slice(0, 6).map(pkg => packageCard(pkg)).join('');

    const themeGrid = document.getElementById('themeGrid');
    if (themeGrid) {
      themeGrid.innerHTML = themes.map(theme => `<div class="col-md-6 col-xl-3"><a class="theme-card theme-card--${theme.id}" href="pages/themes.html?theme=${theme.id}" data-aos="zoom-in"><div><h3>${escapeHtml(theme.name)}</h3><p>${escapeHtml(theme.copy)}</p></div></a></div>`).join('');
    }

    const partnerGrid = document.getElementById('partnerGrid');
    if (partnerGrid) {
      const partners = [
        ['Agoda India', 'Hotels and stays', 'https://www.agoda.com/en-in/'],
        ['Trivago', 'Accommodation comparison', 'https://www.trivago.in/'],
        ['Skyscanner', 'Flight discovery', 'https://www.skyscanner.co.in/'],
        ['Tripadvisor', 'Traveller reviews', 'https://www.tripadvisor.in/']
      ];
      partnerGrid.innerHTML = partners.map(([name, copy, url]) => `<div class="col-md-6 col-xl-3"><a class="partner-card" href="${url}" target="_blank" rel="noopener noreferrer"><span><strong>${name}</strong><span>${copy}</span></span><span aria-hidden="true">↗</span></a></div>`).join('');
    }

    bindHomePackageFilters();
    bindHomeSearch();
    bindCustomTripForm();
  }

  function bindHomePackageFilters() {
    const buttons = document.querySelectorAll('[data-filter]');
    if (!buttons.length) return;
    buttons.forEach(button => button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      filterHomePackages(button.dataset.filter);
    }));
  }

  function filterHomePackages(category = 'all', query = '') {
    const items = [...document.querySelectorAll('#packageGrid .package-item')];
    if (!items.length) return;
    let visible = 0;
    items.forEach(item => {
      const categoryMatch = category === 'all' || item.dataset.category === category;
      const queryMatch = !query || item.dataset.name.includes(query.toLowerCase());
      const show = categoryMatch && queryMatch;
      item.classList.toggle('d-none', !show);
      if (show) visible += 1;
    });
    document.getElementById('noResults')?.classList.toggle('d-none', visible !== 0);
  }

  function bindHomeSearch() {
    const button = document.getElementById('searchBtn');
    if (!button) return;
    button.addEventListener('click', () => {
      const destination = document.getElementById('searchDestination').value.trim().toLowerCase();
      const type = document.getElementById('searchType').value;
      const duration = document.getElementById('searchDuration').value;
      const budget = document.getElementById('searchBudget').value;
      const matches = packages.filter(pkg => {
        const textMatch = !destination || `${pkg.name} ${pkg.destination}`.toLowerCase().includes(destination);
        const typeMatch = type === 'all' || pkg.category === type || type === 'custom';
        const durationMatch = duration === 'all' || pkg.duration === duration;
        const budgetMatch = budget === 'all' || (budget === 'budget' && pkg.price < 30000) || (budget === 'mid' && pkg.price >= 30000 && pkg.price <= 75000) || (budget === 'premium' && pkg.price > 75000);
        return textMatch && typeMatch && durationMatch && budgetMatch;
      });

      const message = document.getElementById('searchMessage');
      if (type === 'custom') {
        message.textContent = 'Custom trips are planned through the enquiry form below.';
        document.getElementById('custom')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      message.textContent = matches.length ? `${matches.length} matching package${matches.length === 1 ? '' : 's'} found. Showing matching featured trips below.` : 'No matching featured package found. Explore all packages for more options.';
      const grid = document.getElementById('packageGrid');
      if (grid) {
        grid.innerHTML = packages.slice(0, 6).map(pkg => packageCard(pkg)).join('');
        filterHomePackages(type === 'all' ? 'all' : type, destination);
        document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function bindCustomTripForm() {
    const form = document.getElementById('customTripForm');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = Object.fromEntries(new FormData(form).entries());
      localStorage.setItem('theTravellerCustomEnquiry', JSON.stringify({ ...values, createdAt: new Date().toISOString() }));
      const message = document.getElementById('formMessage');
      message.textContent = 'Thanks — your trip preferences have been saved in this browser.';
      message.classList.add('text-success');
      form.reset();
    });
  }

  function renderPackagesPage() {
    const grid = document.getElementById('allPackageGrid');
    if (!grid) return;
    grid.innerHTML = packages.map(pkg => packageCard(pkg, { compact: true })).join('');

    const search = document.getElementById('packageSearch');
    const category = document.getElementById('packageCategory');
    const theme = document.getElementById('packageTheme');
    const filter = () => {
      const query = search.value.trim().toLowerCase();
      let visible = 0;
      grid.querySelectorAll('.package-item').forEach(item => {
        const show = (!query || item.dataset.name.includes(query)) && (category.value === 'all' || item.dataset.category === category.value) && (theme.value === 'all' || item.dataset.theme === theme.value);
        item.classList.toggle('d-none', !show);
        if (show) visible += 1;
      });
      document.getElementById('allPackageEmpty').classList.toggle('d-none', visible !== 0);
    };
    [search, category, theme].forEach(control => control.addEventListener(control.tagName === 'INPUT' ? 'input' : 'change', filter));
  }

  function renderThemesPage() {
    const container = document.getElementById('themeListing');
    if (!container) return;
    const selected = new URLSearchParams(location.search).get('theme');
    const orderedThemes = selected ? [...themes.filter(t => t.id === selected), ...themes.filter(t => t.id !== selected)] : themes;
    container.innerHTML = orderedThemes.map(theme => {
      const matched = packages.filter(pkg => pkg.theme === theme.id);
      return `<section class="theme-block" id="${theme.id}" data-aos="fade-up"><div class="theme-block-header"><div><span class="eyebrow text-brand">${escapeHtml(theme.name.toUpperCase())}</span><h2>${escapeHtml(theme.name)}</h2><p>${escapeHtml(theme.copy)}</p></div><span class="tag">${matched.length} packages</span></div><div class="row g-4">${matched.map(pkg => packageCard(pkg)).join('')}</div></section>`;
    }).join('');
    if (selected && themes.some(t => t.id === selected)) setTimeout(() => document.getElementById(selected)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  }

  function currentPackageId() {
    const params = new URLSearchParams(location.search);
    const queryId = params.get('package');
    if (packages.some(pkg => pkg.id === queryId)) return queryId;
    const saved = readJson(STORAGE_KEY);
    if (saved?.packageId && packages.some(pkg => pkg.id === saved.packageId)) return saved.packageId;
    return packages[0].id;
  }

  function renderPackageDetailsPage() {
    const content = document.getElementById('packageDetailContent');
    const select = document.getElementById('selectedPackage');
    const form = document.getElementById('packageSelectionForm');
    if (!content || !select || !form) return;

    select.innerHTML = packages.map(pkg => `<option value="${pkg.id}">${escapeHtml(pkg.name)} — ${money(pkg.price)}</option>`).join('');
    select.value = currentPackageId();

    const saved = readJson(STORAGE_KEY);
    if (saved) {
      ['travelDate', 'travellers', 'roomType', 'name', 'email', 'phone', 'requests'].forEach(key => {
        const field = form.elements.namedItem(key);
        if (field && saved[key] !== undefined) field.value = saved[key];
      });
    }

    const render = () => {
      const pkg = packages.find(item => item.id === select.value) || packages[0];
      document.getElementById('detailHeroTitle').textContent = pkg.name;
      document.getElementById('detailHeroCopy').textContent = pkg.summary;
      content.innerHTML = `<img class="detail-cover" src="${imagePath(pkg.image)}" alt="${escapeHtml(pkg.destination)} landscape"><span class="eyebrow text-brand">${escapeHtml(pkg.tag.toUpperCase())}</span><h2 class="detail-title mt-2">${escapeHtml(pkg.name)}</h2><p class="detail-lead">${escapeHtml(pkg.summary)}</p><div class="detail-meta"><span>${pkg.days} days</span><span>${escapeHtml(pkg.destination)}</span><span>${escapeHtml(pkg.category)}</span><span>${money(pkg.price)} / traveller</span></div><h3 class="h4 fw-bold mb-3">Suggested itinerary</h3><ol class="itinerary-list">${pkg.itinerary.map((item, index) => `<li><strong>Day ${index + 1}</strong>${escapeHtml(item)}</li>`).join('')}</ol><div class="notice-box mt-4"><strong>Package note:</strong> Pricing is illustrative and excludes live airfare or inventory checks. Final commercial terms should be verified before payment integration.</div>`;
    };
    render();
    select.addEventListener('change', render);

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form).entries());
      const pkg = packages.find(item => item.id === data.packageId);
      const booking = { ...data, travellers: Number(data.travellers), packageName: pkg.name, unitPrice: pkg.price, total: pkg.price * Number(data.travellers), createdAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
      location.href = 'booking-summary.html';
    });
  }

  function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch { return null; }
  }

  function renderBookingSummary() {
    const target = document.getElementById('bookingSummary');
    if (!target) return;
    const booking = readJson(STORAGE_KEY);
    if (!booking) {
      target.innerHTML = `<div class="text-center py-4"><h2>No package selected yet</h2><p class="text-muted">Choose a package first so we can build your summary.</p><a class="btn btn-brand" href="package-details.html">Select a package</a></div>`;
      return;
    }
    const pkg = packages.find(item => item.id === booking.packageId);
    if (!pkg) return;
    target.innerHTML = `<div class="summary-grid"><div><span class="eyebrow text-brand">SELECTED JOURNEY</span><div class="summary-package mt-3"><img src="${imagePath(pkg.image)}" alt="${escapeHtml(pkg.destination)} landscape"><div><h2 class="h3 fw-bold">${escapeHtml(pkg.name)}</h2><p class="text-muted">${escapeHtml(pkg.destination)} · ${pkg.days} days</p><p>${escapeHtml(pkg.summary)}</p></div></div><hr class="my-4"><h3 class="h5 fw-bold">Traveller details</h3><dl class="summary-list"><div><dt>Lead traveller</dt><dd>${escapeHtml(booking.name)}</dd></div><div><dt>Email</dt><dd>${escapeHtml(booking.email)}</dd></div><div><dt>Phone</dt><dd>${escapeHtml(booking.phone)}</dd></div><div><dt>Start date</dt><dd>${escapeHtml(booking.travelDate)}</dd></div><div><dt>Travellers</dt><dd>${escapeHtml(booking.travellers)}</dd></div><div><dt>Room</dt><dd>${escapeHtml(booking.roomType)}</dd></div>${booking.requests ? `<div><dt>Requests</dt><dd>${escapeHtml(booking.requests)}</dd></div>` : ''}</dl></div><aside><div class="p-4 rounded-4 bg-light"><h3 class="h5 fw-bold">Price summary</h3><dl class="summary-list"><div><dt>Per traveller</dt><dd>${money(booking.unitPrice)}</dd></div><div><dt>Travellers</dt><dd>× ${booking.travellers}</dd></div><div><dt>Estimated total</dt><dd class="summary-total">${money(booking.total)}</dd></div></dl><p class="small text-muted mt-3">Illustrative package pricing only. Taxes, airfare and live availability can be integrated later.</p></div><form id="bookingConfirmForm" class="mt-3"><div class="form-check mb-3"><input class="form-check-input" type="checkbox" id="confirmDetails" required><label class="form-check-label small" for="confirmDetails">I have reviewed the package and traveller details.</label></div><div class="d-grid gap-2"><button class="btn btn-brand btn-lg" type="submit">Confirm booking request</button><a class="btn btn-outline-brand" href="package-details.html?package=${encodeURIComponent(pkg.id)}">Edit selection</a></div></form></aside></div>`;
    document.getElementById('bookingConfirmForm').addEventListener('submit', event => {
      event.preventDefault();
      if (!event.currentTarget.reportValidity()) return;
      const code = `TRV-${Date.now().toString().slice(-7)}`;
      localStorage.setItem(CONFIRMATION_KEY, JSON.stringify({ ...booking, code, confirmedAt: new Date().toISOString() }));
      location.href = 'booking-confirmation.html';
    });
  }

  function renderConfirmation() {
    const target = document.getElementById('confirmationPanel');
    if (!target) return;
    const confirmation = readJson(CONFIRMATION_KEY);
    if (!confirmation) {
      target.innerHTML = `<div class="success-mark" aria-hidden="true">i</div><h2>No confirmed booking yet</h2><p class="text-muted">Complete the package selection and booking summary first.</p><a class="btn btn-brand" href="package-details.html">Start booking</a>`;
      return;
    }
    target.innerHTML = `<div class="success-mark" aria-hidden="true">✓</div><span class="eyebrow text-brand">SUCCESS</span><h2 class="mt-2">Booking request received</h2><p class="text-muted">Thanks, ${escapeHtml(confirmation.name)}. Your ${escapeHtml(confirmation.packageName)} request has been recorded.</p><div class="booking-code" aria-label="Booking reference">${escapeHtml(confirmation.code)}</div><p><strong>Travel date:</strong> ${escapeHtml(confirmation.travelDate)} · <strong>Travellers:</strong> ${escapeHtml(confirmation.travellers)}</p><p class="small text-muted">This static demo stores the booking only in your browser. Connect a backend, inventory system, email service, and payment provider before production use.</p><div class="d-flex flex-wrap justify-content-center gap-2 mt-4"><a class="btn btn-brand" href="../index.html">Back to home</a><a class="btn btn-outline-brand" href="packages.html">Explore more trips</a></div>`;
  }

  function initAOS() {
    if (window.AOS) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.AOS.init({ duration: reducedMotion ? 0 : 700, once: false, offset: 60 });
      setTimeout(() => window.AOS.refreshHard(), 50);
    }
  }

  async function init() {
    await injectSharedComponents();
    if (page === 'home') renderHome();
    if (page === 'packages') renderPackagesPage();
    if (page === 'themes') renderThemesPage();
    if (page === 'details') renderPackageDetailsPage();
    if (page === 'summary') renderBookingSummary();
    if (page === 'confirmation') renderConfirmation();
    resolveComponentRoutes(document);
    initAOS();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
