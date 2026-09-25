/* ==========================================================================
   Monday Hotels Enterprise CRM - Core Application Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// App State Variables
let currentPropertyId = 'all';
let currentView = 'dashboard';
let activeGuestForChat = null;

let chartOccupancy = null;
let chartChannel = null;
let chartPropertyComp = null;
let chartPipeline = null;

function initApp() {
  populatePropertySelector();
  setupNavigation();
  setupGlobalSearch();

  // Load initial view
  renderCurrentView();

  // Initial Toast
  showToast('Welcome to Monday Hotels Enterprise CRM', 'info');
}

/* ==========================================================================
   PROPERTY SELECTOR & NAVIGATION
   ========================================================================== */

function populatePropertySelector() {
  const selectEl = document.getElementById('global-property-select');
  const leadPropSelect = document.getElementById('lead-property-input');
  const resPropSelect = document.getElementById('res-property-input');

  const properties = window.crmDataStore.getProperties();

  selectEl.innerHTML = properties.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  
  const selectableProps = properties.filter(p => p.id !== 'all');
  const propOptions = selectableProps.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

  if (leadPropSelect) leadPropSelect.innerHTML = propOptions;
  if (resPropSelect) resPropSelect.innerHTML = propOptions;

  selectEl.addEventListener('change', (e) => {
    currentPropertyId = e.target.value;
    renderCurrentView();
    showToast(`Filtered view by ${e.target.options[e.target.selectedIndex].text}`, 'info');
  });
}

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-view');
      switchView(view);
    });
  });

  // Quick Action Buttons
  document.getElementById('btn-quick-lead').addEventListener('click', () => openNewLeadModal());
  document.getElementById('btn-quick-res').addEventListener('click', () => openNewResModal());
  document.getElementById('btn-refresh-dash').addEventListener('click', () => {
    renderCurrentView();
    showToast('Dashboard statistics refreshed', 'success');
  });
}

function switchView(viewName) {
  currentView = viewName;

  // Update Nav Active State
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.getAttribute('data-view') === viewName) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Switch Visible Section
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const activeSec = document.getElementById(`view-${viewName}`);
  if (activeSec) {
    activeSec.classList.add('active');
  }

  renderCurrentView();
}

function renderCurrentView() {
  updateBadges();

  switch (currentView) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'leads':
      renderKanbanBoard();
      break;
    case 'guests':
      renderGuestsTable();
      break;
    case 'reservations':
      renderReservationsTable();
      break;
    case 'corporate':
      renderCorporateTable();
      break;
    case 'reviews':
      renderReviewsFeed();
      break;
    case 'analytics':
      renderAnalyticsCharts();
      break;
  }
}

function updateBadges() {
  const leads = window.crmDataStore.getLeads(currentPropertyId);
  const reservations = window.crmDataStore.getReservations(currentPropertyId);

  document.getElementById('leads-count-badge').textContent = leads.length;
  document.getElementById('res-count-badge').textContent = reservations.length;
}

/* ==========================================================================
   GLOBAL SEARCH
   ========================================================================== */

function setupGlobalSearch() {
  const input = document.getElementById('global-search');
  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) return;

    if (currentView === 'guests') {
      const guests = window.crmDataStore.getGuests();
      const filtered = guests.filter(g => g.name.toLowerCase().includes(query) || g.email.toLowerCase().includes(query));
      renderGuestsTable(filtered);
    } else if (currentView === 'reservations') {
      const res = window.crmDataStore.getReservations(currentPropertyId);
      const filtered = res.filter(r => r.guestName.toLowerCase().includes(query) || r.id.toLowerCase().includes(query));
      renderReservationsTable(filtered);
    }
  });
}

/* ==========================================================================
   DASHBOARD COMPONENT & CHARTS
   ========================================================================== */

function renderDashboard() {
  // Update VIP Arrivals Table
  const guests = window.crmDataStore.getGuests();
  const vipGuests = guests.filter(g => g.vipLevel.includes('VIP'));
  const vipTbody = document.getElementById('dash-vip-table');

  vipTbody.innerHTML = vipGuests.map(g => `
    <tr>
      <td style="font-weight: 600; color: var(--text-primary); cursor: pointer;" onclick="openGuestModal('${g.id}')">
        ${g.name}
      </td>
      <td><span class="badge badge-gold">${g.vipLevel}</span></td>
      <td>${g.preferredProperty.split(' ')[0]}</td>
      <td><span class="badge badge-blue">Suite Request</span></td>
    </tr>
  `).join('');

  // Update High Priority Leads Table
  const leads = window.crmDataStore.getLeads(currentPropertyId);
  const topLeads = leads.slice(0, 4);
  const leadsTbody = document.getElementById('dash-leads-table');

  leadsTbody.innerHTML = topLeads.map(l => `
    <tr>
      <td style="font-weight: 600; color: var(--text-primary);">${l.title}</td>
      <td style="color: var(--accent-gold); font-weight: 700;">$${l.value.toLocaleString()}</td>
      <td><span class="badge badge-amber">${l.stage.replace('_', ' ').toUpperCase()}</span></td>
    </tr>
  `).join('');

  // Render Charts
  initDashboardCharts();
}

function initDashboardCharts() {
  // Occupancy Trend Chart
  const ctxOcc = document.getElementById('chart-occupancy-trend')?.getContext('2d');
  if (ctxOcc) {
    if (chartOccupancy) chartOccupancy.destroy();
    chartOccupancy = new Chart(ctxOcc, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Occupancy Rate (%)',
            data: [72, 75, 81, 86, 88, 92, 95, 91, 84, 88, 82, 90],
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: 'RevPAR ($)',
            data: [310, 325, 360, 395, 410, 450, 480, 440, 412, 430, 390, 460],
            borderColor: '#3B82F6',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94A3B8' } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' } }
        }
      }
    });
  }

  // Booking Source Breakdown
  const ctxMix = document.getElementById('chart-channel-mix')?.getContext('2d');
  if (ctxMix) {
    if (chartChannel) chartChannel.destroy();
    chartChannel = new Chart(ctxMix, {
      type: 'doughnut',
      data: {
        labels: ['Direct Website', 'Corporate Contract', 'Luxury Travel Agent', 'OTA (Booking/Expedia)'],
        datasets: [{
          data: [42, 28, 18, 12],
          backgroundColor: ['#D4AF37', '#3B82F6', '#10B981', '#8B5CF6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94A3B8', boxWidth: 12 } }
        }
      }
    });
  }
}

/* ==========================================================================
   KANBAN BOARD FOR SALES LEADS
   ========================================================================== */

function renderKanbanBoard() {
  const leads = window.crmDataStore.getLeads(currentPropertyId);
  const stages = ['new', 'contacted', 'proposal', 'negotiation', 'closed_won'];

  stages.forEach(stg => {
    const colContainer = document.getElementById(`cards-${stg}`);
    const countBadge = document.getElementById(`count-${stg}`);
    const stageLeads = leads.filter(l => l.stage === stg);

    if (countBadge) countBadge.textContent = stageLeads.length;

    if (colContainer) {
      colContainer.innerHTML = stageLeads.map(lead => `
        <div class="lead-card" draggable="true" ondragstart="dragLead(event, '${lead.id}')" onclick="openEditLeadModal('${lead.id}')">
          <div class="lead-card-header">
            <div class="lead-card-title">${lead.title}</div>
            <div class="lead-value">$${lead.value.toLocaleString()}</div>
          </div>
          <div class="lead-company"><i class="fa-solid fa-building" style="margin-right: 4px;"></i> ${lead.company}</div>
          <div class="lead-meta">
            <span><i class="fa-regular fa-calendar"></i> ${lead.dates}</span>
            <span class="badge badge-gold">${lead.roomsCount} Rooms</span>
          </div>
        </div>
      `).join('');
    }
  });
}

function allowDrop(ev) {
  ev.preventDefault();
}

function dragLead(ev, leadId) {
  ev.dataTransfer.setData('leadId', leadId);
}

function dropLead(ev, targetStage) {
  ev.preventDefault();
  const leadId = ev.dataTransfer.getData('leadId');
  if (leadId) {
    window.crmDataStore.updateLeadStage(leadId, targetStage);
    renderKanbanBoard();
    showToast(`Lead moved to ${targetStage.replace('_', ' ').toUpperCase()}`, 'success');
  }
}

/* ==========================================================================
   360° GUEST PROFILES
   ========================================================================== */

function renderGuestsTable(customList = null) {
  const guests = customList || window.crmDataStore.getGuests();
  const tbody = document.getElementById('guests-table-body');

  tbody.innerHTML = guests.map(g => `
    <tr>
      <td style="font-weight: 600; color: var(--text-primary); cursor: pointer;" onclick="openGuestModal('${g.id}')">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="avatar">${g.name.split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <div>${g.name}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${g.email}</div>
          </div>
        </div>
      </td>
      <td><span class="badge badge-gold">${g.vipLevel}</span></td>
      <td><span class="badge badge-blue">${g.loyaltyTier}</span></td>
      <td>${g.preferredProperty.split(' ')[0]}</td>
      <td style="color: var(--accent-gold); font-weight: 700;">${g.totalSpend}</td>
      <td>${g.totalStays} Stays</td>
      <td>
        <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="openGuestModal('${g.id}')">360° View</button>
        <button class="btn btn-gold" style="padding: 4px 10px; font-size: 11px;" onclick="openGuestChat('${g.id}')"><i class="fa-brands fa-whatsapp"></i></button>
      </td>
    </tr>
  `).join('');
}

function openGuestModal(guestId) {
  const guests = window.crmDataStore.getGuests();
  const g = guests.find(item => item.id === guestId);
  if (!g) return;

  const header = document.getElementById('modal-guest-header');
  const body = document.getElementById('modal-guest-body');

  header.innerHTML = `<i class="fa-solid fa-crown" style="color: var(--accent-gold);"></i> Guest Profile 360°: ${g.name}`;

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
      <!-- Left Column Details -->
      <div style="background: var(--bg-input); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="text-align: center; margin-bottom: 16px;">
          <div class="avatar" style="width: 56px; height: 56px; font-size: 20px; margin: 0 auto 10px auto;">${g.name.split(' ').map(n=>n[0]).join('')}</div>
          <h3 style="font-size: 16px; font-family: var(--font-heading); color: var(--text-primary);">${g.name}</h3>
          <span class="badge badge-gold">${g.vipLevel}</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12px; color: var(--text-secondary);">
          <div><strong style="color: var(--text-primary);">Email:</strong> ${g.email}</div>
          <div><strong style="color: var(--text-primary);">Phone:</strong> ${g.phone}</div>
          <div><strong style="color: var(--text-primary);">Loyalty Status:</strong> ${g.loyaltyTier}</div>
          <div><strong style="color: var(--text-primary);">Lifetime Spend:</strong> <span style="color: var(--accent-gold); font-weight: 700;">${g.totalSpend}</span></div>
          <div><strong style="color: var(--text-primary);">Completed Stays:</strong> ${g.totalStays}</div>
        </div>
      </div>

      <!-- Right Column Preferences & Timeline -->
      <div>
        <h4 style="font-family: var(--font-heading); font-size: 14px; margin-bottom: 10px; color: var(--accent-gold);">Guest Preferences & Special Requirements</h4>
        <div style="background: var(--bg-input); padding: 14px; border-radius: var(--radius-md); margin-bottom: 18px; font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 6px;">
          <div><strong>Room Choice:</strong> ${g.roomPreference}</div>
          <div><strong>Dietary Restrictions:</strong> ${g.dietary}</div>
          <div><strong>Pillow Menu Selection:</strong> ${g.pillowType}</div>
        </div>

        <h4 style="font-family: var(--font-heading); font-size: 14px; margin-bottom: 10px; color: var(--accent-gold);">Guest Journey Timeline</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${g.timeline.map(t => `
            <div style="border-left: 2px solid var(--accent-gold); padding-left: 12px; font-size: 12px;">
              <div style="font-weight: 600; color: var(--text-primary);">${t.event}</div>
              <div style="font-size: 10px; color: var(--text-muted);">${t.date}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  openModal('modal-guest');
}

/* ==========================================================================
   RESERVATIONS TABLE
   ========================================================================== */

function renderReservationsTable() {
  const reservations = window.crmDataStore.getReservations(currentPropertyId);
  const tbody = document.getElementById('reservations-table-body');

  tbody.innerHTML = reservations.map(r => {
    let statusBadge = 'badge-blue';
    if (r.status === 'Checked-In') statusBadge = 'badge-emerald';
    if (r.status === 'Checked-Out') statusBadge = 'badge-rose';

    return `
      <tr>
        <td style="font-weight: 700; color: var(--accent-gold);">${r.id}</td>
        <td style="font-weight: 600; color: var(--text-primary);">${r.guestName}</td>
        <td>${r.propertyName.split(' ')[0]}</td>
        <td><span class="badge badge-gold">Rm ${r.roomNumber || 'TBD'}</span> ${r.roomType}</td>
        <td>${r.checkIn} to ${r.checkOut}</td>
        <td><code>${r.rateCode}</code></td>
        <td style="font-weight: 700; color: var(--text-primary);">${r.amount}</td>
        <td><span class="badge ${statusBadge}">${r.status}</span></td>
      </tr>
    `;
  }).join('');
}

/* ==========================================================================
   CORPORATE ACCOUNTS
   ========================================================================== */

function renderCorporateTable() {
  const accounts = window.crmDataStore.getCorporateAccounts();
  const tbody = document.getElementById('corporate-table-body');

  tbody.innerHTML = accounts.map(c => `
    <tr>
      <td style="font-weight: 600; color: var(--text-primary);">${c.name}</td>
      <td>${c.industry}</td>
      <td style="color: var(--accent-gold); font-weight: 700;">${c.contractedRate}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>${c.nightsBooked} / ${c.annualTarget}</span>
          <div style="flex:1; height: 6px; background: var(--bg-input); border-radius: 3px; overflow: hidden;">
            <div style="width: ${(c.nightsBooked / c.annualTarget)*100}%; background: var(--accent-emerald); height: 100%;"></div>
          </div>
        </div>
      </td>
      <td>${c.accountManager}</td>
      <td>${c.contactPerson}</td>
      <td><span class="badge badge-emerald">${c.status}</span></td>
    </tr>
  `).join('');
}

/* ==========================================================================
   REVIEWS & AI AUTO RESPONSE
   ========================================================================== */

function renderReviewsFeed() {
  const reviews = window.crmDataStore.getReviews();
  const container = document.getElementById('reviews-feed-container');

  container.innerHTML = reviews.map(rev => `
    <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <div>
          <strong style="color: var(--text-primary); font-size: 14px;">${rev.guestName}</strong>
          <span style="font-size: 12px; color: var(--text-muted); margin-left: 8px;">(${rev.source} • ${rev.date})</span>
        </div>
        <div style="color: var(--accent-gold);">
          ${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}
        </div>
      </div>
      <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">"${rev.comment}"</p>
      
      ${rev.responded ? `
        <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid var(--accent-emerald); padding: 10px; border-radius: var(--radius-sm); font-size: 12px; color: var(--text-primary);">
          <strong style="color: var(--accent-emerald);">AI Executive Response Sent:</strong> ${rev.aiResponse}
        </div>
      ` : `
        <button class="btn btn-gold" style="padding: 5px 12px; font-size: 11px;" onclick="generateAIReviewResponse('${rev.id}')">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Generate AI Response
        </button>
      `}
    </div>
  `).join('');
}

function generateAIReviewResponse(reviewId) {
  const reviews = window.crmDataStore.getReviews();
  const rev = reviews.find(r => r.id === reviewId);
  if (!rev) return;

  const sampleResponse = `Dear ${rev.guestName}, thank you for reviewing your stay at ${rev.property}. We are delighted by your feedback regarding our hospitality and have shared your compliments with our operations manager!`;

  window.crmDataStore.saveReviewResponse(reviewId, sampleResponse);
  renderReviewsFeed();
  showToast('AI Response Generated & Sent!', 'success');
}

/* ==========================================================================
   ANALYTICS CHARTS
   ========================================================================== */

function renderAnalyticsCharts() {
  const ctxComp = document.getElementById('chart-property-comparison')?.getContext('2d');
  if (ctxComp) {
    if (chartPropertyComp) chartPropertyComp.destroy();
    chartPropertyComp = new Chart(ctxComp, {
      type: 'bar',
      data: {
        labels: ['Monday Central NYC', 'Monday Resort Miami', 'Monday Grand London', 'Monday Boutique Dubai'],
        datasets: [{
          label: 'Q3 Revenue ($)',
          data: [1420000, 1850000, 1210000, 980000],
          backgroundColor: '#D4AF37',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94A3B8' } } },
        scales: {
          x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  const ctxPipe = document.getElementById('chart-pipeline-stage')?.getContext('2d');
  if (ctxPipe) {
    if (chartPipeline) chartPipeline.destroy();
    chartPipeline = new Chart(ctxPipe, {
      type: 'pie',
      data: {
        labels: ['New Inquiries', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won'],
        datasets: [{
          data: [110000, 62000, 85000, 145000, 210000],
          backgroundColor: ['#3B82F6', '#F59E0B', '#8B5CF6', '#06B6D4', '#10B981']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8' } } }
      }
    });
  }
}

/* ==========================================================================
   WHATSAPP GUEST MESSENGER DRAWER
   ========================================================================== */

function openGuestChat(guestId) {
  const guests = window.crmDataStore.getGuests();
  activeGuestForChat = guests.find(g => g.id === guestId);
  if (!activeGuestForChat) return;

  document.getElementById('drawer-guest-name').textContent = `WhatsApp VIP Concierge: ${activeGuestForChat.name}`;
  
  const historyEl = document.getElementById('chat-history');
  historyEl.innerHTML = `
    <div class="chat-bubble received">
      Hello Monday Hotels Concierge! This is ${activeGuestForChat.name}. Could you please ensure my room has ${activeGuestForChat.pillowType} upon my arrival?
    </div>
    <div class="chat-bubble sent">
      Good day ${activeGuestForChat.name}! Absolutely. Your preferences for ${activeGuestForChat.pillowType} and ${activeGuestForChat.dietary} have been flagged for executive housekeeping.
    </div>
  `;

  document.getElementById('comm-drawer').classList.add('active');
}

function closeDrawer() {
  document.getElementById('comm-drawer').classList.remove('active');
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;

  const historyEl = document.getElementById('chat-history');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble sent';
  bubble.textContent = msg;
  historyEl.appendChild(bubble);

  input.value = '';
  historyEl.scrollTop = historyEl.scrollHeight;

  // Auto simulated reply
  setTimeout(() => {
    const reply = document.createElement('div');
    reply.className = 'chat-bubble received';
    reply.textContent = "Thank you so much! Looking forward to my upcoming stay.";
    historyEl.appendChild(reply);
    historyEl.scrollTop = historyEl.scrollHeight;
  }, 1200);
}

/* ==========================================================================
   MODAL CONTROLLERS & FORM SAVES
   ========================================================================== */

function openModal(modalId) {
  document.getElementById(modalId)?.classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('active');
}

function openNewLeadModal() {
  document.getElementById('form-lead').reset();
  document.getElementById('lead-id').value = '';
  document.getElementById('modal-lead-title').textContent = 'New Corporate Lead';
  openModal('modal-lead');
}

function openEditLeadModal(leadId) {
  const leads = window.crmDataStore.getLeads('all');
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;

  document.getElementById('lead-id').value = lead.id;
  document.getElementById('lead-title-input').value = lead.title;
  document.getElementById('lead-company-input').value = lead.company;
  document.getElementById('lead-property-input').value = lead.propertyId;
  document.getElementById('lead-contact-input').value = lead.contactName;
  document.getElementById('lead-email-input').value = lead.email;
  document.getElementById('lead-value-input').value = lead.value;
  document.getElementById('lead-stage-input').value = lead.stage;
  document.getElementById('lead-notes-input').value = lead.notes || '';

  document.getElementById('modal-lead-title').textContent = `Edit Lead: ${lead.title}`;
  openModal('modal-lead');
}

function handleSaveLead(e) {
  e.preventDefault();
  const propSelect = document.getElementById('lead-property-input');

  const leadData = {
    id: document.getElementById('lead-id').value,
    title: document.getElementById('lead-title-input').value,
    company: document.getElementById('lead-company-input').value,
    propertyId: propSelect.value,
    propertyName: propSelect.options[propSelect.selectedIndex].text,
    contactName: document.getElementById('lead-contact-input').value,
    email: document.getElementById('lead-email-input').value,
    value: parseFloat(document.getElementById('lead-value-input').value) || 0,
    stage: document.getElementById('lead-stage-input').value,
    dates: 'Q4 2026',
    roomsCount: 50,
    notes: document.getElementById('lead-notes-input').value
  };

  window.crmDataStore.saveLead(leadData);
  closeModal('modal-lead');
  renderCurrentView();
  showToast('Lead saved successfully', 'success');
}

function openNewResModal() {
  document.getElementById('form-reservation').reset();
  openModal('modal-reservation');
}

function handleSaveReservation(e) {
  e.preventDefault();
  const propSelect = document.getElementById('res-property-input');

  const resData = {
    guestName: document.getElementById('res-guest-input').value,
    propertyId: propSelect.value,
    propertyName: propSelect.options[propSelect.selectedIndex].text,
    roomType: document.getElementById('res-roomtype-input').value,
    checkIn: document.getElementById('res-checkin-input').value,
    checkOut: document.getElementById('res-checkout-input').value,
    rateCode: document.getElementById('res-ratecode-input').value || 'STANDARD',
    amount: document.getElementById('res-amount-input').value,
    status: 'Confirmed'
  };

  window.crmDataStore.saveReservation(resData);
  closeModal('modal-reservation');
  renderCurrentView();
  showToast('Reservation created!', 'success');
}

function openNewGuestModal() {
  showToast('Guest profile form ready', 'info');
}

/* ==========================================================================
   TOAST NOTIFICATION SYSTEM
   ========================================================================== */

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'warning') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--accent-gold);"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
