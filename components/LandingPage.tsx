import React, { useState, useEffect, useRef } from 'react';
import { Mountain, Shield, LayoutDashboard, ArrowRight, Star, Globe, Users, Share2, MessageSquare, BarChart, Languages, Calendar, CheckCircle, CreditCard, Activity, Search, ExternalLink, CloudSun, TrendingUp, AlertTriangle, Construction, Compass, MapPin, GraduationCap, Snowflake, Waves, Wind, Footprints } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeedbackModal from './FeedbackModal';
import StatsModal from './StatsModal';

const LandingPage = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [lang, setLang] = useState<'it' | 'en'>('it');
  const [activeFeatureTab, setActiveFeatureTab] = useState<'client' | 'guide'>('client');
  const navigate = useNavigate();
  
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === true) return;
    effectRan.current = true;

    try {
        if (!localStorage.getItem('ac_stats_start')) {
            localStorage.setItem('ac_stats_start', new Date().toISOString());
        }
        localStorage.setItem('ac_stats_last', new Date().toISOString());

        const storageKey = 'ac_stats_views';
        const rawViews = localStorage.getItem(storageKey);
        let currentViews = 0;

        if (rawViews) {
            const parsed = parseInt(rawViews, 10);
            if (!isNaN(parsed)) {
                currentViews = parsed;
            }
        }
        localStorage.setItem(storageKey, (currentViews + 1).toString());
    } catch (e) {
        console.error("Local Storage Error:", e);
    }
  }, []);
  
  const handleEnterApp = (e?: React.MouseEvent) => {
    if(e) e.preventDefault();
    navigate(`/app?lang=${lang}`);
    window.scrollTo(0, 0);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'AlpsConnect MVP',
      text: lang === 'it' 
        ? 'Prova il prototipo di AlpsConnect e aiutaci a costruirlo!' 
        : 'Try the AlpsConnect prototype and help us build it!',
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.debug('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert(lang === 'it' ? 'Link copiato!' : 'Link copied!');
      } catch (err) {
        alert('Error copying link.');
      }
    }
  };

  const t = {
    it: {
      mvpBanner: "🚧 Questa è una versione DEMO/MVP. Stiamo raccogliendo feedback per sviluppare l'app finale. Dicci la tua!",
      prototypeBadge: "PROTOTIPO FUNZIONANTE",
      share: "Condividi",
      demoBtn: "Prova Demo",
      heroTitle: <>Trova la tua Guida per<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">ogni avventura.</span></>,
      heroSub: "Il marketplace per connettere Guide e appassionati. Questa è una simulazione interattiva: esplora le funzionalità e dacci la tua opinione per aiutarci a creare lo strumento perfetto.",
      ctaStart: "Prova Demo",
      ctaFeedback: "Lascia Feedback",
      ctaNote: "La tua opinione è fondamentale per passare dal prototipo alla realtà.",
      activitiesList: "SCI ALPINISMO • ARRAMPICATA • TREKKING • ALPINISMO • FREERIDE • GHIACCIO • CANYONING",
      
      guideSecTitle: "Cosa offre una Guida Alpina",
      guideSecSub: "La Guida Alpina è l'unica figura professionale abilitata per legge (UIAGM/IFMGA) ad accompagnare e insegnare su terreno d'avventura. Sicurezza, tecnica e passione.",
      
      formationTitle: "Una formazione d'eccellenza",
      formationDesc: "Il percorso per diventare Guida Alpina dura quasi 4 anni ed è tra i più selettivi al mondo. Richiede il superamento di severi esami pratici su roccia, ghiaccio e sci, oltre a competenze avanzate di nivologia, meteorologia e soccorso.",

      actSki: "Sci Alpinismo",
      actSkiDesc: "L'essenza dello sci: salire con le pelli in ambienti incontaminati e scendere su neve fresca lontani dalla folla. Richiede gestione dello sforzo e conoscenza della neve.",
      actSkiEx: "Haute Route Chamonix-Zermatt, Traversata del Gran Paradiso, Etna Nord.",

      actClimb: "Arrampicata",
      actClimbDesc: "La danza verticale su roccia. Dai corsi base in falesia monotiro alle grandi vie lunghe (multipitch) classiche e moderne in ambiente alpino.",
      actClimbEx: "Tre Cime di Lavaredo, Arco di Trento, Verdon, Valle dell'Orco.",

      actAlp: "Alpinismo",
      actAlpDesc: "L'arte di muoversi in alta quota su terreno misto (roccia, neve, ghiaccio) per raggiungere le vette più ambite. L'apice dell'esperienza in montagna.",
      actAlpEx: "Monte Bianco, Cervino, Cresta del Leone, Piz Bernina.",

      actIce: "Cascate di Ghiaccio",
      actIceDesc: "Scalata tecnica su effimeri flussi d'acqua gelata. Un'attività invernale affascinante che richiede uso di piccozze, ramponi e gestione del freddo.",
      actIceEx: "Cogne (Lillaz), Kandersteg, Val Daone, Sappada.",

      actFreeride: "Freeride",
      actFreerideDesc: "Massimizza il divertimento in discesa utilizzando gli impianti per la salita. Canali ripidi, boschetti e pendii aperti in neve polverosa.",
      actFreerideEx: "Vallée Blanche, Marmolada, La Grave, Monte Rosa.",

      actCanyoning: "Canyoning",
      actCanyoningDesc: "Segui il corso dell'acqua calandoti in forre scavate nella roccia millenaria. Tuffi, scivoli naturali (toboga) e calate in corda doppia.",
      actCanyoningEx: "Val Bodengo, Gole dell'Alcantara, Ticino, Val di Mello.",

      exLabel: "Esempi:",

      featuresTitle: "Obiettivi del Progetto",
      featuresSub: "Ecco le funzionalità che stiamo progettando per la versione finale.",
      tabClient: "Per Appassionati",
      tabGuide: "Per Guide Alpine",
      
      c1Title: "Marketplace Globale",
      c1Desc: "Trova avventure in tutto il mondo con filtri avanzati per attività e difficoltà.",
      c2Title: "Calendario Smart & Meteo",
      c2Desc: "Prenotazione intelligente che incrocia disponibilità e meteo previsto per la data scelta.",
      c3Title: "Diario Sportivo & Sync",
      c3Desc: "Sincronizza Strava o Garmin. Tieni traccia delle ascese e certifica il tuo livello.",
      c4Title: "Chat Diretta",
      c4Desc: "Parla direttamente con la tua guida prima di prenotare per personalizzare l'esperienza.",

      g1Title: "Gestionale & Meteo",
      g1Desc: "Dashboard operativa con calendario integrato alle previsioni meteo locali per ogni uscita.",
      g2Title: "Fatturazione Automatica",
      g2Desc: "Generazione automatica di fatture individuali per ciascun partecipante di ogni gita.",
      g3Title: "Check esperienza clienti",
      g3Desc: "Visualizza il diario sportivo dei clienti per valutare l'idoneità tecnica.",
      g4Title: "Business Analytics",
      g4Desc: "Analizza i trend del momento e scopri dove c'è più richiesta per le tue attività.",

      demoTitle: "Esplora la Simulazione",
      demoDesc: "Interagisci con l'interfaccia reale del nostro MVP. I dati sono dimostrativi, ma l'esperienza utente è quella che vogliamo costruire.",
      systemOnline: "Demo Online",
      footerDesc: "Connettiamo passione e professionalità. Costruiamo insieme il futuro dell'alpinismo.",
      product: "Prodotto",
      company: "Compagnia",
      feedbackTitle: "Supportaci",
      feedbackDesc: "Ti piace l'idea? Hai suggerimenti? Scrivici.",
      rights: "Tutti i diritti riservati.",
      adminStats: "Statistiche Admin",
      launchApp: "Lancia Demo",
      launchSub: "Accedi all'applicazione dimostrativa."
    },
    en: {
      mvpBanner: "🚧 This is a DEMO/MVP version. We are collecting feedback to develop the final app. Tell us what you think!",
      prototypeBadge: "WORKING PROTOTYPE",
      share: "Share",
      demoBtn: "Try Demo",
      heroTitle: <>Find your Guide for <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">every adventure.</span></>,
      heroSub: "The marketplace connecting Guides and enthusiasts. This is an interactive simulation: explore features and give us your opinion to help us create the perfect tool.",
      ctaStart: "Try Demo",
      ctaFeedback: "Leave Feedback",
      ctaNote: "Your opinion is fundamental to move from prototype to reality.",
      activitiesList: "SKI TOURING • CLIMBING • TREKKING • MOUNTAINEERING • FREERIDE • ICE • CANYONING",
      
      guideSecTitle: "What an Alpine Guide offers",
      guideSecSub: "The Alpine Guide is the only professional figure legally authorized (UIAGM/IFMGA) to accompany and teach on adventure terrain. Safety, technique, and passion.",
      
      formationTitle: "Excellence in training",
      formationDesc: "The path to becoming an Alpine Guide lasts almost 4 years and is among the most selective in the world. It requires passing severe practical exams on rock, ice, and skis, as well as advanced skills in nivology, meteorology, and rescue.",

      actSki: "Ski Touring",
      actSkiDesc: "The essence of skiing: going up with skins in pristine environments and skiing down on fresh snow away from crowds. Requires effort management and snow knowledge.",
      actSkiEx: "Haute Route Chamonix-Zermatt, Gran Paradiso Traverse, Etna North.",

      actClimb: "Climbing",
      actClimbDesc: "The vertical dance on rock. From basic single-pitch crag courses to great classic and modern multi-pitch routes in alpine environments.",
      actClimbEx: "Tre Cime di Lavaredo, Arco di Trento, Verdon, Valle dell'Orco.",

      actAlp: "Mountaineering",
      actAlpDesc: "The art of moving at high altitude on mixed terrain (rock, snow, ice) to reach the most coveted peaks. The pinnacle of mountain experience.",
      actAlpEx: "Mont Blanc, Matterhorn, Lion Ridge, Piz Bernina.",

      actIce: "Ice Climbing",
      actIceDesc: "Technical climbing on ephemeral frozen water flows. A fascinating winter activity requiring ice axes, crampons, and cold management.",
      actIceEx: "Cogne (Lillaz), Kandersteg, Val Daone, Sappada.",

      actFreeride: "Freeride",
      actFreerideDesc: "Maximize downhill fun using lifts for the ascent. Steep couloirs, forests, and open powder slopes.",
      actFreerideEx: "Vallée Blanche, Marmolada, La Grave, Monte Rosa.",

      actCanyoning: "Canyoning",
      actCanyoningDesc: "Follow the water course descending into gorges carved in millennial rock. Jumps, natural slides (toboggans), and rappelling.",
      actCanyoningEx: "Val Bodengo, Alcantara Gorges, Ticino, Val di Mello.",

      exLabel: "Examples:",

      featuresTitle: "Project Goals",
      featuresSub: "Here are the features we are designing for the final version.",
      tabClient: "For Enthusiasts",
      tabGuide: "For Alpine Guides",
      
      c1Title: "Global Marketplace",
      c1Desc: "Find adventures worldwide with advanced filters for activity and difficulty.",
      c2Title: "Smart Calendar & Weather",
      c2Desc: "Smart booking that matches availability with forecasted weather for the chosen date.",
      c3Title: "Sports Log & Sync",
      c3Desc: "Sync Strava or Garmin. Keep track of ascents and certify your level.",
      c4Title: "Direct Chat",
      c4Desc: "Talk directly with your guide before booking to customize the experience.",

      g1Title: "Management & Weather",
      g1Desc: "Operational dashboard with calendar integrated with local weather forecasts for each trip.",
      g2Title: "Auto Invoicing",
      g2Desc: "Automatic generation of individual invoices for each participant of every trip.",
      g3Title: "Client Experience Check",
      g3Desc: "View clients' sports logs to assess technical suitability.",
      g4Title: "Business Analytics",
      g4Desc: "Analyze current trends and discover where there is more demand for your activities.",

      demoTitle: "Explore the Simulation",
      demoDesc: "Interact with the real interface of our MVP. The data is demonstrative, but the user experience is what we want to build.",
      systemOnline: "Demo Online",
      footerDesc: "Connecting passion and professionalism. Building the future of mountaineering together.",
      product: "Product",
      company: "Company",
      feedbackTitle: "Support Us",
      feedbackDesc: "Like the idea? Have suggestions? Write to us.",
      rights: "All rights reserved.",
      adminStats: "Admin Stats",
      launchApp: "Launch Demo",
      launchSub: "Access the demo application."
    }
  }[lang];

  // Activities now use icons and colors instead of images
  const guideActivities = [
    { 
        title: t.actSki, 
        desc: t.actSkiDesc, 
        ex: t.actSkiEx, 
        icon: Snowflake,
        color: "bg-blue-600",
        image: "/sci.jpg"
    },
    { 
        title: t.actClimb, 
        desc: t.actClimbDesc, 
        ex: t.actClimbEx, 
        icon: Mountain,
        color: "bg-orange-500",
        image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop"
    },
    { 
        title: t.actAlp, 
        desc: t.actAlpDesc, 
        ex: t.actAlpEx, 
        icon: Footprints,
        color: "bg-red-600",
        image: "https://m.petzl.com/sfc/servlet.shepherd/version/download/0681r0000078UZ7AAM"
    },
    { 
        title: t.actIce, 
        desc: t.actIceDesc, 
        ex: t.actIceEx, 
        icon: Construction, 
        color: "bg-cyan-500",
        image: "https://www.globalmountain.it/wp-content/uploads/2022/03/corso-cascate-di-ghiaccio-base-5.jpg"
    },
    { 
        title: t.actFreeride, 
        desc: t.actFreerideDesc, 
        ex: t.actFreerideEx, 
        icon: Wind,
        color: "bg-indigo-600",
        image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=800&auto=format&fit=crop"
    },
    { 
        title: t.actCanyoning, 
        desc: t.actCanyoningDesc, 
        ex: t.actCanyoningEx, 
        icon: Waves,
        color: "bg-teal-600",
        image: "https://corsocanyoning.it/crscnynng/wp-content/uploads/2021/03/canyoning-laghetto-san-benedetto-aniene-subiaco-lazio-recovery-energy.jpg"
    },
  ];

  const clientFeatures = [
    { icon: Search, title: t.c1Title, desc: t.c1Desc },
    { icon: CloudSun, title: t.c2Title, desc: t.c2Desc },
    { icon: Activity, title: t.c3Title, desc: t.c3Desc },
    { icon: MessageSquare, title: t.c4Title, desc: t.c4Desc },
  ];

  const guideFeatures = [
    { icon: LayoutDashboard, title: t.g1Title, desc: t.g1Desc },
    { icon: Shield, title: t.g2Title, desc: t.g2Desc },
    { icon: Users, title: t.g3Title, desc: t.g3Desc },
    { icon: TrendingUp, title: t.g4Title, desc: t.g4Desc },
  ];

  return (
    <div className="font-sans text-slate-900 bg-white relative">
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} lang={lang} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />

      {/* TOP BANNER */}
      <div className="bg-indigo-600 text-white px-4 py-2.5 text-center text-xs md:text-sm font-bold relative z-50 flex items-center justify-center gap-2 shadow-sm">
         <Construction size={16} className="text-indigo-200" />
         {t.mvpBanner}
      </div>

      {/* --- HERO SECTION --- */}
      <div className="relative min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="absolute top-0 w-full z-20 px-4 py-4 md:px-6 md:py-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
          <div className="flex items-center gap-2">
             <div className="bg-white p-1.5 md:p-2 rounded-xl">
               <Mountain size={20} className="text-slate-900 md:w-6 md:h-6" strokeWidth={2.5} />
             </div>
             <span className="font-bold text-lg md:text-xl tracking-tight text-white drop-shadow-md">AlpsConnect</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <button 
                onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-2.5 py-2 md:px-3 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer border border-white/10"
            >
                <img 
                  src={lang === 'it' ? "https://flagcdn.com/w40/it.png" : "https://flagcdn.com/w40/gb.png"} 
                  alt={lang === 'it' ? "Italiano" : "English"}
                  className="w-4 h-3 md:w-5 md:h-3.5 object-cover rounded-[2px]"
                />
                <span>{lang.toUpperCase()}</span>
            </button>

            <button 
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-3 py-2 md:px-4 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer border border-white/10"
              title={t.share}
            >
              <Share2 size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">{t.share}</span>
            </button>
          </div>
        </nav>

        {/* Hero Content - KEEPING IMAGE HERE AS REQUESTED */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
           <img 
             src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
             className="absolute inset-0 w-full h-full object-cover"
             alt="Mountains"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/40"></div>
           
           <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16 md:mt-20">
              <div className="mb-4 text-[10px] sm:text-xs md:text-sm font-bold tracking-widest text-blue-100/90 uppercase select-none">
                {t.activitiesList}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 md:mb-6 drop-shadow-xl leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-base md:text-xl text-slate-200 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                {t.heroSub}
              </p>
              
              <div className="flex flex-row gap-3 md:gap-4 justify-center items-center">
                 <button 
                   onClick={handleEnterApp}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-none"
                 >
                   {t.ctaStart} <ArrowRight size={18} className="md:w-5 md:h-5"/>
                 </button>
                 <button 
                   onClick={() => setIsFeedbackOpen(true)}
                   className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-4 py-2.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-none"
                 >
                   <MessageSquare size={18} className="md:w-5 md:h-5" /> {t.ctaFeedback}
                 </button>
              </div>
              <p className="mt-4 text-blue-100 text-xs md:text-sm font-medium">{t.ctaNote}</p>
           </div>
        </div>
      </div>

      {/* --- NEW SECTION: COSA E' UNA GUIDA --- */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200">
                    <Shield size={14} className="text-blue-600" /> UIAGM / IFMGA Certified
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">{t.guideSecTitle}</h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed mb-8">
                    {t.guideSecSub}
                </p>

                <div className="max-w-3xl mx-auto bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex flex-col md:flex-row gap-4 text-left shadow-sm">
                    <div className="bg-white p-3 rounded-full shadow-sm shrink-0 h-fit w-fit mx-auto md:mx-0">
                        <GraduationCap className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-2 text-center md:text-left text-lg">{t.formationTitle}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed text-center md:text-left">{t.formationDesc}</p>
                    </div>
                </div>
            </div>

            {/* CARDS MODIFIED: Abstract design (Icon + Color) instead of Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guideActivities.map((act, i) => (
                    <div key={i} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col cursor-default">
                        {/* Image or Abstract Color Header */}
                        <div className={`h-40 ${act.color} relative shrink-0 flex items-center justify-center overflow-hidden`}>
                            {act.image ? (
                                <img src={act.image} alt={act.title} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm relative z-10">
                                    <act.icon size={40} className="text-white" />
                                </div>
                            )}
                            
                            {/* GA Badge instead of Avatar Image */}
                            <div className="absolute -bottom-5 right-4 z-20">
                                <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 shadow-md flex items-center justify-center font-bold text-slate-600 text-sm">
                                    GA
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 flex-1 flex flex-col pt-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{act.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                               {act.desc}
                            </p>
                            
                            <div className="pt-4 border-t border-slate-100 mt-auto">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 block">{t.exLabel}</span>
                                <div className="flex items-start gap-1.5 text-xs text-slate-700 font-medium">
                                    <MapPin size={12} className="text-blue-500 mt-0.5 shrink-0" />
                                    <span>{act.ex}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-16 md:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{t.featuresTitle}</h2>
              <p className="text-slate-500 max-w-2xl mx-auto mb-8 text-sm md:text-base">{t.featuresSub}</p>
              
              <div className="inline-flex bg-white p-1 rounded-full border border-slate-200 shadow-sm">
                 <button 
                   onClick={() => setActiveFeatureTab('client')}
                   className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${activeFeatureTab === 'client' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                 >
                   {t.tabClient}
                 </button>
                 <button 
                   onClick={() => setActiveFeatureTab('guide')}
                   className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${activeFeatureTab === 'guide' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                 >
                   {t.tabGuide}
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {(activeFeatureTab === 'client' ? clientFeatures : guideFeatures).map((feature, idx) => (
                 <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-colors ${activeFeatureTab === 'client' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'}`}>
                       <feature.icon size={24} className="md:w-7 md:h-7" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 md:mb-3">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {feature.desc}
                    </p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- DEMO SECTION --- */}
      <section id="demo" className="py-16 md:py-24 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

         <div className="w-full md:max-w-7xl mx-auto px-2 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-8 md:mb-12 gap-6">
               <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] md:text-xs font-bold uppercase tracking-wide mb-4">
                     <AlertTriangle size={12} fill="currentColor" /> MVP / Demo
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.demoTitle}</h2>
                  <p className="text-slate-400 text-sm md:text-lg">
                    {t.demoDesc}
                  </p>
               </div>
               <div className="flex items-center gap-4 text-xs md:text-sm font-medium text-slate-400">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                     {t.systemOnline}
                  </div>
                  <div className="hidden md:block h-4 w-px bg-slate-700"></div>
                  <div className="hidden md:block">v2.4.0 (Prototype)</div>
               </div>
            </div>

            {/* APP CONTAINER (Mock Window) */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10 w-full">
               <div className="h-10 md:h-12 bg-slate-800 border-b border-slate-700 flex items-center px-4 justify-between select-none">
                  <div className="flex gap-2">
                     <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80"></div>
                     <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80"></div>
                     <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-md text-[10px] md:text-xs text-slate-400 font-mono border border-slate-700">
                     <Shield size={10} /> demo.alpsconnect.com
                  </div>
                  <div className="w-12 md:w-16"></div> 
               </div>

               <div className="h-[400px] md:h-[500px] bg-slate-100 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm"></div>
                   <div className="relative z-10 max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                            <Mountain size={40} className="text-blue-600" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{t.launchApp}</h3>
                        <p className="text-slate-500 mb-8 text-lg">{t.launchSub}</p>
                        <button 
                            onClick={handleEnterApp} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-200 transition-all hover:scale-105 flex items-center justify-center gap-2 mx-auto"
                        >
                            {t.ctaStart} <ArrowRight size={20} />
                        </button>
                   </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-100 py-12 md:py-16">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
               <div>
                  <div className="flex items-center gap-2 mb-6">
                     <div className="bg-slate-900 p-1.5 rounded-lg text-white">
                        <Mountain size={20} strokeWidth={2.5} />
                     </div>
                     <span className="font-bold text-xl tracking-tight text-slate-900">AlpsConnect</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                     {t.footerDesc}
                  </p>
               </div>
               
               <div>
                  <h4 className="font-bold text-slate-900 mb-4">{t.product}</h4>
                  <ul className="space-y-3 text-sm text-slate-500">
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">For Guides</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">For Clients</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-slate-900 mb-4">{t.company}</h4>
                  <ul className="space-y-3 text-sm text-slate-500">
                     <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-slate-900 mb-4">{t.feedbackTitle}</h4>
                  <p className="text-sm text-slate-500 mb-4">{t.feedbackDesc}</p>
                  <button onClick={() => setIsFeedbackOpen(true)} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                     {t.ctaFeedback} <MessageSquare size={14} />
                  </button>
               </div>
            </div>
            
            <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
               <p>&copy; 2024 AlpsConnect Inc. {t.rights}</p>
               <div className="flex gap-6 mt-4 md:mt-0 items-center">
                  <a href="#" className="hover:text-slate-900">Privacy Policy</a>
                  <a href="#" className="hover:text-slate-900">Terms of Service</a>
                  <button 
                    onClick={() => setIsStatsOpen(true)} 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 ml-4 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold"
                    title={t.adminStats}
                  >
                     <BarChart size={14} /> {t.adminStats}
                  </button>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;