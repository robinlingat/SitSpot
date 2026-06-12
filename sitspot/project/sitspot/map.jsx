/* SitSpot — portrait mobile map canvas */
function MapCanvas({ children, dimmed }) {
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--map-land)', overflow:'hidden' }}>
      <svg viewBox="0 0 400 780" preserveAspectRatio="xMidYMid slice"
           style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block' }}>

        <rect width="400" height="780" fill="var(--map-land)"/>

        {/* land texture */}
        <g fill="var(--map-land-2)">
          <rect x="30" y="55" width="130" height="92" rx="4"/>
          <rect x="238" y="88" width="142" height="86" rx="4"/>
          <rect x="18" y="482" width="172" height="118" rx="4"/>
          <rect x="258" y="508" width="128" height="142" rx="4"/>
          <rect x="58" y="308" width="92" height="68" rx="4"/>
        </g>

        {/* buildings */}
        <g fill="var(--map-building)">
          <rect x="44" y="70" width="46" height="34" rx="3"/>
          <rect x="100" y="70" width="42" height="34" rx="3"/>
          <rect x="44" y="112" width="82" height="22" rx="3"/>
          <rect x="253" y="102" width="46" height="56" rx="3"/>
          <rect x="314" y="102" width="52" height="56" rx="3"/>
          <rect x="48" y="498" width="66" height="46" rx="3"/>
          <rect x="126" y="498" width="56" height="46" rx="3"/>
          <rect x="272" y="522" width="88" height="56" rx="3"/>
          <rect x="272" y="588" width="88" height="38" rx="3"/>
          <rect x="72" y="326" width="52" height="38" rx="3"/>
        </g>

        {/* river — Seine-like diagonal */}
        <path d="M-20 418 C 92 378, 202 462, 322 412 S 442 338, 462 368 L 462 478 C 442 448, 322 522, 202 572 S 82 488, -20 528 Z"
              fill="var(--map-water)" opacity="0.92"/>

        {/* parks */}
        <ellipse cx="154" cy="228" rx="106" ry="74" fill="var(--map-park)"/>
        <ellipse cx="154" cy="228" rx="64" ry="44" fill="var(--map-park-deep)" opacity="0.6"/>
        <path d="M292 592 q 86 -30 116 52 q 20 80 -36 122 q -102 28 -132 -52 q -12 -80 52 -122 Z" fill="var(--map-park)"/>
        <ellipse cx="68" cy="372" rx="40" ry="30" fill="var(--map-park)" opacity="0.7"/>

        {/* major roads — casing */}
        <g fill="none" stroke="var(--map-road-stroke)" strokeLinecap="round">
          <path d="M200 -20 V800" strokeWidth="22"/>
          <path d="M-20 392 H420" strokeWidth="22"/>
          <path d="M-20 178 C 102 154, 272 212, 420 166" strokeWidth="18"/>
          <path d="M64 -20 C 84 222, 36 482, 84 800" strokeWidth="16"/>
          <path d="M332 -20 C 352 222, 372 482, 326 800" strokeWidth="16"/>
          <path d="M-20 602 H420" strokeWidth="13"/>
          <path d="M-20 84 H420" strokeWidth="11"/>
          <path d="M128 -20 V800" strokeWidth="11"/>
          <path d="M276 -20 V800" strokeWidth="11"/>
        </g>
        {/* road fills */}
        <g fill="none" stroke="var(--map-road-major)" strokeLinecap="round">
          <path d="M200 -20 V800" strokeWidth="18"/>
          <path d="M-20 392 H420" strokeWidth="18"/>
          <path d="M-20 178 C 102 154, 272 212, 420 166" strokeWidth="14"/>
          <path d="M64 -20 C 84 222, 36 482, 84 800" strokeWidth="12"/>
          <path d="M332 -20 C 352 222, 372 482, 326 800" strokeWidth="12"/>
        </g>
        {/* minor streets */}
        <g fill="none" stroke="var(--map-road)" strokeLinecap="round">
          <path d="M-20 84 H420" strokeWidth="8"/>
          <path d="M-20 602 H420" strokeWidth="8"/>
          <path d="M128 -20 V800" strokeWidth="8"/>
          <path d="M276 -20 V800" strokeWidth="8"/>
          <path d="M-20 502 H420" strokeWidth="5"/>
          <path d="M-20 272 H420" strokeWidth="5"/>
          <path d="M-20 682 H420" strokeWidth="5"/>
          <path d="M54 -20 V800" strokeWidth="5"/>
          <path d="M174 -20 V800" strokeWidth="5"/>
          <path d="M244 -20 V800" strokeWidth="5"/>
          <path d="M356 -20 V800" strokeWidth="5"/>
        </g>
      </svg>

      {dimmed && (
        <div style={{ position:'absolute', inset:0, background:'rgba(26,25,22,0.22)', backdropFilter:'blur(1px)' }}/>
      )}
      {children}
    </div>
  );
}

Object.assign(window, { MapCanvas });
