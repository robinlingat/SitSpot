/* SitSpot — screen components */

/* ── TopBar ── */
function TopBar({ query, setQuery, intents, active, toggle, onFilters }) {
  return (
    <div style={{ position:'absolute', top:62, left:0, right:0, zIndex:40, pointerEvents:'none', padding:'0 12px' }}>
      <div style={{ pointerEvents:'auto', display:'flex', alignItems:'center', gap:10,
        height:52, padding:'0 8px 0 16px',
        background:'rgba(255,255,255,0.93)', backdropFilter:'blur(var(--blur-md))',
        borderRadius:'var(--radius-full)', boxShadow:'var(--shadow-md)' }}>
        <Icon n="search" s={18} color="var(--text-muted)"/>
        <input value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="Cherche un banc…"
          style={{ flex:1, minWidth:0, border:'none', outline:'none', background:'transparent',
            fontSize:15, fontWeight:500, color:'var(--text-primary)' }}/>
        <button onClick={onFilters} style={{ display:'grid', placeItems:'center', width:38, height:38,
          flex:'none', border:'none', borderRadius:'var(--radius-full)', cursor:'pointer',
          background:active.length?'var(--surface-accent-soft)':'var(--surface-sunken)',
          color:active.length?'var(--text-accent)':'var(--text-secondary)', position:'relative' }}>
          <Icon n="sliders-horizontal" s={18}/>
          {active.length>0 && <span style={{ position:'absolute', top:-2, right:-2, minWidth:16, height:16, padding:'0 4px',
            borderRadius:999, background:'var(--accent)', color:'#fff', fontSize:10, fontWeight:700,
            display:'grid', placeItems:'center', boxShadow:'0 0 0 2px #fff' }}>{active.length}</span>}
        </button>
      </div>
      <div style={{ pointerEvents:'auto', display:'flex', gap:8, overflowX:'auto', padding:'10px 0 4px',
        scrollbarWidth:'none',
        WebkitMaskImage:'linear-gradient(90deg,transparent,#000 14px,#000 calc(100% - 14px),transparent)' }}>
        {intents.map(it=>(
          <Chip key={it.id} icon={it.icon} selected={active.includes(it.id)} onClick={()=>toggle(it.id)}>
            {it.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/* ── FiltersSheet ── */
function FiltersSheet({ filters, setFilters, onClose }) {
  const [loc, setLoc] = React.useState(filters);
  const tog = (k,v) => setLoc(f => ({...f, [k]: f[k]===v ? null : v}));
  const lbl = txt => (
    <div style={{ fontSize:12, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase',
      letterSpacing:'0.07em', marginBottom:10 }}>{txt}</div>
  );
  return (
    <div style={{ position:'absolute', inset:0, zIndex:65 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(26,25,22,0.3)',
        backdropFilter:'blur(2px)', animation:'fadeIn var(--dur-base)' }}/>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, maxHeight:'80%',
        background:'var(--surface-card)', borderRadius:'24px 24px 0 0',
        boxShadow:'var(--shadow-xl)', animation:'slideUp var(--dur-slow) var(--ease-spring)',
        display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'12px 0 4px', display:'flex', justifyContent:'center' }}>
          <div style={{ width:40, height:5, borderRadius:3, background:'var(--neutral-300)' }}/>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'8px 20px 16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, letterSpacing:'-0.02em', margin:0 }}>Filtres</h2>
            <button onClick={onClose} style={{ width:32, height:32, border:'none', borderRadius:'50%',
              background:'var(--surface-sunken)', cursor:'pointer', display:'grid', placeItems:'center' }}>
              <Icon n="x" s={16} color="var(--text-secondary)"/>
            </button>
          </div>
          <div style={{ marginBottom:18 }}>
            {lbl('Distance')}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {['200 m','500 m','1 km','5 km'].map(d=>(
                <Chip key={d} selected={loc.distance===d} onClick={()=>tog('distance',d)}>{d}</Chip>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:18 }}>
            {lbl('Ombrage')}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {["Ensoleillé","À l'ombre","Les deux"].map(s=>(
                <Chip key={s} selected={loc.shade===s} onClick={()=>tog('shade',s)}>{s}</Chip>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:18 }}>
            {lbl('Note minimum')}
            <div style={{ display:'flex', gap:8 }}>
              {['≥ 3 ★','≥ 4 ★'].map(r=>(
                <Chip key={r} selected={loc.minRating===r} onClick={()=>tog('minRating',r)}>{r}</Chip>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'14px 0', borderTop:'1px solid var(--border-subtle)' }}>
            <span style={{ fontSize:15, fontWeight:600 }}>Accessible PMR</span>
            <div onClick={()=>setLoc(f=>({...f,pmr:!f.pmr}))} style={{ width:50, height:30, borderRadius:15,
              cursor:'pointer', background:loc.pmr?'var(--accent)':'var(--neutral-300)',
              display:'flex', alignItems:'center', padding:3, transition:'background var(--dur-base)' }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:'#fff',
                boxShadow:'var(--shadow-sm)',
                transform:loc.pmr?'translateX(20px)':'translateX(0)',
                transition:'transform var(--dur-base) var(--ease-spring)' }}/>
            </div>
          </div>
        </div>
        <div style={{ padding:'12px 20px 24px', borderTop:'1px solid var(--border-subtle)', display:'flex', gap:10 }}>
          <Btn variant="ghost" full onClick={()=>setLoc({distance:null,shade:null,minRating:null,pmr:false})}>Réinitialiser</Btn>
          <Btn variant="primary" full onClick={()=>{setFilters(loc);onClose();}}>Appliquer</Btn>
        </div>
      </div>
    </div>
  );
}

/* ── BenchSheet ── */
function BenchSheet({ bench, onClose, onAddReview, onNeedAuth, isLoggedIn }) {
  if (!bench) return null;
  return (
    <div style={{ position:'absolute', bottom:78, left:0, right:0, zIndex:55, height:'68%',
      background:'var(--surface-card)', borderRadius:'24px 24px 0 0',
      boxShadow:'var(--shadow-xl)', animation:'slideUp var(--dur-slow) var(--ease-spring)',
      display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ padding:'12px 0 4px', display:'flex', justifyContent:'center', flex:'none' }}>
        <div style={{ width:40, height:5, borderRadius:3, background:'var(--neutral-300)' }}/>
      </div>
      {/* photo header */}
      <div style={{ position:'relative', height:138, flex:'none', background:'linear-gradient(145deg,#cfe6c6,#a9d6e6)' }}>
        <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center' }}>
          <Icon n="armchair" s={44} color="var(--green-700)"/>
        </div>
        <span style={{ position:'absolute', top:12, left:14 }}>
          <Badge tone={bench.status.tone} solid dot>{bench.status.label}</Badge>
        </span>
        <button onClick={onClose} style={{ position:'absolute', top:12, right:14, width:34, height:34,
          border:'none', borderRadius:'50%', background:'rgba(255,255,255,0.92)', cursor:'pointer',
          display:'grid', placeItems:'center' }}>
          <Icon n="x" s={16}/>
        </button>
        <div style={{ position:'absolute', bottom:10, left:14, display:'flex', gap:6 }}>
          {bench.photos>0
            ? Array.from({length:Math.min(bench.photos,3)}).map((_,i)=>(
                <div key={i} style={{ width:32, height:32, borderRadius:7,
                  background:'rgba(255,255,255,0.5)', display:'grid', placeItems:'center', cursor:'pointer' }}>
                  <Icon n="image" s={14} color="var(--green-700)"/>
                </div>
              ))
            : <div style={{ display:'flex', alignItems:'center', gap:5, height:32, padding:'0 10px',
                borderRadius:7, background:'rgba(255,255,255,0.5)', cursor:'pointer' }}>
                <Icon n="camera" s={13} color="var(--green-700)"/>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--green-700)' }}>Ajouter une photo</span>
              </div>
          }
        </div>
      </div>
      {/* scroll body */}
      <div style={{ flex:1, overflowY:'auto', padding:'14px 18px 20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:20,
              letterSpacing:'-0.02em', lineHeight:1.15, margin:0 }}>{bench.name}</h2>
            <div style={{ marginTop:3, fontSize:13, color:'var(--text-muted)' }}>{bench.area}</div>
          </div>
          <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:'var(--font-mono)',
            fontSize:12, color:'var(--text-muted)', marginTop:2, flex:'none' }}>
            <Icon n="navigation" s={12}/>{bench.distance}
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10 }}>
          <Stars value={bench.score||0} size={16}/>
          {bench.score
            ? <><span style={{ fontWeight:800, fontSize:15 }}>{String(bench.score).replace('.',',')}</span>
               <span style={{ fontSize:13, color:'var(--text-muted)' }}>· {bench.count} avis</span></>
            : <span style={{ fontSize:13, color:'var(--text-muted)' }}>Aucun avis</span>
          }
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:12 }}>
          {bench.tags.map((t,i)=><Tag key={i} icon={t.icon}>{t.label}</Tag>)}
        </div>
        <div style={{ display:'flex', gap:10, marginTop:14 }}>
          <Btn variant="primary" full iconLeft="navigation">M'y emmener</Btn>
          <Btn variant="ghost" iconLeft="share-2">Partager</Btn>
        </div>
        {/* reviews */}
        <div style={{ marginTop:20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17,
              letterSpacing:'-0.01em', margin:0 }}>Avis</h3>
            <Btn variant="ghost" size="sm" iconLeft="plus"
              onClick={isLoggedIn ? onAddReview : onNeedAuth}>Ajouter</Btn>
          </div>
          {bench.reviews.length===0
            ? <div style={{ padding:'18px 0', textAlign:'center', color:'var(--text-muted)', fontSize:14 }}>
                Aucun avis pour l'instant 🌱<br/>
                <span style={{ fontSize:13 }}>Sois le premier !</span>
              </div>
            : bench.reviews.map((r,i)=>(
              <div key={i} style={{ display:'flex', gap:12, padding:'12px 0',
                borderTop:i>0?'1px solid var(--border-subtle)':'none' }}>
                <Avatar name={r.name} size={36}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                    <span style={{ fontWeight:700, fontSize:13 }}>{r.name}</span>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-muted)' }}>{r.date}</span>
                  </div>
                  <div style={{ margin:'3px 0 5px' }}><Stars value={r.score} size={13}/></div>
                  <p style={{ margin:0, fontSize:13, lineHeight:1.55, color:'var(--text-secondary)', textWrap:'pretty' }}>{r.text}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

/* ── AddReviewModal ── */
function AddReviewModal({ bench, onClose, onSubmit }) {
  const [score, setScore] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [text, setText]   = React.useState('');
  const [selTags, setSelTags] = React.useState([]);
  const toggle = t => setSelTags(ts => ts.includes(t) ? ts.filter(x=>x!==t) : [...ts,t]);
  const disp = hover||score;
  return (
    <div onClick={onClose} style={{ position:'absolute', inset:0, zIndex:70,
      background:'rgba(26,25,22,0.5)', backdropFilter:'blur(4px)',
      display:'grid', placeItems:'center', padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:'100%', background:'var(--surface-card)',
        borderRadius:'var(--radius-2xl)', boxShadow:'var(--shadow-xl)',
        animation:'popIn var(--dur-slow) var(--ease-spring)', overflow:'hidden' }}>
        <div style={{ padding:'20px 20px 24px', maxHeight:'76vh', overflowY:'auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em' }}>
                Comment était ce spot ?
              </div>
              <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18,
                letterSpacing:'-0.02em', margin:'3px 0 0' }}>{bench.name}</h2>
            </div>
            <button onClick={onClose} style={{ width:34, height:34, border:'none', borderRadius:'50%',
              background:'var(--surface-sunken)', cursor:'pointer', display:'grid', placeItems:'center' }}>
              <Icon n="x" s={16} color="var(--text-secondary)"/>
            </button>
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:18 }}>
            {[1,2,3,4,5].map(i=>(
              <span key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)}
                    onClick={()=>setScore(i)} style={{ cursor:'pointer' }}>
                <svg width="40" height="40" viewBox="0 0 24 24"
                     fill={disp>=i?'var(--star)':'var(--neutral-200)'}
                     style={{ display:'block', transition:'fill var(--dur-fast)' }}>
                  <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z"/>
                </svg>
              </span>
            ))}
          </div>
          <textarea value={text} onChange={e=>setText(e.target.value)}
            placeholder="Propre ? À l'ombre ? Tranquille ? Raconte…"
            rows={3} maxLength={500}
            style={{ width:'100%', resize:'none', border:'2px solid var(--border-subtle)',
              borderRadius:'var(--radius-md)', padding:'12px 14px', fontSize:14, lineHeight:1.5,
              color:'var(--text-primary)', background:'var(--surface-card)',
              fontFamily:'var(--font-sans)', boxSizing:'border-box' }}
            onFocus={e=>e.target.style.borderColor='var(--border-accent)'}
            onBlur={e=>e.target.style.borderColor='var(--border-subtle)'}/>
          <div style={{ textAlign:'right', fontSize:11, color:'var(--text-faint)', marginTop:3 }}>{text.length}/500</div>
          <div style={{ marginTop:12 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:8 }}>Caractéristiques</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {window.SS_RTAGS.slice(0,8).map(t=>(
                <Tag key={t} selected={selTags.includes(t)} onClick={()=>toggle(t)}>{t}</Tag>
              ))}
            </div>
          </div>
          <div onClick={()=>{}} style={{ marginTop:14, padding:12,
            border:'2px dashed var(--border-default)', borderRadius:'var(--radius-md)',
            display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
            <div style={{ width:36, height:36, borderRadius:8, background:'var(--surface-sunken)',
              display:'grid', placeItems:'center' }}>
              <Icon n="camera" s={18} color="var(--text-muted)"/>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:600 }}>Ajouter des photos</div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>Facultatif · max 3</div>
            </div>
          </div>
          <div style={{ marginTop:18 }}>
            <Btn variant="primary" full disabled={!score} onClick={()=>onSubmit({score,text,tags:selTags})}>
              Publier mon avis
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── AddBenchModal ── */
function AddBenchModal({ onClose, onSubmit }) {
  const [name, setName]     = React.useState('');
  const [hasPhoto, setHP]   = React.useState(false);
  const [tags, setTags]     = React.useState([]);
  const toggle = t => setTags(ts => ts.includes(t) ? ts.filter(x=>x!==t) : [...ts,t]);
  return (
    <div style={{ position:'absolute', inset:'0 0 78px 0', zIndex:65, display:'flex', alignItems:'flex-end' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(26,25,22,0.35)', backdropFilter:'blur(2px)' }}/>
      <div style={{ position:'relative', width:'100%', maxHeight:'88%', background:'var(--surface-card)',
        borderRadius:'24px 24px 0 0', boxShadow:'var(--shadow-xl)',
        animation:'slideUp var(--dur-slow) var(--ease-spring)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'12px 0 4px', display:'flex', justifyContent:'center' }}>
          <div style={{ width:40, height:5, borderRadius:3, background:'var(--neutral-300)' }}/>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'8px 20px 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, letterSpacing:'-0.02em', margin:0 }}>Ajouter un banc</h2>
            <button onClick={onClose} style={{ width:32, height:32, border:'none', borderRadius:'50%',
              background:'var(--surface-sunken)', cursor:'pointer', display:'grid', placeItems:'center' }}>
              <Icon n="x" s={16} color="var(--text-secondary)"/>
            </button>
          </div>
          {/* mini-map */}
          <div style={{ position:'relative', height:132, borderRadius:'var(--radius-lg)', overflow:'hidden',
            background:'var(--map-land)', marginBottom:18 }}>
            <svg viewBox="0 0 400 180" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
              <rect width="400" height="180" fill="var(--map-land)"/>
              <ellipse cx="200" cy="90" rx="100" ry="55" fill="var(--map-park)"/>
              <path d="M-20 90 H420" stroke="var(--map-road-major)" strokeWidth="13" fill="none"/>
              <path d="M200 -20 V200" stroke="var(--map-road-major)" strokeWidth="13" fill="none"/>
              <path d="M-20 90 H420" stroke="var(--map-road)" strokeWidth="9" fill="none"/>
              <path d="M200 -20 V200" stroke="var(--map-road)" strokeWidth="9" fill="none"/>
            </svg>
            <div style={{ position:'absolute', left:'50%', top:'36%', transform:'translate(-50%,-100%)' }}>
              <div style={{ width:30, height:30, background:'var(--marker-ring)', borderRadius:'50% 50% 50% 0',
                transform:'rotate(-45deg)', boxShadow:'var(--shadow-lg)', display:'grid', placeItems:'center' }}>
                <div style={{ transform:'rotate(45deg)' }}><Icon n="map-pin" s={15} color="#fff"/></div>
              </div>
            </div>
            <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)',
              background:'rgba(255,255,255,0.92)', borderRadius:99, padding:'5px 12px',
              fontSize:12, fontWeight:600, color:'var(--text-secondary)', whiteSpace:'nowrap' }}>
              Déplace le pin à l'emplacement exact
            </div>
          </div>
          {/* name */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--text-secondary)', marginBottom:6 }}>
              Nom <span style={{ color:'var(--text-faint)', fontWeight:400 }}>(facultatif)</span>
            </label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="ex. Banc du parc Monceau"
              style={{ width:'100%', height:46, border:'2px solid var(--border-subtle)',
                borderRadius:'var(--radius-md)', padding:'0 14px', fontSize:15, boxSizing:'border-box',
                fontFamily:'var(--font-sans)' }}
              onFocus={e=>e.target.style.borderColor='var(--border-accent)'}
              onBlur={e=>e.target.style.borderColor='var(--border-subtle)'}/>
          </div>
          {/* photo */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--text-secondary)', marginBottom:6 }}>
              Photo <span style={{ color:'var(--danger)', fontSize:12 }}>obligatoire</span>
            </label>
            {hasPhoto ? (
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ width:76, height:76, borderRadius:12, background:'linear-gradient(145deg,#cfe6c6,#a9d6e6)',
                  display:'grid', placeItems:'center', position:'relative' }}>
                  <Icon n="image" s={22} color="var(--green-700)"/>
                  <button onClick={()=>setHP(false)} style={{ position:'absolute', top:-5, right:-5,
                    width:20, height:20, border:'none', borderRadius:'50%', background:'var(--neutral-800)',
                    cursor:'pointer', display:'grid', placeItems:'center' }}>
                    <Icon n="x" s={11} color="#fff"/>
                  </button>
                </div>
              </div>
            ) : (
              <div onClick={()=>setHP(true)} style={{ height:80, borderRadius:12,
                border:'2px dashed var(--border-default)', display:'flex', alignItems:'center',
                justifyContent:'center', gap:10, cursor:'pointer', background:'var(--surface-sunken)' }}>
                <Icon n="camera" s={20} color="var(--text-muted)"/>
                <span style={{ fontSize:14, fontWeight:600, color:'var(--text-secondary)' }}>Prendre ou importer</span>
              </div>
            )}
          </div>
          {/* tags */}
          <div style={{ marginBottom:22 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--text-secondary)', marginBottom:8 }}>
              Caractéristiques <span style={{ color:'var(--text-faint)', fontWeight:400 }}>(facultatif)</span>
            </label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {window.SS_RTAGS.slice(0,6).map(t=>(
                <Tag key={t} selected={tags.includes(t)} onClick={()=>toggle(t)}>{t}</Tag>
              ))}
            </div>
          </div>
          <Btn variant="primary" full disabled={!hasPhoto} onClick={()=>onSubmit({name,tags})}>
            Soumettre le banc
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ── AuthModal ── */
function AuthModal({ view, setView, onClose, onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [pw, setPw]       = React.useState('');
  const [pseudo, setPseudo] = React.useState('');
  const isLogin = view==='login';
  const inp = {
    width:'100%', height:50, border:'2px solid var(--border-subtle)',
    borderRadius:'var(--radius-md)', padding:'0 14px', fontSize:15,
    fontFamily:'var(--font-sans)', color:'var(--text-primary)', boxSizing:'border-box',
  };
  return (
    <div style={{ position:'absolute', inset:0, zIndex:80, background:'var(--surface-card)',
      overflowY:'auto', animation:'popIn var(--dur-slow) var(--ease-spring)' }}>
      <button onClick={onClose} style={{ position:'absolute', top:68, right:20, width:36, height:36,
        border:'none', borderRadius:'50%', background:'var(--surface-sunken)', cursor:'pointer',
        display:'grid', placeItems:'center', zIndex:1 }}>
        <Icon n="x" s={18} color="var(--text-secondary)"/>
      </button>
      <div style={{ padding:'76px 28px 48px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
          <div style={{ width:42, height:42, borderRadius:14, background:'var(--marker-ring)',
            display:'grid', placeItems:'center' }}>
            <Icon n="armchair" s={20} color="#fff"/>
          </div>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, letterSpacing:'-0.03em' }}>SitSpot</span>
        </div>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:26,
          letterSpacing:'-0.03em', marginBottom:6 }}>{isLogin ? 'Bon retour 👋' : 'Rejoins SitSpot'}</h1>
        <p style={{ fontSize:15, color:'var(--text-secondary)', marginBottom:24, lineHeight:1.5 }}>
          {isLogin ? 'Connecte-toi pour noter et ajouter des bancs.' : 'Crée ton compte pour contribuer à la communauté.'}
        </p>
        {/* Google */}
        <button onClick={onSuccess} style={{ width:'100%', height:52, border:'2px solid var(--border-default)',
          borderRadius:'var(--radius-full)', background:'#fff', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          fontSize:15, fontWeight:600, marginBottom:18, fontFamily:'var(--font-sans)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuer avec Google
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
          <div style={{ flex:1, height:1, background:'var(--border-subtle)' }}/>
          <span style={{ fontSize:13, color:'var(--text-muted)' }}>ou</span>
          <div style={{ flex:1, height:1, background:'var(--border-subtle)' }}/>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {!isLogin && (
            <input value={pseudo} onChange={e=>setPseudo(e.target.value)} placeholder="Pseudo" style={inp}
              onFocus={e=>e.target.style.borderColor='var(--border-accent)'}
              onBlur={e=>e.target.style.borderColor='var(--border-subtle)'}/>
          )}
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={inp}
            onFocus={e=>e.target.style.borderColor='var(--border-accent)'}
            onBlur={e=>e.target.style.borderColor='var(--border-subtle)'}/>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Mot de passe" style={inp}
            onFocus={e=>e.target.style.borderColor='var(--border-accent)'}
            onBlur={e=>e.target.style.borderColor='var(--border-subtle)'}/>
        </div>
        <Btn variant="primary" full style={{ marginTop:18, height:54 }} onClick={onSuccess}>
          {isLogin ? 'Se connecter' : 'Créer mon compte'}
        </Btn>
        <div style={{ marginTop:18, textAlign:'center', fontSize:14, color:'var(--text-secondary)' }}>
          {isLogin
            ? <>Pas encore de compte ?{' '}<span onClick={()=>setView('signup')} style={{ color:'var(--accent)', fontWeight:700, cursor:'pointer' }}>S'inscrire</span></>
            : <>Déjà un compte ?{' '}<span onClick={()=>setView('login')} style={{ color:'var(--accent)', fontWeight:700, cursor:'pointer' }}>Se connecter</span></>
          }
        </div>
      </div>
    </div>
  );
}

/* ── ProfileScreen ── */
function ProfileScreen({ isLoggedIn, user, onLogout, onLogin }) {
  if (!isLoggedIn) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding:'32px 24px', background:'var(--surface-app)', textAlign:'center' }}>
      <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--surface-accent-soft)',
        display:'grid', placeItems:'center', marginBottom:16 }}>
        <Icon n="user" s={30} color="var(--text-accent)"/>
      </div>
      <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22,
        letterSpacing:'-0.02em', marginBottom:8 }}>Connecte-toi</h2>
      <p style={{ fontSize:15, color:'var(--text-secondary)', lineHeight:1.5, marginBottom:24, maxWidth:260 }}>
        Pour noter des bancs, ajouter les tiens et consulter ton profil.
      </p>
      <Btn variant="primary" iconLeft="user" onClick={onLogin}>Connexion / Inscription</Btn>
    </div>
  );

  const myBenches = window.SS_BENCHES.slice(0,2);
  const myReviews = [
    {bench:'Banc du parc Monceau', score:5, date:'il y a 3 j'},
    {bench:'Banc des quais',        score:5, date:'il y a 1 sem'},
    {bench:'Banc de la butte',      score:4, date:'il y a 3 sem'},
  ];

  return (
    <div style={{ flex:1, overflowY:'auto', background:'var(--surface-app)' }}>
      {/* header card */}
      <div style={{ background:'var(--surface-card)', padding:'20px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ position:'relative' }}>
            <Avatar name={user.name} size={60}/>
            <button style={{ position:'absolute', bottom:-2, right:-2, width:24, height:24, border:'none',
              borderRadius:'50%', background:'var(--accent)', cursor:'pointer', display:'grid', placeItems:'center' }}>
              <Icon n="camera" s={12} color="#fff"/>
            </button>
          </div>
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:19,
              letterSpacing:'-0.02em', margin:0 }}>{user.name}</h2>
            <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:2 }}>@{user.pseudo}</div>
          </div>
        </div>
        <div style={{ display:'flex', marginTop:18, paddingTop:16, borderTop:'1px solid var(--border-subtle)' }}>
          {[{l:'Bancs ajoutés',v:user.benchCount},{l:'Avis postés',v:user.reviewCount}].map((s,i)=>(
            <div key={i} style={{ flex:1, textAlign:'center',
              borderRight:i===0?'1px solid var(--border-subtle)':'none' }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:28,
                letterSpacing:'-0.03em' }}>{s.v}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* my benches */}
      <div style={{ margin:'10px 0 0', background:'var(--surface-card)', padding:'16px 20px' }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16,
          letterSpacing:'-0.01em', margin:'0 0 12px' }}>Mes bancs</h3>
        {myBenches.map((b,i)=>(
          <div key={b.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0',
            borderTop:i>0?'1px solid var(--border-subtle)':'none' }}>
            <div style={{ width:44, height:44, borderRadius:10, background:'linear-gradient(145deg,#cfe6c6,#a9d6e6)',
              display:'grid', placeItems:'center', flex:'none' }}>
              <Icon n="armchair" s={18} color="var(--green-700)"/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:600, fontSize:14 }}>{b.name}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:1 }}>{b.area}</div>
            </div>
            <span style={{ display:'inline-flex', alignItems:'center', gap:3 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--star)">
                <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z"/>
              </svg>
              <span style={{ fontSize:13, fontWeight:700 }}>{String(b.score).replace('.',',')}</span>
            </span>
          </div>
        ))}
      </div>
      {/* my reviews */}
      <div style={{ margin:'10px 0 0', background:'var(--surface-card)', padding:'16px 20px' }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16,
          letterSpacing:'-0.01em', margin:'0 0 12px' }}>Mes avis</h3>
        {myReviews.map((r,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0',
            borderTop:i>0?'1px solid var(--border-subtle)':'none' }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--surface-accent-soft)',
              display:'grid', placeItems:'center', flex:'none' }}>
              <Icon n="star" s={17} color="var(--text-accent)"/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:600, fontSize:14 }}>{r.bench}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
                <Stars value={r.score} size={12}/>
                <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{r.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ margin:'10px 20px 24px' }}>
        <Btn variant="danger" full onClick={onLogout}>Se déconnecter</Btn>
      </div>
    </div>
  );
}

/* ── Toast ── */
function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{ position:'absolute', bottom:96, left:'50%', zIndex:95, pointerEvents:'none',
      display:'inline-flex', alignItems:'center', gap:10, padding:'13px 18px',
      background:'var(--neutral-900)', color:'#fff', borderRadius:'var(--radius-full)',
      boxShadow:'var(--shadow-xl)', fontWeight:600, fontSize:14, whiteSpace:'nowrap',
      animation:'springIn 400ms var(--ease-spring)' }}>
      <Icon n="check-circle" s={18} color="var(--green-400)"/>
      {message}
    </div>
  );
}

Object.assign(window, { TopBar, FiltersSheet, BenchSheet, AddReviewModal, AddBenchModal, AuthModal, ProfileScreen, Toast });
