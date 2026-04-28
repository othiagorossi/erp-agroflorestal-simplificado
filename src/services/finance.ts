import { supabase } from '@/lib/supabase/client'

export type FinanceRecord = {
  id: string
  user_id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  cost_center_type: string
  cost_center: string
  date: string
  created_at: string
}

export const getFinanceRecords = async () => {
  const { data, error } = await supabase
    .from('finance_records')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data as FinanceRecord[]
}

export const createFinanceRecord = async (
  record: Omit<FinanceRecord, 'id' | 'created_at' | 'user_id'>,
) => {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('finance_records')
    .insert([{ ...record, user_id: userData.user.id }])
    .select()
    .single()

  if (error) throw error
  return data as FinanceRecord
}

export const deleteFinanceRecord = async (id: string) => {
  const { error } = await supabase.from('finance_records').delete().eq('id', id)

  if (error) throw error
}
