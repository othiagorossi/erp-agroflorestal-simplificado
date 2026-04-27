import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff, Leaf, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { Separator } from '@/components/ui/separator'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const { toast } = useToast()
  const { signIn, signUp, signInWithGoogle, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({ title: 'Atenção', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }

    setIsLoading(true)

    if (isSignUp) {
      const { error } = await signUp(email, password)
      if (error) {
        toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      } else {
        toast({
          title: 'Sucesso',
          description: 'Conta criada! Verifique seu e-mail ou faça login.',
        })
        setIsSignUp(false)
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        toast({ title: 'Erro', description: 'E-mail ou senha inválidos.', variant: 'destructive' })
      } else {
        toast({ title: 'Sucesso', description: 'Login realizado com sucesso.' })
      }
    }

    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      toast({ title: 'Erro', description: 'Falha ao conectar com Google.', variant: 'destructive' })
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display">
            {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta'}
          </CardTitle>
          <CardDescription>Acesse o sistema de gestão agroflorestal.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <img
                  src="https://img.usecurling.com/i?q=google&shape=fill&color=multicolor"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
              )}
              {isSignUp ? 'Cadastrar com Google' : 'Entrar com Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com e-mail
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isGoogleLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full mt-2" disabled={isLoading || isGoogleLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? 'Criar Conta' : 'Entrar no Sistema'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? 'Já tem uma conta? ' : 'Ainda não tem conta? '}
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={isLoading || isGoogleLoading}
            >
              {isSignUp ? 'Faça login' : 'Cadastre-se'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
