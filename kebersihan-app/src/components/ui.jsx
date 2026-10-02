import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { STATUS } from '../lib/api'

export const fmtDate = (d) =>
  new Date(d).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export function Logo({ className = 'h-9 w-9' }) {
  return (
    <div className={`grid place-items-center rounded-xl bg-brand text-white shadow-lift ${className}`}>
      <svg viewBox="0 0 24 24" className="h-[60%] w-[60%]" fill="none">
        <path d="M12 2.5c3.2 4 6 6.9 6 10.6a6 6 0 1 1-12 0C6 9.4 8.8 6.5 12 2.5Z" fill="currentColor" />
        <path d="M12 10l.9 2.1L15 13l-2.1.9L12 16l-.9-2.1L9 13l2.1-.9L12 10Z" fill="#D9F46A" />
      </svg>
    </div>
  )
}

export function Spinner({ full }) {
  return (
    <div className={full ? 'grid min-h-screen place-items-center' : 'grid place-items-center py-12'}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-mint border-t-brand" />
    </div>
  )
}

export function StatusBadge({ status }) {
  const s = STATUS[status]
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />{s.label}
    </span>
  )
}

const ROLE_LABEL = { umum: 'Pelapor', admin: 'Admin', ob: 'Petugas OB' }

export function Shell({ title, subtitle, children }) {
  const { profile, signOut } = useAuth()
  const initial = (profile?.full_name || '?').trim().charAt(0).toUpperCase()
  return (
    <div className="min-h-screen">
      <header className="sticky top-3 z-30 mx-auto mt-3 max-w-6xl px-3">
        <div className="flex items-center justify-between rounded-full bg-white/80 py-2 pl-3 pr-2 shadow-soft ring-1 ring-navy/5 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <Logo />
            <p className="font-display text-lg font-bold leading-none text-navy">Lapor Bersih</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full bg-mint py-1 pl-1 pr-3 sm:flex">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-navy text-xs font-bold text-lime">{initial}</span>
              <span className="text-sm font-semibold text-navy">{profile?.full_name}</span>
              <span className="text-xs text-brand">{ROLE_LABEL[profile?.role]}</span>
            </div>
            <button onClick={signOut} className="btn-ghost !py-2">Keluar</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <div className="mb-8 animate-rise">
          <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1.5 text-slate-500">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  )
}

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-navy/50 p-0 backdrop-blur-md sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl animate-pop overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl sm:rounded-[2rem]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <h2 className="text-xl font-bold text-navy">{title}</h2>
          <button onClick={onClose} aria-label="Tutup" className="grid h-8 w-8 place-items-center rounded-full bg-mint text-slate-500 transition hover:bg-navy hover:text-white">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function StatCard({ label, value, tone = 'text-navy' }) {
  return (
    <div className="card p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 font-display text-4xl font-extrabold tracking-tight ${tone}`}>{value}</p>
    </div>
  )
}

export function PhotoBox({ src, label, tone }) {
  return (
    <figure>
      <figcaption className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${tone === 'after' ? 'bg-lime text-navy' : 'bg-navy/5 text-slate-600'}`}>{label}</figcaption>
      {src ? (
        <a href={src} target="_blank" rel="noreferrer">
          <img src={src} alt={label} className="aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-navy/10 transition hover:opacity-90" />
        </a>
      ) : (
        <div className="grid aspect-[4/3] place-items-center rounded-2xl bg-mint/60 text-xs text-slate-400 ring-1 ring-dashed ring-brand/30">Belum ada foto</div>
      )}
    </figure>
  )
}

// Detail laporan + perbandingan Before/After — dipakai semua role
export function ReportDetail({ r }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <PhotoBox src={r.photo_before_url} label="Sebelum" />
        <PhotoBox src={r.photo_after_url} label="Sesudah" tone="after" />
      </div>
      <dl className="grid gap-4 rounded-2xl bg-surface p-4 text-sm sm:grid-cols-2">
        <div><dt className="text-slate-500">Lokasi</dt><dd className="font-semibold text-navy">{r.location}</dd></div>
        <div><dt className="text-slate-500">Status</dt><dd className="mt-0.5"><StatusBadge status={r.status} /></dd></div>
        <div className="sm:col-span-2"><dt className="text-slate-500">Keterangan pelapor</dt><dd>{r.description}</dd></div>
        {r.ob_notes && <div className="sm:col-span-2"><dt className="text-slate-500">Catatan petugas</dt><dd>{r.ob_notes}</dd></div>}
        <div><dt className="text-slate-500">Dilaporkan</dt><dd>{fmtDate(r.created_at)}</dd></div>
        <div><dt className="text-slate-500">Diperbarui</dt><dd>{fmtDate(r.updated_at)}</dd></div>
      </dl>
    </div>
  )
}

export function PhotoInput({ file, onChange, label }) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    if (!file) return setUrl(null)
    const u = URL.createObjectURL(file)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [file])
  return (
    <label className="block cursor-pointer">
      <span className="mb-1.5 block text-sm font-semibold text-navy">{label}</span>
      <div className="grid min-h-40 place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-brand/30 bg-mint/50 text-sm text-slate-500 transition hover:border-brand hover:bg-mint">
        {url ? <img src={url} alt="Pratinjau" className="max-h-64 w-full object-cover" /> : (
          <span className="flex flex-col items-center gap-2">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-xl shadow-soft">📷</span>
            Ketuk untuk memilih atau memotret foto
          </span>
        )}
      </div>
      <input type="file" accept="image/*" className="sr-only" onChange={(e) => onChange(e.target.files?.[0] || null)} />
    </label>
  )
}

export const Empty = ({ children }) => (
  <div className="py-12 text-center text-sm text-slate-500">{children}</div>
)
