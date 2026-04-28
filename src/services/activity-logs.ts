import { supabase } from '@/lib/supabase/client'

export type ActivityLog = {
  id: string
  user_id: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  entity_type: string
  entity_id: string | null
  details: any
  created_at: string
  profiles?: {
    name: string | null
    email: string
  }
}

export const logActivity = async (
  action: ActivityLog['action'],
  entity_type: string,
  entity_id?: string,
  details?: any,
) => {
  try {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { error } = await supabase.from('activity_logs').insert({
      user_id: userData.user.id,
      action,
      entity_type,
      entity_id: entity_id || null,
      details: details || null,
    })

    if (error) {
      console.error('Error logging activity:', error)
    }
  } catch (error) {
    console.error('Error in logActivity:', error)
  }
}

export const getActivityLogs = async () => {
  const { data, error } = await supabase
    .from('activity_logs')
    .select(`
      *,
      profiles (
        name,
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return data as any as ActivityLog[]
}
