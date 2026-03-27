import React, { useState, useEffect } from 'react';
import { Trip, Client, Difficulty, ActivityType, SportsPassport, Review, Guide, ChatConversation, ChatMessage } from '../types';
import Marketplace from './Marketplace';
import Dashboard from './Dashboard';
import ClientProfile from './ClientProfile';
import FeedbackModal from './FeedbackModal';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Mountain, LayoutDashboard, Compass, User, MessageSquare } from 'lucide-react';

// --- HELPER FOR DYNAMIC DATES ---
const getRelativeDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// --- HELPER FOR SPECIFIC EQUIPMENT ---
const getEquipmentForActivity = (type: ActivityType, lang: 'it' | 'en'): string[] => {
  const isIt = lang === 'it';
  switch (type) {
    case ActivityType.SkiTouring:
      return isIt 
        ? ['Sci da alpinismo', 'Pelli di foca', 'ARTVA, Pala, Sonda', 'Rampanti', 'Casco', 'Zaino 30L']
        : ['Touring skis', 'Climbing skins', 'Transceiver, Shovel, Probe', 'Ski crampons', 'Helmet', '30L Backpack'];
    case ActivityType.Climbing:
      return isIt
        ? ['Scarpette d\'arrampicata', 'Imbrago', 'Casco', 'Sacchetto magnesite', 'Corda intera', 'Rinvii']
        : ['Climbing shoes', 'Harness', 'Helmet', 'Chalk bag', 'Single rope', 'Quickdraws'];
    case ActivityType.Mountaineering:
      return isIt
        ? ['Ramponi', 'Piccozza classica', 'Imbrago', 'Casco', 'Scarponi rigidi', 'Abbigliamento a strati']
        : ['Crampons', 'Classic ice axe', 'Harness', 'Helmet', 'Mountaineering boots', 'Layered clothing'];
    case ActivityType.Freeride:
      return isIt
        ? ['Sci da freeride (larghi)', 'Casco', 'Maschera', 'ARTVA, Pala, Sonda', 'Zaino airbag (consigliato)']
        : ['Freeride skis (wide)', 'Helmet', 'Goggles', 'Transceiver, Shovel, Probe', 'Airbag backpack (recommended)'];
    case ActivityType.IceClimbing:
      return isIt
        ? ['2 Piccozze tecniche', 'Ramponi da ghiaccio', 'Scarponi termici', 'Imbrago', 'Casco', 'Viti da ghiaccio']
        : ['2 Technical ice axes', 'Ice crampons', 'Thermal boots', 'Harness', 'Helmet', 'Ice screws'];
    case ActivityType.Canyoning:
      return isIt
        ? ['Muta neoprene 5mm', 'Calzari neoprene', 'Imbrago canyoning', 'Casco', 'Scarpe aderenti']
        : ['5mm Neoprene wetsuit', 'Neoprene booties', 'Canyoning harness', 'Helmet', 'Grippy shoes'];
    case ActivityType.Hiking:
      return isIt
        ? ['Scarponi da trekking', 'Zaino 20-30L', 'Giacca antivento', 'Bastoncini telescopici', 'Borraccia']
        : ['Hiking boots', '20-30L Backpack', 'Windproof jacket', 'Trekking poles', 'Water bottle'];
    default:
      return isIt 
        ? ['Attrezzatura standard', 'Abbigliamento adeguato al meteo'] 
        : ['Standard equipment', 'Weather-appropriate clothing'];
  }
};

// --- TRANSLATION HELPERS FOR DATA ---

const getMockChats = (lang: 'it' | 'en'): { guideChats: ChatConversation[], clientChats: ChatConversation[] } => {
  const isIt = lang === 'it';
  
  const guideChats: ChatConversation[] = [
    {
      id: 'c1',
      participantId: 'client-1',
      participantName: 'Marco Rossi',
      participantAvatar: 'https://ui-avatars.com/api/?name=Marco+Rossi&background=random',
      participantRole: 'Client',
      lastMessage: isIt ? 'Perfetto, ci vediamo al parcheggio alle 8:00.' : 'Perfect, see you at the parking lot at 8:00.',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      unreadCount: 1,
      messages: [
        { id: 'm1', senderId: 'client-1', text: isIt ? 'Ciao Jean-Pierre, per l\'uscita di domani serve il kit da valanga?' : 'Hi Jean-Pierre, do I need the avalanche kit for tomorrow?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true },
        { id: 'm2', senderId: 'me', text: isIt ? 'Ciao Marco! Sì, assolutamente. ARTVA, pala e sonda sono obbligatori.' : 'Hi Marco! Yes, absolutely. Transceiver, shovel, and probe are mandatory.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(), read: true },
        { id: 'm3', senderId: 'client-1', text: isIt ? 'Perfetto, ci vediamo al parcheggio alle 8:00.' : 'Perfect, see you at the parking lot at 8:00.', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false }
      ]
    },
    {
      id: 'c2',
      participantId: 'client-2',
      participantName: 'Elena Bianchi',
      participantAvatar: 'https://ui-avatars.com/api/?name=Elena+Bianchi&background=random',
      participantRole: 'Client',
      lastMessage: isIt ? 'Grazie mille per le informazioni!' : 'Thank you so much for the info!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      unreadCount: 0,
      messages: [
        { id: 'm4', senderId: 'me', text: isIt ? 'Ciao Elena, ho confermato la tua prenotazione per il corso.' : 'Hi Elena, I confirmed your booking for the course.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), read: true },
        { id: 'm5', senderId: 'client-2', text: isIt ? 'Grazie mille per le informazioni!' : 'Thank you so much for the info!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true }
      ]
    }
  ];

  const clientChats: ChatConversation[] = [
    {
      id: 'c1',
      participantId: 'g1',
      participantName: 'Jean-Pierre Luc',
      participantAvatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
      participantRole: 'Guide',
      lastMessage: isIt ? 'Ci vediamo al rifugio!' : 'See you at the hut!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      unreadCount: 0,
      messages: [
        { id: 'm1', senderId: 'me', text: isIt ? 'Ciao, confermi che il meteo è buono per sabato?' : 'Hi, can you confirm the weather is good for Saturday?', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: true },
        { id: 'm2', senderId: 'g1', text: isIt ? 'Sì, previsioni ottime. Sole e zero vento.' : 'Yes, excellent forecast. Sun and zero wind.', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), read: true },
        { id: 'm3', senderId: 'g1', text: isIt ? 'Ci vediamo al rifugio!' : 'See you at the hut!', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: true }
      ]
    }
  ];

  return { guideChats, clientChats };
};

const getMockReviews = (lang: 'it' | 'en'): Review[] => {
  const isIt = lang === 'it';
  return [
    {
      id: 'r1',
      authorName: 'Guida Alpina Marco',
      rating: 5,
      comment: isIt ? 'Cliente eccellente, ottima preparazione fisica e tecnica. Molto rispettoso della montagna.' : 'Excellent client, great physical and technical preparation. Very respectful of the mountain.',
      date: '2023-08-10',
      role: 'Guide'
    },
    {
      id: 'r2',
      authorName: 'Guida Luca B.',
      rating: 4,
      comment: isIt ? 'Buona resistenza, tecnica da affinare sul ripido, ma grande entusiasmo.' : 'Good stamina, technique needs refinement on steep terrain, but great enthusiasm.',
      date: '2023-02-15',
      role: 'Guide'
    }
  ];
};

const getMockClient = (lang: 'it' | 'en'): { main: Client, second: Client, third: Client } => {
  const isIt = lang === 'it';
  const reviews = getMockReviews(lang);

  const main: Client = {
    id: 'client-1',
    name: 'Marco Rossi',
    email: 'marco@test.com',
    passport: {
      level: isIt ? 'Intermedio' : 'Intermediate',
      verified: true,
      yearsExperience: 5,
      lastAscents: ['Gran Paradiso', 'Breithorn Occidentale', 'Piz Palü'],
      fitnessScore: 85,
      technicalScore: 65
    },
    billingInfo: {
      address: 'Via delle Alpi 12',
      city: 'Milano',
      zipCode: '20100',
      country: isIt ? 'Italia' : 'Italy',
      taxId: 'RSSMRC80A01H501U'
    },
    reviews: reviews,
    transactions: [
      {
        id: 'tx-001',
        date: '2023-12-15',
        description: isIt ? 'Acconto prenotazione' : 'Booking deposit',
        amount: 150,
        type: 'deposit',
        status: 'completed',
        guideName: 'Jean-Pierre Luc',
        tripTitle: 'Freeride a Courmayeur',
        method: 'Credit Card'
      },
      {
        id: 'tx-002',
        date: getRelativeDate(-1),
        description: isIt ? 'Saldo finale' : 'Final balance',
        amount: 200,
        type: 'balance',
        status: 'pending',
        guideName: 'Jean-Pierre Luc',
        tripTitle: 'Freeride a Courmayeur',
        method: 'Bank Transfer'
      },
      {
        id: 'tx-003',
        date: '2023-11-20',
        description: isIt ? 'Pagamento completo' : 'Full payment',
        amount: 360,
        type: 'full_payment',
        status: 'completed',
        guideName: 'Sara Conti',
        tripTitle: isIt ? 'Corso Base Arrampicata' : 'Basic Climbing Course',
        method: 'Apple Pay'
      },
      {
        id: 'tx-004',
        date: '2023-10-05',
        description: isIt ? 'Rimborso per maltempo' : 'Refund for bad weather',
        amount: 120,
        type: 'refund',
        status: 'completed',
        guideName: 'Marco Belli',
        tripTitle: 'Canyoning Val Bodengo',
        method: 'Credit Card'
      }
    ]
  };

  const second: Client = {
    id: 'client-2',
    name: 'Elena Bianchi',
    email: 'elena@test.com',
    passport: { ...main.passport, level: isIt ? 'Esperto' : 'Expert', yearsExperience: 8 },
    reviews: [],
    requestedDate: getRelativeDate(2),
    transactions: []
  };

  const third: Client = {
    id: 'client-3',
    name: 'Roberto Verdi',
    email: 'rob@test.com',
    passport: { ...main.passport, level: isIt ? 'Principiante' : 'Beginner', yearsExperience: 1 },
    reviews: [],
    requestedDate: getRelativeDate(5),
    transactions: []
  };

  return { main, second, third };
};

const getMockGuide = (lang: 'it' | 'en'): Guide => {
  const isIt = lang === 'it';
  return {
    id: 'g1',
    name: 'Jean-Pierre Luc',
    email: 'jp.luc@guidealpine.it',
    phoneNumber: '+39 333 1234567',
    avatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
    alboNumber: 'IT-AO-1234',
    bio: isIt 
      ? 'Guida Alpina UIAGM con oltre 15 anni di esperienza. Specializzato in sci alpinismo e alta quota. Vivo a Courmayeur.' 
      : 'UIAGM Alpine Guide with over 15 years of experience. Specialized in ski touring and high altitude mountaineering. Based in Courmayeur.',
    reviews: [
        { id: 'gr1', authorName: 'Paolo V.', rating: 5, comment: isIt ? 'Jean-Pierre è una sicurezza. Conosce il Monte Bianco come le sue tasche.' : 'Jean-Pierre is reliable. He knows Mont Blanc like the back of his hand.', date: '2023-04-12', role: 'Client' },
        { id: 'gr2', authorName: 'Anna S.', rating: 5, comment: isIt ? 'Gita fantastica, grande professionalità e simpatia.' : 'Fantastic trip, great professionalism and friendliness.', date: '2023-08-20', role: 'Client' },
        { id: 'gr3', authorName: 'Mark D.', rating: 4, comment: 'Very good guide, excellent English.', date: '2023-02-10', role: 'Client' }
    ],
    earningsHistory: [
      { month: isIt ? 'Gen' : 'Jan', amount: 3200, tripsCount: 8 },
      { month: isIt ? 'Feb' : 'Feb', amount: 4500, tripsCount: 12 },
      { month: isIt ? 'Mar' : 'Mar', amount: 3800, tripsCount: 10 },
      { month: isIt ? 'Apr' : 'Apr', amount: 2100, tripsCount: 5 },
      { month: isIt ? 'Mag' : 'May', amount: 1500, tripsCount: 4 },
      { month: isIt ? 'Giu' : 'Jun', amount: 4200, tripsCount: 11 },
      { month: isIt ? 'Lug' : 'Jul', amount: 5100, tripsCount: 14 },
      { month: isIt ? 'Ago' : 'Aug', amount: 4800, tripsCount: 13 },
      { month: isIt ? 'Set' : 'Sep', amount: 3000, tripsCount: 7 },
      { month: isIt ? 'Ott' : 'Oct', amount: 1800, tripsCount: 4 },
      { month: isIt ? 'Nov' : 'Nov', amount: 1200, tripsCount: 3 },
      { month: isIt ? 'Dic' : 'Dec', amount: 2900, tripsCount: 8 },
    ],
    marketTrends: [
      { activity: 'Ski Touring', demand: 85 },
      { activity: 'Freeride', demand: 60 },
      { activity: 'Ice Climbing', demand: 30 },
      { activity: isIt ? 'Alpinismo' : 'Mountaineering', demand: 75 },
    ],
    clientOrigins: [
      { region: 'Lombardia', count: 45 },
      { region: 'Piemonte', count: 20 },
      { region: 'Veneto', count: 15 },
      { region: isIt ? 'Estero (UE)' : 'Abroad (EU)', count: 12 },
      { region: isIt ? 'Estero (Extra UE)' : 'Abroad (Non-EU)', count: 8 },
    ],
    clientDemographics: [
      { range: '16-25', count: 12 },
      { range: '26-40', count: 45 },
      { range: '41-55', count: 28 },
      { range: '55-70', count: 10 },
      { range: 'Over 70', count: 5 },
    ],
    activityPerformance: [
      { activity: isIt ? 'Sci Alp.' : 'Ski Tour.', revenue: 90, demand: 85, satisfaction: 95 },
      { activity: isIt ? 'Alpin.' : 'Mount.', revenue: 80, demand: 70, satisfaction: 88 },
      { activity: isIt ? 'Arram.' : 'Climb.', revenue: 60, demand: 50, satisfaction: 92 },
      { activity: 'Freeride', revenue: 75, demand: 65, satisfaction: 90 },
      { activity: 'Canyon.', revenue: 40, demand: 30, satisfaction: 85 },
      { activity: isIt ? 'Ghiac.' : 'Ice', revenue: 55, demand: 40, satisfaction: 98 },
    ],
    invoices: [
      { id: 'INV-001', clientName: 'Mario Rossi', date: '2024-02-10', amount: 350, status: 'Paid' },
      { id: 'INV-002', clientName: 'Giulia Bianchi', date: '2024-02-15', amount: 400, status: 'Pending' },
      { id: 'INV-003', clientName: 'Team RedBull', date: '2024-01-20', amount: 1200, status: 'Paid' },
    ]
  };
};

// --- TRIP GENERATION ---

const LOCATIONS = [
  { loc: 'Courmayeur, AO', lat: 45.7969, lng: 6.9672 },
  { loc: 'Dolomiti, TN', lat: 46.4102, lng: 11.8440 },
  { loc: 'Cervinia, AO', lat: 45.9336, lng: 7.6310 },
  { loc: 'Gran Sasso, AQ', lat: 42.4529, lng: 13.5574 },
  { loc: 'Finale Ligure, SV', lat: 44.1706, lng: 8.3435 },
  { loc: 'Etna, CT', lat: 37.7510, lng: 14.9934 },
  { loc: 'Val di Mello, SO', lat: 46.2084, lng: 9.6322 },
  { loc: 'Adamello, BS', lat: 46.1500, lng: 10.5000 }
];

const getImageForActivity = (type: ActivityType): string => {
  switch (type) {
    case ActivityType.SkiTouring:
      return '/sci.jpg';
    case ActivityType.Climbing:
      return 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop';
    case ActivityType.Mountaineering:
      return 'https://m.petzl.com/sfc/servlet.shepherd/version/download/0681r0000078UZ7AAM';
    case ActivityType.Freeride:
      return 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=800&auto=format&fit=crop';
    case ActivityType.Hiking:
      return 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop';
    case ActivityType.Canyoning:
      return 'https://corsocanyoning.it/crscnynng/wp-content/uploads/2021/03/canyoning-laghetto-san-benedetto-aniene-subiaco-lazio-recovery-energy.jpg';
    case ActivityType.IceClimbing:
      return 'https://www.globalmountain.it/wp-content/uploads/2022/03/corso-cascate-di-ghiaccio-base-5.jpg';
    default:
      return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop';
  }
};

const getActivities = (lang: 'it' | 'en') => [
  { type: ActivityType.SkiTouring, title: lang === 'it' ? 'Avventura Sci Alpinismo' : 'Ski Touring Adventure', diff: Difficulty.Hard, price: 350 },
  { type: ActivityType.Climbing, title: lang === 'it' ? 'Corso Arrampicata' : 'Climbing Course', diff: Difficulty.Moderate, price: 300 },
  { type: ActivityType.Mountaineering, title: lang === 'it' ? 'Salita Classica Vetta' : 'Classic Peak Ascent', diff: Difficulty.Expert, price: 450 },
  { type: ActivityType.Freeride, title: lang === 'it' ? 'Powder Day' : 'Powder Day', diff: Difficulty.Hard, price: 380 },
  { type: ActivityType.Hiking, title: lang === 'it' ? 'Trekking Panoramico' : 'Panoramic Hiking', diff: Difficulty.Easy, price: 150 },
  { type: ActivityType.Canyoning, title: lang === 'it' ? 'Canyoning Experience' : 'Canyoning Experience', diff: Difficulty.Moderate, price: 200 },
];

const GUIDE_NAMES = ['Jean-Pierre Luc', 'Sara Conti', 'Marco Belli', 'Luca Ferrari', 'Giulia Bianchi'];
const GUIDE_AVATARS = [
    'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
    'https://ui-avatars.com/api/?name=Sara+Conti&background=ec4899&color=fff',
    'https://ui-avatars.com/api/?name=Marco+Belli&background=f59e0b&color=fff',
    'https://ui-avatars.com/api/?name=Luca+Ferrari&background=3b82f6&color=fff',
    'https://ui-avatars.com/api/?name=Giulia+Bianchi&background=8b5cf6&color=fff'
];

const getTrips = (lang: 'it' | 'en'): Trip[] => {
  const isIt = lang === 'it';
  const { main: mainClient, second: secondClient, third: thirdClient } = getMockClient(lang);

  const baseTrips: Trip[] = [
    {
      id: 't1',
      title: isIt ? 'Freeride a Courmayeur' : 'Freeride in Courmayeur',
      location: 'Courmayeur, AO',
      coordinates: { lat: 45.7969, lng: 6.9672 },
      date: getRelativeDate(2),
      availableFrom: getRelativeDate(-2),
      availableTo: getRelativeDate(25),
      durationDays: 1,
      price: 350,
      difficulty: Difficulty.Hard,
      activityType: ActivityType.SkiTouring,
      description: isIt 
        ? 'Giornata dedicata al freeride sui pendii del Monte Bianco. Richiesta ottima tecnica di sci fuoripista.' 
        : 'Day dedicated to freeride on the slopes of Mont Blanc. Excellent off-piste skiing technique required.',
      equipment: isIt ? ['ARTVA', 'Pala', 'Sonda', 'Sci larghi'] : ['Transceiver', 'Shovel', 'Probe', 'Wide skis'],
      guideId: 'g1',
      guideName: 'Jean-Pierre Luc',
      guideAvatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
      guideRating: 4.9,
      maxParticipants: 4,
      enrolledClients: [{...secondClient, requestedDate: getRelativeDate(1)}], 
      pendingRequests: [{ ...mainClient, requestedDate: getRelativeDate(2) }],
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=800&auto=format&fit=crop',
      status: 'upcoming',
      paymentStatus: 'deposit'
    },
    {
      id: 't2',
      title: isIt ? 'Corso Base Arrampicata' : 'Basic Climbing Course',
      location: 'Arco, TN',
      coordinates: { lat: 45.9177, lng: 10.8867 },
      date: getRelativeDate(10),
      availableFrom: getRelativeDate(5),
      availableTo: getRelativeDate(60),
      durationDays: 3,
      price: 360,
      difficulty: Difficulty.Easy,
      activityType: ActivityType.Climbing,
      description: isIt 
        ? 'Impara le basi della sicurezza e del movimento in verticale nella mecca dell\'arrampicata italiana. Corso di 3 giorni.' 
        : 'Learn the basics of safety and vertical movement in the Italian climbing mecca. 3-day course.',
      equipment: isIt ? ['Scarpette', 'Imbrago', 'Casco'] : ['Climbing shoes', 'Harness', 'Helmet'],
      guideId: 'g2',
      guideName: 'Sara Conti',
      guideAvatar: 'https://ui-avatars.com/api/?name=Sara+Conti&background=ec4899&color=fff',
      guideRating: 4.8,
      maxParticipants: 6,
      enrolledClients: [],
      pendingRequests: [],
      image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop',
      status: 'upcoming',
      paymentStatus: 'pending'
    },
    {
      id: 't3',
      title: isIt ? 'Corso Cascate Ghiaccio' : 'Ice Climbing Course',
      location: 'Cogne, AO',
      coordinates: { lat: 45.6083, lng: 7.3556 },
      date: getRelativeDate(5),
      availableFrom: getRelativeDate(3),
      availableTo: getRelativeDate(12),
      durationDays: 2,
      price: 400,
      difficulty: Difficulty.Moderate,
      activityType: ActivityType.IceClimbing,
      description: isIt 
        ? 'Introduzione all\'arrampicata su ghiaccio nelle famose cascate di Lillaz.' 
        : 'Introduction to ice climbing in the famous Lillaz waterfalls.',
      equipment: isIt ? ['Ramponi', 'Piccozze', 'Imbrago', 'Casco'] : ['Crampons', 'Ice Axes', 'Harness', 'Helmet'],
      guideId: 'g1',
      guideName: 'Jean-Pierre Luc',
      guideAvatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
      guideRating: 4.9,
      maxParticipants: 4,
      enrolledClients: [{...secondClient, requestedDate: getRelativeDate(5)}],
      pendingRequests: [],
      image: 'https://www.globalmountain.it/wp-content/uploads/2022/03/corso-cascate-di-ghiaccio-base-5.jpg',
      status: 'upcoming',
      paymentStatus: 'pending'
    },
    {
      id: 't4',
      title: 'Haute Route Chamonix-Zermatt',
      location: 'Chamonix, FR',
      coordinates: { lat: 45.9237, lng: 6.8694 },
      date: getRelativeDate(20),
      availableFrom: getRelativeDate(18),
      availableTo: getRelativeDate(25),
      durationDays: 6,
      price: 1200,
      difficulty: Difficulty.Expert,
      activityType: ActivityType.SkiTouring,
      description: isIt 
        ? 'La traversata scialpinistica più famosa delle Alpi. 6 giorni di avventura pura.' 
        : 'The most famous ski mountaineering traverse in the Alps. 6 days of pure adventure.',
      equipment: isIt ? ['Kit completo scialpinismo', 'Ramponi', 'Piccozza', 'Imbrago'] : ['Full ski touring kit', 'Crampons', 'Ice axe', 'Harness'],
      guideId: 'g1',
      guideName: 'Jean-Pierre Luc',
      guideAvatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
      guideRating: 4.9,
      maxParticipants: 6,
      enrolledClients: [],
      pendingRequests: [{ ...mainClient, requestedDate: getRelativeDate(20) }],
      image: '/sci.jpg',
      status: 'upcoming',
      paymentStatus: 'pending'
    },
    {
      id: 't7',
      title: isIt ? 'Ascesa al Gran Paradiso' : 'Gran Paradiso Ascent',
      location: 'Valsavarenche, AO',
      coordinates: { lat: 45.5204, lng: 7.2662 },
      date: getRelativeDate(1),
      availableFrom: getRelativeDate(0),
      availableTo: getRelativeDate(15),
      durationDays: 2,
      price: 450,
      difficulty: Difficulty.Hard,
      activityType: ActivityType.Mountaineering,
      description: isIt 
        ? 'L\'unico 4000 interamente italiano. Salita classica dal rifugio Vittorio Emanuele.' 
        : 'The only 4000m peak entirely in Italy. Classic ascent from Vittorio Emanuele hut.',
      equipment: isIt ? ['Ramponi', 'Piccozza', 'Imbrago', 'Casco'] : ['Crampons', 'Ice axe', 'Harness', 'Helmet'],
      guideId: 'g1',
      guideName: 'Jean-Pierre Luc',
      guideAvatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
      guideRating: 4.9,
      maxParticipants: 4,
      enrolledClients: [{...thirdClient, requestedDate: getRelativeDate(1)}],
      pendingRequests: [],
      image: 'https://m.petzl.com/sfc/servlet.shepherd/version/download/0681r0000078UZ7AAM',
      status: 'upcoming',
      paymentStatus: 'paid'
    }
  ];

  const generatedTrips: Trip[] = [];
  const ACTIVITIES = getActivities(lang);
  const needed = 80;

  for (let i = 0; i < needed; i++) {
      const loc = LOCATIONS[i % LOCATIONS.length];
      const act = ACTIVITIES[i % ACTIVITIES.length];
      const guideIdx = i % GUIDE_NAMES.length;
      
      const offset = Math.floor(Math.random() * 80) - 20; 
      const date = getRelativeDate(offset);
      
      let status: Trip['status'] = 'upcoming';
      let payment: Trip['paymentStatus'] = 'pending';
      
      if (offset < 0) {
          status = Math.random() > 0.8 ? 'cancelled' : 'completed';
          payment = status === 'completed' ? 'paid' : 'deposit';
      } else {
          status = 'upcoming';
          payment = Math.random() > 0.5 ? 'deposit' : 'pending';
      }

      generatedTrips.push({
          id: `gen-${i}`,
          title: `${act.title} @ ${loc.loc.split(',')[0]}`,
          location: loc.loc,
          coordinates: { lat: loc.lat + (Math.random() * 0.05 - 0.025), lng: loc.lng + (Math.random() * 0.05 - 0.025) }, 
          date: date,
          availableFrom: getRelativeDate(offset - 2),
          availableTo: getRelativeDate(offset + 5),
          durationDays: Math.floor(Math.random() * 3) + 1,
          price: act.price + Math.floor(Math.random() * 50),
          difficulty: act.diff,
          activityType: act.type,
          description: isIt 
            ? `Un'esperienza indimenticabile di ${act.type} nella splendida cornice di ${loc.loc}. Adatto a chi cerca avventura e natura.` 
            : `An unforgettable ${act.type} experience in the beautiful setting of ${loc.loc}. Suitable for those seeking adventure and nature.`,
          equipment: getEquipmentForActivity(act.type, lang),
          guideId: `g-${guideIdx}`,
          guideName: GUIDE_NAMES[guideIdx],
          guideAvatar: GUIDE_AVATARS[guideIdx],
          guideRating: 4.5 + (Math.random() * 0.5),
          maxParticipants: 4 + Math.floor(Math.random() * 4),
          enrolledClients: Math.random() > 0.5 ? [{...secondClient, requestedDate: date}] : [],
          pendingRequests: Math.random() > 0.7 ? [{...mainClient, requestedDate: date}] : [],
          image: getImageForActivity(act.type),
          status: status,
          paymentStatus: payment
      });
  }

  const extraGuideTrips: Trip[] = [];
  // Future
  for(let i=0; i<15; i++) {
    const act = ACTIVITIES[i % ACTIVITIES.length];
    const loc = LOCATIONS[i % LOCATIONS.length];
    extraGuideTrips.push({
        id: `g1-future-${i}`,
        title: `${act.title} - ${isIt ? 'Gruppo' : 'Group'} ${i+1}`,
        location: loc.loc,
        coordinates: { lat: loc.lat, lng: loc.lng },
        date: getRelativeDate(3 + i),
        availableFrom: getRelativeDate(1 + i),
        availableTo: getRelativeDate(10 + i),
        durationDays: 1,
        price: act.price,
        difficulty: act.diff,
        activityType: act.type,
        description: isIt ? "Uscita di gruppo organizzata per livelli intermedi." : "Organized group trip for intermediate levels.",
        equipment: getEquipmentForActivity(act.type, lang),
        guideId: 'g1',
        guideName: 'Jean-Pierre Luc',
        guideAvatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
        guideRating: 4.9,
        maxParticipants: 6,
        enrolledClients: [],
        pendingRequests: [],
        image: getImageForActivity(act.type),
        status: 'upcoming',
        paymentStatus: 'pending'
    });
  }
  // Past
  for(let i=0; i<10; i++) {
    const act = ACTIVITIES[(i+2) % ACTIVITIES.length];
    const loc = LOCATIONS[(i+2) % LOCATIONS.length];
    extraGuideTrips.push({
        id: `g1-past-${i}`,
        title: `${act.title} - Session ${i+1}`,
        location: loc.loc,
        coordinates: { lat: loc.lat, lng: loc.lng },
        date: getRelativeDate(-10 - (i*2)),
        availableFrom: getRelativeDate(-15 - (i*2)),
        availableTo: getRelativeDate(-5 - (i*2)),
        durationDays: 1,
        price: act.price,
        difficulty: act.diff,
        activityType: act.type,
        description: isIt ? "Uscita completata con successo." : "Trip completed successfully.",
        equipment: getEquipmentForActivity(act.type, lang),
        guideId: 'g1',
        guideName: 'Jean-Pierre Luc',
        guideAvatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
        guideRating: 4.9,
        maxParticipants: 4,
        enrolledClients: [{...mainClient}, {...secondClient}],
        pendingRequests: [],
        image: getImageForActivity(act.type),
        status: 'completed',
        paymentStatus: 'paid'
    });
  }

  return [...baseTrips, ...generatedTrips, ...extraGuideTrips].sort((a, b) => a.date.localeCompare(b.date));
};

const Navbar = ({ lang }: { lang: 'it' | 'en' }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');
  const isProfile = location.pathname.includes('/profile');
  const isMarketplace = !isDashboard && !isProfile;

  const t = {
    it: {
      market: "Marketplace",
      guideArea: "Area Guide",
      profile: "Area Clienti"
    },
    en: {
      market: "Marketplace",
      guideArea: "Guide Area",
      profile: "Client Area"
    }
  }[lang];

  return (
    <nav className="sticky top-0 z-[1100] bg-white/80 backdrop-blur-md border-b border-slate-200/50 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={`/?lang=${lang}`} className="flex items-center gap-2 group shrink-0">
            <div className="bg-slate-900 p-1.5 rounded-lg text-white transition-transform group-hover:scale-110 duration-300">
              <Mountain size={18} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 hidden sm:block">AlpsConnect</span>
          </Link>
          
          <div className="flex items-center gap-1 md:gap-4 flex-1 justify-end">
            <Link 
              to={`/app?lang=${lang}`} 
              className={`flex flex-col md:flex-row items-center gap-0.5 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg md:rounded-full transition-all ${isMarketplace ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <Compass size={18} className="md:w-5 md:h-5" /> 
              <span className="text-[10px] md:text-sm font-medium">{t.market}</span>
            </Link>
            
            <Link 
              to={`/app/dashboard?lang=${lang}`} 
              className={`flex flex-col md:flex-row items-center gap-0.5 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg md:rounded-full transition-all ${isDashboard ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <LayoutDashboard size={18} className="md:w-5 md:h-5" /> 
              <span className="text-[10px] md:text-sm font-medium">{t.guideArea}</span>
            </Link>
            
            <Link 
              to={`/app/profile?lang=${lang}`} 
              className={`flex flex-col md:flex-row items-center gap-0.5 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg md:rounded-full transition-all ${isProfile ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <User size={18} className="md:w-5 md:h-5" /> 
              <span className="text-[10px] md:text-sm font-medium">{t.profile}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const AlpinaApp = ({ lang }: { lang: 'it' | 'en' }) => {
  // Initialize state with data based on current language
  const [trips, setTrips] = useState<Trip[]>(() => getTrips(lang));
  const [chats, setChats] = useState<{ guideChats: ChatConversation[], clientChats: ChatConversation[] }>(() => getMockChats(lang));
  const [guideData, setGuideData] = useState<Guide>(() => getMockGuide(lang));
  const [clientData, setClientData] = useState<Client>(() => getMockClient(lang).main);
  
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const location = useLocation();

  // Effect to update data when language changes (re-fetch/re-generate mocks)
  useEffect(() => {
     setTrips(getTrips(lang));
     setChats(getMockChats(lang));
     setGuideData(getMockGuide(lang));
     setClientData(getMockClient(lang).main);
  }, [lang]);

  const handleAddTrip = (newTrip: Trip) => {
    setTrips([...trips, newTrip]);
  };

  const handleRequestJoin = (tripId: string, date: string, friendIds?: string[]) => {
    const totalRequests = 1 + (friendIds ? friendIds.length : 0);
    const mockClients = getMockClient(lang);
    
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const newRequests = [...t.pendingRequests, { ...mockClients.main, requestedDate: date }];
        if (friendIds) {
           friendIds.forEach((fid, idx) => {
              newRequests.push({
                 ...mockClients.main, // Simplification for mock
                 id: fid,
                 name: lang === 'it' ? `Amico ${idx + 1}` : `Friend ${idx + 1}`,
                 requestedDate: date
              });
           });
        }
        return { ...t, pendingRequests: newRequests };
      }
      return t;
    }));

    if (totalRequests > 1) {
       alert(lang === 'it' 
         ? `Richiesta inviata per te e ${totalRequests - 1} amici!` 
         : `Request sent for you and ${totalRequests - 1} friends!`);
    } else {
       alert(lang === 'it' ? "Richiesta inviata con successo!" : "Request sent successfully!");
    }
  };

  const handleApproveRequest = (tripId: string, client: Client) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          pendingRequests: t.pendingRequests.filter(req => req.id !== client.id),
          enrolledClients: [...t.enrolledClients, client]
        };
      }
      return t;
    }));
  };

  const t = {
    it: { feedback: "Feedback" },
    en: { feedback: "Feedback" }
  }[lang];

  // Only show trips belonging to the logged-in guide (Mock Guide ID: g1)
  const myTrips = trips.filter(t => t.guideId === 'g1');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar lang={lang} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route 
            path="/" 
            element={<Marketplace trips={trips.filter(t => t.status !== 'cancelled')} onRequestJoin={handleRequestJoin} lang={lang} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard 
                trips={myTrips} 
                onAddTrip={handleAddTrip} 
                onApproveRequest={handleApproveRequest}
                guide={guideData}
                chats={chats.guideChats}
                lang={lang}
              />
            } 
          />
          <Route 
            path="/profile" 
            element={<ClientProfile client={clientData} chats={chats.clientChats} lang={lang} />} 
          />
        </Routes>
      </div>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} lang={lang} /> 

      <button 
         onClick={() => setIsFeedbackOpen(true)}
         className="fixed bottom-6 right-6 z-50 bg-yellow-400 hover:bg-yellow-500 text-slate-900 p-3 md:p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center gap-2 font-bold"
      >
         <MessageSquare size={20} className="md:w-6 md:h-6" />
         <span className="hidden md:inline">{t.feedback}</span>
      </button>
    </div>
  );
};

export default AlpinaApp;