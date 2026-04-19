import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error('Erro 404: O usuário tentou acessar uma rota inexistente:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-8xl font-display font-bold text-primary">404</h1>
        <p className="text-2xl font-medium text-foreground">Página não encontrada</p>
        <p className="text-muted-foreground max-w-md mx-auto pb-4">
          A página que você está procurando pode ter sido removida, teve seu nome alterado ou está
          temporariamente indisponível no sistema.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  )
}

export default NotFound
