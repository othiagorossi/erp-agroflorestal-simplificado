import { supabase } from '@/lib/supabase/client'

export type Profile = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  role: string
  created_at: string
}

export const getProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Profile[]
}

export const updateProfile = async (id: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

export const inviteUser = async (email: string, role: string) => {
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: { email, role },
  })

  if (error) throw error
  return data
}
