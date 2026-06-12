/* SitSpot — main app + state */
function App() {
  const benches = window.SS_BENCHES;
  const intents = window.SS_INTENTS;
  const user    = window.SS_USER;

  const [tab,          setTab]          = React.useState('map');
  const [selectedId,   setSelectedId]   = React.useState(null);
  const [overlay,      setOverlay]      = React.useState(null); // 'review'|'addBench'|'filters'|'auth'
  const [authView,     setAuthView]     = React.useState('login');
  const [isLoggedIn,   setIsLoggedIn]   = React.useState(false);
  const [activeIntents,setActiveIntents]= React.useState([]);
  const [query,        setQuery]        = React.useState('');
  const [filters,      setFilters]      = React.useState({ distance:null, shade:null, minRating:null, pmr:false });
  const [toast,        setToast]        = React.useState(null);

  const selected = benches.find(b => b.id===selectedId) || null;

  // re-render icons each tick (Lucide needs this for dynamically mounted SVGs)
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const toggleIntent = id =>
    setActiveIntents(a => a.includes(id) ? a.filter(x=>x!==id) : [...a, id]);

  const matches = b =>
    activeIntents.length===0 || activeIntents.some(i => i==='near' || b.intents.includes(i));

  const openAuth = () => { setAuthView('login'); setOverlay('auth'); };

  const handleMarker = id => {
    setSelectedId(selectedId===id ? null : id);
    setOverlay(null);
  };

  const handleAddBench = () => {
    if (!isLoggedIn) { openAuth(); return; }
    setOverlay('addBench');
  };

  const handleReviewSubmit = () => {
    setOverlay(null);
    showToast("Merci ! Ton avis aide les autres à mieux s'asseoir 🙌");
  };

  const handleBenchSubmit = () => {
    setOverlay(null);
    setSelectedId(null);
    showToast('Banc ajouté ! Il apparaît sur la carte 🗺️');
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setOverlay(null);
    showToast('Bienvenue sur SitSpot 👋');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Déconnecté. À bientôt !');
  };

  const switchTab = t => {
    setTab(t);
    if (t==='map') { setSelectedId(null); setOverlay(null); }
  };

  return (
    <div style={{ position:'relative', height:'100%', overflow:'hidden', fontFamily:'var(--font-sans)', background:'var(--surface-app)' }}>

      {/* ═══ MAP TAB ═══ */}
      {tab==='map' && <>
        <MapCanvas dimmed={!!selected}>
          {benches.map(b => (
            <div key={b.id} style={{ opacity:matches(b)?1:0.28, transition:'opacity var(--dur-base)' }}>
              <Marker bench={b} open={selectedId===b.id} onClick={() => handleMarker(b.id)}/>
            </div>
          ))}
        </MapCanvas>

        <TopBar query={query} setQuery={setQuery}
          intents={intents} active={activeIntents} toggle={toggleIntent}
          onFilters={() => setOverlay('filters')}/>

        {/* floating controls — only when no bench open */}
        {!selected && <>
          {/* map zoom + locate */}
          <div style={{ position:'absolute', right:14, bottom:90, display:'flex', flexDirection:'column', gap:10, zIndex:35 }}>
            <FloatBtn icon="crosshair" label="Ma position" accent/>
            <FloatBtn icon="plus" label="Zoom +"/>
            <FloatBtn icon="minus" label="Zoom -"/>
          </div>

          {/* add bench FAB — circular button in left cluster */}
          <div style={{ position:'absolute', left:14, bottom:90, display:'flex', flexDirection:'column', gap:10, zIndex:35 }}>
            <FloatBtn icon="plus" label="Ajouter un banc" onClick={handleAddBench}/>
          </div>

          {/* bench count pill — sits above the FAB clusters */}
          {activeIntents.length===0 && (
            <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', bottom:148, zIndex:30,
              display:'inline-flex', alignItems:'center', gap:7, height:38, padding:'0 16px',
              background:'rgba(255,255,255,0.92)', backdropFilter:'blur(10px)',
              borderRadius:'var(--radius-full)', boxShadow:'var(--shadow-md)',
              fontWeight:700, fontSize:13, whiteSpace:'nowrap', pointerEvents:'none' }}>
              <Icon n="map-pin" s={15} color="var(--green-600)"/>
              {benches.filter(matches).length} bancs près de toi
            </div>
          )}
        </>}

        {/* bench detail sheet + backdrop */}
        {selected && <>
          <div onClick={() => setSelectedId(null)} style={{
            position:'absolute', inset:'0 0 78px 0', zIndex:48,
            background:'rgba(26,25,22,0.18)', backdropFilter:'blur(1px)',
            animation:'fadeIn var(--dur-base)',
          }}/>
          <BenchSheet
            bench={selected}
            onClose={() => setSelectedId(null)}
            isLoggedIn={isLoggedIn}
            onAddReview={() => setOverlay('review')}
            onNeedAuth={openAuth}/>
        </>}
      </>}

      {/* ═══ PROFILE TAB ═══ */}
      {tab==='profile' && (
        <div style={{ position:'absolute', inset:'0 0 78px 0', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ background:'var(--surface-card)', borderBottom:'1px solid var(--border-subtle)',
            padding:'72px 20px 14px', flex:'none' }}>
            <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:20,
              letterSpacing:'-0.02em', margin:0 }}>Profil</h1>
          </div>
          <ProfileScreen
            isLoggedIn={isLoggedIn} user={user}
            onLogout={handleLogout}
            onLogin={openAuth}/>
        </div>
      )}

      {/* ═══ TAB BAR ═══ */}
      <TabBar tab={tab} setTab={switchTab}/>

      {/* ═══ OVERLAYS ═══ */}
      {overlay==='filters' && (
        <FiltersSheet filters={filters} setFilters={setFilters} onClose={() => setOverlay(null)}/>
      )}
      {overlay==='review' && selected && (
        <AddReviewModal bench={selected} onClose={() => setOverlay(null)} onSubmit={handleReviewSubmit}/>
      )}
      {overlay==='addBench' && (
        <AddBenchModal onClose={() => setOverlay(null)} onSubmit={handleBenchSubmit}/>
      )}
      {overlay==='auth' && (
        <AuthModal view={authView} setView={setAuthView} onClose={() => setOverlay(null)} onSuccess={handleAuthSuccess}/>
      )}

      <Toast message={toast}/>
    </div>
  );
}

/* Scale device to fit any viewport */
function DeviceScaler({ children }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const pad = 32;
      const s = Math.min(
        (window.innerWidth  - pad*2) / 402,
        (window.innerHeight - pad*2) / 874,
        1
      );
      ref.current.style.transform = `scale(${s})`;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return <div ref={ref} style={{ transformOrigin:'center center' }}>{children}</div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <DeviceScaler>
    <IOSDevice>
      <App/>
    </IOSDevice>
  </DeviceScaler>
);

setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 120);
