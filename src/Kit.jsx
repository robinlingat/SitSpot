import React from 'react';
import {
  Search, SlidersHorizontal, Navigation, MapPin, Armchair, X, Camera, Image,
  Share2, Plus, Minus, CheckCircle, User, Star, Crosshair, Map, Eye, Sun,
  Trees, Sandwich, Leaf, Mountain, Wind, Coffee,
} from 'lucide-react';

const ICONS = {
  'search': Search, 'sliders-horizontal': SlidersHorizontal, 'navigation': Navigation,
  'map-pin': MapPin, 'armchair': Armchair, 'x': X, 'camera': Camera, 'image': Image,
  'share-2': Share2, 'plus': Plus, 'minus': Minus, 'check-circle': CheckCircle,
  'user': User, 'star': Star, 'crosshair': Crosshair, 'map': Map, 'eye': Eye,
  'sun': Sun, 'trees': Trees, 'sandwich': Sandwich, 'leaf': Leaf, 'mountain': Mountain,
  'wind': Wind, 'coffee': Coffee,
};

export function Icon({ n, s=20, color }) {
  const Comp = ICONS[n];
  if (!Comp) return <span style={{width:s,height:s,display:'inline-block'}}/>;
  return <Comp size={s} color={color||'currentColor'} strokeWidth={1.8} style={{display:'block',flexShrink:0}}/>;
}

export function Stars({ value=0, size=15 }) {
  return (
    <span style={{display:'inline-flex',gap:2}}>
      {[1,2,3,4,5].map(i => {
        const fill = value>=i ? 'var(--star)' : value>=i-0.5 ? 'url(#sg)' : 'var(--neutral-200)';
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" style={{display:'block'}}>
            <defs><linearGradient id="sg"><stop offset="50%" stopColor="var(--star)"/><stop offset="50%" stopColor="var(--neutral-200)"/></linearGradient></defs>
            <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z" fill={fill}/>
          </svg>
        );
      })}
    </span>
  );
}

export function Btn({ children, variant='primary', size='md', full, onClick, iconLeft, disabled, style:xStyle }) {
  const sz = {sm:{h:36,p:'0 14px',f:13},md:{h:48,p:'0 22px',f:15},lg:{h:56,p:'0 28px',f:17}}[size];
  const vr = {
    primary:   {background:'var(--accent)',color:'#fff',boxShadow:'var(--glow-green)'},
    secondary: {background:'var(--accent-2)',color:'#fff',boxShadow:'var(--glow-blue)'},
    soft:      {background:'var(--surface-accent-soft)',color:'var(--text-accent)'},
    ghost:     {background:'transparent',color:'var(--text-primary)',boxShadow:'inset 0 0 0 1.5px var(--border-default)'},
    danger:    {background:'#FCEBEC',color:'var(--danger)'},
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,
      height:sz.h,padding:sz.p,width:full?'100%':'auto',
      fontWeight:700,fontSize:sz.f,letterSpacing:'-0.01em',whiteSpace:'nowrap',
      border:'none',borderRadius:'var(--radius-full)',cursor:disabled?'not-allowed':'pointer',
      opacity:disabled?0.48:1,transition:'transform var(--dur-fast) var(--ease-out)',
      ...vr,...xStyle,
    }}
      onMouseDown={e=>e.currentTarget.style.transform='scale(0.96)'}
      onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
      onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.filter='none'}}
      onMouseEnter={e=>e.currentTarget.style.filter='brightness(0.93)'}>
      {iconLeft && <Icon n={iconLeft} s={14}/>}
      {children}
    </button>
  );
}

export function Chip({ children, selected, icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      display:'inline-flex',alignItems:'center',gap:6,height:38,padding:'0 16px',
      whiteSpace:'nowrap',cursor:'pointer',flexShrink:0,
      fontWeight:600,fontSize:14,borderRadius:'var(--radius-full)',
      color:selected?'#fff':'var(--text-secondary)',
      background:selected?'var(--accent)':'rgba(255,255,255,0.9)',
      border:selected?'2px solid var(--accent)':'2px solid var(--border-subtle)',
      boxShadow:selected?'var(--glow-green)':'var(--shadow-xs)',
      backdropFilter:'blur(8px)',transition:'all var(--dur-base) var(--ease-out)',
    }}>
      {icon && <Icon n={icon} s={15}/>}
      {children}
    </button>
  );
}

export function Tag({ children, icon, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      display:'inline-flex',alignItems:'center',gap:6,height:32,padding:'0 12px',
      borderRadius:'var(--radius-full)',border:'none',
      background:selected?'var(--surface-accent-soft)':'var(--surface-sunken)',
      color:selected?'var(--text-accent)':'var(--text-secondary)',
      fontWeight:600,fontSize:13,cursor:onClick?'pointer':'default',
      boxShadow:selected?'inset 0 0 0 1.5px var(--border-accent)':'none',
      transition:'all var(--dur-fast)',
    }}>
      {icon && <Icon n={icon} s={14} color={selected?'var(--text-accent)':'var(--text-muted)'}/>}
      {children}
    </button>
  );
}

export function Badge({ children, tone='green', solid, dot }) {
  const p = {
    green:   {s:'var(--green-500)',bg:'var(--green-50)',tx:'var(--green-700)'},
    blue:    {s:'var(--blue-500)', bg:'var(--blue-50)', tx:'var(--blue-700)'},
    gold:    {s:'var(--star)',     bg:'#FDF1DC',         tx:'#9A6B12'},
    neutral: {s:'var(--neutral-500)',bg:'var(--neutral-100)',tx:'var(--neutral-600)'},
  }[tone]||{s:'var(--green-500)',bg:'var(--green-50)',tx:'var(--green-700)'};
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:5,height:24,padding:'0 10px',
      borderRadius:'var(--radius-full)',fontSize:12,fontWeight:700,
      background:solid?p.s:p.bg,color:solid?'#fff':p.tx}}>
      {dot&&<span style={{width:6,height:6,borderRadius:'50%',background:solid?'rgba(255,255,255,0.7)':p.s}}/>}
      {children}
    </span>
  );
}

export function Avatar({ name='', size=40 }) {
  const initials = name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  const tints = ['var(--green-100)','var(--blue-100)','var(--green-200)','var(--blue-200)'];
  const txts  = ['var(--green-800)','var(--blue-800)','var(--green-800)','var(--blue-800)'];
  const idx   = (name.charCodeAt(0)||0)%4;
  return (
    <span style={{display:'grid',placeItems:'center',width:size,height:size,flexShrink:0,
      borderRadius:'50%',background:tints[idx],color:txts[idx],fontWeight:700,fontSize:size*0.38}}>
      {initials||'?'}
    </span>
  );
}

export function Marker({ bench, open, onClick }) {
  const sc = bench.score;
  const dotColor = sc===null?'var(--neutral-400)':sc>=4?'var(--green-500)':sc>=2.5?'var(--warning)':'var(--danger)';
  const dim = open?58:32;
  return (
    <button onClick={onClick} aria-label={bench.name} style={{
      position:'absolute',left:bench.x+'%',top:bench.y+'%',
      transform:'translate(-50%,-50%)',border:'none',padding:0,
      background:'transparent',cursor:'pointer',zIndex:open?30:10,
    }}>
      <span style={{position:'relative',display:'grid',placeItems:'center',
        width:dim,height:dim,borderRadius:'50%',background:'var(--marker-ring)',
        padding:open?5:4,boxShadow:open?'var(--shadow-lg),var(--glow-green)':'var(--shadow-md)',
        transition:'all var(--dur-slow) var(--ease-spring)'}}>
        <span style={{width:'100%',height:'100%',borderRadius:'50%',
          background:open?'linear-gradient(145deg,#cfe6c6,#a9d6e6)':'#fff',
          display:'grid',placeItems:'center',transition:'background var(--dur-base)'}}>
          {open
            ? <Icon n="armchair" s={20} color="var(--green-700)"/>
            : <span style={{width:10,height:10,borderRadius:'50%',background:dotColor}}/>
          }
        </span>
        {open&&sc&&(
          <span style={{position:'absolute',bottom:-8,left:'50%',transform:'translateX(-50%)',
            display:'inline-flex',alignItems:'center',gap:3,height:22,padding:'0 8px',
            borderRadius:'var(--radius-full)',background:'#fff',boxShadow:'var(--shadow-md)',
            fontWeight:800,fontSize:12,whiteSpace:'nowrap'}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--star)">
              <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z"/>
            </svg>
            {String(sc).replace('.',',')}
          </span>
        )}
      </span>
    </button>
  );
}

export function FloatBtn({ icon, label, accent, onClick }) {
  return (
    <button aria-label={label} onClick={onClick} style={{
      width:44,height:44,border:'none',borderRadius:'50%',cursor:'pointer',
      display:'grid',placeItems:'center',
      background:accent?'var(--accent)':'rgba(255,255,255,0.94)',
      color:accent?'#fff':'var(--text-primary)',
      boxShadow:accent?'var(--glow-green)':'var(--shadow-md)',
      backdropFilter:'blur(10px)',transition:'transform var(--dur-fast)',
    }}
      onMouseDown={e=>e.currentTarget.style.transform='scale(0.88)'}
      onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
      onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
      <Icon n={icon} s={20}/>
    </button>
  );
}

export function TabBar({ tab, setTab }) {
  const items = [{id:'map',icon:'map',label:'Carte'},{id:'profile',icon:'user',label:'Profil'}];
  return (
    <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:50,height:78,
      background:'rgba(255,255,255,0.96)',backdropFilter:'blur(14px)',
      borderTop:'1px solid var(--border-subtle)',display:'flex',alignItems:'flex-start',paddingTop:8}}>
      {items.map(it=>(
        <button key={it.id} onClick={()=>setTab(it.id)} style={{
          flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,
          height:56,paddingTop:4,border:'none',background:'transparent',cursor:'pointer',
          color:tab===it.id?'var(--accent)':'var(--text-muted)',
          transition:'color var(--dur-fast)',
        }}>
          <Icon n={it.icon} s={24}/>
          <span style={{fontSize:11,fontWeight:tab===it.id?700:500}}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}
