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

async function unwrapFunctionError(error: any) {
  if (error && error.context && typeof error.context.json === 'function') {
    try {
      const errData = await error.context.json()
      if (errData && errData.error) {
        throw new Error(errData.error)
      }
    } catch (e) {
      // Ignora erro de parse JSON
    }
  }
  throw error
}

export const inviteUser = async (email: string, role: string) => {
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: { email, role },
  })

  if (error) await unwrapFunctionError(error)
  if (data?.error) throw new Error(data.error)
  return data
}

export const resendInvite = async (userId: string, email: string, role: string) => {
  const { data, error } = await supabase.functions.invoke('resend-invite', {
    body: { userId, email, role },
  })

  if (error) await unwrapFunctionError(error)
  if (data?.error) throw new Error(data.error)
  return data
}

export const adminUpdateUser = async (
  userId: string,
  updates: { name?: string; role?: string },
) => {
  const { data, error } = await supabase.functions.invoke('update-user', {
    body: { userId, ...updates },
  })

  if (error) await unwrapFunctionError(error)
  if (data?.error) throw new Error(data.error)
  return data
}

export const deleteUser = async (userId: string) => {
  const { data, error } = await supabase.functions.invoke('delete-user', {
    body: { userId },
  })

  if (error) await unwrapFunctionError(error)
  if (data?.error) throw new Error(data.error)
  return data
}
