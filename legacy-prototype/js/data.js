/* ==========================================================================
   Monday Hotels Enterprise CRM - Data Store & Local Storage Management
   ========================================================================== */

const INITIAL_PROPERTIES = [
  { id: 'all', name: 'All Properties (Portfolio)' },
  { id: 'mcp', name: 'Monday Central Plaza (NYC)' },
  { id: 'mbr', name: 'Monday Beach Resort & Spa (Miami)' },
  { id: 'mgl', name: 'Monday Grand Luxury (London)' },
  { id: 'mbs', name: 'Monday Boutique Suites (Dubai)' }
];

const INITIAL_LEADS = [
  {
    id: 'LEAD-101',
    title: 'Deloitte Tech Leadership Summit 2026',
    company: 'Deloitte Global',
    contactName: 'Sarah Jenkins',
    email: 'sjenkins@deloitte.com',
    phone: '+1 212-555-0192',
    propertyId: 'mcp',
    propertyName: 'Monday Central Plaza (NYC)',
    value: 85000,
    stage: 'proposal', // new, contacted, proposal, negotiation, closed_won, closed_lost
    dates: 'Nov 12 - Nov 16, 2026',
    roomsCount: 120,
    leadSource: 'Corporate Referral',
    notes: 'Requires ballroom layout for keynotes and private dining set up.'
  },
  {
    id: 'LEAD-102',
    title: 'Luxury Beachfront Wedding Gala',
    company: 'Private Client (Vanderbilt)',
    contactName: 'Marcus Vanderbilt',
    email: 'marcus.v@vanderbilt.org',
    phone: '+1 305-555-8841',
    propertyId: 'mbr',
    propertyName: 'Monday Beach Resort & Spa (Miami)',
    value: 145000,
    stage: 'negotiation',
    dates: 'Dec 20 - Dec 24, 2026',
    roomsCount: 45,
    leadSource: 'Direct Inbound',
    notes: 'VIP Oceanfront Villa block requested. Sunset cocktail reception on terrace.'
  },
  {
    id: 'LEAD-103',
    title: 'Goldman Sachs Q4 Strategy Retreat',
    company: 'Goldman Sachs',
    contactName: 'Elena Rostova',
    email: 'elena.rostova@gs.com',
    phone: '+44 20 7946 0912',
    propertyId: 'mgl',
    propertyName: 'Monday Grand Luxury (London)',
    value: 62000,
    stage: 'contacted',
    dates: 'Oct 15 - Oct 18, 2026',
    roomsCount: 30,
    leadSource: 'Account Manager Outbound',
    notes: 'Full board dining, executive boardroom access with high-spec AV.'
  },
  {
    id: 'LEAD-104',
    title: 'Emirates Aviation Exec Conference',
    company: 'Emirates Group',
    contactName: 'Tariq Al-Mansoor',
    email: 'tariq.m@emirates.com',
    phone: '+971 4 214 4444',
    propertyId: 'mbs',
    propertyName: 'Monday Boutique Suites (Dubai)',
    value: 110000,
    stage: 'new',
    dates: 'Jan 08 - Jan 12, 2027',
    roomsCount: 75,
    leadSource: 'Website Inquiry',
    notes: 'Requires VIP airport chauffeur service for 10 executive guests.'
  },
  {
    id: 'LEAD-105',
    title: 'Microsoft AI Summit Room Block',
    company: 'Microsoft Inc.',
    contactName: 'David Chen',
    email: 'dchen@microsoft.com',
    phone: '+1 425-555-0144',
    propertyId: 'mcp',
    propertyName: 'Monday Central Plaza (NYC)',
    value: 210000,
    stage: 'closed_won',
    dates: 'Nov 01 - Nov 05, 2026',
    roomsCount: 200,
    leadSource: 'Corporate Contract',
    notes: 'Contract signed. Pre-authorization received for F&B expenditure.'
  }
];

const INITIAL_GUESTS = [
  {
    id: 'GST-901',
    name: 'Alexander Wright',
    vipLevel: 'Diamond VIP',
    email: 'a.wright@wrightcapital.com',
    phone: '+1 917-555-3810',
    loyaltyTier: 'Platinum Elite',
    totalSpend: '$42,500',
    totalStays: 14,
    preferredProperty: 'Monday Central Plaza (NYC)',
    roomPreference: 'Corner Executive Suite, High Floor',
    dietary: 'Gluten-Free, Sparkling Water only',
    pillowType: 'Goose Feather Extra Soft',
    lastStay: 'Sep 10, 2026',
    timeline: [
      { date: 'Sep 10, 2026', event: 'Checked in at Monday Central Plaza (Suite 1402)' },
      { date: 'Jun 04, 2026', event: 'Booked Presidential Spa Suite at Miami Resort' },
      { date: 'Feb 18, 2026', event: 'Achieved Platinum Elite Loyalty Tier' }
    ]
  },
  {
    id: 'GST-902',
    name: 'Sophia Martinez',
    vipLevel: 'Gold VIP',
    email: 'sophia.m@designs.co',
    phone: '+1 305-555-7201',
    loyaltyTier: 'Gold Preferred',
    totalSpend: '$18,900',
    totalStays: 8,
    preferredProperty: 'Monday Beach Resort & Spa (Miami)',
    roomPreference: 'Oceanfront Cabana Suite',
    dietary: 'Vegan, Almond Milk Latte',
    pillowType: 'Memory Foam',
    lastStay: 'Aug 28, 2026',
    timeline: [
      { date: 'Aug 28, 2026', event: 'Completed 5-night stay at Monday Beach Resort' },
      { date: 'Jan 12, 2026', event: 'Special Anniversary Guest Welcome Amenity gifted' }
    ]
  },
  {
    id: 'GST-903',
    name: 'Lord Henry Sterling',
    vipLevel: 'Diamond VIP',
    email: 'h.sterling@sterlingholdings.uk',
    phone: '+44 7700 900123',
    loyaltyTier: 'Diamond Black',
    totalSpend: '$89,400',
    totalStays: 26,
    preferredProperty: 'Monday Grand Luxury (London)',
    roomPreference: 'Royal Penthouse Suite',
    dietary: 'Earl Grey Tea at 7:00 AM, Organic breakfast',
    pillowType: 'Hypoallergenic Silk',
    lastStay: 'Sep 18, 2026',
    timeline: [
      { date: 'Sep 18, 2026', event: 'Private Airport Chauffeur pick-up from Heathrow' },
      { date: 'Jul 22, 2026', event: 'Hosted Private Board Dinner at London Grand Grill' }
    ]
  },
  {
    id: 'GST-904',
    name: 'Fatima Al-Hassan',
    vipLevel: 'Platinum VIP',
    email: 'fatima.alhassan@investment.ae',
    phone: '+971 50 123 4567',
    loyaltyTier: 'Platinum Elite',
    totalSpend: '$56,000',
    totalStays: 19,
    preferredProperty: 'Monday Boutique Suites (Dubai)',
    roomPreference: 'Sky Villa with Private Pool',
    dietary: 'Halal Fine Dining, Fresh Detox Juices',
    pillowType: 'Lavender Infused Down',
    lastStay: 'Sep 02, 2026',
    timeline: [
      { date: 'Sep 02, 2026', event: 'Spa Package Redemption (Hammams & Aromatherapy)' }
    ]
  }
];

const INITIAL_RESERVATIONS = [
  {
    id: 'RES-8801',
    guestName: 'Alexander Wright',
    propertyId: 'mcp',
    propertyName: 'Monday Central Plaza (NYC)',
    roomNumber: '1402',
    roomType: 'Executive Suite',
    checkIn: '2026-09-24',
    checkOut: '2026-09-28',
    status: 'Checked-In',
    rateCode: 'CORP-DELOITTE',
    amount: '$2,800'
  },
  {
    id: 'RES-8802',
    guestName: 'Sophia Martinez',
    propertyId: 'mbr',
    propertyName: 'Monday Beach Resort & Spa (Miami)',
    roomNumber: '304',
    roomType: 'Oceanfront Cabana',
    checkIn: '2026-09-25',
    checkOut: '2026-09-30',
    status: 'Confirmed',
    rateCode: 'RACK-STANDARD',
    amount: '$3,450'
  },
  {
    id: 'RES-8803',
    guestName: 'Lord Henry Sterling',
    propertyId: 'mgl',
    propertyName: 'Monday Grand Luxury (London)',
    roomNumber: 'PH-01',
    roomType: 'Royal Penthouse',
    checkIn: '2026-10-01',
    checkOut: '2026-10-07',
    status: 'Confirmed',
    rateCode: 'VIP-DIAMOND',
    amount: '$14,200'
  },
  {
    id: 'RES-8804',
    guestName: 'Dr. Robert Vance',
    propertyId: 'mbs',
    propertyName: 'Monday Boutique Suites (Dubai)',
    roomNumber: '809',
    roomType: 'Sky Deluxe Suite',
    checkIn: '2026-09-23',
    checkOut: '2026-09-26',
    status: 'Checked-In',
    rateCode: 'DIRECT-WEB',
    amount: '$1,950'
  },
  {
    id: 'RES-8805',
    guestName: 'Emily & James Thorne',
    propertyId: 'mbr',
    propertyName: 'Monday Beach Resort & Spa (Miami)',
    roomNumber: '112',
    roomType: 'Garden Villa',
    checkIn: '2026-09-22',
    checkOut: '2026-09-24',
    status: 'Checked-Out',
    rateCode: 'PROMO-HONEYMOON',
    amount: '$2,100'
  }
];

const INITIAL_CORPORATE_ACCOUNTS = [
  {
    id: 'CORP-01',
    name: 'Deloitte Global',
    industry: 'Management Consulting',
    contractedRate: '$420 / night',
    annualTarget: 800,
    nightsBooked: 640,
    accountManager: 'Victoria Sterling',
    contactPerson: 'Sarah Jenkins',
    status: 'Active'
  },
  {
    id: 'CORP-02',
    name: 'Goldman Sachs',
    industry: 'Financial Services',
    contractedRate: '$490 / night',
    annualTarget: 1200,
    nightsBooked: 1050,
    accountManager: 'Marcus Brody',
    contactPerson: 'Elena Rostova',
    status: 'Active'
  },
  {
    id: 'CORP-03',
    name: 'Microsoft Corporation',
    industry: 'Technology',
    contractedRate: '$450 / night',
    annualTarget: 1500,
    nightsBooked: 1380,
    accountManager: 'Victoria Sterling',
    contactPerson: 'David Chen',
    status: 'Active'
  },
  {
    id: 'CORP-04',
    name: 'Emirates Aviation',
    industry: 'Airlines & Aerospace',
    contractedRate: '$380 / night',
    annualTarget: 600,
    nightsBooked: 410,
    accountManager: 'Zaid Al-Harthy',
    contactPerson: 'Tariq Al-Mansoor',
    status: 'Under Review'
  }
];

const INITIAL_REVIEWS = [
  {
    id: 'REV-501',
    guestName: 'Claire D.',
    property: 'Monday Central Plaza (NYC)',
    source: 'Google Reviews',
    rating: 5,
    date: 'Sep 21, 2026',
    comment: 'Exceptional service! The concierge arranged last-minute Broadway tickets for our family. The rooftop cocktail bar views of Manhattan are stunning.',
    sentiment: 'Positive',
    aiResponse: 'Dear Claire, thank you for sharing your wonderful experience at Monday Central Plaza. We are delighted our concierge team exceeded your expectations!',
    responded: true
  },
  {
    id: 'REV-502',
    guestName: 'Mark Thompson',
    property: 'Monday Beach Resort & Spa (Miami)',
    source: 'TripAdvisor',
    rating: 4,
    date: 'Sep 19, 2026',
    comment: 'Beautiful ocean views and private beach access. Room service was slightly delayed on Friday evening, but overall a luxury experience.',
    sentiment: 'Neutral / Positive',
    aiResponse: '',
    responded: false
  },
  {
    id: 'REV-503',
    guestName: 'Sir Arthur Pendelton',
    property: 'Monday Grand Luxury (London)',
    source: 'Booking.com',
    rating: 5,
    date: 'Sep 15, 2026',
    comment: 'Flawless British hospitality at its finest. The afternoon tea experience is world-class.',
    sentiment: 'Positive',
    aiResponse: 'Thank you Sir Arthur for your gracious praise. We look forward to welcoming you back to Monday Grand Luxury.',
    responded: true
  }
];

// CRM Data Store Object
class CRMDataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('monday_properties')) {
      localStorage.setItem('monday_properties', JSON.stringify(INITIAL_PROPERTIES));
    }
    if (!localStorage.getItem('monday_leads')) {
      localStorage.setItem('monday_leads', JSON.stringify(INITIAL_LEADS));
    }
    if (!localStorage.getItem('monday_guests')) {
      localStorage.setItem('monday_guests', JSON.stringify(INITIAL_GUESTS));
    }
    if (!localStorage.getItem('monday_reservations')) {
      localStorage.setItem('monday_reservations', JSON.stringify(INITIAL_RESERVATIONS));
    }
    if (!localStorage.getItem('monday_corporate')) {
      localStorage.setItem('monday_corporate', JSON.stringify(INITIAL_CORPORATE_ACCOUNTS));
    }
    if (!localStorage.getItem('monday_reviews')) {
      localStorage.setItem('monday_reviews', JSON.stringify(INITIAL_REVIEWS));
    }
  }

  getProperties() {
    return JSON.parse(localStorage.getItem('monday_properties')) || INITIAL_PROPERTIES;
  }

  getLeads(propertyId = 'all') {
    const leads = JSON.parse(localStorage.getItem('monday_leads')) || INITIAL_LEADS;
    if (propertyId === 'all') return leads;
    return leads.filter(l => l.propertyId === propertyId);
  }

  saveLead(lead) {
    const leads = this.getLeads('all');
    if (lead.id) {
      const idx = leads.findIndex(l => l.id === lead.id);
      if (idx !== -1) leads[idx] = lead;
    } else {
      lead.id = 'LEAD-' + Math.floor(100 + Math.random() * 900);
      leads.unshift(lead);
    }
    localStorage.setItem('monday_leads', JSON.stringify(leads));
    return lead;
  }

  updateLeadStage(leadId, newStage) {
    const leads = this.getLeads('all');
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      lead.stage = newStage;
      localStorage.setItem('monday_leads', JSON.stringify(leads));
    }
  }

  getGuests() {
    return JSON.parse(localStorage.getItem('monday_guests')) || INITIAL_GUESTS;
  }

  saveGuest(guest) {
    const guests = this.getGuests();
    if (guest.id) {
      const idx = guests.findIndex(g => g.id === guest.id);
      if (idx !== -1) guests[idx] = guest;
    } else {
      guest.id = 'GST-' + Math.floor(900 + Math.random() * 100);
      guest.timeline = [{ date: new Date().toLocaleDateString(), event: 'Profile created in CRM' }];
      guests.unshift(guest);
    }
    localStorage.setItem('monday_guests', JSON.stringify(guests));
    return guest;
  }

  getReservations(propertyId = 'all') {
    const reservations = JSON.parse(localStorage.getItem('monday_reservations')) || INITIAL_RESERVATIONS;
    if (propertyId === 'all') return reservations;
    return reservations.filter(r => r.propertyId === propertyId);
  }

  saveReservation(res) {
    const reservations = this.getReservations('all');
    if (res.id) {
      const idx = reservations.findIndex(r => r.id === res.id);
      if (idx !== -1) reservations[idx] = res;
    } else {
      res.id = 'RES-' + Math.floor(8800 + Math.random() * 100);
      reservations.unshift(res);
    }
    localStorage.setItem('monday_reservations', JSON.stringify(reservations));
    return res;
  }

  getCorporateAccounts() {
    return JSON.parse(localStorage.getItem('monday_corporate')) || INITIAL_CORPORATE_ACCOUNTS;
  }

  getReviews() {
    return JSON.parse(localStorage.getItem('monday_reviews')) || INITIAL_REVIEWS;
  }

  saveReviewResponse(reviewId, aiResponseText) {
    const reviews = this.getReviews();
    const rev = reviews.find(r => r.id === reviewId);
    if (rev) {
      rev.aiResponse = aiResponseText;
      rev.responded = true;
      localStorage.setItem('monday_reviews', JSON.stringify(reviews));
    }
  }
}

window.crmDataStore = new CRMDataStore();
