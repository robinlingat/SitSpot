import React from 'react';
import { Icon, Btn, Avatar } from './Kit';
import { supabase } from './supabase';
import { clans } from './clans';

// ══════════════════════════════════════════
// CheckinBanner — bannière check-in actif sur la carte
// ══════════════════════════════════════════
export function CheckinBanner({ activeCheckin, onCheckout, clanName, isMobile }) {
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    if (!activeCheckin) return;
    const start = activeCheckin.startedAt;
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeCheckin]);

  if (!activeCheckin) return null;

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  const bottom = isMobile ? 92 : 28;

  return (
    <div style={{
      position: 'absolute',
      bottom,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 50,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 16px',
      borderRadius: 99,
      background: 'linear-gradient(135deg, #16a34a, #15803d)',
      boxShadow: '0 4px 20px rgba(22,163,74,0.45)',
      color: '#fff',
      whiteSpace: 'nowrap',
      maxWidth: 'calc(100vw - 32px)',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#86efac', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{activeCheckin.benchName}</div>
        <div style={{ fontSize: 11, opacity: 0.85 }}>{timeStr} · {clanName}</div>
      </div>
      <button onClick={onCheckout} style={{
        marginLeft: 4,
        padding: '5px 11px',
        borderRadius: 99,
        border: 'none',
        background: 'rgba(255,255,255,0.22)',
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        flexShrink: 0,
      }}>Quitter</button>
    </div>
  );
}

// ══════════════════════════════════════════
// ClanHub — écran principal clan
// ══════════════════════════════════════════
export function ClanHub({ user, userClan, userClanMember, onClanUpdated, showToast }) {
  if (!user) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center' }}>
        <Icon n="shield" s={48} color="var(--text-muted)" />
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, margin: '16px 0 8px' }}>Clans</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Connecte-toi pour rejoindre ou créer un clan.</p>
      </div>
    );
  }
  if (!userClan) return <ClanCreateForm user={user} onCreated={onClanUpdated} showToast={showToast} />;
  return <ClanProfile user={user} clan={userClan} member={userClanMember} onUpdated={onClanUpdated} showToast={showToast} />;
}

// ── ClanCreateForm ──
function ClanCreateForm({ user, onCreated, showToast }) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async () => {
    setError('');
    const trimmed = name.trim();
    if (trimmed.length < 3) { setError('Le nom doit faire au moins 3 caractères.'); return; }
    setLoading(true);
    try {
      const data = await clans.create(trimmed, description.trim() || null, null);
      showToast?.('Clan créé ! Vous êtes maintenant chef 🎉');
      onCreated?.(data.clan);
    } catch (e) {
      setError(e.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', height: 48,
    border: '2px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '0 14px', fontSize: 15,
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    boxSizing: 'border-box',
    background: 'var(--surface-card)',
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--surface-app)' }}>
      <div style={{ padding: '32px 20px 24px', background: 'var(--surface-card)', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--surface-accent-soft)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
          <Icon n="shield" s={32} color="var(--text-accent)" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', margin: '0 0 8px' }}>Créer un clan</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          Rassemblez vos amis et conquérez les bancs de la ville !
        </p>
      </div>
      <div style={{ margin: '12px', padding: '20px', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
            Nom du clan <span style={{ color: 'var(--danger)', fontSize: 11 }}>3–30 caractères</span>
          </label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="ex. Les Pigeonniers" maxLength={30}
            style={inp}
            onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-faint)', marginTop: 3 }}>{name.length}/30</div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
            Description <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(optionnelle, 200 max)</span>
          </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Qui êtes-vous ?" rows={3} maxLength={200}
            style={{ ...inp, height: 'auto', padding: '12px 14px', resize: 'none' }}
            onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-faint)', marginTop: 3 }}>{description.length}/200</div>
        </div>
        {error && <div style={{ marginBottom: 14, padding: '10px 14px', background: '#fef2f2', borderRadius: 'var(--radius-md)', fontSize: 13, color: '#dc2626', fontWeight: 500 }}>{error}</div>}
        <Btn variant="primary" full onClick={handleSubmit} disabled={loading || name.trim().length < 3}>
          {loading ? 'Création…' : 'Fonder le clan'}
        </Btn>
      </div>
    </div>
  );
}

// ── ClanProfile ──
function ClanProfile({ user, clan, member, onUpdated, showToast }) {
  const [members, setMembers] = React.useState([]);
  const [ownedBenches, setOwnedBenches] = React.useState([]);
  const [score, setScore] = React.useState(null);
  const [showInvite, setShowInvite] = React.useState(false);
  const [inviteUsername, setInviteUsername] = React.useState('');
  const [inviteLoading, setInviteLoading] = React.useState(false);
  const [showDissolveConfirm, setShowDissolveConfirm] = React.useState(false);
  const [dissolveInput, setDissolveInput] = React.useState('');

  React.useEffect(() => {
    if (!clan) return;
    clans.getMembers(clan.id).then(setMembers);
    clans.getOwnedBenches(clan.id).then(setOwnedBenches);
    supabase.from('clan_total_scores').select('global_score').eq('clan_id', clan.id).maybeSingle()
      .then(({ data }) => setScore(data?.global_score ?? 0));
  }, [clan]);

  const canInvite = ['chef', 'sous_chef', 'admin'].includes(member?.role);
  const canManage = ['chef', 'sous_chef'].includes(member?.role);
  const isChef = member?.role === 'chef';

  const handleInvite = async () => {
    if (!inviteUsername.trim()) return;
    setInviteLoading(true);
    try {
      await clans.invite(clan.id, inviteUsername.trim());
      showToast?.(`Invitation envoyée à @${inviteUsername.trim()} !`);
      setShowInvite(false);
      setInviteUsername('');
    } catch (e) {
      showToast?.(e.message || 'Erreur lors de l\'invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Quitter le clan ?')) return;
    try {
      await clans.leave(clan.id);
      showToast?.('Vous avez quitté le clan.');
      onUpdated?.(null, null);
    } catch (e) {
      showToast?.(e.message);
    }
  };

  const handleDissolve = async () => {
    if (dissolveInput !== clan.name) return;
    try {
      await clans.dissolve(clan.id);
      showToast?.('Clan dissous.');
      onUpdated?.(null, null);
    } catch (e) {
      showToast?.(e.message);
    }
  };

  const handlePromote = async (targetUserId, newRole) => {
    try {
      await clans.promote(clan.id, targetUserId, newRole);
      showToast?.('Rôle mis à jour.');
      clans.getMembers(clan.id).then(setMembers);
    } catch (e) {
      showToast?.(e.message);
    }
  };

  const handleKick = async (targetUserId, pseudo) => {
    if (!window.confirm(`Exclure @${pseudo} ?`)) return;
    try {
      await clans.kick(clan.id, targetUserId);
      showToast?.('Membre exclu.');
      clans.getMembers(clan.id).then(setMembers);
    } catch (e) {
      showToast?.(e.message);
    }
  };

  const ROLE_LABELS = { chef: '👑 Chef', sous_chef: '⚔️ Sous-chef', admin: '🛡️ Admin', membre: 'Membre' };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--surface-app)' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface-card)', padding: '20px 20px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: 'var(--accent)', display: 'grid', placeItems: 'center', flexShrink: 0, overflow: 'hidden' }}>
            {clan.logo_url
              ? <img src={clan.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <Icon n="shield" s={24} color="#fff" />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{clan.name}</h2>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{ROLE_LABELS[member?.role]} · {members.length} membre{members.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
        {clan.description && <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{clan.description}</p>}
        {/* Scores */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          {[
            { v: score ?? '…', l: 'points total' },
            { v: ownedBenches.length, l: 'bancs possédés' },
            { v: members.length, l: 'membres' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>{typeof s.v === 'number' ? s.v.toLocaleString('fr-FR') : s.v}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Inviter */}
      {canInvite && (
        <div style={{ margin: '10px 0 0', background: 'var(--surface-card)', padding: '14px 20px' }}>
          {!showInvite
            ? <Btn variant="primary" iconLeft="user-plus" full onClick={() => setShowInvite(true)}>Inviter un membre</Btn>
            : (
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={inviteUsername} onChange={e => setInviteUsername(e.target.value)} placeholder="Pseudo du joueur"
                    onKeyDown={e => e.key === 'Enter' && handleInvite()}
                    style={{ flex: 1, height: 42, border: '2px solid var(--border-accent)', borderRadius: 'var(--radius-md)', padding: '0 12px', fontSize: 14, fontFamily: 'var(--font-sans)', boxSizing: 'border-box', background: 'var(--surface-card)', color: 'var(--text-primary)' }} />
                  <Btn variant="primary" onClick={handleInvite} disabled={inviteLoading || !inviteUsername.trim()}>{inviteLoading ? '…' : 'Inviter'}</Btn>
                </div>
                <Btn variant="ghost" onClick={() => { setShowInvite(false); setInviteUsername(''); }}>Annuler</Btn>
              </div>
            )
          }
        </div>
      )}

      {/* Membres */}
      <div style={{ margin: '10px 0 0', background: 'var(--surface-card)', padding: '16px 20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em', margin: '0 0 12px' }}>Membres</h3>
        {members.map((m, i) => {
          const p = m.profiles;
          const pseudo = p?.pseudo || p?.name || 'Anonyme';
          const isMe = m.user_id === user?.id;
          const canKickThis = canManage && !isMe && m.role !== 'chef';
          return (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: i > 0 ? '1px solid var(--border-subtle)' : 'none' }}>
              <Avatar name={pseudo} size={36} src={p?.avatar_url} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {pseudo}
                  {isMe && <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--surface-sunken)', padding: '1px 6px', borderRadius: 99 }}>vous</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{ROLE_LABELS[m.role]}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {canManage && !isMe && m.role === 'membre' && (
                  <button onClick={() => handlePromote(m.user_id, 'admin')} title="Promouvoir admin"
                    style={{ padding: '4px 9px', border: '1.5px solid var(--border-default)', borderRadius: 99, background: 'transparent', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    Admin
                  </button>
                )}
                {canManage && !isMe && m.role === 'admin' && (
                  <button onClick={() => handlePromote(m.user_id, 'membre')} title="Rétrograder"
                    style={{ padding: '4px 9px', border: '1.5px solid var(--border-default)', borderRadius: 99, background: 'transparent', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    Rétrograder
                  </button>
                )}
                {isChef && !isMe && m.role !== 'chef' && (
                  <button onClick={() => handlePromote(m.user_id, 'chef')} title="Transférer le titre de chef"
                    style={{ padding: '4px 9px', border: '1.5px solid var(--border-default)', borderRadius: 99, background: 'transparent', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: 'var(--star, #f59e0b)' }}>
                    👑
                  </button>
                )}
                {canKickThis && (
                  <button onClick={() => handleKick(m.user_id, pseudo)} title="Exclure"
                    style={{ width: 28, height: 28, border: 'none', borderRadius: '50%', background: 'var(--surface-sunken)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                    <Icon n="x" s={13} color="var(--text-muted)" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Territoires possédés */}
      {ownedBenches.length > 0 && (
        <div style={{ margin: '10px 0 0', background: 'var(--surface-card)', padding: '16px 20px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em', margin: '0 0 12px' }}>🏴 Nos territoires</h3>
          {ownedBenches.map((b, i) => (
            <div key={b.bench_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i > 0 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--surface-accent-soft)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon n="armchair" s={15} color="var(--text-accent)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.bench_id}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(b.total_points || 0).toLocaleString('fr-FR')} pts</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--star, #f59e0b)">
                <path d="M11.562 3.322a.75.75 0 0 1 .876 0l2.254 1.639 2.635-.856a.75.75 0 0 1 .928.523l.683 2.658 2.41 1.39a.75.75 0 0 1 .223 1.044l-1.53 2.317.528 2.7a.75.75 0 0 1-.739.896l-2.73-.17-1.687 2.145a.75.75 0 0 1-1.086.07l-1.957-1.92-2.712.377a.75.75 0 0 1-.84-.763l.1-2.742-2.116-1.702a.75.75 0 0 1 .062-1.197l2.54-1.498.483-2.686a.75.75 0 0 1 .875-.597l2.671.528 1.869-1.917z"/>
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ margin: '10px 12px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!isChef && (
          <Btn variant="ghost" full iconLeft="log-out" onClick={handleLeave}>Quitter le clan</Btn>
        )}
        {isChef && !showDissolveConfirm && (
          <Btn variant="danger" full onClick={() => setShowDissolveConfirm(true)}>Dissoudre le clan</Btn>
        )}
        {isChef && showDissolveConfirm && (
          <div style={{ padding: 16, background: '#fef2f2', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 13, color: '#dc2626', marginBottom: 10, fontWeight: 600 }}>
              Tapez le nom du clan pour confirmer la dissolution :
            </div>
            <input value={dissolveInput} onChange={e => setDissolveInput(e.target.value)} placeholder={clan.name}
              style={{ width: '100%', height: 42, border: '2px solid #dc2626', borderRadius: 'var(--radius-md)', padding: '0 12px', fontSize: 14, fontFamily: 'var(--font-sans)', boxSizing: 'border-box', marginBottom: 10, background: '#fff' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="danger" full disabled={dissolveInput !== clan.name} onClick={handleDissolve}>Confirmer</Btn>
              <Btn variant="ghost" onClick={() => { setShowDissolveConfirm(false); setDissolveInput(''); }}>Annuler</Btn>
            </div>
          </div>
        )}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

// ══════════════════════════════════════════
// ClanLeaderboardScreen — classement global
// ══════════════════════════════════════════
export function ClanLeaderboardScreen({ userClanId }) {
  const [entries, setEntries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    clans.getGlobalLeaderboard().then(data => { setEntries(data); setLoading(false); });
  }, []);

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--surface-app)' }}>
      <div style={{ padding: '20px 20px 12px', background: 'var(--surface-card)', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', margin: 0 }}>Classement des clans</h2>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Score total cumulé sur tous les bancs</div>
      </div>
      {loading
        ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Chargement…</div>
        : entries.length === 0
          ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🌱</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Aucun clan classé pour l'instant</div>
            </div>
          )
          : entries.map((e, i) => {
              const c = e.clans;
              const isMe = c?.id === userClanId;
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
              return (
                <div key={e.clan_id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: isMe ? 'var(--surface-accent-soft)' : 'var(--surface-card)',
                }}>
                  <div style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>
                    {medal || `#${i + 1}`}
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent)', display: 'grid', placeItems: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {c?.logo_url ? <img src={c.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon n="shield" s={16} color="#fff" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c?.name || '?'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.benches_contributed || 0} banc{e.benches_contributed !== 1 ? 's' : ''} visité{e.benches_contributed !== 1 ? 's' : ''}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 15, color: 'var(--text-accent)', flexShrink: 0 }}>
                    {(e.global_score || 0).toLocaleString('fr-FR')}
                    <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 3 }}>pts</span>
                  </div>
                </div>
              );
            })
      }
      <div style={{ height: 24 }} />
    </div>
  );
}

// ══════════════════════════════════════════
// ClanInvitationsScreen — invitations reçues
// ══════════════════════════════════════════
export function ClanInvitationsScreen({ user, onAccepted, showToast }) {
  const [invitations, setInvitations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    clans.getPendingInvitations(user.id).then(data => { setInvitations(data); setLoading(false); });
  }, [user]);

  const handleRespond = async (inv, accept) => {
    try {
      await clans.respond(inv.id, accept);
      setInvitations(prev => prev.filter(i => i.id !== inv.id));
      if (accept) {
        showToast?.(`Bienvenue dans ${inv.clans?.name} !`);
        onAccepted?.();
      } else {
        showToast?.('Invitation refusée.');
      }
    } catch (e) {
      showToast?.(e.message);
    }
  };

  if (!user) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
      <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Connecte-toi pour voir tes invitations.</div>
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--surface-app)' }}>
      <div style={{ padding: '20px 20px 12px', background: 'var(--surface-card)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', margin: 0 }}>Invitations</h2>
        {invitations.length > 0 && (
          <span style={{ minWidth: 22, height: 22, padding: '0 6px', borderRadius: 99, background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'inline-grid', placeItems: 'center' }}>
            {invitations.length}
          </span>
        )}
      </div>
      {loading
        ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Chargement…</div>
        : invitations.length === 0
          ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Aucune invitation en attente</div>
            </div>
          )
          : invitations.map(inv => {
              const c = inv.clans;
              const expiresIn = Math.max(1, Math.ceil((new Date(inv.expires_at) - Date.now()) / (1000 * 60 * 60 * 24)));
              return (
                <div key={inv.id} style={{ margin: '10px 12px', padding: 16, background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--accent)', display: 'grid', placeItems: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {c?.logo_url ? <img src={c.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon n="shield" s={20} color="#fff" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{c?.name || 'Clan'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Expire dans {expiresIn} jour{expiresIn !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Btn variant="primary" full onClick={() => handleRespond(inv, true)}>Rejoindre</Btn>
                    <Btn variant="ghost" full onClick={() => handleRespond(inv, false)}>Refuser</Btn>
                  </div>
                </div>
              );
            })
      }
      <div style={{ height: 24 }} />
    </div>
  );
}

// ══════════════════════════════════════════
// BenchLeaderboardPanel — dans la fiche banc
// ══════════════════════════════════════════
export function BenchLeaderboardPanel({ benchId, userClanId }) {
  const [entries, setEntries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!benchId) return;
    setLoading(true);
    clans.getBenchLeaderboard(benchId).then(data => { setEntries(data); setLoading(false); });
  }, [benchId]);

  if (loading) return <div style={{ padding: '10px 0', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>Chargement…</div>;
  if (!entries.length) return (
    <div style={{ padding: '10px 0', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
      Aucun clan n'a encore visité ce banc 🌱
    </div>
  );

  return (
    <div>
      {entries.map((e, i) => {
        const c = e.clans;
        const isMe = c?.id === userClanId;
        return (
          <div key={e.clan_id} style={{
            display: 'flex', alignItems: 'center', gap: 9, padding: '8px 0',
            borderTop: i > 0 ? '1px solid var(--border-subtle)' : 'none',
            background: isMe ? 'var(--surface-accent-soft)' : 'transparent',
            borderRadius: isMe ? 'var(--radius-sm)' : 0,
            paddingLeft: isMe ? 6 : 0, paddingRight: isMe ? 6 : 0,
          }}>
            <span style={{ width: 22, textAlign: 'center', fontSize: 13, flexShrink: 0 }}>
              {i === 0 ? '👑' : `#${i + 1}`}
            </span>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--accent)', display: 'grid', placeItems: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {c?.logo_url ? <img src={c.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon n="shield" s={12} color="#fff" />}
            </div>
            <div style={{ flex: 1, minWidth: 0, fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c?.name || '?'}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--text-accent)', flexShrink: 0 }}>
              {(e.total_points || 0).toLocaleString('fr-FR')} pts
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════
// BenchPresenceWidget — temps réel (clan owner)
// ══════════════════════════════════════════
export function BenchPresenceWidget({ benchId, isOwner }) {
  const [count, setCount] = React.useState(null);

  React.useEffect(() => {
    if (!benchId || !isOwner) return;
    clans.getActiveSessions(benchId).then(setCount);

    const channel = supabase.channel(`bench-presence-${benchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bench_sessions',
        filter: `bench_id=eq.${benchId}`,
      }, () => clans.getActiveSessions(benchId).then(setCount))
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [benchId, isOwner]);

  if (!isOwner || count === null) return null;

  const active = count > 0;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
      borderRadius: 'var(--radius-md)',
      background: active ? 'rgba(22,163,74,0.08)' : 'var(--surface-sunken)',
      border: `1px solid ${active ? 'rgba(22,163,74,0.25)' : 'var(--border-subtle)'}`,
    }}>
      {active && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />}
      <Icon n="eye" s={13} color={active ? '#16a34a' : 'var(--text-muted)'} />
      <span style={{ fontSize: 12, fontWeight: 600, color: active ? '#16a34a' : 'var(--text-muted)' }}>
        {active
          ? `${count} personne${count > 1 ? 's' : ''} présente${count > 1 ? 's' : ''} — Territoire du clan`
          : 'Territoire du clan — Vide actuellement'}
      </span>
    </div>
  );
}
