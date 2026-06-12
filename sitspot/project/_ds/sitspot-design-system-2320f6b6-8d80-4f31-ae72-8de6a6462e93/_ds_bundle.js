/* @ds-bundle: {"format":3,"namespace":"SitSpotDesignSystem_2320f6","components":[{"name":"Avatar","sourcePath":"components/data/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data/Badge.jsx"},{"name":"Rating","sourcePath":"components/data/Rating.jsx"},{"name":"Tag","sourcePath":"components/data/Tag.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"FilterChip","sourcePath":"components/forms/FilterChip.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"SearchBar","sourcePath":"components/forms/SearchBar.jsx"},{"name":"BenchCard","sourcePath":"components/surfaces/BenchCard.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"MarkerBubble","sourcePath":"components/surfaces/MarkerBubble.jsx"},{"name":"ReviewItem","sourcePath":"components/surfaces/ReviewItem.jsx"}],"sourceHashes":{"components/data/Avatar.jsx":"535a8dbd0da2","components/data/Badge.jsx":"7981c4ec62dc","components/data/Rating.jsx":"7d73f10d279a","components/data/Tag.jsx":"28dbb7812e8a","components/forms/Button.jsx":"074e3bc9197d","components/forms/FilterChip.jsx":"d6edbd23f1a9","components/forms/IconButton.jsx":"a470d4b974fe","components/forms/SearchBar.jsx":"4db3e02eb991","components/surfaces/BenchCard.jsx":"9488825964a5","components/surfaces/Card.jsx":"6df8ac079349","components/surfaces/MarkerBubble.jsx":"178dad5fb01f","components/surfaces/ReviewItem.jsx":"22e297c3cf32","ui_kits/app/MapCanvas.jsx":"518eb02388d5","ui_kits/app/app.jsx":"eb9bc1f7c757","ui_kits/app/data.js":"1531be1f6e82","ui_kits/app/kit.jsx":"1d536eb5ad9a","ui_kits/app/screens.jsx":"fafd2ddd7b38"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SitSpotDesignSystem_2320f6 = window.SitSpotDesignSystem_2320f6 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data/Avatar.jsx
try { (() => {
/**
 * SitSpot Avatar — round user avatar. Shows an image when `src` is set,
 * otherwise initials on a brand-tinted background. Optional gradient
 * ring (the marker motif) to highlight a contributor.
 */
function Avatar({
  src = null,
  name = '',
  size = 40,
  ring = false,
  style = {}
}) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  // deterministic tint from the name
  const tints = ['var(--green-100)', 'var(--blue-100)', 'var(--green-200)', 'var(--blue-200)'];
  const txt = ['var(--green-800)', 'var(--blue-800)', 'var(--green-800)', 'var(--blue-800)'];
  const idx = (name.charCodeAt(0) || 0) % tints.length;
  const inner = /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      background: src ? 'var(--neutral-200)' : tints[idx],
      color: txt[idx],
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: size * 0.4,
      flex: 'none'
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials || '?');
  if (!ring) return /*#__PURE__*/React.createElement("span", {
    style: style
  }, inner);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-grid',
      placeItems: 'center',
      padding: 2,
      borderRadius: '50%',
      background: 'var(--marker-ring)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: 2,
      borderRadius: '50%',
      background: 'var(--surface-card)'
    }
  }, inner));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data/Badge.jsx
try { (() => {
/**
 * SitSpot Badge — small status / count pill. Soft (tinted) by default,
 * solid for stronger emphasis. Tones map to the semantic palette.
 */
function Badge({
  children,
  tone = 'green',
  variant = 'soft',
  dot = false,
  style = {}
}) {
  const palette = {
    green: {
      solid: 'var(--green-500)',
      soft: 'var(--green-50)',
      text: 'var(--green-700)'
    },
    blue: {
      solid: 'var(--blue-500)',
      soft: 'var(--blue-50)',
      text: 'var(--blue-700)'
    },
    neutral: {
      solid: 'var(--neutral-700)',
      soft: 'var(--neutral-100)',
      text: 'var(--neutral-700)'
    },
    gold: {
      solid: 'var(--star)',
      soft: '#FDF1DC',
      text: '#9A6B12'
    },
    danger: {
      solid: 'var(--danger)',
      soft: 'var(--danger-bg)',
      text: '#B42318'
    }
  }[tone] || {};
  const solid = variant === 'solid';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 24,
      padding: '0 10px',
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 700,
      letterSpacing: 'var(--tracking-snug)',
      background: solid ? palette.solid : palette.soft,
      color: solid ? '#fff' : palette.text,
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: solid ? '#fff' : palette.solid
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data/Rating.jsx
try { (() => {
/**
 * SitSpot Rating — gold stars. Read-only by default (shows a score and
 * optional count); pass `interactive` + `onRate` for the review form.
 * French decimal comma is used when rendering the numeral.
 */
function Rating({
  value = 0,
  count = null,
  size = 18,
  interactive = false,
  onRate = () => {},
  showValue = false,
  style = {}
}) {
  const [hover, setHover] = React.useState(0);
  const display = interactive && hover ? hover : value;
  const Star = ({
    fill
  }) => /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: `half${size}`
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "var(--star)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "var(--neutral-200)"
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z",
    fill: fill === 1 ? 'var(--star)' : fill === 0.5 ? `url(#half${size})` : 'var(--neutral-200)'
  }));
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 2
    }
  }, [1, 2, 3, 4, 5].map(i => {
    const fill = display >= i ? 1 : display >= i - 0.5 ? 0.5 : 0;
    return interactive ? /*#__PURE__*/React.createElement("span", {
      key: i,
      role: "button",
      "aria-label": `${i} étoile${i > 1 ? 's' : ''}`,
      onMouseEnter: () => setHover(i),
      onMouseLeave: () => setHover(0),
      onClick: () => onRate(i),
      style: {
        cursor: 'pointer',
        lineHeight: 0
      }
    }, /*#__PURE__*/React.createElement(Star, {
      fill: display >= i ? 1 : 0
    })) : /*#__PURE__*/React.createElement(Star, {
      key: i,
      fill: fill
    });
  })), showValue && value > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: size * 0.82,
      color: 'var(--text-primary)'
    }
  }, value.toFixed(1).replace('.', ',')), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: size * 0.78,
      color: 'var(--text-muted)'
    }
  }, count, " avis"));
}
Object.assign(__ds_scope, { Rating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Rating.jsx", error: String((e && e.message) || e) }); }

// components/data/Tag.jsx
try { (() => {
/**
 * SitSpot Tag — an attribute chip describing a bench ("Ombragé",
 * "Vue", "Au calme"). Optional leading icon. Quieter than a Badge:
 * outlined, neutral, used in rows on cards & detail sheets.
 */
function Tag({
  children,
  icon = null,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 30,
      padding: icon ? '0 12px 0 10px' : '0 12px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--surface-sunken)',
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--text-muted)'
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SitSpot Button — pill-shaped, friendly, two brand colors.
 * Variants: primary (green), secondary (blue), soft, ghost, danger.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      height: 'var(--control-h-sm)',
      padding: '0 16px',
      fontSize: 'var(--text-sm)',
      gap: 6
    },
    md: {
      height: 'var(--control-h-md)',
      padding: '0 22px',
      fontSize: 'var(--text-base)',
      gap: 8
    },
    lg: {
      height: 'var(--control-h-lg)',
      padding: '0 28px',
      fontSize: 'var(--text-md)',
      gap: 10
    }
  };
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--accent-contrast)',
      boxShadow: 'var(--glow-green)'
    },
    secondary: {
      background: 'var(--accent-2)',
      color: '#fff',
      boxShadow: 'var(--glow-blue)'
    },
    soft: {
      background: 'var(--surface-accent-soft)',
      color: 'var(--text-accent)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      boxShadow: 'inset 0 0 0 1px var(--border-default)'
    },
    danger: {
      background: 'var(--danger)',
      color: '#fff'
    }
  };
  const sz = sizes[size] || sizes.md;
  const vr = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    className: `ss-btn ss-btn--${variant}`,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: sz.gap,
      height: sz.height,
      padding: sz.padding,
      width: fullWidth ? '100%' : 'auto',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: sz.fontSize,
      lineHeight: 1,
      letterSpacing: 'var(--tracking-snug)',
      color: vr.color,
      background: vr.background,
      boxShadow: vr.boxShadow || 'none',
      border: 'none',
      borderRadius: 'var(--radius-full)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out)',
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.filter = 'none';
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.filter = 'brightness(0.94)';
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/FilterChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SitSpot FilterChip — selectable pill for search intents
 * (pique-nique, paysage, au calme, le plus proche…). Toggles between a
 * quiet resting state and a green selected state.
 */
function FilterChip({
  children,
  selected = false,
  icon = null,
  onClick = () => {},
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-pressed": selected,
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      height: 38,
      padding: icon ? '0 16px 0 12px' : '0 16px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      borderRadius: 'var(--radius-full)',
      color: selected ? 'var(--accent-contrast)' : 'var(--text-secondary)',
      background: selected ? 'var(--accent)' : 'var(--surface-card)',
      border: selected ? '2px solid var(--accent)' : '2px solid var(--border-subtle)',
      boxShadow: selected ? 'var(--glow-green)' : 'var(--shadow-xs)',
      transition: 'all var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      opacity: selected ? 1 : 0.75
    }
  }, icon), children);
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SitSpot IconButton — round, for map controls & toolbar actions.
 * Variants: floating (white, shadowed — sits on the map), solid (green),
 * ghost (transparent).
 */
function IconButton({
  children,
  variant = 'floating',
  size = 'md',
  'aria-label': ariaLabel,
  disabled = false,
  active = false,
  style = {},
  ...rest
}) {
  const dims = {
    sm: 36,
    md: 44,
    lg: 52
  }[size] || 44;
  const variants = {
    floating: {
      background: active ? 'var(--surface-accent-soft)' : 'rgba(255,255,255,0.92)',
      color: active ? 'var(--text-accent)' : 'var(--text-primary)',
      boxShadow: 'var(--shadow-md)',
      backdropFilter: 'blur(var(--blur-sm))'
    },
    solid: {
      background: 'var(--accent)',
      color: 'var(--accent-contrast)',
      boxShadow: 'var(--glow-green)'
    },
    ghost: {
      background: active ? 'var(--surface-sunken)' : 'transparent',
      color: 'var(--text-secondary)'
    }
  };
  const vr = variants[variant] || variants.floating;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": ariaLabel,
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dims,
      height: dims,
      border: 'none',
      borderRadius: 'var(--radius-full)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'transform var(--dur-fast) var(--ease-out), background var(--dur-base) var(--ease-out)',
      ...vr,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.92)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchBar.jsx
try { (() => {
/**
 * SitSpot SearchBar — the fixed top-center search field. Pill-shaped,
 * frosted white, with a leading search glyph and an optional trailing
 * filter button. Search by intent: "pique-nique, vue, au calme".
 */
function SearchBar({
  value = '',
  onChange = () => {},
  placeholder = 'Cherche un banc… pique-nique, vue, au calme',
  onFilterClick,
  filterCount = 0,
  style = {}
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      maxWidth: 'var(--search-max-w)',
      height: 'var(--control-h-lg)',
      padding: '0 8px 0 18px',
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(var(--blur-md))',
      borderRadius: 'var(--radius-full)',
      boxShadow: focused ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      border: focused ? '2px solid var(--border-accent)' : '2px solid transparent',
      transition: 'box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-muted)",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  })), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    placeholder: placeholder,
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      fontWeight: 500,
      color: 'var(--text-primary)'
    }
  }), onFilterClick && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Filtres",
    onClick: onFilterClick,
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      flex: 'none',
      border: 'none',
      borderRadius: 'var(--radius-full)',
      background: filterCount > 0 ? 'var(--surface-accent-soft)' : 'var(--surface-sunken)',
      color: filterCount > 0 ? 'var(--text-accent)' : 'var(--text-secondary)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 6h16M7 12h10M10 18h4"
  })), filterCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -2,
      right: -2,
      minWidth: 18,
      height: 18,
      padding: '0 5px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--accent)',
      color: '#fff',
      fontSize: 11,
      fontWeight: 700,
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--font-sans)',
      boxShadow: '0 0 0 2px #fff'
    }
  }, filterCount)));
}
Object.assign(__ds_scope, { SearchBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchBar.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SitSpot Card — the base white surface that floats over the map.
 * Rounded, soft-shadowed. `interactive` adds a lift on hover.
 */
function Card({
  children,
  interactive = false,
  padding = 'var(--space-5)',
  elevation = 'md',
  style = {},
  ...rest
}) {
  const shadow = {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)'
  }[elevation] || 'var(--shadow-md)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: shadow,
      padding,
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      cursor: interactive ? 'pointer' : 'default',
      ...style
    },
    onMouseEnter: e => {
      if (interactive) {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }
    },
    onMouseLeave: e => {
      if (interactive) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = shadow;
      }
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/BenchCard.jsx
try { (() => {
/**
 * SitSpot BenchCard — summary card for a single bench: photo header,
 * name, distance, rating, attribute tags and primary actions. Composes
 * Card + Rating + Tag + Badge + Button.
 */
function BenchCard({
  name = '',
  area = '',
  photo = null,
  distance = '',
  score = 0,
  count = 0,
  status = null,
  // { tone, label } e.g. { tone:'green', label:'Propre' }
  tags = [],
  // [{ icon, label }]
  onNavigate = () => {},
  onReviews = () => {},
  style = {}
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    padding: "0",
    style: {
      overflow: 'hidden',
      width: 320,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 150,
      background: 'linear-gradient(150deg,#cfe6c6,#a9d6e6)'
    }
  }, photo ? /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--green-700)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "armchair",
    style: {
      width: 32,
      height: 32
    }
  })), status && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 12,
      left: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: status.tone,
    variant: "solid",
    dot: true
  }, status.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 28,
      padding: '0 10px',
      borderRadius: 'var(--radius-full)',
      background: 'rgba(255,255,255,0.95)',
      boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 800,
      fontSize: 13,
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "var(--star)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z"
  })), score.toFixed(1).replace('.', ','))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) var(--space-5) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-lg)',
      letterSpacing: 'var(--tracking-snug)',
      color: 'var(--text-primary)'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "navigation",
    style: {
      width: 13,
      height: 13
    }
  }), distance)), area && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, area), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: score,
    size: 15
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, count, " avis")), tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginTop: 12
    }
  }, tags.map((t, i) => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: i,
    icon: t.icon ? /*#__PURE__*/React.createElement("i", {
      "data-lucide": t.icon,
      style: {
        width: 15,
        height: 15
      }
    }) : null
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    fullWidth: true,
    iconLeft: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "navigation",
      style: {
        width: 16,
        height: 16
      }
    }),
    onClick: onNavigate
  }, "M'y emmener"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "sm",
    onClick: onReviews
  }, "Avis"))));
}
Object.assign(__ds_scope, { BenchCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/BenchCard.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/MarkerBubble.jsx
try { (() => {
/**
 * SitSpot MarkerBubble — THE signature map marker. A small green→blue
 * ring sits over a bench; when `open` the ring expands and the bench
 * photo fills it, with a small gold score badge. Place absolutely on
 * the map via the `style` prop (left/top/transform).
 */
function MarkerBubble({
  photo = null,
  score = null,
  open = false,
  onClick = () => {},
  style = {}
}) {
  const ringDim = open ? 96 : 34;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-label": "Banc",
    style: {
      position: 'absolute',
      appearance: 'none',
      border: 'none',
      padding: 0,
      background: 'transparent',
      cursor: 'pointer',
      transform: 'translate(-50%, -50%)',
      zIndex: open ? 30 : 10,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
      width: ringDim,
      height: ringDim,
      borderRadius: '50%',
      background: 'var(--marker-ring)',
      padding: open ? 5 : 6,
      boxShadow: open ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      transition: 'width var(--dur-slow) var(--ease-spring), height var(--dur-slow) var(--ease-spring), box-shadow var(--dur-base) var(--ease-out)',
      boxSizing: 'border-box'
    }
  }, open ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      overflow: 'hidden',
      background: 'linear-gradient(150deg,#cfe6c6,#a9d6e6)',
      display: 'grid',
      placeItems: 'center'
    }
  }, photo ? /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: "Banc",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("i", {
    "data-lucide": "armchair",
    style: {
      color: 'var(--green-700)'
    }
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: '#fff',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: 'var(--green-500)'
    }
  })), open && score != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: -6,
      right: -6,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      height: 26,
      padding: '0 9px',
      borderRadius: 'var(--radius-full)',
      background: '#fff',
      boxShadow: 'var(--shadow-md)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 800,
      fontSize: 13,
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "var(--star)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z"
  })), String(score).replace('.', ','))));
}
Object.assign(__ds_scope, { MarkerBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/MarkerBubble.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/ReviewItem.jsx
try { (() => {
/**
 * SitSpot ReviewItem — one user's review: avatar, name, date, star
 * rating and free text. Used in the stack below a bench photo.
 */
function ReviewItem({
  name = '',
  avatar = null,
  score = 0,
  date = '',
  text = '',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      padding: 'var(--space-4) 0',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: name,
    src: avatar,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)',
      flex: 'none'
    }
  }, date)), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '3px 0 6px'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: score,
    size: 14
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--text-secondary)',
      textWrap: 'pretty'
    }
  }, text)));
}
Object.assign(__ds_scope, { ReviewItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/ReviewItem.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/MapCanvas.jsx
try { (() => {
/* SitSpot UI kit — stylized Tesla-style light map background.
   A calm vector map: warm land, white streets, green parks, a pale
   river. Children (markers) are layered above it. */
function MapCanvas({
  children,
  dim = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: 'var(--map-land)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1200 800",
    preserveAspectRatio: "xMidYMid slice",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "1200",
    height: "800",
    fill: "var(--map-land)"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "var(--map-land-2)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "120",
    y: "80",
    width: "220",
    height: "160",
    rx: "6"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "700",
    y: "120",
    width: "180",
    height: "140",
    rx: "6"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "880",
    y: "520",
    width: "240",
    height: "180",
    rx: "6"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "80",
    y: "560",
    width: "200",
    height: "150",
    rx: "6"
  })), /*#__PURE__*/React.createElement("g", {
    fill: "var(--map-building)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "150",
    y: "110",
    width: "60",
    height: "50",
    rx: "3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "230",
    y: "110",
    width: "80",
    height: "50",
    rx: "3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "150",
    y: "180",
    width: "100",
    height: "40",
    rx: "3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "730",
    y: "150",
    width: "55",
    height: "80",
    rx: "3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "800",
    y: "150",
    width: "55",
    height: "80",
    rx: "3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "910",
    y: "560",
    width: "90",
    height: "55",
    rx: "3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "1020",
    y: "560",
    width: "80",
    height: "55",
    rx: "3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "910",
    y: "630",
    width: "180",
    height: "45",
    rx: "3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "110",
    y: "600",
    width: "70",
    height: "90",
    rx: "3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "200",
    y: "600",
    width: "60",
    height: "90",
    rx: "3"
  })), /*#__PURE__*/React.createElement("path", {
    d: "M-40 470 C 220 430, 360 600, 620 560 S 1040 470, 1260 520 L 1260 640 C 1040 600, 820 700, 620 690 S 220 560, -40 600 Z",
    fill: "var(--map-water)",
    opacity: "0.95"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "360",
    cy: "300",
    rx: "170",
    ry: "120",
    fill: "var(--map-park)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "360",
    cy: "300",
    rx: "110",
    ry: "74",
    fill: "var(--map-park-deep)",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M860 220 q 120 -40 220 40 q 40 120 -60 200 q -160 40 -220 -60 q -20 -120 60 -180 Z",
    fill: "var(--map-park)"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "var(--map-road-stroke)",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M-20 250 H1220",
    strokeWidth: "26"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M600 -20 V820",
    strokeWidth: "26"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 640 C 300 600, 700 720, 1220 660",
    strokeWidth: "22"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120 -20 C 200 250, 60 520, 240 820",
    strokeWidth: "18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M980 -20 C 920 250, 1080 520, 940 820",
    strokeWidth: "18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 120 H1220",
    strokeWidth: "12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 760 H1220",
    strokeWidth: "12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M340 -20 V820",
    strokeWidth: "12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M820 -20 V820",
    strokeWidth: "12"
  })), /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "var(--map-road-major)",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M-20 250 H1220",
    strokeWidth: "22"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M600 -20 V820",
    strokeWidth: "22"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 640 C 300 600, 700 720, 1220 660",
    strokeWidth: "18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120 -20 C 200 250, 60 520, 240 820",
    strokeWidth: "14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M980 -20 C 920 250, 1080 520, 940 820",
    strokeWidth: "14"
  })), /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "var(--map-road)",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M-20 120 H1220",
    strokeWidth: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 760 H1220",
    strokeWidth: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M340 -20 V820",
    strokeWidth: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M820 -20 V820",
    strokeWidth: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 380 H1220",
    strokeWidth: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 520 H1220",
    strokeWidth: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M210 -20 V820",
    strokeWidth: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M470 -20 V820",
    strokeWidth: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M720 -20 V820",
    strokeWidth: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M1080 -20 V820",
    strokeWidth: "5"
  }))), dim && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(26,25,22,0.18)',
      backdropFilter: 'blur(1px)'
    }
  }), children);
}
Object.assign(window, {
  MapCanvas
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/MapCanvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/app.jsx
try { (() => {
/* SitSpot UI kit — main interactive app. */
function App() {
  const benches = window.SITSPOT_BENCHES;
  const intents = window.SITSPOT_INTENTS;
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(['picnic']);
  const [selectedId, setSelectedId] = React.useState(null);
  const [reviewFor, setReviewFor] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const toggle = id => setActive(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
  const selected = benches.find(b => b.id === selectedId) || null;

  // dim benches that don't match active intents (visual filter)
  const matches = b => active.length === 0 || active.some(i => i === 'near' || b.intents.includes(i));
  const submitReview = ({
    score
  }) => {
    setReviewFor(null);
    setToast('Merci ! Ton avis aide les autres à mieux s\'asseoir 🙌');
    setTimeout(() => setToast(null), 3200);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(MapCanvas, {
    dim: !!selected
  }, benches.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.id,
    style: {
      opacity: matches(b) ? 1 : 0.32,
      transition: 'opacity var(--dur-base)'
    }
  }, /*#__PURE__*/React.createElement(Marker, {
    bench: b,
    open: selectedId === b.id,
    onClick: () => setSelectedId(selectedId === b.id ? null : b.id)
  })))), /*#__PURE__*/React.createElement(TopBar, {
    query: query,
    setQuery: setQuery,
    intents: intents,
    active: active,
    toggle: toggle,
    onOpenFilters: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 18,
      bottom: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      zIndex: 35
    }
  }, /*#__PURE__*/React.createElement(FloatBtn, {
    icon: "plus",
    label: "Zoom avant"
  }), /*#__PURE__*/React.createElement(FloatBtn, {
    icon: "minus",
    label: "Zoom arri\xE8re"
  }), /*#__PURE__*/React.createElement(FloatBtn, {
    icon: "crosshair",
    label: "Ma position",
    accent: true
  })), !selected && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 18,
      bottom: 18,
      zIndex: 35,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 44,
      padding: '0 18px',
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(var(--blur-md))',
      borderRadius: 'var(--radius-full)',
      boxShadow: 'var(--shadow-md)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "map-pin",
    s: 18,
    color: "var(--green-600)"
  }), benches.filter(matches).length, " bancs pr\xE8s de toi"), /*#__PURE__*/React.createElement(BenchSheet, {
    bench: selected,
    onClose: () => setSelectedId(null),
    onAddReview: () => setReviewFor(selected)
  }), /*#__PURE__*/React.createElement(AddReview, {
    bench: reviewFor,
    onClose: () => setReviewFor(null),
    onSubmit: submitReview
  }), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      bottom: 26,
      transform: 'translateX(-50%)',
      zIndex: 70,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 20px',
      background: 'var(--neutral-900)',
      color: '#fff',
      borderRadius: 'var(--radius-full)',
      boxShadow: 'var(--shadow-xl)',
      fontWeight: 600,
      fontSize: 15,
      animation: 'ss-pop var(--dur-slow) var(--ease-spring)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "check",
    s: 18,
    color: "var(--green-400)"
  }), toast));
}
function FloatBtn({
  icon,
  label,
  accent
}) {
  return /*#__PURE__*/React.createElement("button", {
    "aria-label": label,
    style: {
      width: 44,
      height: 44,
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      background: accent ? 'var(--accent)' : 'rgba(255,255,255,0.92)',
      color: accent ? '#fff' : 'var(--text-primary)',
      boxShadow: accent ? 'var(--glow-green)' : 'var(--shadow-md)',
      backdropFilter: 'blur(8px)',
      transition: 'transform var(--dur-fast)'
    },
    onMouseDown: e => e.currentTarget.style.transform = 'scale(0.92)',
    onMouseUp: e => e.currentTarget.style.transform = 'scale(1)',
    onMouseLeave: e => e.currentTarget.style.transform = 'scale(1)'
  }, /*#__PURE__*/React.createElement(Icon, {
    n: icon,
    s: 20
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
setTimeout(() => window.lucide && window.lucide.createIcons(), 80);
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
// SitSpot — sample data for the UI kit (all fake, French copy).
window.SITSPOT_BENCHES = [{
  id: 'b1',
  name: 'Banc du parc Monceau',
  area: 'Parc Monceau · Paris 8e',
  x: 38,
  y: 44,
  score: 4.3,
  count: 28,
  status: {
    tone: 'green',
    label: 'Propre'
  },
  tags: [{
    icon: 'trees',
    label: 'Ombragé'
  }, {
    icon: 'sandwich',
    label: 'Pique-nique'
  }, {
    icon: 'eye',
    label: 'Belle vue'
  }],
  distance: '120 m',
  intents: ['picnic', 'view', 'calm'],
  reviews: [{
    name: 'Léa Moreau',
    score: 5,
    date: 'il y a 3 j',
    text: "Parfait pour un pique-nique au calme, bien à l'ombre l'après-midi 🌳"
  }, {
    name: 'Tom B.',
    score: 4,
    date: 'il y a 1 sem',
    text: 'Vue sympa sur le parc, un peu de passage le week-end mais rien de gênant.'
  }, {
    name: 'Inès K.',
    score: 4,
    date: 'il y a 2 sem',
    text: 'Propre et tranquille en semaine. Idéal pour réviser dehors.'
  }]
}, {
  id: 'b2',
  name: 'Banc des quais',
  area: 'Quai de Seine · Paris 4e',
  x: 64,
  y: 58,
  score: 4.7,
  count: 51,
  status: {
    tone: 'gold',
    label: 'Top noté'
  },
  tags: [{
    icon: 'sun',
    label: 'Ensoleillé'
  }, {
    icon: 'eye',
    label: 'Vue Seine'
  }],
  distance: '340 m',
  intents: ['view', 'sun'],
  reviews: [{
    name: 'Naïm R.',
    score: 5,
    date: 'hier',
    text: 'La vue sur la Seine au coucher du soleil, imbattable 🌇'
  }, {
    name: 'Clara D.',
    score: 5,
    date: 'il y a 4 j',
    text: 'Mon spot préféré pour traîner avec les potes après les cours.'
  }]
}, {
  id: 'b3',
  name: 'Banc square Louise',
  area: 'Square Louise Michel · 18e',
  x: 22,
  y: 66,
  score: 3.8,
  count: 12,
  status: {
    tone: 'green',
    label: 'Calme'
  },
  tags: [{
    icon: 'leaf',
    label: 'Au calme'
  }, {
    icon: 'trees',
    label: 'Verdure'
  }],
  distance: '600 m',
  intents: ['calm'],
  reviews: [{
    name: 'Yanis',
    score: 4,
    date: 'il y a 5 j',
    text: 'Tranquille, parfait pour lire. Un peu usé mais ça va.'
  }, {
    name: 'Manon',
    score: 3,
    date: 'il y a 3 sem',
    text: 'Sympa mais parfois un peu de déchets le lundi matin.'
  }]
}, {
  id: 'b4',
  name: 'Banc de la butte',
  area: 'Parc de Belleville · 20e',
  x: 78,
  y: 32,
  score: 4.5,
  count: 34,
  status: {
    tone: 'green',
    label: 'Propre'
  },
  tags: [{
    icon: 'eye',
    label: 'Panorama'
  }, {
    icon: 'sun',
    label: 'Coucher de soleil'
  }],
  distance: '1,2 km',
  intents: ['view', 'sun'],
  reviews: [{
    name: 'Sofia',
    score: 5,
    date: 'il y a 2 j',
    text: 'Le meilleur point de vue sur Paris, sans touristes 🙌'
  }, {
    name: 'Hugo',
    score: 4,
    date: 'il y a 1 sem',
    text: 'Faut grimper un peu mais ça vaut le coup.'
  }]
}, {
  id: 'b5',
  name: 'Banc allée des tilleuls',
  area: 'Jardin du Luxembourg · 6e',
  x: 50,
  y: 74,
  score: 4.1,
  count: 19,
  status: {
    tone: 'green',
    label: 'Propre'
  },
  tags: [{
    icon: 'trees',
    label: 'Ombragé'
  }, {
    icon: 'leaf',
    label: 'Au calme'
  }],
  distance: '850 m',
  intents: ['calm', 'picnic'],
  reviews: [{
    name: 'Émile',
    score: 4,
    date: 'il y a 6 j',
    text: 'Allée ombragée super agréable en été. Bancs en bon état.'
  }]
}];
window.SITSPOT_INTENTS = [{
  id: 'picnic',
  icon: 'sandwich',
  label: 'Pique-nique'
}, {
  id: 'view',
  icon: 'mountain',
  label: 'Paysage'
}, {
  id: 'calm',
  icon: 'leaf',
  label: 'Au calme'
}, {
  id: 'sun',
  icon: 'sun',
  label: 'Ensoleillé'
}, {
  id: 'near',
  icon: 'navigation',
  label: 'Le plus proche'
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/app/kit.jsx
try { (() => {
/* SitSpot UI kit — local cosmetic primitives (mirror the design-system
   components; self-contained so the prototype runs anywhere). */

const Icon = ({
  n,
  s = 20,
  color
}) => /*#__PURE__*/React.createElement("i", {
  "data-lucide": n,
  style: {
    width: s,
    height: s,
    color: color || 'currentColor'
  }
});
function Stars({
  value = 0,
  size = 16,
  gap = 1
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap
    }
  }, [1, 2, 3, 4, 5].map(i => {
    const fill = value >= i ? 'var(--star)' : value >= i - 0.5 ? 'url(#sg)' : 'var(--neutral-200)';
    return /*#__PURE__*/React.createElement("svg", {
      key: i,
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "sg"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "50%",
      stopColor: "var(--star)"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "50%",
      stopColor: "var(--neutral-200)"
    }))), /*#__PURE__*/React.createElement("path", {
      d: "M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z",
      fill: fill
    }));
  }));
}
function Btn({
  children,
  variant = 'primary',
  size = 'md',
  full,
  onClick,
  iconLeft,
  style
}) {
  const sizes = {
    sm: {
      h: 36,
      p: '0 16px',
      f: 14
    },
    md: {
      h: 44,
      p: '0 22px',
      f: 16
    },
    lg: {
      h: 54,
      p: '0 28px',
      f: 18
    }
  }[size];
  const vr = {
    primary: {
      background: 'var(--accent)',
      color: '#fff',
      boxShadow: 'var(--glow-green)'
    },
    secondary: {
      background: 'var(--accent-2)',
      color: '#fff',
      boxShadow: 'var(--glow-blue)'
    },
    soft: {
      background: 'var(--surface-accent-soft)',
      color: 'var(--text-accent)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      boxShadow: 'inset 0 0 0 1px var(--border-default)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: sizes.h,
      padding: sizes.p,
      width: full ? '100%' : 'auto',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: sizes.f,
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
      border: 'none',
      borderRadius: 'var(--radius-full)',
      cursor: 'pointer',
      transition: 'transform var(--dur-fast) var(--ease-out), filter var(--dur-fast)',
      ...vr,
      ...style
    },
    onMouseDown: e => e.currentTarget.style.transform = 'scale(0.97)',
    onMouseUp: e => e.currentTarget.style.transform = 'scale(1)',
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.filter = 'none';
    },
    onMouseEnter: e => e.currentTarget.style.filter = 'brightness(0.94)'
  }, iconLeft && /*#__PURE__*/React.createElement(Icon, {
    n: iconLeft,
    s: size === 'lg' ? 20 : 17
  }), children);
}
function Chip({
  children,
  selected,
  icon,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      height: 38,
      padding: icon ? '0 16px 0 12px' : '0 16px',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1,
      borderRadius: 'var(--radius-full)',
      color: selected ? '#fff' : 'var(--text-secondary)',
      background: selected ? 'var(--accent)' : 'var(--surface-card)',
      border: selected ? '2px solid var(--accent)' : '2px solid var(--border-subtle)',
      boxShadow: selected ? 'var(--glow-green)' : 'var(--shadow-xs)',
      transition: 'all var(--dur-base) var(--ease-out)',
      flex: 'none'
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    n: icon,
    s: 16
  }), children);
}
function Tag({
  children,
  icon
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 30,
      padding: icon ? '0 12px 0 10px' : '0 12px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--surface-sunken)',
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 600,
      whiteSpace: 'nowrap'
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    n: icon,
    s: 15,
    color: "var(--text-muted)"
  }), children);
}
function Badge({
  children,
  tone = 'green',
  solid,
  dot
}) {
  const pal = {
    green: {
      solid: 'var(--green-500)',
      soft: 'var(--green-50)',
      text: 'var(--green-700)'
    },
    blue: {
      solid: 'var(--blue-500)',
      soft: 'var(--blue-50)',
      text: 'var(--blue-700)'
    },
    gold: {
      solid: 'var(--star)',
      soft: '#FDF1DC',
      text: '#9A6B12'
    },
    neutral: {
      solid: 'var(--neutral-700)',
      soft: 'var(--neutral-100)',
      text: 'var(--neutral-700)'
    }
  }[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 24,
      padding: '0 10px',
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 700,
      background: solid ? pal.solid : pal.soft,
      color: solid ? '#fff' : pal.text
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: solid ? '#fff' : pal.solid
    }
  }), children);
}
function Avatar({
  name = '',
  size = 40,
  ring
}) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const tints = ['var(--green-100)', 'var(--blue-100)', 'var(--green-200)', 'var(--blue-200)'];
  const txt = ['var(--green-800)', 'var(--blue-800)', 'var(--green-800)', 'var(--blue-800)'];
  const idx = (name.charCodeAt(0) || 0) % tints.length;
  const inner = /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: size,
      height: size,
      borderRadius: '50%',
      background: tints[idx],
      color: txt[idx],
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: size * 0.4,
      flex: 'none'
    }
  }, initials || '?');
  if (!ring) return inner;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-grid',
      placeItems: 'center',
      padding: 2,
      borderRadius: '50%',
      background: 'var(--marker-ring)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: 2,
      borderRadius: '50%',
      background: 'var(--surface-card)'
    }
  }, inner));
}

/* The signature marker */
function Marker({
  bench,
  open,
  onClick
}) {
  const dim = open ? 92 : 32;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-label": bench.name,
    style: {
      position: 'absolute',
      left: bench.x + '%',
      top: bench.y + '%',
      transform: 'translate(-50%,-50%)',
      border: 'none',
      padding: 0,
      background: 'transparent',
      cursor: 'pointer',
      zIndex: open ? 30 : 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
      width: dim,
      height: dim,
      borderRadius: '50%',
      background: 'var(--marker-ring)',
      padding: open ? 5 : 5,
      boxShadow: open ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      boxSizing: 'border-box',
      transition: 'width var(--dur-slow) var(--ease-spring), height var(--dur-slow) var(--ease-spring)'
    }
  }, open ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      overflow: 'hidden',
      background: 'linear-gradient(150deg,#cfe6c6,#a9d6e6)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "armchair",
    s: 30,
    color: "var(--green-700)"
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: '#fff',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--green-500)'
    }
  })), open && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: -6,
      right: -6,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      height: 26,
      padding: '0 9px',
      borderRadius: 'var(--radius-full)',
      background: '#fff',
      boxShadow: 'var(--shadow-md)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 800,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "var(--star)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z"
  })), String(bench.score).replace('.', ','))));
}
Object.assign(window, {
  Icon,
  Stars,
  Btn,
  Chip,
  Tag,
  Badge,
  Avatar,
  Marker
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/kit.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/screens.jsx
try { (() => {
/* SitSpot UI kit — composed surfaces: TopBar, BenchSheet, AddReview. */

function TopBar({
  query,
  setQuery,
  intents,
  active,
  toggle,
  onOpenFilters
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 18,
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      padding: '0 16px',
      zIndex: 40,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      maxWidth: 'var(--search-max-w)',
      height: 54,
      padding: '0 8px 0 18px',
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(var(--blur-md))',
      borderRadius: 'var(--radius-full)',
      boxShadow: 'var(--shadow-md)',
      border: '2px solid transparent'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "search",
    s: 20,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Cherche un banc\u2026 pique-nique, vue, au calme",
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      fontWeight: 500,
      color: 'var(--text-primary)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Filtres",
    onClick: onOpenFilters,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      flex: 'none',
      border: 'none',
      borderRadius: 'var(--radius-full)',
      background: active.length ? 'var(--surface-accent-soft)' : 'var(--surface-sunken)',
      color: active.length ? 'var(--text-accent)' : 'var(--text-secondary)',
      cursor: 'pointer',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "sliders-horizontal",
    s: 20
  }), active.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -2,
      right: -2,
      minWidth: 18,
      height: 18,
      padding: '0 5px',
      borderRadius: '999px',
      background: 'var(--accent)',
      color: '#fff',
      fontSize: 11,
      fontWeight: 700,
      display: 'grid',
      placeItems: 'center',
      boxShadow: '0 0 0 2px #fff'
    }
  }, active.length))), /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: 'auto',
      display: 'flex',
      gap: 8,
      maxWidth: '100%',
      overflowX: 'auto',
      padding: '2px 4px',
      WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 16px,#000 calc(100% - 16px),transparent)'
    }
  }, intents.map(it => /*#__PURE__*/React.createElement(Chip, {
    key: it.id,
    icon: it.icon,
    selected: active.includes(it.id),
    onClick: () => toggle(it.id)
  }, it.label))));
}
function BenchSheet({
  bench,
  onClose,
  onAddReview
}) {
  if (!bench) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      zIndex: 50,
      right: 18,
      top: 18,
      bottom: 18,
      width: 'var(--sheet-max-w)',
      maxWidth: 'calc(100% - 36px)',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden',
      animation: 'ss-slide var(--dur-slow) var(--ease-spring)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 188,
      flex: 'none',
      background: 'linear-gradient(150deg,#cfe6c6,#a9d6e6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--green-700)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "armchair",
    s: 42
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 14,
      left: 14
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: bench.status.tone,
    solid: true,
    dot: true
  }, bench.status.label)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fermer",
    style: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 36,
      height: 36,
      border: 'none',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(8px)',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "x",
    s: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 12,
      left: 14,
      display: 'inline-flex',
      gap: 6
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: 'rgba(255,255,255,0.55)',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--green-700)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "image",
    s: 16
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 'var(--space-5) var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 26,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      color: 'var(--text-primary)'
    }
  }, bench.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, bench.area)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "navigation",
    s: 14
  }), bench.distance)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Stars, {
    value: bench.score,
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 18,
      color: 'var(--text-primary)'
    }
  }, String(bench.score).replace('.', ',')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, "\xB7 ", bench.count, " avis")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 16
    }
  }, bench.tags.map((t, i) => /*#__PURE__*/React.createElement(Tag, {
    key: i,
    icon: t.icon
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    full: true,
    iconLeft: "navigation"
  }, "M'y emmener"), /*#__PURE__*/React.createElement(Btn, {
    variant: "soft",
    iconLeft: "share-2"
  }, "Partager")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '26px 0 4px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 19,
      color: 'var(--text-primary)'
    }
  }, "Avis"), /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    size: "sm",
    iconLeft: "plus",
    onClick: onAddReview
  }, "Ajouter un avis")), /*#__PURE__*/React.createElement("div", null, bench.reviews.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 12,
      padding: '16px 0',
      borderTop: i ? '1px solid var(--border-subtle)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.name,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--text-primary)'
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, r.date)), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '3px 0 6px'
    }
  }, /*#__PURE__*/React.createElement(Stars, {
    value: r.score,
    size: 14
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      textWrap: 'pretty'
    }
  }, r.text)))))));
}
function AddReview({
  bench,
  onClose,
  onSubmit
}) {
  const [score, setScore] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [text, setText] = React.useState('');
  if (!bench) return null;
  const disp = hover || score;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 60,
      background: 'rgba(26,25,22,0.4)',
      backdropFilter: 'blur(3px)',
      display: 'grid',
      placeItems: 'center',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 420,
      maxWidth: '100%',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-xl)',
      padding: 'var(--space-6)',
      animation: 'ss-pop var(--dur-slow) var(--ease-spring)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      fontWeight: 600
    }
  }, "Comment \xE9tait ce spot ?"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '4px 0 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 22,
      letterSpacing: '-0.01em',
      color: 'var(--text-primary)'
    }
  }, bench.name)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fermer",
    style: {
      width: 36,
      height: 36,
      border: 'none',
      borderRadius: '50%',
      background: 'var(--surface-sunken)',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "x",
    s: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      margin: '20px 0',
      justifyContent: 'center'
    }
  }, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(0),
    onClick: () => setScore(i),
    style: {
      cursor: 'pointer',
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 24 24",
    fill: disp >= i ? 'var(--star)' : 'var(--neutral-200)'
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z"
  }))))), /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => setText(e.target.value),
    placeholder: "Propre ? \xC0 l'ombre ? Tranquille ? Raconte ton exp\xE9rience\u2026",
    rows: 3,
    style: {
      width: '100%',
      boxSizing: 'border-box',
      resize: 'none',
      border: '2px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.5,
      color: 'var(--text-primary)',
      outline: 'none'
    },
    onFocus: e => e.target.style.borderColor = 'var(--border-accent)',
    onBlur: e => e.target.style.borderColor = 'var(--border-subtle)'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 12,
      flexWrap: 'wrap'
    }
  }, ['Propre', 'Ombragé', 'Au calme', 'Belle vue'].map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    full: true,
    onClick: () => onSubmit({
      score,
      text
    }),
    style: {
      opacity: score ? 1 : 0.5,
      pointerEvents: score ? 'auto' : 'none'
    }
  }, "Publier mon avis"))));
}
Object.assign(window, {
  TopBar,
  BenchSheet,
  AddReview
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Rating = __ds_scope.Rating;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.SearchBar = __ds_scope.SearchBar;

__ds_ns.BenchCard = __ds_scope.BenchCard;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.MarkerBubble = __ds_scope.MarkerBubble;

__ds_ns.ReviewItem = __ds_scope.ReviewItem;

})();
