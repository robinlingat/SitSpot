import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: { user } } = await sb.auth.getUser(req.headers.get('Authorization')!.replace('Bearer ', ''))
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401, headers: cors })
  const { invitation_id, accept } = await req.json()
  const { data: inv } = await sb.from('clan_invitations').select('*').eq('id', invitation_id).eq('invited_user_id', user.id).eq('status', 'pending').maybeSingle()
  if (!inv) return new Response(JSON.stringify({ error: 'Invitation introuvable ou expirée' }), { status: 404, headers: cors })
  await sb.from('clan_invitations').update({ status: accept ? 'accepted' : 'declined', responded_at: new Date().toISOString() }).eq('id', invitation_id)
  if (accept) {
    const { data: alreadyMember } = await sb.from('clan_members').select('id').eq('user_id', user.id).maybeSingle()
    if (alreadyMember) return new Response(JSON.stringify({ error: 'Vous êtes déjà dans un clan' }), { status: 400, headers: cors })
    await sb.from('clan_members').insert({ clan_id: inv.clan_id, user_id: user.id, role: 'membre', invited_by: inv.invited_by })
  }
  return new Response(JSON.stringify({ success: true }), { headers: { ...cors, 'Content-Type': 'application/json' } })
})
