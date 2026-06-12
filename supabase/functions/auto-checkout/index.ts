import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

// CRON job : appeler toutes les 15 minutes depuis Supabase Dashboard → Cron Jobs
serve(async (_req) => {
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  const cutoff = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  const { data: staleSessions } = await sb
    .from('bench_sessions')
    .select('id, checked_in_at')
    .is('checked_out_at', null)
    .lt('checked_in_at', cutoff)

  if (!staleSessions?.length) return new Response(JSON.stringify({ processed: 0 }), { headers: cors })

  let processed = 0
  for (const s of staleSessions) {
    const dur = Math.min(Math.floor((Date.now() - new Date(s.checked_in_at).getTime()) / 60000), 240)
    await sb.from('bench_sessions').update({
      checked_out_at: new Date().toISOString(),
      duration_minutes: dur,
      points_awarded: dur,
      is_auto_checkout: true,
    }).eq('id', s.id)
    processed++
  }

  return new Response(JSON.stringify({ processed }), { headers: { ...cors, 'Content-Type': 'application/json' } })
})
