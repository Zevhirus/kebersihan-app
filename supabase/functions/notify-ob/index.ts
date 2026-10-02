// Kirim WhatsApp ke OB lewat Fonnte saat laporan ditugaskan.
// Secrets: FONNTE_TOKEN, WEBHOOK_SECRET, APP_URL (opsional)
import { createClient } from 'npm:@supabase/supabase-js@2'

const normalize = (p: string) => {
  const d = p.replace(/\D/g, '')
  return d.startsWith('0') ? '62' + d.slice(1) : d
}

Deno.serve(async (req) => {
  if (req.headers.get('x-webhook-secret') !== Deno.env.get('WEBHOOK_SECRET')) {
    return new Response('forbidden', { status: 403 })
  }
  const { record: r } = await req.json()
  if (!r?.assigned_ob_id) return Response.json({ skipped: 'no OB assigned' })

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: ob } = await db.from('profiles').select('full_name, phone').eq('user_id', r.assigned_ob_id).single()
  if (!ob?.phone) return Response.json({ skipped: 'OB belum punya nomor WA' })

  const link = Deno.env.get('APP_URL') ? `\n\nBuka tugas: ${Deno.env.get('APP_URL')}/ob` : ''
  const message =
    `Halo ${ob.full_name || 'Petugas'}, ada tugas kebersihan baru untuk Anda.\n\n` +
    `Lokasi: ${r.location}\nKeterangan: ${r.description}\n\nFoto: ${r.photo_before_url}${link}`

  const form = new FormData()
  form.append('target', normalize(ob.phone))
  form.append('message', message)

  const res = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { Authorization: Deno.env.get('FONNTE_TOKEN')! },
    body: form,
  })
  const out = await res.json().catch(() => ({}))
  if (!res.ok || out.status === false) console.error('Fonnte gagal:', out)
  return Response.json({ sent: res.ok && out.status !== false, detail: out })
})
