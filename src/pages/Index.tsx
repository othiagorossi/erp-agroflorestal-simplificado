import { Map, Leaf, Target, ListTodo, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import useMainStore from '@/stores/main'

export default function Index() {
  const { metrics, activities, tasks } = useMainStore()
  const activeTasks = tasks.filter((t) => t.status !== 'done').length

  const kpis = [
    { title: 'Área Total (ha)', value: metrics.area, icon: Map, color: 'text-primary' },
    {
      title: 'Plantas Ativas',
      value: metrics.plants.toLocaleString('pt-BR'),
      icon: Leaf,
      color: 'text-accent',
    },
    { title: 'Carbono (CO2e t)', value: metrics.carbon, icon: Target, color: 'text-secondary' },
    { title: 'Tarefas Pendentes', value: activeTasks, icon: ListTodo, color: 'text-amber-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe a saúde do seu sistema agroflorestal.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card
            key={index}
            className="border-none shadow-elevation hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{kpi.title}</p>
                <h3 className="text-3xl font-bold tracking-tight">{kpi.value}</h3>
              </div>
              <div className={`p-3 rounded-full bg-muted/50 ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-elevation">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Calendário de Colheita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-4">
              {[
                { crop: 'Banana Prata', window: 'Jul - Ago', progress: 85, color: 'bg-amber-400' },
                { crop: 'Cacau CCN-51', window: 'Set - Nov', progress: 40, color: 'bg-primary' },
                {
                  crop: 'Palmito Pupunha',
                  window: 'Out - Dez',
                  progress: 20,
                  color: 'bg-secondary',
                },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.crop}</span>
                    <span className="text-muted-foreground">{item.window}</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl bg-muted/30 border border-dashed border-border p-8 flex flex-col items-center justify-center text-center">
              <Map className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground font-medium">Mapa de Lotes em processamento</p>
              <p className="text-xs text-muted-foreground mt-1">Integração com satélite pendente</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-elevation">
          <CardHeader>
            <CardTitle className="text-lg">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-snug">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-primary" asChild>
              <Link to="/tarefas">
                Ver todas tarefas <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
