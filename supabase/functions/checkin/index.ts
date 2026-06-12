import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: { user } } = await sb.auth.getUser(req.headers.get('Authorization')!.replace('Bearer ', ''))
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401, headers: cors })

  const { bench_id, lat, lng } = await req.json()
  if (!bench_id) return new Response(JSON.stringify({ error: 'bench_id requis' }), { status: 400, headers: cors })

  const { data: membership } = await sb.from('clan_members').select('clan_id, clans(is_dissolved)').eq('user_id', user.id).maybeSingle()
  if (!membership || (membership.clans as any)?.is_dissolved)
    return new Response(JSON.stringify({ error: 'Vous devez être membre d\'un clan actif' }), { status: 403, headers: cors })

  // Clôturer toute session active
  const { data: existing } = await sb.from('bench_sessions').select('id, checked_in_at').eq('user_id', user.id).is('checked_out_at', null).maybeSingle()
  if (existing) {
    const dur = Math.min(Math.floor((Date.now() - new Date(existing.checked_in_at).getTime()) / 60000), 240)
    await sb.from('bench_sessions').update({ checked_out_at: new Date().toISOString(), duration_minutes: dur, points_awarded: dur, is_auto_checkout: true }).eq('id', existing.id)
  }

  const { data: session, error } = await sb.from('bench_sessions')
    .insert({ bench_id, user_id: user.id, clan_id: membership.clan_id, lat_checkin: lat, lng_checkin: lng })
    .select('id, checked_in_at').single()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors })

  return new Response(JSON.stringify({ session_id: session.id, checked_in_at: session.checked_in_at }), {
    headers: { ...cors, 'Content-Type': 'application/json' }
  })
})
