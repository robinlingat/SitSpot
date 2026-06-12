import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: { user } } = await sb.auth.getUser(req.headers.get('Authorization')!.replace('Bearer ', ''))
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401, headers: cors })
  const { clan_id, username } = await req.json()
  const { data: inviter } = await sb.from('clan_members').select('role').eq('clan_id', clan_id).eq('user_id', user.id).maybeSingle()
  if (!inviter || !['chef', 'sous_chef', 'admin'].includes(inviter.role))
    return new Response(JSON.stringify({ error: 'Permissions insuffisantes' }), { status: 403, headers: cors })
  const { data: target } = await sb.from('profiles').select('id').eq('pseudo', username).maybeSingle()
  if (!target) return new Response(JSON.stringify({ error: 'Utilisateur introuvable' }), { status: 404, headers: cors })
  const { data: existingMember } = await sb.from('clan_members').select('id').eq('user_id', target.id).maybeSingle()
  if (existingMember) return new Response(JSON.stringify({ error: 'Cet utilisateur est déjà dans un clan' }), { status: 400, headers: cors })
  const { error } = await sb.from('clan_invitations').insert({ clan_id, invited_user_id: target.id, invited_by: user.id })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors })
  return new Response(JSON.stringify({ success: true }), { headers: { ...cors, 'Content-Type': 'application/json' } })
})
