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

  const body = await req.json().catch(() => ({}))
  const { session_id } = body

  let q = sb.from('bench_sessions').select('id, checked_in_at, user_id').is('checked_out_at', null)
  if (session_id) q = q.eq('id', session_id)
  else q = q.eq('user_id', user.id)

  const { data: session } = await q.maybeSingle()
  if (!session) return new Response(JSON.stringify({ error: 'Aucune session active' }), { status: 404, headers: cors })
  if (session.user_id !== user.id) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 403, headers: cors })

  const dur = Math.min(Math.floor((Date.now() - new Date(session.checked_in_at).getTime()) / 60000), 240)

  const { error } = await sb.from('bench_sessions').update({
    checked_out_at: new Date().toISOString(),
    duration_minutes: dur,
    points_awarded: dur,
  }).eq('id', session.id)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors })

  return new Response(JSON.stringify({ duration_minutes: dur, points_awarded: dur }), {
    headers: { ...cors, 'Content-Type': 'application/json' }
  })
})
