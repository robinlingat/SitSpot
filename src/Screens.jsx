import React from 'react';
import { Icon, Stars, Btn, Chip, Tag, Badge, Avatar } from './Kit';
import { SS_RTAGS } from './data';
import { supabase } from './supabase';

export function TopBar({ query, setQuery, intents, active, toggle, onFilters, onSearch, top=62 }) {
  const handleKey = e => { if (e.key === 'Enter' && query.trim()) onSearch?.(query.trim()); };
  return (
    <div style={{position:'absolute',top,left:0,right:0,zIndex:40,pointerEvents:'none',padding:'0 12px'}}>
      <div style={{pointerEvents:'auto',display:'flex',alignItems:'center',gap:10,
        height:52,padding:'0 8px 0 16px',
        background:'rgba(255,255,255,0.93)',backdropFilter:'blur(var(--blur-md))',
        borderRadius:'var(--radius-full)',boxShadow:'var(--shadow-md)'}}>
        <Icon n="search" s={18} color="var(--text-muted)"/>
        <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={handleKey}
          placeholder="Cherche un lieu ou un banc…"
          style={{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',
            fontSize:15,fontWeight:500,color:'var(--text-primary)'}}/>
        <button onClick={onFilters} style={{display:'grid',placeItems:'center',width:38,height:38,
          flexShrink:0,border:'none',borderRadius:'var(--radius-full)',cursor:'pointer',
          background:active.length?'var(--surface-accent-soft)':'var(--surface-sunken)',
          color:active.length?'var(--text-accent)':'var(--text-secondary)',position:'relative'}}>
          <Icon n="sliders-horizontal" s={18}/>
          {active.length>0&&<span style={{position:'absolute',top:-2,right:-2,minWidth:16,height:16,padding:'0 4px',
            borderRadius:999,background:'var(--accent)',color:'#fff',fontSize:10,fontWeight:700,
            display:'grid',placeItems:'center',boxShadow:'0 0 0 2px #fff'}}>{active.length}</span>}
        </button>
      </div>
      <div style={{pointerEvents:'auto',display:'flex',gap:8,overflowX:'auto',padding:'10px 0 4px',
        scrollbarWidth:'none',
        WebkitMaskImage:'linear-gradient(90deg,transparent,#000 14px,#000 calc(100% - 14px),transparent)'}}>
        {intents.map(it=>(
          <Chip key={it.id} icon={it.icon} selected={active.includes(it.id)} onClick={()=>toggle(it.id)}>
            {it.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export function FiltersSheet({ filters, setFilters, onClose }) {
  const [loc, setLoc] = React.useState(filters);
  const tog = (k,v) => setLoc(f=>({...f,[k]:f[k]===v?null:v}));
  const lbl = txt => <div style={{fontSize:12,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10}}>{txt}</div>;
  return (
    <div style={{position:'absolute',inset:0,zIndex:65}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(26,25,22,0.3)',
        backdropFilter:'blur(2px)',animation:'fadeIn var(--dur-base)'}}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,maxHeight:'80%',
        background:'var(--surface-card)',borderRadius:'24px 24px 0 0',
        boxShadow:'var(--shadow-xl)',animation:'slideUp var(--dur-slow) var(--ease-spring)',
        display:'flex',flexDirection:'column'}}>
        <div style={{padding:'12px 0 4px',display:'flex',justifyContent:'center'}}>
          <div style={{width:40,height:5,borderRadius:3,background:'var(--neutral-300)'}}/>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'8px 20px 16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <h2 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:22,letterSpacing:'-0.02em',margin:0}}>Filtres</h2>
            <button onClick={onClose} style={{width:32,height:32,border:'none',borderRadius:'50%',
              background:'var(--surface-sunken)',cursor:'pointer',display:'grid',placeItems:'center'}}>
              <Icon n="x" s={16} color="var(--text-secondary)"/>
            </button>
          </div>
          <div style={{marginBottom:18}}>{lbl('Distance')}
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {['200 m','500 m','1 km','5 km'].map(d=><Chip key={d} selected={loc.distance===d} onClick={()=>tog('distance',d)}>{d}</Chip>)}
            </div>
          </div>
          <div style={{marginBottom:18}}>{lbl('Ombrage')}
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {["Ensoleillé","À l'ombre","Les deux"].map(s=><Chip key={s} selected={loc.shade===s} onClick={()=>tog('shade',s)}>{s}</Chip>)}
            </div>
          </div>
          <div style={{marginBottom:18}}>{lbl('Note minimum')}
            <div style={{display:'flex',gap:8}}>
              {['≥ 3 ★','≥ 4 ★'].map(r=><Chip key={r} selected={loc.minRating===r} onClick={()=>tog('minRating',r)}>{r}</Chip>)}
            </div>
          </div>
          {[
            { key:'rated', label:'Déjà noté' },
            { key:'pmr',   label:'Accessible PMR' },
          ].map(({ key, label }) => (
            <div key={key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',
              padding:'14px 0',borderTop:'1px solid var(--border-subtle)'}}>
              <span style={{fontSize:15,fontWeight:600}}>{label}</span>
              <div onClick={()=>setLoc(f=>({...f,[key]:!f[key]}))} style={{width:50,height:30,borderRadius:15,
                cursor:'pointer',background:loc[key]?'var(--accent)':'var(--neutral-300)',
                display:'flex',alignItems:'center',padding:3,transition:'background var(--dur-base)'}}>
                <div style={{width:24,height:24,borderRadius:'50%',background:'#fff',
                  boxShadow:'var(--shadow-sm)',
                  transform:loc[key]?'translateX(20px)':'translateX(0)',
                  transition:'transform var(--dur-base) var(--ease-spring)'}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:'12px 20px 24px',borderTop:'1px solid var(--border-subtle)',display:'flex',gap:10}}>
          <Btn variant="ghost" full onClick={()=>setLoc({distance:null,shade:null,minRating:null,pmr:false,rated:false})}>Réinitialiser</Btn>
          <Btn variant="primary" full onClick={()=>{setFilters(loc);onClose();}}>Appliquer</Btn>
        </div>
      </div>
    </div>
  );
}

export function BenchSheet({ bench, reviews = [], photos = [], onClose, onAddReview, onNeedAuth, isLoggedIn, user, onPhotoUploaded, onPhotoDeleted, onDeleteReview, desktop = false }) {
  const [shared,       setShared]       = React.useState(false);
  const [photoLoading, setPhotoLoading] = React.useState(false);
  const [viewPhoto,    setViewPhoto]    = React.useState(null);
  const photoInputRef = React.useRef();

  const handlePhotoDelete = async (photo) => {
    if (!window.confirm('Supprimer cette photo ?')) return;
    const pathParts = photo.url.split('/bench-photos/');
    if (pathParts[1]) {
      await supabase.storage.from('bench-photos').remove([pathParts[1]]);
    }
    const { error } = await supabase.from('photos').delete().eq('id', photo.id);
    if (error) { alert('Erreur lors de la suppression : ' + error.message); return; }
    onPhotoDeleted?.(photo.id);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) { alert(!user ? 'Connecte-toi pour ajouter une photo.' : 'Fichier invalide.'); return; }
    setPhotoLoading(true);
    try {
      const ext  = file.name.split('.').pop();
      const path = `${user.id}/${bench.id}/${Date.now()}.${ext}`;
      const { data: upload, error } = await supabase.storage.from('bench-photos').upload(path, file, { upsert: true });
      if (error) { alert('Erreur upload : ' + error.message); return; }
      const { data: { publicUrl } } = supabase.storage.from('bench-photos').getPublicUrl(path);
      const { data: photo, error: dbError } = await supabase.from('photos').insert({ bench_id: bench.id, user_id: user.id, url: publicUrl }).select().single();
      if (dbError) { alert('Erreur base de données : ' + dbError.message); return; }
      if (photo) onPhotoUploaded?.(photo);
    } finally { setPhotoLoading(false); }
  };

  const handleShare = async () => {
    const mapsUrl = `https://www.google.com/maps?q=${bench.lat},${bench.lng}`;
    const text    = bench.score
      ? `${bench.name} · ${String(bench.score).replace('.', ',')} ★ — ${bench.area}`
      : `${bench.name} — ${bench.area}`;
    if (navigator.share) {
      try { await navigator.share({ title: bench.name, text, url: mapsUrl }); } catch(_) {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${mapsUrl}`);
      setShared(true);
      setTimeout(() => setShared(false), 2200);
    }
  };

  if (!bench) return null;
  return (<>
    {viewPhoto && (
      <div onClick={()=>setViewPhoto(null)} style={{position:'fixed',inset:0,zIndex:100,background:'rgba(0,0,0,0.92)',display:'grid',placeItems:'center'}}>
        <img src={viewPhoto.url} alt="" style={{maxWidth:'95vw',maxHeight:'85vh',borderRadius:12,objectFit:'contain'}}/>
        {isLoggedIn && user?.id === viewPhoto.user_id &&
          <button onClick={(e)=>{e.stopPropagation();handlePhotoDelete(viewPhoto);setViewPhoto(null);}}
            style={{position:'absolute',bottom:40,left:'50%',transform:'translateX(-50%)',
              display:'flex',alignItems:'center',gap:8,padding:'12px 24px',
              background:'rgba(220,38,38,0.9)',border:'none',borderRadius:99,cursor:'pointer',
              color:'#fff',fontWeight:700,fontSize:15,fontFamily:'var(--font-sans)'}}>
            <Icon n="trash-2" s={16} color="#fff"/> Supprimer cette photo
          </button>
        }
      </div>
    )}
    <div style={desktop ? {
      flex:1, display:'flex', flexDirection:'column', overflow:'hidden',
      background:'var(--surface-card)',
    } : {
      position:'absolute',bottom:78,left:0,right:0,zIndex:55,height:'68%',
      background:'var(--surface-card)',borderRadius:'24px 24px 0 0',
      boxShadow:'var(--shadow-xl)',animation:'slideUp var(--dur-slow) var(--ease-spring)',
      display:'flex',flexDirection:'column',overflow:'hidden',
    }}>
      {!desktop && (
        <div style={{padding:'12px 0 4px',display:'flex',justifyContent:'center',flexShrink:0}}>
          <div style={{width:40,height:5,borderRadius:3,background:'var(--neutral-300)'}}/>
        </div>
      )}
      <input ref={photoInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhotoUpload}/>
      <div style={{position:'relative',height: desktop ? 200 : 138,flexShrink:0,background:'linear-gradient(145deg,#cfe6c6,#a9d6e6)'}}>
        {photos.length > 0
          ? <img src={photos[0].url} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
          : <div style={{position:'absolute',inset:0,display:'grid',placeItems:'center'}}>
              <Icon n="armchair" s={44} color="var(--green-700)"/>
            </div>
        }
        <span style={{position:'absolute',top:12,left:14}}><Badge tone={bench.status.tone} solid dot>{bench.status.label}</Badge></span>
        <button onClick={onClose} style={{position:'absolute',top:12,right:14,width:34,height:34,
          border:'none',borderRadius:'50%',background:'rgba(255,255,255,0.92)',cursor:'pointer',display:'grid',placeItems:'center'}}>
          <Icon n="x" s={16}/>
        </button>
        <div style={{position:'absolute',bottom:10,left:14,display:'flex',gap:6}}>
          {photos.slice(0,3).map((p,i)=>(
            <div key={p.id||i} style={{position:'relative',width:32,height:32,borderRadius:7,overflow:'visible'}}>
              <div onClick={()=>setViewPhoto(p)} style={{width:32,height:32,borderRadius:7,overflow:'hidden',border:'2px solid rgba(255,255,255,0.8)',cursor:'pointer'}}>
                <img src={p.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              </div>
              {isLoggedIn && user?.id === p.user_id &&
                <button onClick={(e)=>{e.stopPropagation();handlePhotoDelete(p);}}
                  style={{position:'absolute',top:-6,right:-6,width:18,height:18,border:'none',borderRadius:'50%',
                    background:'rgba(220,38,38,0.9)',cursor:'pointer',display:'grid',placeItems:'center',zIndex:2}}>
                  <Icon n="x" s={10} color="#fff"/>
                </button>
              }
            </div>
          ))}
          {isLoggedIn
            ? <div onClick={()=>!photoLoading&&photoInputRef.current?.click()}
                style={{display:'flex',alignItems:'center',gap:5,height:32,padding:'0 10px',borderRadius:7,
                  background:'rgba(255,255,255,0.5)',cursor:photoLoading?'wait':'pointer'}}>
                <Icon n={photoLoading?'loader':'camera'} s={13} color="var(--green-700)"/>
                <span style={{fontSize:12,fontWeight:600,color:'var(--green-700)'}}>
                  {photoLoading?'Envoi…':'Ajouter une photo'}
                </span>
              </div>
            : <div onClick={onNeedAuth}
                style={{display:'flex',alignItems:'center',gap:5,height:32,padding:'0 10px',borderRadius:7,background:'rgba(255,255,255,0.5)',cursor:'pointer'}}>
                <Icon n="camera" s={13} color="var(--green-700)"/>
                <span style={{fontSize:12,fontWeight:600,color:'var(--green-700)'}}>Ajouter une photo</span>
              </div>
          }
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'14px 18px 20px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
          <div>
            <h2 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:20,letterSpacing:'-0.02em',lineHeight:1.15,margin:0}}>{bench.name}</h2>
            <div style={{marginTop:3,fontSize:13,color:'var(--text-muted)'}}>{bench.area}</div>
          </div>
          <span style={{display:'inline-flex',alignItems:'center',gap:4,fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-muted)',marginTop:2,flexShrink:0}}>
            <Icon n="navigation" s={12}/>{bench.distance}
          </span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,marginTop:10}}>
          <Stars value={bench.score||0} size={16}/>
          {bench.score
            ?<><span style={{fontWeight:800,fontSize:15}}>{String(bench.score).replace('.',',')}</span>
               <span style={{fontSize:13,color:'var(--text-muted)'}}>· {bench.count} avis</span></>
            :<span style={{fontSize:13,color:'var(--text-muted)'}}>Aucun avis</span>}
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:12}}>
          {bench.tags.map((t,i)=><Tag key={i} icon={t.icon}>{t.label}</Tag>)}
        </div>
        <div style={{display:'flex',gap:10,marginTop:14}}>
          <Btn variant="primary" full iconLeft="navigation"
            onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${bench.lat},${bench.lng}`,'_blank')}>
            M'y emmener
          </Btn>
          <Btn variant="ghost" iconLeft={shared ? 'check' : 'share-2'} onClick={handleShare}>
            {shared ? 'Copié !' : 'Partager'}
          </Btn>
        </div>
        <div style={{marginTop:20}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:17,letterSpacing:'-0.01em',margin:0}}>Avis</h3>
            <Btn variant="ghost" size="sm" iconLeft="plus" onClick={isLoggedIn?onAddReview:onNeedAuth}>Ajouter</Btn>
          </div>
          {reviews.length===0
            ?<div style={{padding:'18px 0',textAlign:'center',color:'var(--text-muted)',fontSize:14}}>
               Aucun avis pour l'instant 🌱<br/><span style={{fontSize:13}}>Sois le premier !</span>
             </div>
            :reviews.map((r,i)=>{
              const date = new Date(r.created_at);
              const dateStr = date.toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
              const isOwner = user && r.user_id === user.id;
              return (
              <div key={r.id||i} style={{display:'flex',gap:12,padding:'12px 0',borderTop:i>0?'1px solid var(--border-subtle)':'none'}}>
                <Avatar name={r.user_name||'?'} size={36}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
                    <span style={{fontWeight:700,fontSize:13}}>{r.user_name||'Anonyme'}</span>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)'}}>{dateStr}</span>
                      {isOwner && onDeleteReview && (
                        <button
                          onClick={()=>onDeleteReview(r.id)}
                          title="Supprimer mon avis"
                          style={{background:'none',border:'none',cursor:'pointer',padding:2,display:'flex',alignItems:'center',color:'var(--text-muted)',borderRadius:4,lineHeight:1}}
                          onMouseEnter={e=>e.currentTarget.style.color='var(--error,#e53e3e)'}
                          onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{margin:'3px 0 5px'}}><Stars value={r.score} size={13}/></div>
                  <p style={{margin:0,fontSize:13,lineHeight:1.55,color:'var(--text-secondary)'}}>{r.text}</p>
                </div>
              </div>);})}
        </div>
      </div>
    </div>
  </>);
}

export function AddReviewModal({ bench, onClose, onSubmit }) {
  const [score,setScore]=React.useState(0);
  const [hover,setHover]=React.useState(0);
  const [text,setText]=React.useState('');
  const [selTags,setSelTags]=React.useState([]);
  const toggle=t=>setSelTags(ts=>ts.includes(t)?ts.filter(x=>x!==t):[...ts,t]);
  const disp=hover||score;
  return (
    <div onClick={onClose} style={{position:'absolute',inset:0,zIndex:70,
      background:'rgba(26,25,22,0.5)',backdropFilter:'blur(4px)',display:'grid',placeItems:'center',padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{width:'100%',background:'var(--surface-card)',
        borderRadius:'var(--radius-2xl)',boxShadow:'var(--shadow-xl)',
        animation:'popIn var(--dur-slow) var(--ease-spring)',overflow:'hidden'}}>
        <div style={{padding:'20px 20px 24px',maxHeight:'76vh',overflowY:'auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.07em'}}>Comment était ce spot ?</div>
              <h2 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:18,letterSpacing:'-0.02em',margin:'3px 0 0'}}>{bench.name}</h2>
            </div>
            <button onClick={onClose} style={{width:34,height:34,border:'none',borderRadius:'50%',background:'var(--surface-sunken)',cursor:'pointer',display:'grid',placeItems:'center'}}>
              <Icon n="x" s={16} color="var(--text-secondary)"/>
            </button>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'center',marginBottom:18}}>
            {[1,2,3,4,5].map(i=>(
              <span key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)}
                    onClick={()=>setScore(i)} style={{cursor:'pointer'}}>
                <svg width="40" height="40" viewBox="0 0 24 24"
                     fill={disp>=i?'var(--star)':'var(--neutral-200)'}
                     style={{display:'block',transition:'fill var(--dur-fast)'}}>
                  <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z"/>
                </svg>
              </span>))}
          </div>
          <textarea value={text} onChange={e=>setText(e.target.value)}
            placeholder="Propre ? À l'ombre ? Tranquille ? Raconte…" rows={3} maxLength={500}
            style={{width:'100%',resize:'none',border:'2px solid var(--border-subtle)',
              borderRadius:'var(--radius-md)',padding:'12px 14px',fontSize:14,lineHeight:1.5,
              color:'var(--text-primary)',background:'var(--surface-card)',fontFamily:'var(--font-sans)',boxSizing:'border-box'}}
            onFocus={e=>e.target.style.borderColor='var(--border-accent)'}
            onBlur={e=>e.target.style.borderColor='var(--border-subtle)'}/>
          <div style={{textAlign:'right',fontSize:11,color:'var(--text-faint)',marginTop:3}}>{text.length}/500</div>
          <div style={{marginTop:12}}>
            <div style={{fontSize:12,fontWeight:600,color:'var(--text-muted)',marginBottom:8}}>Caractéristiques</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {SS_RTAGS.slice(0,8).map(t=><Tag key={t} selected={selTags.includes(t)} onClick={()=>toggle(t)}>{t}</Tag>)}
            </div>
          </div>
          <div style={{marginTop:18}}>
            <Btn variant="primary" full disabled={!score} onClick={()=>onSubmit({score,text,tags:selTags})}>Publier mon avis</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AddBenchModal({ onClose, onSubmit }) {
  const [name,setName]=React.useState('');
  const [file,setFile]=React.useState(null);
  const [preview,setPreview]=React.useState(null);
  const [tags,setTags]=React.useState([]);
  const fileInputRef=React.useRef();
  const toggle=t=>setTags(ts=>ts.includes(t)?ts.filter(x=>x!==t):[...ts,t]);
  const handleFile=e=>{
    const f=e.target.files?.[0];
    if(!f)return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
  return (
    <div style={{position:'absolute',inset:'0 0 78px 0',zIndex:65,display:'flex',alignItems:'flex-end'}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(26,25,22,0.35)',backdropFilter:'blur(2px)'}}/>
      <div style={{position:'relative',width:'100%',maxHeight:'88%',background:'var(--surface-card)',
        borderRadius:'24px 24px 0 0',boxShadow:'var(--shadow-xl)',
        animation:'slideUp var(--dur-slow) var(--ease-spring)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'12px 0 4px',display:'flex',justifyContent:'center'}}>
          <div style={{width:40,height:5,borderRadius:3,background:'var(--neutral-300)'}}/>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'8px 20px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
            <h2 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:22,letterSpacing:'-0.02em',margin:0}}>Ajouter un banc</h2>
            <button onClick={onClose} style={{width:32,height:32,border:'none',borderRadius:'50%',background:'var(--surface-sunken)',cursor:'pointer',display:'grid',placeItems:'center'}}>
              <Icon n="x" s={16} color="var(--text-secondary)"/>
            </button>
          </div>
          <div style={{position:'relative',height:132,borderRadius:'var(--radius-lg)',overflow:'hidden',background:'var(--map-land)',marginBottom:18}}>
            <svg viewBox="0 0 400 180" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
              <rect width="400" height="180" fill="var(--map-land)"/>
              <ellipse cx="200" cy="90" rx="100" ry="55" fill="var(--map-park)"/>
              <path d="M-20 90 H420" stroke="var(--map-road-major)" strokeWidth="13" fill="none"/>
              <path d="M200 -20 V200" stroke="var(--map-road-major)" strokeWidth="13" fill="none"/>
              <path d="M-20 90 H420" stroke="var(--map-road)" strokeWidth="9" fill="none"/>
              <path d="M200 -20 V200" stroke="var(--map-road)" strokeWidth="9" fill="none"/>
            </svg>
            <div style={{position:'absolute',left:'50%',top:'36%',transform:'translate(-50%,-100%)'}}>
              <div style={{width:30,height:30,background:'var(--marker-ring)',borderRadius:'50% 50% 50% 0',
                transform:'rotate(-45deg)',boxShadow:'var(--shadow-lg)',display:'grid',placeItems:'center'}}>
                <div style={{transform:'rotate(45deg)'}}><Icon n="map-pin" s={15} color="#fff"/></div>
              </div>
            </div>
            <div style={{position:'absolute',bottom:8,left:'50%',transform:'translateX(-50%)',
              background:'rgba(255,255,255,0.92)',borderRadius:99,padding:'5px 12px',fontSize:12,fontWeight:600,color:'var(--text-secondary)',whiteSpace:'nowrap'}}>
              Déplace le pin à l'emplacement exact
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:13,fontWeight:600,color:'var(--text-secondary)',marginBottom:6}}>
              Nom <span style={{color:'var(--text-faint)',fontWeight:400}}>(facultatif)</span>
            </label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="ex. Banc du parc Monceau"
              style={{width:'100%',height:46,border:'2px solid var(--border-subtle)',borderRadius:'var(--radius-md)',padding:'0 14px',fontSize:15,boxSizing:'border-box',fontFamily:'var(--font-sans)'}}
              onFocus={e=>e.target.style.borderColor='var(--border-accent)'}
              onBlur={e=>e.target.style.borderColor='var(--border-subtle)'}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:13,fontWeight:600,color:'var(--text-secondary)',marginBottom:6}}>
              Photo <span style={{color:'var(--danger)',fontSize:12}}>obligatoire</span>
            </label>
            <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFile}/>
            {preview
              ?<div style={{display:'flex',gap:8}}>
                 <div style={{width:76,height:76,borderRadius:12,overflow:'hidden',position:'relative'}}>
                   <img src={preview} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                   <button onClick={()=>{setFile(null);setPreview(null);}} style={{position:'absolute',top:3,right:3,width:20,height:20,border:'none',borderRadius:'50%',background:'rgba(0,0,0,0.6)',cursor:'pointer',display:'grid',placeItems:'center'}}>
                     <Icon n="x" s={11} color="#fff"/>
                   </button>
                 </div>
               </div>
              :<div onClick={()=>fileInputRef.current?.click()} style={{height:80,borderRadius:12,border:'2px dashed var(--border-default)',display:'flex',alignItems:'center',justifyContent:'center',gap:10,cursor:'pointer',background:'var(--surface-sunken)'}}>
                 <Icon n="camera" s={20} color="var(--text-muted)"/>
                 <span style={{fontSize:14,fontWeight:600,color:'var(--text-secondary)'}}>Prendre ou importer</span>
               </div>
            }
          </div>
          <div style={{marginBottom:22}}>
            <label style={{display:'block',fontSize:13,fontWeight:600,color:'var(--text-secondary)',marginBottom:8}}>
              Caractéristiques <span style={{color:'var(--text-faint)',fontWeight:400}}>(facultatif)</span>
            </label>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {SS_RTAGS.slice(0,6).map(t=><Tag key={t} selected={tags.includes(t)} onClick={()=>toggle(t)}>{t}</Tag>)}
            </div>
          </div>
          <Btn variant="primary" full disabled={!file} onClick={()=>onSubmit({name,tags,file})}>Soumettre le banc</Btn>
        </div>
      </div>
    </div>
  );
}

export function AuthModal({ view, setView, onClose, onSuccess }) {
  const [email,setEmail]=React.useState('');
  const [pw,setPw]=React.useState('');
  const [pseudo,setPseudo]=React.useState('');
  const [loading,setLoading]=React.useState(false);
  const [error,setError]=React.useState('');
  const isLogin=view==='login';
  const inp={width:'100%',height:50,border:'2px solid var(--border-subtle)',borderRadius:'var(--radius-md)',padding:'0 14px',fontSize:15,fontFamily:'var(--font-sans)',color:'var(--text-primary)',boxSizing:'border-box'};

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      if (isLogin) {
        const { data, error: e } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (e) { setError(e.message); return; }
        onSuccess(data.user);
      } else {
        if (!pseudo.trim()) { setError('Le pseudo est obligatoire.'); return; }
        const { data, error: e } = await supabase.auth.signUp({
          email, password: pw,
          options: { data: { pseudo: pseudo.trim(), name: pseudo.trim() } },
        });
        if (e) { setError(e.message); return; }
        onSuccess(data.user);
      }
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (e) { setError(e.message); setLoading(false); }
  };

  return (
    <div style={{position:'absolute',inset:0,zIndex:80,background:'var(--surface-card)',overflowY:'auto',animation:'popIn var(--dur-slow) var(--ease-spring)'}}>
      <button onClick={onClose} style={{position:'absolute',top:68,right:20,width:36,height:36,border:'none',borderRadius:'50%',background:'var(--surface-sunken)',cursor:'pointer',display:'grid',placeItems:'center',zIndex:1}}>
        <Icon n="x" s={18} color="var(--text-secondary)"/>
      </button>
      <div style={{padding:'76px 28px 48px'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:28}}>
          <div style={{width:42,height:42,borderRadius:14,background:'var(--marker-ring)',display:'grid',placeItems:'center'}}>
            <Icon n="armchair" s={20} color="#fff"/>
          </div>
          <span style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:22,letterSpacing:'-0.03em'}}>SitSpot</span>
        </div>
        <h1 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:26,letterSpacing:'-0.03em',marginBottom:6}}>{isLogin?'Bon retour 👋':'Rejoins SitSpot'}</h1>
        <p style={{fontSize:15,color:'var(--text-secondary)',marginBottom:24,lineHeight:1.5}}>
          {isLogin?'Connecte-toi pour noter et ajouter des bancs.':'Crée ton compte pour contribuer à la communauté.'}
        </p>
        <button onClick={handleGoogle} style={{width:'100%',height:52,border:'2px solid var(--border-default)',borderRadius:'var(--radius-full)',background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,fontSize:15,fontWeight:600,marginBottom:18,fontFamily:'var(--font-sans)'}}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuer avec Google
        </button>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
          <div style={{flex:1,height:1,background:'var(--border-subtle)'}}/><span style={{fontSize:13,color:'var(--text-muted)'}}>ou</span><div style={{flex:1,height:1,background:'var(--border-subtle)'}}/>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {!isLogin&&<input value={pseudo} onChange={e=>setPseudo(e.target.value)} placeholder="Pseudo" style={inp} onFocus={e=>e.target.style.borderColor='var(--border-accent)'} onBlur={e=>e.target.style.borderColor='var(--border-subtle)'}/>}
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={inp} onFocus={e=>e.target.style.borderColor='var(--border-accent)'} onBlur={e=>e.target.style.borderColor='var(--border-subtle)'}/>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Mot de passe" style={inp} onFocus={e=>e.target.style.borderColor='var(--border-accent)'} onBlur={e=>e.target.style.borderColor='var(--border-subtle)'}/>
        </div>
        {error&&<div style={{marginTop:12,padding:'10px 14px',background:'#fef2f2',borderRadius:'var(--radius-md)',fontSize:13,color:'#dc2626',fontWeight:500}}>{error}</div>}
        <Btn variant="primary" full style={{marginTop:18,height:54}} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Chargement…' : isLogin ? 'Se connecter' : 'Créer mon compte'}
        </Btn>
        <div style={{marginTop:18,textAlign:'center',fontSize:14,color:'var(--text-secondary)'}}>
          {isLogin
            ?<>Pas encore de compte ?{' '}<span onClick={()=>setView('signup')} style={{color:'var(--accent)',fontWeight:700,cursor:'pointer'}}>S'inscrire</span></>
            :<>Déjà un compte ?{' '}<span onClick={()=>setView('login')} style={{color:'var(--accent)',fontWeight:700,cursor:'pointer'}}>Se connecter</span></>
          }
        </div>
      </div>
    </div>
  );
}

export function ProfileScreen({ isLoggedIn, profile, myReviews = [], onLogout, onLogin }) {
  if (!isLoggedIn) return (
    <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 24px',background:'var(--surface-app)',textAlign:'center'}}>
      <div style={{width:72,height:72,borderRadius:'50%',background:'var(--surface-accent-soft)',display:'grid',placeItems:'center',marginBottom:16}}>
        <Icon n="user" s={30} color="var(--text-accent)"/>
      </div>
      <h2 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:22,letterSpacing:'-0.02em',marginBottom:8}}>Connecte-toi</h2>
      <p style={{fontSize:15,color:'var(--text-secondary)',lineHeight:1.5,marginBottom:24,maxWidth:260}}>
        Pour noter des bancs, ajouter les tiens et consulter ton profil.
      </p>
      <Btn variant="primary" iconLeft="user" onClick={onLogin}>Connexion / Inscription</Btn>
    </div>
  );

  const firstName   = profile?.first_name || '';
  const lastName    = profile?.last_name  || '';
  const fullName    = profile?.name || (firstName || lastName ? `${firstName} ${lastName}`.trim() : '') || profile?.pseudo || 'Utilisateur';
  const displayName = fullName;
  const pseudo      = profile?.pseudo || '';
  const email       = profile?.email || '';

  return (
    <div style={{flex:1,overflowY:'auto',background:'var(--surface-app)'}}>
      <div style={{background:'var(--surface-card)',padding:'20px 20px'}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{position:'relative'}}>
            <Avatar name={displayName} size={60} src={profile?.avatar_url||null}/>
          </div>
          <div style={{minWidth:0}}>
            <h2 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:19,letterSpacing:'-0.02em',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{displayName}</h2>
            {pseudo&&<div style={{fontSize:13,color:'var(--text-muted)',marginTop:2}}>@{pseudo}</div>}
            {email&&<div style={{fontSize:12,color:'var(--text-muted)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{email}</div>}
          </div>
        </div>
        <div style={{display:'flex',marginTop:18,paddingTop:16,borderTop:'1px solid var(--border-subtle)'}}>
          {[{l:'Bancs ajoutés',v:profile?.bench_count||0},{l:'Avis postés',v:myReviews.length}].map((s,i)=>(
            <div key={i} style={{flex:1,textAlign:'center',borderRight:i===0?'1px solid var(--border-subtle)':'none'}}>
              <div style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:28,letterSpacing:'-0.03em'}}>{s.v}</div>
              <div style={{fontSize:12,color:'var(--text-muted)'}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      {myReviews.length > 0 && (
        <div style={{margin:'10px 0 0',background:'var(--surface-card)',padding:'16px 20px'}}>
          <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,letterSpacing:'-0.01em',margin:'0 0 12px'}}>Mes avis</h3>
          {myReviews.map((r,i)=>{
            const dateStr = new Date(r.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
            return (
            <div key={r.id||i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderTop:i>0?'1px solid var(--border-subtle)':'none'}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:'var(--surface-accent-soft)',display:'grid',placeItems:'center',flexShrink:0}}>
                <Icon n="star" s={17} color="var(--text-accent)"/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:14,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.bench_id}</div>
                <div style={{display:'flex',alignItems:'center',gap:6,marginTop:2}}>
                  <Stars value={r.score} size={12}/>
                  <span style={{fontSize:11,color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>{dateStr}</span>
                </div>
              </div>
            </div>);
          })}
        </div>
      )}
      <SettingsSection />
      <div style={{margin:'10px 20px 24px'}}>
        <Btn variant="danger" full onClick={onLogout}>Se déconnecter</Btn>
      </div>
    </div>
  );
}

function SettingsSection() {
  const [notifSpot,  setNotifSpot]  = React.useState(true);
  const [notifAvis,  setNotifAvis]  = React.useState(false);
  const [darkMode,   setDarkMode]   = React.useState(false);
  const [locAuto,    setLocAuto]    = React.useState(true);
  const [distUnit,   setDistUnit]   = React.useState('m');

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{
      width:46, height:28, borderRadius:14, cursor:'pointer', flex:'none',
      background: value ? 'var(--accent)' : 'var(--neutral-300)',
      display:'flex', alignItems:'center', padding:'3px',
      transition:'background var(--dur-base)',
    }}>
      <div style={{
        width:22, height:22, borderRadius:'50%', background:'#fff',
        boxShadow:'var(--shadow-sm)',
        transform: value ? 'translateX(18px)' : 'translateX(0)',
        transition:'transform var(--dur-base) var(--ease-spring)',
      }}/>
    </div>
  );

  const Row = ({ icon, label, sub, children }) => (
    <div style={{display:'flex', alignItems:'center', gap:12, padding:'12px 0'}}>
      <div style={{width:36, height:36, borderRadius:10, background:'var(--surface-sunken)',
        display:'grid', placeItems:'center', flexShrink:0}}>
        <Icon n={icon} s={17} color="var(--text-accent)"/>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontWeight:600, fontSize:14}}>{label}</div>
        {sub && <div style={{fontSize:12, color:'var(--text-muted)', marginTop:1}}>{sub}</div>}
      </div>
      {children}
    </div>
  );

  const LinkRow = ({ icon, label, sub }) => (
    <div style={{display:'flex', alignItems:'center', gap:12, padding:'12px 0', cursor:'pointer'}}>
      <div style={{width:36, height:36, borderRadius:10, background:'var(--surface-sunken)',
        display:'grid', placeItems:'center', flexShrink:0}}>
        <Icon n={icon} s={17} color="var(--text-accent)"/>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontWeight:600, fontSize:14}}>{label}</div>
        {sub && <div style={{fontSize:12, color:'var(--text-muted)', marginTop:1}}>{sub}</div>}
      </div>
      <Icon n="chevron-right" s={16} color="var(--text-muted)"/>
    </div>
  );

  const Sep = ({ label }) => (
    <div style={{fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase',
      letterSpacing:'0.07em', marginTop:20, marginBottom:4}}>{label}</div>
  );

  const Div = () => <div style={{borderTop:'1px solid var(--border-subtle)'}}/>;

  return (
    <div style={{margin:'10px 0 0', background:'var(--surface-card)', padding:'16px 20px'}}>
      <h3 style={{fontFamily:'var(--font-display)', fontWeight:700, fontSize:16,
        letterSpacing:'-0.01em', margin:'0 0 4px'}}>Paramètres</h3>

      <Sep label="Notifications"/>
      <div style={{borderTop:'1px solid var(--border-subtle)'}}>
        <Row icon="bell" label="Nouveaux bancs à proximité" sub="Quand un banc est ajouté près de toi">
          <Toggle value={notifSpot} onChange={setNotifSpot}/>
        </Row>
        <Div/>
        <Row icon="message-circle" label="Réponses à mes avis" sub="Lorsque quelqu'un commente ton avis">
          <Toggle value={notifAvis} onChange={setNotifAvis}/>
        </Row>
      </div>

      <Sep label="Affichage"/>
      <div style={{borderTop:'1px solid var(--border-subtle)'}}>
        <Row icon="moon" label="Mode sombre" sub="Thème foncé pour l'interface">
          <Toggle value={darkMode} onChange={setDarkMode}/>
        </Row>
        <Div/>
        <Row icon="ruler" label="Unité de distance">
          <div style={{display:'flex', gap:6}}>
            {['m','km'].map(u => (
              <button key={u} onClick={() => setDistUnit(u)} style={{
                height:30, padding:'0 12px', border:'2px solid', borderRadius:99,
                fontSize:13, fontWeight:600, cursor:'pointer',
                borderColor: distUnit===u ? 'var(--accent)' : 'var(--border-subtle)',
                background: distUnit===u ? 'var(--surface-accent-soft)' : 'transparent',
                color: distUnit===u ? 'var(--text-accent)' : 'var(--text-secondary)',
              }}>{u}</button>
            ))}
          </div>
        </Row>
      </div>

      <Sep label="Confidentialité"/>
      <div style={{borderTop:'1px solid var(--border-subtle)'}}>
        <Row icon="map-pin" label="Localisation automatique" sub="Centrer la carte sur ta position">
          <Toggle value={locAuto} onChange={setLocAuto}/>
        </Row>
        <Div/>
        <LinkRow icon="lock" label="Profil public" sub="Tes bancs et avis sont visibles par tous"/>
      </div>

      <Sep label="À propos"/>
      <div style={{borderTop:'1px solid var(--border-subtle)'}}>
        <LinkRow icon="help-circle" label="Aide & support"/>
        <Div/>
        <LinkRow icon="file-text" label="Conditions d'utilisation"/>
        <Div/>
        <div style={{padding:'12px 0', textAlign:'center'}}>
          <span style={{fontSize:12, color:'var(--text-faint)', fontFamily:'var(--font-mono)'}}>SitSpot v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

export function LocationPrompt({ onAccept, onDecline }) {
  return (
    <div style={{position:'absolute',inset:0,zIndex:90,display:'grid',placeItems:'center',padding:24,
      background:'rgba(26,25,22,0.55)',backdropFilter:'blur(6px)',animation:'fadeIn var(--dur-base)'}}>
      <div style={{width:'100%',maxWidth:340,background:'var(--surface-card)',borderRadius:'var(--radius-2xl)',
        boxShadow:'var(--shadow-xl)',overflow:'hidden',animation:'popIn var(--dur-slow) var(--ease-spring)'}}>
        <div style={{height:140,background:'linear-gradient(145deg,#cfe6c6,#a9d6e6)',display:'grid',placeItems:'center',position:'relative'}}>
          <div style={{width:72,height:72,borderRadius:'50%',background:'rgba(255,255,255,0.3)',
            display:'grid',placeItems:'center',backdropFilter:'blur(4px)'}}>
            <Icon n="map-pin" s={34} color="var(--green-700)"/>
          </div>
        </div>
        <div style={{padding:'24px 24px 20px'}}>
          <h2 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:22,
            letterSpacing:'-0.02em',margin:'0 0 10px',textAlign:'center'}}>
            Où es-tu ?
          </h2>
          <p style={{fontSize:15,color:'var(--text-secondary)',lineHeight:1.6,
            textAlign:'center',margin:'0 0 24px'}}>
            SitSpot utilise ta position pour charger les bancs près de toi en priorité.
          </p>
          <Btn variant="primary" full iconLeft="navigation" onClick={onAccept}
            style={{marginBottom:10}}>
            Utiliser ma position
          </Btn>
          <Btn variant="ghost" full onClick={onDecline}>
            Pas maintenant
          </Btn>
        </div>
      </div>
    </div>
  );
}

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{position:'absolute',bottom:96,left:'50%',zIndex:95,pointerEvents:'none',
      display:'inline-flex',alignItems:'center',gap:10,padding:'13px 18px',
      background:'var(--neutral-900)',color:'#fff',borderRadius:'var(--radius-full)',
      boxShadow:'var(--shadow-xl)',fontWeight:600,fontSize:14,whiteSpace:'nowrap',
      animation:'springIn 400ms var(--ease-spring)'}}>
      <Icon n="check-circle" s={18} color="var(--green-400)"/>
      {message}
    </div>
  );
}
