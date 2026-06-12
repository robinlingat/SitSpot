import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const PARIS            = [2.3522, 48.8566];

const CLUSTER_MAX_ZOOM = 13; // au-delà de ce zoom, plus de clustering
const COLORS = {
  land:       '#F4F2EC',
  land2:      '#EFECE4',
  road:       '#FFFFFF',
  roadMajor:  '#FBF4DF',
  roadStroke: '#E7E2D6',
  water:      '#CADFEC',
  park:       '#DCEBCF',
  parkDeep:   '#CBE2BB',
  building:   '#EBE7DD',
  text:       '#5F5C54',
  textHalo:   '#F4F2EC',
};

const set = (map, id, prop, val) => { try { map.setPaintProperty(id, prop, val); } catch(_) {} };

function applySitSpotStyle(map) {
  set(map, 'background',         'background-color', COLORS.land);
  set(map, 'natural_earth',      'raster-opacity',   0);
  set(map, 'park',               'fill-color',       COLORS.park);
  set(map, 'park',               'fill-outline-color',COLORS.park);
  set(map, 'park_outline',       'line-color',       COLORS.parkDeep);
  set(map, 'landcover_grass',    'fill-color',       COLORS.park);
  set(map, 'landcover_wood',     'fill-color',       COLORS.parkDeep);
  set(map, 'landuse_residential','fill-color',       COLORS.land2);
  set(map, 'landuse_pitch',      'fill-color',       COLORS.park);
  set(map, 'landuse_cemetery',   'fill-color',       COLORS.land2);
  set(map, 'landuse_hospital',   'fill-color',       COLORS.land2);
  set(map, 'landuse_school',     'fill-color',       COLORS.land2);
  set(map, 'water',              'fill-color',       COLORS.water);
  set(map, 'waterway_river',     'line-color',       COLORS.water);
  set(map, 'waterway_other',     'line-color',       COLORS.water);
  set(map, 'waterway_tunnel',    'line-color',       COLORS.water);
  set(map, 'building',           'fill-color',       COLORS.building);
  set(map, 'building',           'fill-outline-color',COLORS.roadStroke);
  set(map, 'building-3d',        'fill-extrusion-color', COLORS.building);

  const casings = [
    'road_motorway_casing','road_trunk_primary_casing','road_secondary_tertiary_casing',
    'road_minor_casing','road_link_casing','road_motorway_link_casing','road_service_track_casing',
    'bridge_motorway_casing','bridge_trunk_primary_casing','bridge_secondary_tertiary_casing',
    'bridge_street_casing','bridge_link_casing','bridge_motorway_link_casing','bridge_service_track_casing',
    'bridge_path_pedestrian_casing',
    'tunnel_motorway_casing','tunnel_trunk_primary_casing','tunnel_secondary_tertiary_casing',
    'tunnel_street_casing','tunnel_link_casing','tunnel_motorway_link_casing','tunnel_service_track_casing',
  ];
  casings.forEach(id => set(map, id, 'line-color', COLORS.roadStroke));

  const major = [
    'road_motorway','road_trunk_primary','road_motorway_link',
    'bridge_motorway','bridge_trunk_primary','bridge_motorway_link',
    'tunnel_motorway','tunnel_trunk_primary','tunnel_motorway_link',
  ];
  major.forEach(id => set(map, id, 'line-color', COLORS.roadMajor));

  const minor = [
    'road_secondary_tertiary','road_link','road_minor','road_service_track','road_path_pedestrian',
    'bridge_secondary_tertiary','bridge_link','bridge_street','bridge_service_track','bridge_path_pedestrian',
    'tunnel_secondary_tertiary','tunnel_link','tunnel_minor','tunnel_service_track','tunnel_path_pedestrian',
  ];
  minor.forEach(id => set(map, id, 'line-color', COLORS.road));

  ['road_major_rail','road_transit_rail','bridge_major_rail','bridge_transit_rail',
   'tunnel_major_rail','tunnel_transit_rail'].forEach(id => set(map, id, 'line-color', COLORS.roadStroke));
  ['road_major_rail_hatching','road_transit_rail_hatching','bridge_major_rail_hatching',
   'bridge_transit_rail_hatching','tunnel_major_rail_hatching','tunnel_transit_rail_hatching']
    .forEach(id => set(map, id, 'line-color', COLORS.roadStroke));

  ['boundary_2','boundary_3','boundary_disputed'].forEach(id => {
    set(map, id, 'line-color', COLORS.roadStroke);
    set(map, id, 'line-opacity', 0.35);
  });

  const labels = [
    'waterway_line_label','water_name_point_label','water_name_line_label',
    'poi_r20','poi_r7','poi_r1','poi_transit',
    'highway-name-path','highway-name-minor','highway-name-major',
    'label_other','label_village','label_town','label_state',
    'label_city','label_city_capital','label_country_1','label_country_2','label_country_3',
    'airport',
  ];
  labels.forEach(id => {
    const isWater = id.includes('water') || id.includes('waterway');
    set(map, id, 'text-color',      isWater ? COLORS.water : COLORS.text);
    set(map, id, 'text-halo-color', COLORS.textHalo);
  });
}

/* Taille des marqueurs DOM selon le niveau de zoom */
function markerDim(zoom) {
  if (zoom >= 16) return 30;
  if (zoom <= 11) return 12;
  // interpolation linéaire 11→12px  14→24px  16→30px
  if (zoom <= 14) return 12 + (zoom - 11) / 3 * 12;
  return 24 + (zoom - 14) / 2 * 6;
}

function toAllGeoJSON(ssBenches, osmBenches) {
  return {
    type: 'FeatureCollection',
    features: [
      ...ssBenches.filter(b => b.lng != null && b.lat != null).map(b => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [b.lng, b.lat] },
        properties: { id: b.id, isSS: true },
      })),
      ...osmBenches.filter(b => b.lng != null && b.lat != null).map(b => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [b.lng, b.lat] },
        properties: { id: b.id, isSS: false },
      })),
    ],
  };
}

const ARMCHAIR = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0"/><line x1="5" y1="18" x2="5" y2="20"/><line x1="19" y1="18" x2="19" y2="20"/></svg>`;

function makeMarkerEl(bench, isOpen, isOwned) {
  const sc    = bench.score;
  const color = sc === null ? '#9ca3af' : sc >= 4 ? '#22c55e' : sc >= 2.5 ? '#f59e0b' : '#ef4444';
  const dim   = isOpen ? 56 : 30;
  const pad   = isOpen ? 5 : 4;
  const bg    = isOpen
    ? 'linear-gradient(145deg,#cfe6c6,#a9d6e6)'
    : isOwned ? 'linear-gradient(145deg,#fef3c7,#fde68a)' : '#fff';
  const shadow = isOpen
    ? '0 4px 16px rgba(0,0,0,0.22),0 0 0 3px rgba(34,197,94,0.28)'
    : isOwned ? '0 2px 8px rgba(0,0,0,0.14),0 0 0 2px rgba(245,158,11,0.5)'
    : '0 2px 8px rgba(0,0,0,0.14)';
  const inner = isOpen
    ? ARMCHAIR
    : isOwned
      ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="#d97706"><path d="M11.562 3.322a.75.75 0 0 1 .876 0l2.254 1.639 2.635-.856a.75.75 0 0 1 .928.523l.683 2.658 2.41 1.39a.75.75 0 0 1 .223 1.044l-1.53 2.317.528 2.7a.75.75 0 0 1-.739.896l-2.73-.17-1.687 2.145a.75.75 0 0 1-1.086.07l-1.957-1.92-2.712.377a.75.75 0 0 1-.84-.763l.1-2.742-2.116-1.702a.75.75 0 0 1 .062-1.197l2.54-1.498.483-2.686a.75.75 0 0 1 .875-.597l2.671.528 1.869-1.917z"/></svg>`
      : `<span style="width:10px;height:10px;border-radius:50%;background:${color};display:block"></span>`;
  const badge = isOpen && sc
    ? `<span style="position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);white-space:nowrap;display:inline-flex;align-items:center;gap:3px;height:22px;padding:0 8px;border-radius:100px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.14);font-weight:800;font-size:12px;font-family:sans-serif"><svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z"/></svg>${String(sc).replace('.', ',')}</span>`
    : '';
  const el = document.createElement('div');
  el.style.cssText = `position:relative;display:grid;place-items:center;width:${dim}px;height:${dim}px;border-radius:50%;background:rgba(255,255,255,0.92);padding:${pad}px;box-shadow:${shadow};cursor:pointer;transition:all .22s`;
  el.innerHTML = `<div style="width:100%;height:100%;border-radius:50%;background:${bg};display:grid;place-items:center">${inner}</div>${badge}`;
  return el;
}

function makeUserMarkerEl() {
  const el = document.createElement('div');
  el.style.cssText = 'position:relative;width:36px;height:36px;display:grid;place-items:center;';
  el.innerHTML = `
    <div class="ss-user-arrow" style="transition:transform 0.25s ease;display:grid;place-items:center;">
      <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 2px 6px rgba(22,163,74,0.55)) drop-shadow(0 1px 2px rgba(0,0,0,0.18))">
        <defs>
          <linearGradient id="ss-arrow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#86efac"/>
            <stop offset="100%" stop-color="#1d4ed8"/>
          </linearGradient>
        </defs>
        <!-- Corps de la flèche -->
        <path d="M18 4 L26 30 L18 25 L10 30 Z" fill="url(#ss-arrow-grad)" stroke="white" stroke-width="2" stroke-linejoin="round"/>
      </svg>
    </div>
  `;
  return el;
}

export function MapCanvas({ benches = [], osmBenches = [], selectedId, onSelect, zoomCmd, flyToCmd, onViewport, dimmed, userLocation, onReady, ownedBenchIds = [] }) {
  const containerRef   = useRef(null);
  const mapRef         = useRef(null);
  const markersRef     = useRef({});
  const prevCmd        = useRef(null);
  const userMarkerRef  = useRef(null);
  const userMarkerElRef = useRef(null);

  const benchesRef       = useRef(benches);
  const osmBenchesRef    = useRef(osmBenches);
  const selectedIdRef    = useRef(selectedId);
  const onSelectRef      = useRef(onSelect);
  const mapLoadedRef     = useRef(false);
  const onViewportRef    = useRef(onViewport);
  const onReadyRef       = useRef(onReady);
  const ownedBenchIdsRef = useRef(ownedBenchIds);
  onViewportRef.current    = onViewport;
  onReadyRef.current       = onReady;
  benchesRef.current       = benches;
  osmBenchesRef.current    = osmBenches;
  selectedIdRef.current    = selectedId;
  onSelectRef.current      = onSelect;
  ownedBenchIdsRef.current = ownedBenchIds;

  function applyMarkerZoom() {
    const map = mapRef.current;
    if (!map) return;
    const zoom    = map.getZoom();
    const scale   = markerDim(zoom) / 30;
    const visible = zoom > CLUSTER_MAX_ZOOM;
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const isOpen = selectedIdRef.current === id;
      const el     = marker.getElement();
      el.style.display = (visible || isOpen) ? '' : 'none';
      if (isOpen) return;
      const inner = el.firstElementChild;
      if (inner) inner.style.transform = `scale(${scale.toFixed(3)})`;
    });
  }

  function rebuildMarkers() {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current) return;
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};
    benchesRef.current.forEach(b => {
      const isOwned = ownedBenchIdsRef.current.includes(b.id);
      const el = makeMarkerEl(b, selectedIdRef.current === b.id, isOwned);
      el.style.opacity = b._dim === false ? '0.28' : '1';
      el.addEventListener('click', () => onSelectRef.current(b.id));
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([b.lng, b.lat])
        .addTo(map);
      markersRef.current[b.id] = marker;
    });
    applyMarkerZoom();
  }

  function updateAllBenchesLayer(map) {
    const src = map.getSource('all-benches');
    if (!src) return;
    try { src.setData(toAllGeoJSON(benchesRef.current, osmBenchesRef.current)); } catch(_) { return; }
    const sel   = selectedIdRef.current;
    const selId = sel?.startsWith('osm_') ? sel : '__none__';
    try {
      map.setPaintProperty('bench-dots', 'circle-color', [
        'case', ['==', ['get', 'id'], selId], '#15803d', '#9ca3af',
      ]);
      map.setPaintProperty('bench-dots', 'circle-radius',
        selId === '__none__'
          ? ['interpolate',['linear'],['zoom'], 11,2, 14,4, 17,5]
          : ['case', ['==', ['get', 'id'], selId], 8,
              ['interpolate',['linear'],['zoom'], 11,2, 14,4, 17,5]]
      );
      map.setPaintProperty('bench-dots-bg', 'circle-radius',
        selId === '__none__'
          ? ['interpolate',['linear'],['zoom'], 11,4, 14,9, 17,15]
          : ['case', ['==', ['get', 'id'], selId], 28,
              ['interpolate',['linear'],['zoom'], 11,4, 14,9, 17,15]]
      );
    } catch(_) {}
  }

  /* Crée la carte — une seule fois */
  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container:          containerRef.current,
      style:              'https://tiles.openfreemap.org/styles/liberty',
      center:             PARIS,
      zoom:               12,
      zoomControl:        false,
      attributionControl: false,
    });

    map.on('load', () => {
      mapLoadedRef.current = true;
      map.resize();
      applySitSpotStyle(map);
      onReadyRef.current?.();

      /* Source unique pour tous les bancs, clustering activé */
      map.addSource('all-benches', {
        type: 'geojson',
        data: toAllGeoJSON([], []),
        cluster: true,
        clusterMaxZoom: CLUSTER_MAX_ZOOM,
        clusterRadius: 55,
      });

      /* ── Images dégradé pour les macarons clusters ── */
      function makeClusterImg(size) {
        const c = document.createElement('canvas');
        c.width = size; c.height = size;
        const ctx = c.getContext('2d');
        const cx = size / 2, r = size / 2 - 1.5;
        const g = ctx.createLinearGradient(cx - r, cx - r, cx + r, cx + r);
        g.addColorStop(0, '#86efac');
        g.addColorStop(1, '#1d4ed8');
        ctx.beginPath();
        ctx.arc(cx, cx, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        return { width: size, height: size, data: new Uint8Array(ctx.getImageData(0, 0, size, size).data) };
      }
      map.addImage('cluster-sm', makeClusterImg(44));
      map.addImage('cluster-md', makeClusterImg(56));
      map.addImage('cluster-lg', makeClusterImg(70));

      /* ── Macarons clusters ── */
      map.addLayer({
        id: 'clusters',
        type: 'symbol',
        source: 'all-benches',
        filter: ['has', 'point_count'],
        layout: {
          'icon-image': ['step', ['get', 'point_count'], 'cluster-sm', 20, 'cluster-md', 100, 'cluster-lg'],
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      });
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'all-benches',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 12,
          'text-font': ['Noto Sans Bold', 'Arial Unicode MS Bold'],
          'text-allow-overlap': true,
        },
        paint: { 'text-color': '#ffffff' },
      });

      /* ── Points individuels OSM (non SS, non cluster) ── */
      map.addLayer({
        id: 'bench-dots-bg',
        type: 'circle',
        source: 'all-benches',
        filter: ['all', ['!', ['has', 'point_count']], ['!', ['boolean', ['get', 'isSS'], false]]],
        paint: {
          'circle-radius': ['interpolate',['linear'],['zoom'], 11,4, 14,9, 17,15],
          'circle-color': 'rgba(255,255,255,0.92)',
          'circle-pitch-alignment': 'map',
        },
      });
      map.addLayer({
        id: 'bench-dots',
        type: 'circle',
        source: 'all-benches',
        filter: ['all', ['!', ['has', 'point_count']], ['!', ['boolean', ['get', 'isSS'], false]]],
        paint: {
          'circle-radius': ['interpolate',['linear'],['zoom'], 11,2, 14,4, 17,5],
          'circle-color': '#9ca3af',
          'circle-pitch-alignment': 'map',
        },
      });

      /* Click sur un banc OSM individuel */
      ['bench-dots', 'bench-dots-bg'].forEach(layer => {
        map.on('click', layer, e => {
          const id = e.features[0]?.properties?.id;
          if (id) onSelectRef.current(id);
        });
      });
      map.on('mouseenter', 'bench-dots', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'bench-dots', () => { map.getCanvas().style.cursor = ''; });

      /* Click sur un cluster → zoom pour décluster */
      map.on('click', 'clusters', e => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        if (!features.length) return;
        const clusterId = features[0].properties.cluster_id;
        const coords    = features[0].geometry.coordinates.slice();
        map.getSource('all-benches').getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          map.easeTo({ center: coords, zoom });
        });
      });
      map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });

      updateAllBenchesLayer(map);
      rebuildMarkers();

      /* Notifie App du viewport initial */
      const fireViewport = () => {
        const b = map.getBounds();
        onViewportRef.current?.({ south: b.getSouth(), west: b.getWest(), north: b.getNorth(), east: b.getEast(), zoom: map.getZoom() });
      };
      fireViewport();
      map.on('moveend', fireViewport);
    });

    map.on('zoom', () => applyMarkerZoom());

    mapRef.current = map;
    return () => map.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Mise à jour des marqueurs SS (6 bancs détaillés) */
  useEffect(() => {
    rebuildMarkers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benches, selectedId, onSelect, ownedBenchIds]);

  /* Mise à jour de la source quand les données ou la sélection changent */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getSource('all-benches')) return;
    updateAllBenchesLayer(map);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [osmBenches, selectedId, benches]);

  /* Zoom */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !zoomCmd || zoomCmd === prevCmd.current) return;
    prevCmd.current = zoomCmd;
    if (zoomCmd.startsWith('in'))    map.zoomIn();
    if (zoomCmd.startsWith('out'))   map.zoomOut();
    if (zoomCmd.startsWith('reset')) map.flyTo({ center: PARIS, zoom: 12 });
  }, [zoomCmd]);

  /* Fly to searched location */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyToCmd) return;
    map.flyTo({ center: flyToCmd.center, zoom: flyToCmd.zoom ?? 15, duration: 1400 });
  }, [flyToCmd]);

  /* Marqueur position utilisateur */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;
    if (userMarkerRef.current) userMarkerRef.current.remove();
    const el = makeUserMarkerEl();
    userMarkerElRef.current = el;
    userMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map);
  }, [userLocation]);

  /* Orientation appareil → rotation de la flèche */
  useEffect(() => {
    const handleOrientation = (e) => {
      const el = userMarkerElRef.current;
      if (!el) return;
      const arrow = el.querySelector('.ss-user-arrow');
      if (!arrow) return;
      // iOS: webkitCompassHeading est la vraie boussole (0 = Nord, croît vers l'Est)
      // Android/Chrome: alpha = azimut, mais sens inverse → on utilise 360 - alpha
      let heading;
      if (e.webkitCompassHeading != null) {
        heading = e.webkitCompassHeading;
      } else if (e.alpha != null) {
        heading = (360 - e.alpha) % 360;
      } else {
        return;
      }
      arrow.style.transform = `rotate(${heading}deg)`;
    };

    if (typeof DeviceOrientationEvent === 'undefined') return;

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requiert une permission déclenchée par un geste utilisateur
      // On essaie silencieusement ; si refusé, la flèche pointe juste vers le Nord
      DeviceOrientationEvent.requestPermission()
        .then(state => { if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation, true); })
        .catch(() => {});
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, isolation: 'isolate', zIndex: 0 }}>
      <style>{`.maplibregl-ctrl{display:none!important}`}</style>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}/>
      {dimmed && (
        <div style={{ position:'absolute',inset:0,background:'rgba(26,25,22,0.22)',backdropFilter:'blur(1px)',zIndex:10,pointerEvents:'none' }}/>
      )}
    </div>
  );
}
