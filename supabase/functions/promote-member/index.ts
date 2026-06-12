import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: { user } } = await sb.auth.getUser(req.headers.get('Authorization')!.replace('Bearer ', ''))
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401, headers: cors })
  const { clan_id, target_user_id, new_role } = await req.json()
  const { data: caller } = await sb.from('clan_members').select('role').eq('clan_id', clan_id).eq('user_id', user.id).maybeSingle()
  if (!caller) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 403, headers: cors })
  const { data: target } = await sb.from('clan_members').select('role').eq('clan_id', clan_id).eq('user_id', target_user_id).maybeSingle()
  if (!target) return new Response(JSON.stringify({ error: 'Membre introuvable' }), { status: 404, headers: cors })
  if (target.role === 'chef') return new Response(JSON.stringify({ error: 'Impossible de modifier le rôle du chef' }), { status: 403, headers: cors })
  const allowed: Record<string, string[]> = { chef: ['sous_chef', 'admin', 'membre'], sous_chef: ['admin', 'membre'] }
  if (!allowed[caller.role]?.includes(new_role))
    return new Response(JSON.stringify({ error: 'Transition de rôle non autorisée' }), { status: 403, headers: cors })
  if (new_role === 'sous_chef')
    await sb.from('clan_members').update({ role: 'membre' }).eq('clan_id', clan_id).eq('role', 'sous_chef')
  await sb.from('clan_members').update({ role: new_role }).eq('clan_id', clan_id).eq('user_id', target_user_id)
  return new Response(JSON.stringify({ success: true }), { headers: { ...cors, 'Content-Type': 'application/json' } })
})
