import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchMyReports, submitReport, subscribeReports } from '../lib/api'
import { Empty, fmtDate, Modal, PhotoInput, ReportDetail, Shell, Spinner, StatusBadge } from '../components/ui'

const AREAS = ['Toilet', 'Ruang Kelas / Kerja', 'Koridor / Lobi', 'Kantin / Pantry', 'Halaman / Parkir', 'Lainnya']

export default function UmumDashboard() {
  const { user } = useAuth()
  const [reports, setReports] = useState(null)
  const [sel, setSel] = useState(null)
  const [form, setForm] = useState({ area: AREAS[0], room: '', description: '' })
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  const load = useCallback(() => fetchMyReports(user.id).then(setReports), [user.id])
  useEffect(() => { load(); return subscribeReports(load) }, [load])

  async function submit(e) {
    e.preventDefault()
    if (!file) return setMsg({ ok: false, t: 'Foto area kotor wajib diunggah.' })
    setBusy(true); setMsg(null)
    try {
      await submitReport({ userId: user.id, location: `${form.area} — ${form.room}`, description: form.description, file })
      setForm({ area: AREAS[0], room: '', description: '' }); setFile(null)
      setMsg({ ok: true, t: 'Laporan terkirim. Admin akan segera memeriksanya.' })
      load()
    } catch (err) { setMsg({ ok: false, t: err.message }) }
    setBusy(false)
  }

  return (
    <Shell title="Laporan kebersihan" subtitle="Kirim laporan baru dan pantau statusnya.">
      <div className="grid gap-6 lg:grid-cols-5">
        <form onSubmit={submit} className="card space-y-4 p-5 lg:col-span-2 lg:self-start">
          <h2 className="font-bold text-navy">Buat laporan</h2>
          <PhotoInput label="Foto area kotor" file={file} onChange={setFile} />
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Kategori area</label>
            <select className="input" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
              {AREAS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Lokasi / detail ruangan</label>
            <input className="input" required placeholder="Mis. Gedung B lantai 2, dekat tangga" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Keterangan keluhan</label>
            <textarea className="input min-h-24" required placeholder="Apa yang perlu dibersihkan?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          {msg && <p className={`rounded-xl p-3 text-sm ${msg.ok ? 'bg-mint text-emerald-800' : 'bg-rose-50 text-rose-700'}`}>{msg.t}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Mengirim…' : 'Kirim laporan'}</button>
        </form>

        <section className="card overflow-hidden lg:col-span-3">
          <h2 className="border-b border-navy/5 px-5 py-4 font-bold text-navy">Laporan saya</h2>
          {!reports ? <Spinner /> : reports.length === 0 ? <Empty>Belum ada laporan. Kirim laporan pertama Anda.</Empty> : (
            <ul className="divide-y divide-navy/5">
              {reports.map((r) => (
                <li key={r.id}>
                  <button onClick={() => setSel(r)} className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-mint/40">
                    <img src={r.photo_before_url} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{r.location}</p>
                      <p className="text-xs text-slate-500">{fmtDate(r.created_at)}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <Modal open={!!sel} onClose={() => setSel(null)} title="Detail laporan">{sel && <ReportDetail r={sel} />}</Modal>
    </Shell>
  )
}
