import { supabase } from '@/lib/supabase/client'
import { logActivity } from './activity-logs'

export type Worker = {
  id: string
  user_id: string
  name: string
  culture?: string
  period?: string
  daily_rate: number
  created_at: string
}

export type WorkerRecord = {
  id: string
  worker_id: string
  user_id: string
  type: 'shift' | 'payment'
  date: string
  days?: number
  amount?: number
  culture?: string
  created_at: string
}

export const getWorkers = async () => {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data as Worker[]
}

export const createWorker = async (worker: Omit<Worker, 'id' | 'created_at' | 'user_id'>) => {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('workers')
    .insert([{ ...worker, user_id: userData.user.id }])
    .select()
    .single()

  if (error) throw error
  if (data) {
    await logActivity('CREATE', 'worker', data.id, { name: data.name })
  }
  return data as Worker
}

export const deleteWorker = async (id: string) => {
  const { error } = await supabase.from('workers').delete().eq('id', id)
  if (error) throw error
  await logActivity('DELETE', 'worker', id)
}

export const getAllWorkerRecords = async () => {
  const { data, error } = await supabase
    .from('worker_records')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data as WorkerRecord[]
}

export const addWorkerRecord = async (
  record: Omit<WorkerRecord, 'id' | 'created_at' | 'user_id'>,
) => {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('worker_records')
    .insert([{ ...record, user_id: userData.user.id }])
    .select()
    .single()

  if (error) throw error
  if (data) {
    await logActivity('CREATE', 'worker_record', data.id, { type: data.type, date: data.date })
  }
  return data as WorkerRecord
}
