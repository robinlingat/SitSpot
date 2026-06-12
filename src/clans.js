import { supabase } from './supabase';

async function invoke(fn, body) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const { data, error } = await supabase.functions.invoke(fn, {
    body,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (error) throw new Error(error.message || String(error));
  if (data?.error) throw new Error(data.error);
  return data;
}

export const clans = {
  create: (name, description, logo_url) => invoke('create-clan', { name, description, logo_url }),
  update: (clan_id, updates) => invoke('update-clan', { clan_id, ...updates }),
  dissolve: (clan_id) => invoke('dissolve-clan', { clan_id }),

  invite: (clan_id, username) => invoke('invite-member', { clan_id, username }),
  respond: (invitation_id, accept) => invoke('respond-invitation', { invitation_id, accept }),
  promote: (clan_id, target_user_id, new_role) => invoke('promote-member', { clan_id, target_user_id, new_role }),
  kick: (clan_id, target_user_id) => invoke('kick-member', { clan_id, target_user_id }),
  leave: (clan_id) => invoke('leave-clan', { clan_id }),
  transfer: (clan_id, target_user_id) => invoke('transfer-leadership', { clan_id, target_user_id }),

  checkin: (bench_id, lat, lng) => invoke('checkin', { bench_id, lat, lng }),
  checkout: (session_id) => invoke('checkout', session_id ? { session_id } : {}),

  async getMembership(user_id) {
    const { data } = await supabase
      .from('clan_members')
      .select('*, clans(*)')
      .eq('user_id', user_id)
      .maybeSingle();
    return data;
  },

  async getMembers(clan_id) {
    const { data } = await supabase
      .from('clan_members')
      .select('*, profiles(id, pseudo, avatar_url, name)')
      .eq('clan_id', clan_id)
      .order('joined_at');
    return data || [];
  },

  async getBenchLeaderboard(bench_id) {
    const { data } = await supabase
      .from('bench_clan_scores')
      .select('*, clans(id, name, logo_url)')
      .eq('bench_id', bench_id)
      .order('total_points', { ascending: false })
      .limit(10);
    return data || [];
  },

  async getGlobalLeaderboard() {
    const { data } = await supabase
      .from('clan_total_scores')
      .select('*, clans(id, name, logo_url, description)')
      .order('global_score', { ascending: false })
      .limit(50);
    return data || [];
  },

  async getOwnedBenches(clan_id) {
    const { data } = await supabase
      .from('bench_owners')
      .select('bench_id, total_points')
      .eq('clan_id', clan_id);
    return data || [];
  },

  async getPendingInvitations(user_id) {
    const { data } = await supabase
      .from('clan_invitations')
      .select('*, clans(id, name, logo_url)')
      .eq('invited_user_id', user_id)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString());
    return data || [];
  },

  async getActiveSessions(bench_id) {
    const { count } = await supabase
      .from('bench_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('bench_id', bench_id)
      .is('checked_out_at', null);
    return count || 0;
  },
};
