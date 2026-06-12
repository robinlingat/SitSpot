import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: { user } } = await sb.auth.getUser(req.headers.get('Authorization')!.replace('Bearer ', ''))
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401, headers: cors })
  const { clan_id } = await req.json()
  const { data: member } = await sb.from('clan_members').select('role').eq('clan_id', clan_id).eq('user_id', user.id).maybeSingle()
  if (!member) return new Response(JSON.stringify({ error: 'Vous n\'êtes pas membre de ce clan' }), { status: 404, headers: cors })
  if (member.role === 'chef')
    return new Response(JSON.stringify({ error: 'Le chef doit transférer son titre avant de quitter' }), { status: 400, headers: cors })
  await sb.from('clan_members').delete().eq('clan_id', clan_id).eq('user_id', user.id)
  return new Response(JSON.stringify({ success: true }), { headers: { ...cors, 'Content-Type': 'application/json' } })
})
