import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: { user } } = await sb.auth.getUser(req.headers.get('Authorization')!.replace('Bearer ', ''))
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401, headers: cors })
  const { clan_id, name, description, logo_url } = await req.json()
  const { data: member } = await sb.from('clan_members').select('role').eq('clan_id', clan_id).eq('user_id', user.id).maybeSingle()
  if (!member || !['chef', 'sous_chef'].includes(member.role))
    return new Response(JSON.stringify({ error: 'Permissions insuffisantes' }), { status: 403, headers: cors })
  const updates: Record<string, unknown> = {}
  if (name) updates.name = name.trim()
  if (description !== undefined) updates.description = description
  if (logo_url !== undefined) updates.logo_url = logo_url
  const { data, error } = await sb.from('clans').update(updates).eq('id', clan_id).select().single()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors })
  return new Response(JSON.stringify({ clan: data }), { headers: { ...cors, 'Content-Type': 'application/json' } })
})
