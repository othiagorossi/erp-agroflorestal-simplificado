import { useEffect, useState } from 'react'
import { getActivityLogs, ActivityLog } from '@/services/activity-logs'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, PlusCircle, Trash2, Edit2, Activity } from 'lucide-react'

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      const data = await getActivityLogs()
      setLogs(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <PlusCircle className="h-4 w-4 text-emerald-500" />
      case 'DELETE':
        return <Trash2 className="h-4 w-4 text-destructive" />
      case 'UPDATE':
        return <Edit2 className="h-4 w-4 text-amber-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const getActionText = (log: ActivityLog) => {
    const entityName = log.entity_type === 'finance_record' ? 'lançamento financeiro' : 'tarefa'

    switch (log.action) {
      case 'CREATE':
        return `criou um(a) ${entityName}`
      case 'DELETE':
        return `excluiu um(a) ${entityName}`
      case 'UPDATE':
        return `atualizou um(a) ${entityName}`
      default:
        return `modificou um(a) ${entityName}`
    }
  }

  const formatDetails = (details: any) => {
    if (!details) return null

    if (details.description && details.amount) {
      return `${details.description} (R$ ${details.amount})`
    }

    if (details.title) {
      return details.title
    }

    if (details.status) {
      const statusMap: Record<string, string> = {
        todo: 'A Fazer',
        'in-progress': 'Em Andamento',
        done: 'Concluído',
      }
      return `Novo status: ${statusMap[details.status] || details.status}`
    }

    return JSON.stringify(details)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Histórico de Atividades</h1>
        <p className="text-muted-foreground mt-1">Acompanhe as ações realizadas no sistema.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">Nenhuma atividade registrada</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
              As ações realizadas no sistema aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative pl-6 border-l border-border space-y-8 mt-8">
          {logs.map((log) => (
            <div key={log.id} className="relative">
              <div className="absolute -left-[35px] bg-background p-1.5 rounded-full border border-border shadow-sm">
                {getActionIcon(log.action)}
              </div>
              <Card className="shadow-sm border-border/50 transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      {log.profiles?.name || log.profiles?.email || 'Usuário'}
                    </span>
                    <time className="text-xs text-muted-foreground font-medium bg-muted/60 px-2.5 py-1 rounded-md">
                      {format(new Date(log.created_at), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                    </time>
                  </div>
                  <p className="text-sm text-foreground mb-1">{getActionText(log)}</p>
                  {log.details && (
                    <div className="mt-3 text-sm bg-muted/40 p-3 rounded-md border border-border/40 text-muted-foreground">
                      {formatDetails(log.details)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
