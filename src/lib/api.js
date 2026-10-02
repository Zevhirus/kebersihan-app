import { supabase } from './supabase'

const BUCKET = 'report-photos'

export const STATUS = {
  PENDING: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  APPROVED: { label: 'Disetujui Admin', cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
  IN_PROGRESS: { label: 'Dikerjakan OB', cls: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  COMPLETED: { label: 'Selesai', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  REJECTED: { label: 'Ditolak', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
}

// Upload foto ke Storage -> kembalikan URL publik
export async function uploadPhoto(file, userId, prefix) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${prefix}-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

// ALUR 1 — UMUM: kirim laporan (status PENDING)
export async function submitReport({ userId, location, description, file }) {
  const photo_before_url = await uploadPhoto(file, userId, 'before')
  const { error } = await supabase.from('reports').insert({
    user_id: userId, location, description, photo_before_url, status: 'PENDING',
  })
  if (error) throw error
}

export async function fetchMyReports(userId) {
  const { data, error } = await supabase.from('reports').select('*')
    .eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// ALUR 2 — ADMIN
export async function fetchAllReports() {
  const { data, error } = await supabase.from('reports').select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchObs() {
  const { data, error } = await supabase.from('profiles').select('user_id, full_name').eq('role', 'ob')
  if (error) throw error
  return data
}

// Approve + assign ke OB -> langsung IN_PROGRESS
export async function approveAndAssign(reportId, obUserId) {
  const { error } = await supabase.from('reports')
    .update({ status: 'IN_PROGRESS', assigned_ob_id: obUserId }).eq('id', reportId)
  if (error) throw error
}

export async function rejectReport(reportId) {
  const { error } = await supabase.from('reports').update({ status: 'REJECTED' }).eq('id', reportId)
  if (error) throw error
}

// ALUR 3 — OB
export async function fetchObTasks(obUserId) {
  const { data, error } = await supabase.from('reports').select('*')
    .eq('assigned_ob_id', obUserId).order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function completeTask({ reportId, userId, file, notes }) {
  const photo_after_url = await uploadPhoto(file, userId, 'after')
  const { error } = await supabase.from('reports')
    .update({ status: 'COMPLETED', photo_after_url, ob_notes: notes }).eq('id', reportId)
  if (error) throw error
}

// Realtime: panggil callback tiap ada perubahan di tabel reports
export function subscribeReports(onChange) {
  const ch = supabase.channel('reports-' + Math.random().toString(36).slice(2))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, onChange)
    .subscribe()
  return () => supabase.removeChannel(ch)
}
