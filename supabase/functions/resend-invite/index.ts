import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Não autorizado: Token ausente')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Não autorizado: Sessão inválida')

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      throw new Error('Acesso negado: Apenas administradores podem reenviar convites')
    }

    const { email, role } = await req.json()

    if (!email) {
      throw new Error('O e-mail é obrigatório')
    }

    // Obter o usuário alvo para verificar o status
    const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers()
    if (usersError) throw new Error('Erro ao listar usuários: ' + usersError.message)

    const targetUser = usersData.users.find((u: any) => u.email === email)

    // Se o usuário não existir, realiza um convite normal
    if (!targetUser) {
      const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
        data: { role: role || 'viewer' },
        redirectTo: 'https://cacau4zero.goskip.app',
      })
      if (error) throw new Error('Erro ao convidar: ' + error.message)

      return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      })
    }

    // Se o usuário já existe, verificar se está ativo
    if (targetUser.last_sign_in_at || targetUser.email_confirmed_at) {
      throw new Error('Este usuário já aceitou o convite e está ativo.')
    }

    // Para "reenviar" no GoTrue, se o e-mail não foi entregue, excluímos a conta pendente e recriamos.
    // Isso é seguro pois usuários pendentes não possuem dados vinculados que não o profile.
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(targetUser.id)
    if (deleteError) throw new Error('Erro ao remover convite anterior: ' + deleteError.message)

    // Aguardar deleção em cascata (profiles vinculados)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Refazer o convite
    const { data, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { role: role || 'viewer' },
      redirectTo: 'https://cacau4zero.goskip.app',
    })

    if (inviteError) throw new Error('Erro ao reenviar convite: ' + inviteError.message)

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 400,
    })
  }
})
