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

  const { data: existing } = await sb.from('clan_members').select('id').eq('user_id', user.id).maybeSingle()
  if (existing) return new Response(JSON.stringify({ error: 'Vous êtes déjà membre d\'un clan' }), { status: 400, headers: cors })

  const { name, description, logo_url } = await req.json()
  if (!name || name.trim().length < 3 || name.trim().length > 30)
    return new Response(JSON.stringify({ error: 'Le nom doit faire entre 3 et 30 caractères' }), { status: 400, headers: cors })

  const { data: clan, error } = await sb.from('clans').insert({
    name: name.trim(),
    description: description?.trim() || null,
    logo_url: logo_url || null,
    created_by: user.id,
  }).select().single()

  if (error) {
    console.error('insert clans error:', JSON.stringify(error))
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors })
  }

  await sb.from('clan_members').insert({ clan_id: clan.id, user_id: user.id, role: 'chef' })

  return new Response(JSON.stringify({ clan }), { headers: { ...cors, 'Content-Type': 'application/json' } })
})
