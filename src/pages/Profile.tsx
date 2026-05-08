import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import {
  getProfiles,
  updateProfile,
  inviteUser,
  resendInvite,
  deleteUser,
  Profile,
} from '@/services/profiles'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Loader2, UserPlus, MoreHorizontal, Mail, Trash } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('viewer')
  const [inviting, setInviting] = useState(false)

  const myProfile = profiles.find((p) => p.id === user?.id)

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      const data = await getProfiles()
      setProfiles(data)
      const current = data.find((p) => p.id === user?.id)
      if (current && current.name) setName(current.name)
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar perfis',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [user?.id])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setSaving(true)
      await updateProfile(user.id, { name })
      toast({ title: 'Perfil atualizado', description: 'Suas informações foram salvas.' })
      fetchProfiles()
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setInviting(true)
      await inviteUser(inviteEmail, inviteRole)
      toast({ title: 'Convite enviado', description: `Um e-mail foi enviado para ${inviteEmail}.` })
      setIsInviteOpen(false)
      setInviteEmail('')
      setInviteRole('viewer')
      fetchProfiles()
    } catch (error: any) {
      toast({ title: 'Erro ao convidar', description: error.message, variant: 'destructive' })
    } finally {
      setInviting(false)
    }
  }

  const handleResendInvite = async (email: string, role: string) => {
    try {
      await resendInvite(email, role)
      toast({
        title: 'Convite reenviado',
        description: `Um novo e-mail foi enviado para ${email}.`,
      })
      fetchProfiles()
    } catch (error: any) {
      if (
        error.message?.includes('already') ||
        error.message?.includes('registered') ||
        error.message?.includes('ativo')
      ) {
        toast({ title: 'Aviso', description: 'Este usuário já aceitou o convite e está ativo.' })
      } else {
        toast({ title: 'Erro ao reenviar', description: error.message, variant: 'destructive' })
      }
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.'))
      return

    try {
      await deleteUser(userId)
      toast({ title: 'Usuário removido', description: 'O usuário foi removido com sucesso.' })
      fetchProfiles()
    } catch (error: any) {
      toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' })
    }
  }

  const isAdmin = myProfile?.role === 'admin'

  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie seu perfil e os membros da sua equipe agroflorestal.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
          <TabsTrigger value="team">Equipe e Permissões</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize seus dados básicos de cadastro.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" value={user?.email || ''} disabled />
                  <p className="text-xs text-muted-foreground">
                    O e-mail não pode ser alterado por aqui.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João da Silva"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nível de Acesso</Label>
                  <div>
                    <Badge variant={myProfile?.role === 'admin' ? 'default' : 'secondary'}>
                      {myProfile?.role === 'admin' ? 'Administrador' : 'Visualizador'}
                    </Badge>
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Membros da Equipe</CardTitle>
                <CardDescription>
                  Gerencie quem tem acesso ao sistema do seu empreendimento.
                </CardDescription>
              </div>
              {isAdmin && (
                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" /> Convidar Membro
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Convidar para a Equipe</DialogTitle>
                      <DialogDescription>
                        Envie um e-mail de convite para que um novo membro possa acessar a
                        plataforma.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInviteUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="invite-email">E-mail</Label>
                        <Input
                          id="invite-email"
                          type="email"
                          required
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="agronomo@exemplo.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="invite-role">Permissão</Label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um nível" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador (Acesso Total)</SelectItem>
                            <SelectItem value="viewer">Visualizador (Apenas Leitura)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsInviteOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={inviting}>
                          {inviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Enviar Convite
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Permissão</TableHead>
                    <TableHead>Data de Entrada</TableHead>
                    {isAdmin && <TableHead className="text-right">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{profile.name || 'Sem nome'}</span>
                          {!profile.name && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
                            >
                              Pendente
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                          {profile.role === 'admin' ? 'Administrador' : 'Visualizador'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          {profile.id !== user?.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleResendInvite(profile.email, profile.role)}
                                >
                                  <Mail className="mr-2 h-4 w-4" />
                                  Reenviar Convite
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(profile.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Remover Usuário
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {profiles.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 5 : 4}
                        className="text-center text-muted-foreground py-6"
                      >
                        Nenhum membro encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
