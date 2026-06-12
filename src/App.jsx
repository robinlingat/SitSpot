import React from 'react';
import { SS_INTENTS } from './data';
import { supabase } from './supabase';
import { FloatBtn, TabBar } from './Kit';
import { MapCanvas } from './Map';
import { IOSDevice, DeviceScaler } from './IOSFrame';
import { TopBar, FiltersSheet, BenchSheet, AddReviewModal, AddBenchModal, AuthModal, ProfileScreen, Toast, LocationPrompt } from './Screens';

/* Convertit un élément OSM en objet banc compatible avec BenchSheet */
function osmToBench(el) {
  const t = el.tags || {};
  const tags = [];
  if (t.backrest === 'yes')      tags.push({ icon: 'leaf',       label: 'Avec dossier' });
  if (t.covered  === 'yes')      tags.push({ icon: 'trees',      label: 'Couvert'      });
  if (t.wheelchair === 'yes')    tags.push({ icon: 'navigation', label: 'Accessible PMR' });
  if (t.material === 'wood')     tags.push({ icon: 'leaf',       label: 'En bois'      });
  if (t.material === 'metal')    tags.push({ icon: 'leaf',       label: 'En métal'     });
  if (t.material === 'stone')    tags.push({ icon: 'mountain',   label: 'En pierre'    });
  if (t.seats)                   tags.push({ icon: 'eye',        label: `${t.seats} places` });
  const lat = el.lat;
  const lng = el.lng ?? el.lon;
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null;
  return {
    id:       el.id.startsWith('osm_') ? el.id : 'osm_' + el.id,
    name:     t.name || 'Banc public',
    area:     t['addr:street'] ? t['addr:street'] + ' · France' : 'France',
    lat,
    lng,
    score:    null,
    count:    0,
    status:   { tone: 'neutral', label: 'Nouveau' },
    tags,
    distance: '',
    intents:  [],
    photos:   0,
    reviews:  [],
    _osm:     true,
  };
}

export default function App() {
  const [tab,           setTab]           = React.useState('map');
  const [selectedId,    setSelectedId]    = React.useState(null);
  const [overlay,       setOverlay]       = React.useState(null);
  const [authView,      setAuthView]      = React.useState('login');
  const [user,          setUser]          = React.useState(null);
  const [profile,       setProfile]       = React.useState(null);
  const [myReviews,     setMyReviews]     = React.useState([]);
  const [benchReviews,  setBenchReviews]  = React.useState([]);
  const [benchPhotos,   setBenchPhotos]   = React.useState([]);
  const [activeIntents, setActiveIntents] = React.useState([]);
  const [query,         setQuery]         = React.useState('');
  const [filters,       setFilters]       = React.useState({distance:null,shade:null,minRating:null,pmr:false,rated:false});
  const [toast,         setToast]         = React.useState(null);
  const [zoomCmd,           setZoomCmd]           = React.useState(null);
  const [flyToCmd,          setFlyToCmd]          = React.useState(null);
  const [ssBenches,         setSsBenches]         = React.useState([]);
  const [osmBenches,        setOsmBenches]        = React.useState([]);
  const [osmLoading,        setOsmLoading]        = React.useState(true);
  // phase: 'map' → 'geoloc' → 'ready'
  const [loadPhase,         setLoadPhase]         = React.useState('map');
  const [mapCenter,         setMapCenter]         = React.useState(null);
  const [isLoadingRefresh,  setIsLoadingRefresh]  = React.useState(false);
  const [geolocationDenied, setGeolocationDenied] = React.useState(false);
  const lastViewportRef  = React.useRef(null);

  const isLoggedIn = !!user;

  /* Authentification : vérifie la session au démarrage */
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* Charge le profil quand l'utilisateur change */
  React.useEffect(() => {
    if (!user) { setProfile(null); setMyReviews([]); return; }
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => setProfile(data));
    supabase.from('reviews').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setMyReviews(data || []));
  }, [user]);

  /* Demande de localisation — affiche l'écran seulement si pas encore répondu */
  const [showLocationPrompt, setShowLocationPrompt] = React.useState(
    () => !localStorage.getItem('location_asked')
  );
  const [userLocation, setUserLocation] = React.useState(null);
  const userLocationRef = React.useRef(null);


  // Centre du cadre pour lequel les bancs sont actuellement chargés
  const loadedCenterRef = React.useRef(null);

  /* Charge UNIQUEMENT les bancs dans le cadre visible (bounding-box) */
  const fetchBounds = React.useCallback(async ({ south, west, north, east }) => {
    setOsmLoading(true);
    loadedCenterRef.current = { lat: (south + north) / 2, lng: (west + east) / 2 };
    try {
      const { data } = await supabase
        .from('osm_benches')
        .select('id, lat, lng, tags')
        .gte('lat', south).lte('lat', north)
        .gte('lng', west).lte('lng', east)
        .limit(5000);
      // On remplace : seuls les bancs du cadre courant restent affichés
      setOsmBenches((data || []).map(osmToBench).filter(Boolean));
    } catch(_) {
      /* garde l'affichage courant en cas d'erreur réseau */
    } finally {
      setOsmLoading(false);
    }
  }, []);

  // Haversine distance en mètres
  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  const refCenter = userLocation || loadedCenterRef.current;
  const showRefresh = loadPhase === 'ready' && !!mapCenter && !!refCenter
    && haversine(refCenter.lat, refCenter.lng, mapCenter.lat, mapCenter.lng) > 500;

  const startWatchingLocation = React.useCallback((flyTo = false) => {
    if (!navigator.geolocation) { setLoadPhase('ready'); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        userLocationRef.current = loc;
        setUserLocation(loc);
        if (flyTo) setFlyToCmd({ center: [loc.lng, loc.lat], zoom: 15 });
        // Charge directement un cadre ~2km autour de la géoloc (le moveend affinera ensuite)
        const d = 0.02;
        fetchBounds({ south: loc.lat - d, north: loc.lat + d, west: loc.lng - d, east: loc.lng + d });
        setLoadPhase('ready');
      },
      () => { setGeolocationDenied(true); setLoadPhase('ready'); } // refus → le useEffect chargera la zone par défaut
    );
  }, [fetchBounds]);

  /* Si permission déjà accordée, la position sera récupérée après que la carte soit prête (handleMapReady) */
  /* handleMapReady est appelé par MapCanvas quand map.on('load') est résolu */
  const handleMapReady = React.useCallback(() => {
    setLoadPhase('geoloc');
    if (localStorage.getItem('location_asked') === '1') {
      startWatchingLocation(true); // flyTo=true → carte recentrée sur l'utilisateur, bancs chargés pour cette zone
    }
    // Sinon, on attend l'action sur LocationPrompt (handleLocationAccept appellera startWatchingLocation(true))
  }, [startWatchingLocation]);

  const handleLocationAccept = () => {
    localStorage.setItem('location_asked', '1');
    setShowLocationPrompt(false);
    startWatchingLocation(true);
  };

  const handleLocationDecline = () => {
    localStorage.setItem('location_asked', '1');
    setShowLocationPrompt(false);
    setLoadPhase('ready'); // pas de géoloc → on charge quand même
  };

  const handleLocateMe = () => {
    if (userLocationRef.current) {
      setFlyToCmd({ center: [userLocationRef.current.lng, userLocationRef.current.lat], zoom: 16 });
    } else if (localStorage.getItem('location_asked') === '1') {
      startWatchingLocation(true);
    } else {
      setShowLocationPrompt(true);
    }
  };

  /* Charge les avis et photos du banc sélectionné */
  React.useEffect(() => {
    if (!selectedId) { setBenchReviews([]); setBenchPhotos([]); return; }
    supabase.from('reviews').select('*').eq('bench_id', selectedId).order('created_at', { ascending: false })
      .then(({ data }) => setBenchReviews(data || []));
    supabase.from('photos').select('*').eq('bench_id', selectedId).order('created_at', { ascending: false })
      .then(({ data }) => setBenchPhotos(data || []));
  }, [selectedId]);

  /* Chargement des 6 bancs SS depuis Supabase */
  React.useEffect(() => {
    supabase.from('benches').select('*').eq('source', 'ss')
      .then(({ data }) => {
        if (data) setSsBenches(data.map(b => ({
          ...b,
          status:  { tone: b.status_tone, label: b.status_label },
          tags:    b.tags    || [],
          intents: b.intents || [],
          reviews: [],
        })));
      });
  }, []);

  /* Fallback : si la géoloc a échoué (pas de flyTo), charger le viewport courant (Paris par défaut) */
  React.useEffect(() => {
    if (loadPhase !== 'ready') return;
    if (userLocationRef.current) return; // géoloc OK → déjà chargé dans startWatchingLocation
    const vp = lastViewportRef.current;
    if (!vp || vp.zoom < 7) return;
    fetchBounds(vp);
  }, [loadPhase, fetchBounds]);

  const handleRefresh = React.useCallback(async () => {
    const vp = lastViewportRef.current;
    if (!vp) return;
    setIsLoadingRefresh(true);
    await fetchBounds(vp);
    setIsLoadingRefresh(false);
  }, [fetchBounds]);

  const handleSearch = async q => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&accept-language=fr`;
    try {
      const res  = await fetch(url, { headers: { 'Accept-Language': 'fr' } });
      const data = await res.json();
      if (data.length) setFlyToCmd({ center: [parseFloat(data[0].lon), parseFloat(data[0].lat)], zoom: 15 });
    } catch(_) {}
  };

  const zoomIn    = () => setZoomCmd('in_'    + Date.now());
  const zoomOut   = () => setZoomCmd('out_'   + Date.now());
  const zoomReset = () => setZoomCmd('reset_' + Date.now());

  /* Déclenché à chaque changement de viewport par MapCanvas */
  const handleViewport = React.useCallback(({ south, west, north, east, zoom }) => {
    const center = { lat: (south + north) / 2, lng: (west + east) / 2 };
    setMapCenter(center);
    lastViewportRef.current = { south, west, north, east, zoom };
    // On NE charge PAS automatiquement au déplacement : l'utilisateur utilise
    // « Actualiser cette zone ». Le chargement initial se fait autour de la géoloc.
  }, []);

  /* Tous les bancs = 6 bancs détaillés + bancs OSM */
  const allBenches = React.useMemo(
    () => [...ssBenches, ...osmBenches],
    [osmBenches]
  );

  const selected = allBenches.find(b => b.id === selectedId) || null;

  const showToast    = msg => { setToast(msg); setTimeout(()=>setToast(null), 3200); };
  const toggleIntent = id  => setActiveIntents(a => a.includes(id) ? a.filter(x=>x!==id) : [...a,id]);
  const openAuth     = ()  => { setAuthView('login'); setOverlay('auth'); };
  const ratedOnly    = activeIntents.includes('rated') || filters.rated;
  const matches      = b   => {
    if (ratedOnly && b.score === null) return false;
    const intentsOk = activeIntents.filter(i => i !== 'rated');
    return intentsOk.length === 0 || intentsOk.some(i => i === 'near' || b.intents.includes(i));
  };

  const handleMarker   = id => { setSelectedId(selectedId === id ? null : id); setOverlay(null); };
  const handleAddBench = () => { if(!isLoggedIn){openAuth();return;} setOverlay('addBench'); };
  const handleReview   = async ({ score, text }) => {
    if (!selected || !user) return;
    await supabase.from('reviews').insert({
      bench_id:  selected.id,
      user_id:   user.id,
      user_name: profile?.pseudo || user.email?.split('@')[0] || 'Anonyme',
      score,
      text,
    });
    setBenchReviews(prev => [{ id: Date.now(), bench_id: selected.id, user_id: user.id,
      user_name: profile?.pseudo || user.email?.split('@')[0] || 'Anonyme',
      score, text, created_at: new Date().toISOString() }, ...prev]);
    setOverlay(null);
    showToast("Merci ! Ton avis aide les autres à mieux s'asseoir 🙌");
  };
  const handleBench    = async ({ name, file }) => {
    const benchId = 'user_' + Date.now();
    await supabase.from('benches').insert({
      id: benchId,
      name: name || 'Banc public',
      area: 'France',
      lat: 48.8566, lng: 2.3522,
      score: null, count: 0,
      status_tone: 'neutral', status_label: 'Nouveau',
      tags: [], intents: [], photos: file ? 1 : 0,
      source: 'user',
    });
    if (file && user) {
      const ext  = file.name.split('.').pop();
      const path = `${user.id}/${benchId}/photo.${ext}`;
      const { data: upload } = await supabase.storage.from('bench-photos').upload(path, file, { upsert: true });
      if (upload) {
        const { data: { publicUrl } } = supabase.storage.from('bench-photos').getPublicUrl(path);
        await supabase.from('photos').insert({ bench_id: benchId, user_id: user.id, url: publicUrl });
      }
    }
    setOverlay(null); setSelectedId(null);
    showToast('Banc ajouté ! Il apparaît sur la carte 🗺️');
  };
  const handleAuth     = (u) => { setUser(u); setOverlay(null); showToast('Bienvenue sur SitSpot 👋'); };
  const handleLogout   = async () => { await supabase.auth.signOut(); setUser(null); showToast('Déconnecté. À bientôt !'); };
  const switchTab      = t  => { setTab(t); if(t==='map'){setSelectedId(null);setOverlay(null);} };

  const matchingSS = ssBenches.filter(matches);

  const isPreviewMobile = new URLSearchParams(window.location.search).get('view') === 'mobile';
  const [isSmallScreen, setIsSmallScreen] = React.useState(() => window.innerWidth < 768);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = e => setIsSmallScreen(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  const isMobile = isPreviewMobile || isSmallScreen;

  const PHASE_LABEL = { map: 'Chargement de la carte…', geoloc: 'Localisation en cours…' };
  const phaseLabel = PHASE_LABEL[loadPhase] || null;

  // Sur mobile la TopBar (top:62, h:52) + chips (~40px) = ~154px ; on place les banners en dessous
  const bannerTop    = isSmallScreen ? 160 : 130;
  const refreshTop   = isSmallScreen ? 160 : 84;

  const RefreshBtn = showRefresh && (
    <div style={{position:'absolute', top:refreshTop, left:'50%', transform:'translateX(-50%)', zIndex:50}}>
      <button
        onClick={handleRefresh}
        disabled={isLoadingRefresh}
        style={{
          display:'flex', alignItems:'center', gap:8,
          padding:'9px 18px', borderRadius:99, border:'none', cursor: isLoadingRefresh ? 'default' : 'pointer',
          background:'linear-gradient(135deg, var(--green-300), var(--blue-400))', color:'#fff', fontWeight:700, fontSize:14,
          boxShadow:'var(--shadow-md)', opacity: isLoadingRefresh ? 0.75 : 1,
          transition:'opacity 0.2s',
        }}
      >
        {isLoadingRefresh ? (
          <svg style={{animation:'spin 0.8s linear infinite'}} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><polyline points="21 3 21 9 15 9"/></svg>
        )}
        {isLoadingRefresh ? 'Chargement…' : 'Actualiser cette zone'}
      </button>
    </div>
  );

  const GeolocationDeniedBanner = geolocationDenied && (
    <div style={{position:'absolute', top:bannerTop, left:'50%', transform:'translateX(-50%)', zIndex:50,
      display:'inline-flex', alignItems:'center', gap:8, padding:'8px 16px',
      background:'rgba(255,255,255,0.96)', backdropFilter:'blur(8px)',
      borderRadius:99, boxShadow:'var(--shadow-md)',
      whiteSpace: isSmallScreen ? 'normal' : 'nowrap',
      maxWidth: isSmallScreen ? 'calc(100vw - 32px)' : undefined,
      fontSize:13, fontWeight:600, color:'var(--danger)',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Localisation refusée — autorise-la dans les paramètres du site
    </div>
  );

  const LoadingBanner = phaseLabel && (
    <div style={{position:'absolute', top:bannerTop, left:'50%', transform:'translateX(-50%)', zIndex:50,
      display:'inline-flex', alignItems:'center', gap:8, padding:'8px 16px',
      background:'rgba(255,255,255,0.94)', backdropFilter:'blur(8px)',
      borderRadius:99, boxShadow:'var(--shadow-md)', whiteSpace:'nowrap',
      fontSize:13, fontWeight:600, color:'var(--text-secondary)',
    }}>
      <svg style={{animation:'spin 0.8s linear infinite', flexShrink:0}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><polyline points="21 3 21 9 15 9"/></svg>
      {phaseLabel}
    </div>
  );

  /* ── Sidebar nav item ── */
  const NavItem = ({ icon, label, active, onClick, accent }) => (
    <button onClick={onClick} title={label} style={{
      display:'flex', flexDirection:'column', alignItems:'center', gap:4,
      width:'100%', padding:'10px 0', border:'none', cursor:'pointer',
      background: active ? 'var(--surface-accent-soft)' : 'transparent',
      color: active ? 'var(--text-accent)' : 'var(--text-secondary)',
      borderRadius:'var(--radius-md)', transition:'background var(--dur-fast)',
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'var(--accent)' : (accent ? 'var(--accent)' : 'currentColor')}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{display:'block'}}
        dangerouslySetInnerHTML={{__html: ICONS[icon] || ''}}/>
      <span style={{fontSize:10, fontWeight: active ? 700 : 500, letterSpacing:'0.02em'}}>{label}</span>
    </button>
  );

  const mobileContent = (
    <div style={{position:'relative',height:'100%',overflow:'hidden',fontFamily:'var(--font-sans)',background:'var(--surface-app)'}}>
      {tab==='map' && <>
        <MapCanvas
          benches={ssBenches.map(b=>({...b, _dim: matches(b)}))}
          osmBenches={ratedOnly ? [] : osmBenches}
          selectedId={selectedId} onSelect={handleMarker}
          zoomCmd={zoomCmd} flyToCmd={flyToCmd}
          onViewport={handleViewport} dimmed={!!selected} userLocation={userLocation}
          onReady={handleMapReady}
        />
        {LoadingBanner}
        {GeolocationDeniedBanner}
        {RefreshBtn}
        <TopBar query={query} setQuery={setQuery} intents={SS_INTENTS}
          active={activeIntents} toggle={toggleIntent} onFilters={()=>setOverlay('filters')}
          onSearch={handleSearch}/>
        {!selected && <>
          <div style={{position:'absolute',right:14,bottom:90,display:'flex',flexDirection:'column',gap:10,zIndex:35}}>
            <FloatBtn icon="crosshair" label="Ma position" accent onClick={handleLocateMe}/>
            <FloatBtn icon="plus" label="Zoom +" onClick={zoomIn}/>
            <FloatBtn icon="minus" label="Zoom -" onClick={zoomOut}/>
          </div>
          <div style={{position:'absolute',left:14,bottom:90,zIndex:35}}>
            <FloatBtn icon="plus" label="Ajouter un banc" onClick={handleAddBench}/>
          </div>
        </>}
        {selected && <>
          <div onClick={()=>setSelectedId(null)} style={{position:'absolute',inset:'0 0 78px 0',zIndex:48,background:'rgba(26,25,22,0.18)',backdropFilter:'blur(1px)'}}/>
          <BenchSheet bench={selected} reviews={benchReviews} photos={benchPhotos}
            onClose={()=>setSelectedId(null)} isLoggedIn={isLoggedIn}
            onAddReview={()=>setOverlay('review')} onNeedAuth={openAuth}
            user={user}
            onPhotoUploaded={p=>setBenchPhotos(prev=>[p,...prev])}
            onPhotoDeleted={id=>setBenchPhotos(prev=>prev.filter(p=>p.id!==id))}/>
        </>}
      </>}
      {tab==='profile' && (
        <div style={{position:'absolute',inset:'0 0 78px 0',display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{background:'var(--surface-card)',borderBottom:'1px solid var(--border-subtle)',padding:'72px 20px 14px',flexShrink:0}}>
            <h1 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:20,letterSpacing:'-0.02em',margin:0}}>Profil</h1>
          </div>
          <ProfileScreen isLoggedIn={isLoggedIn} profile={profile} myReviews={myReviews} onLogout={handleLogout} onLogin={openAuth}/>
        </div>
      )}
      <TabBar tab={tab} setTab={switchTab}/>
      {overlay==='filters' && <FiltersSheet filters={filters} setFilters={setFilters} onClose={()=>setOverlay(null)}/>}
      {overlay==='review' && selected && <AddReviewModal bench={selected} onClose={()=>setOverlay(null)} onSubmit={handleReview}/>}
      {overlay==='addBench' && <AddBenchModal onClose={()=>setOverlay(null)} onSubmit={handleBench} isLoggedIn={isLoggedIn}/>}
      {overlay==='auth' && <AuthModal view={authView} setView={setAuthView} onClose={()=>setOverlay(null)} onSuccess={handleAuth}/>}
      <Toast message={toast}/>
      {showLocationPrompt && <LocationPrompt onAccept={handleLocationAccept} onDecline={handleLocationDecline}/>}
    </div>
  );

  if (isPreviewMobile) {
    return (
      <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <DeviceScaler><IOSDevice>{mobileContent}</IOSDevice></DeviceScaler>
      </div>
    );
  }

  if (isSmallScreen) {
    return (
      <div style={{width:'100%',height:'100dvh',fontFamily:'var(--font-sans)',background:'var(--surface-app)',overflow:'hidden'}}>
        {mobileContent}
      </div>
    );
  }

  /* ════════════════════════════════
     DESKTOP LAYOUT
  ════════════════════════════════ */
  return (
    <div style={{display:'flex', width:'100vw', height:'100vh', fontFamily:'var(--font-sans)', background:'var(--surface-app)', overflow:'hidden'}}>

      {/* ── Sidebar gauche ── */}
      <aside style={{
        width:220, flexShrink:0, height:'100vh',
        background:'var(--surface-card)',
        borderRight:'1px solid var(--border-subtle)',
        display:'flex', flexDirection:'column',
        boxShadow:'2px 0 8px rgba(0,0,0,0.04)',
        zIndex:10,
      }}>
        {/* Logo */}
        <div style={{padding:'20px 16px 8px', display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:36, height:36, borderRadius:10, background:'var(--accent)',
            display:'grid', placeItems:'center', flexShrink:0}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <span style={{fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, letterSpacing:'-0.03em'}}>SitSpot</span>
        </div>

        {/* Search bar */}
        <div style={{padding:'12px 12px 8px'}}>
          <div style={{
            display:'flex', alignItems:'center', gap:8, height:40, padding:'0 12px',
            background:'var(--surface-sunken)', borderRadius:'var(--radius-full)',
            border:'1px solid var(--border-subtle)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              value={query} onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&handleSearch(query)}
              placeholder="Cherche un lieu…"
              style={{flex:1, border:'none', outline:'none', background:'transparent', fontSize:13, color:'var(--text-primary)'}}
            />
          </div>
        </div>

        {/* Nav links */}
        <nav style={{padding:'8px 12px', display:'flex', flexDirection:'column', gap:2}}>
          {[
            {id:'map',     label:'Carte',   path:'M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13 6-3m-6-3V7m6 10 4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-1.447-.894L15 9m0 8V9m0 0L9 7'},
            {id:'profile', label:'Profil',  path:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'},
          ].map(item => (
            <button key={item.id} onClick={()=>switchTab(item.id)} style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'10px 12px', borderRadius:'var(--radius-md)',
              border:'none', cursor:'pointer', textAlign:'left', width:'100%',
              background: tab===item.id ? 'var(--surface-accent-soft)' : 'transparent',
              color: tab===item.id ? 'var(--text-accent)' : 'var(--text-secondary)',
              fontWeight: tab===item.id ? 700 : 500, fontSize:14,
              transition:'background var(--dur-fast)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.path}/>
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Filtres rapides (only on map tab) */}
        {tab==='map' && (
          <div style={{padding:'8px 12px'}}>
            <div style={{fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6}}>Filtres</div>
            <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
              {SS_INTENTS.map(it => (
                <button key={it.id} onClick={()=>toggleIntent(it.id)} style={{
                  padding:'5px 10px', borderRadius:99, fontSize:12, fontWeight:600, cursor:'pointer',
                  border: '1.5px solid', borderColor: activeIntents.includes(it.id) ? 'var(--accent)' : 'var(--border-default)',
                  background: activeIntents.includes(it.id) ? 'var(--surface-accent-soft)' : 'transparent',
                  color: activeIntents.includes(it.id) ? 'var(--text-accent)' : 'var(--text-secondary)',
                }}>{it.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{flex:1}}/>

        {/* Ajouter un banc */}
        {tab==='map' && (
          <div style={{padding:'12px'}}>
            <button onClick={handleAddBench} style={{
              width:'100%', height:40, border:'none', borderRadius:'var(--radius-md)',
              background:'var(--accent)', color:'#fff', fontWeight:700, fontSize:14,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Ajouter un banc
            </button>
          </div>
        )}

        {/* User / login */}
        <div style={{padding:'12px', borderTop:'1px solid var(--border-subtle)'}}>
          {isLoggedIn ? (
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <div style={{width:32, height:32, borderRadius:'50%', background:'var(--surface-accent-soft)',
                display:'grid', placeItems:'center', flexShrink:0,
                fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, color:'var(--text-accent)'}}>
                {(profile?.name || profile?.pseudo || 'U')[0].toUpperCase()}
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight:600, fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                  {profile?.name || profile?.pseudo || 'Utilisateur'}
                </div>
                <div style={{fontSize:11, color:'var(--text-muted)'}}>Connecté</div>
              </div>
            </div>
          ) : (
            <button onClick={openAuth} style={{
              width:'100%', height:36, border:'1.5px solid var(--border-default)', borderRadius:'var(--radius-md)',
              background:'transparent', color:'var(--text-secondary)', fontWeight:600, fontSize:13,
              cursor:'pointer',
            }}>Connexion</button>
          )}
        </div>
      </aside>

      {/* ── Zone principale ── */}
      <main style={{flex:1, position:'relative', overflow:'hidden'}}>

        {/* ── VUE CARTE ── */}
        {tab==='map' && <>
          <MapCanvas
            benches={ssBenches.map(b=>({...b, _dim: matches(b)}))}
            osmBenches={ratedOnly ? [] : osmBenches}
            selectedId={selectedId} onSelect={handleMarker}
            zoomCmd={zoomCmd} flyToCmd={flyToCmd}
            onViewport={handleViewport} dimmed={!!selected} userLocation={userLocation}
            onReady={handleMapReady}
          />
          {LoadingBanner}
          {GeolocationDeniedBanner}
          {RefreshBtn}

          {/* Contrôles carte */}
          <div style={{position:'absolute', right:16, bottom:24, display:'flex', flexDirection:'column', gap:8, zIndex:35}}>
            <FloatBtn icon="crosshair" label="Ma position" accent onClick={handleLocateMe}/>
            <FloatBtn icon="plus"      label="Zoom +"      onClick={zoomIn}/>
            <FloatBtn icon="minus"     label="Zoom -"      onClick={zoomOut}/>
          </div>

          {/* Compteur bancs */}
          <div style={{position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)', zIndex:30,
            display:'inline-flex', alignItems:'center', gap:7, height:36, padding:'0 14px',
            background:'rgba(255,255,255,0.92)', backdropFilter:'blur(10px)',
            borderRadius:'var(--radius-full)', boxShadow:'var(--shadow-md)',
            fontWeight:600, fontSize:13, whiteSpace:'nowrap', pointerEvents:'none'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {osmLoading ? 'Chargement…' : `${matchingSS.length + osmBenches.length} bancs`}
          </div>

          {/* Panel détail banc — panneau latéral droit */}
          {selected && (
            <>
              <div onClick={()=>setSelectedId(null)} style={{position:'absolute', inset:0, zIndex:48, background:'rgba(26,25,22,0.12)'}}/>
              <div style={{
                position:'absolute', top:0, right:0, bottom:0, width:380,
                background:'var(--surface-card)', boxShadow:'-4px 0 24px rgba(0,0,0,0.10)',
                zIndex:49, overflowY:'auto', display:'flex', flexDirection:'column',
                animation:'slideInRight 0.25s var(--ease-spring)',
              }}>
                <BenchSheet bench={selected} reviews={benchReviews} photos={benchPhotos}
                  onClose={()=>setSelectedId(null)} isLoggedIn={isLoggedIn}
                  onAddReview={()=>setOverlay('review')} onNeedAuth={openAuth}
                  user={user}
                  onPhotoUploaded={p=>setBenchPhotos(prev=>[p,...prev])}
                  onPhotoDeleted={id=>setBenchPhotos(prev=>prev.filter(p=>p.id!==id))}
                  desktop/>
              </div>
            </>
          )}
        </>}

        {/* ── VUE PROFIL ── */}
        {tab==='profile' && (
          <div style={{height:'100%', overflowY:'auto', background:'var(--surface-app)'}}>
            <div style={{maxWidth:680, margin:'0 auto', padding:'32px 24px'}}>
              <h1 style={{fontFamily:'var(--font-display)', fontWeight:800, fontSize:24, letterSpacing:'-0.02em', margin:'0 0 24px'}}>Mon profil</h1>
              <ProfileScreen isLoggedIn={isLoggedIn} profile={profile} myReviews={myReviews} onLogout={handleLogout} onLogin={openAuth}/>
            </div>
          </div>
        )}
      </main>

      {/* ══ OVERLAYS GLOBAUX ══ */}
      {overlay==='filters' && <FiltersSheet filters={filters} setFilters={setFilters} onClose={()=>setOverlay(null)}/>}
      {overlay==='review' && selected && <AddReviewModal bench={selected} onClose={()=>setOverlay(null)} onSubmit={handleReview}/>}
      {overlay==='addBench' && <AddBenchModal onClose={()=>setOverlay(null)} onSubmit={handleBench} isLoggedIn={isLoggedIn}/>}
      {overlay==='auth' && <AuthModal view={authView} setView={setAuthView} onClose={()=>setOverlay(null)} onSuccess={handleAuth}/>}

      <Toast message={toast}/>
      {showLocationPrompt && <LocationPrompt onAccept={handleLocationAccept} onDecline={handleLocationDecline}/>}
    </div>
  );
}
