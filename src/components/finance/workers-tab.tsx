import { useState, useEffect } from 'react'
import {
  getWorkers,
  getAllWorkerRecords,
  deleteWorker,
  Worker,
  WorkerRecord,
} from '@/services/workers'
import { WorkerDialog } from './worker-dialog'
import { WorkerRecordDialog } from './worker-record-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, DollarSign, Calendar, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function WorkersTab() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [records, setRecords] = useState<WorkerRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorker, setSelectedWorker] = useState<any>(null)
  const [recordDialogOpen, setRecordDialogOpen] = useState(false)
  const [initialRecordTab, setInitialRecordTab] = useState<'shift' | 'payment'>('shift')
  const { toast } = useToast()

  const loadData = async () => {
    setLoading(true)
    try {
      const [wData, rData] = await Promise.all([getWorkers(), getAllWorkerRecords()])
      setWorkers(wData)
      setRecords(rData)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este funcionário?')) return
    try {
      await deleteWorker(id)
      toast({ title: 'Sucesso', description: 'Funcionário removido.' })
      loadData()
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível remover.', variant: 'destructive' })
    }
  }

  const handleAction = (w: any, type: 'shift' | 'payment') => {
    setSelectedWorker(w)
    setInitialRecordTab(type)
    setRecordDialogOpen(true)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const parts = dateStr.split('T')[0].split('-')
    if (parts.length !== 3) return dateStr
    const [y, m, d] = parts
    return `${d}/${m}/${y}`
  }

  const stats = workers.map((w) => {
    const wRecords = records.filter((r) => r.worker_id === w.id)
    const totalDays = wRecords
      .filter((r) => r.type === 'shift')
      .reduce((acc, curr) => acc + Number(curr.days || 0), 0)

    const payments = wRecords
      .filter((r) => r.type === 'payment')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const lastPayment = payments.length > 0 ? payments[0].date : null

    let daysSincePayment = null
    let pendingDays = totalDays

    if (lastPayment) {
      const last = new Date(lastPayment)
      const now = new Date()
      last.setHours(0, 0, 0, 0)
      now.setHours(0, 0, 0, 0)
      const diffTime = Math.abs(now.getTime() - last.getTime())
      daysSincePayment = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      pendingDays = wRecords
        .filter((r) => r.type === 'shift' && new Date(r.date) > last)
        .reduce((acc, curr) => acc + Number(curr.days || 0), 0)
    }

    const pendingAmount = pendingDays * (w.daily_rate || 0)

    return { ...w, totalDays, lastPayment, daysSincePayment, pendingDays, pendingAmount }
  })

  const exportToCSV = () => {
    const headers = [
      'Nome',
      'Cultura',
      'Período',
      'Diária (R$)',
      'Total de Dias Trabalhados',
      'Dias Pendentes',
      'Valor Pendente (R$)',
      'Último Pagamento',
    ]
    const rows = stats.map((w) => [
      `"${w.name}"`,
      `"${w.culture}"`,
      `"${w.period}"`,
      Number(w.daily_rate || 0).toFixed(2),
      w.totalDays,
      w.pendingDays,
      Number(w.pendingAmount || 0).toFixed(2),
      w.lastPayment ? formatDate(w.lastPayment) : 'Nenhum',
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'relatorio_funcionarios.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Gestão de Equipe</h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe produtividade e custos de mão de obra.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV} disabled={stats.length === 0}>
            <Download className="h-4 w-4 sm:mr-2" />{' '}
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <WorkerDialog onSuccess={loadData} />
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Detalhes</TableHead>
              <TableHead className="text-right">Dias Pendentes</TableHead>
              <TableHead className="text-right">Último Pagamento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : stats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum funcionário cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              stats.map((w) => (
                <TableRow
                  key={w.id}
                  className={cn({
                    'bg-destructive/5 hover:bg-destructive/10':
                      w.daysSincePayment !== null && w.daysSincePayment >= 30,
                    'bg-amber-500/5 hover:bg-amber-500/10':
                      w.daysSincePayment !== null &&
                      w.daysSincePayment >= 15 &&
                      w.daysSincePayment < 30,
                  })}
                >
                  <TableCell className="font-medium">{w.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 mb-1">
                      <Badge variant="outline">{w.culture}</Badge>
                      <Badge variant="secondary">{w.period}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Diária: R$ {Number(w.daily_rate || 0).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-lg font-semibold">{w.pendingDays}</div>
                    <div className="text-xs text-muted-foreground">
                      R$ {Number(w.pendingAmount || 0).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {w.daysSincePayment !== null ? (
                      <div className="flex flex-col items-end">
                        <span
                          className={cn('font-bold', {
                            'text-destructive': w.daysSincePayment >= 30,
                            'text-amber-500': w.daysSincePayment >= 15 && w.daysSincePayment < 30,
                            'text-green-600': w.daysSincePayment < 15,
                          })}
                        >
                          Há {w.daysSincePayment} dias
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(w.lastPayment!)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Nenhum registro</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        title="Registrar Diária"
                        onClick={() => handleAction(w, 'shift')}
                      >
                        <Calendar className="h-4 w-4 sm:mr-1" />{' '}
                        <span className="hidden sm:inline">Diária</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        title="Registrar Pagamento"
                        className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleAction(w, 'payment')}
                      >
                        <DollarSign className="h-4 w-4 sm:mr-1" />{' '}
                        <span className="hidden sm:inline">Pagar</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleDelete(w.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedWorker && (
        <WorkerRecordDialog
          worker={selectedWorker}
          pendingAmount={selectedWorker.pendingAmount}
          initialTab={initialRecordTab}
          open={recordDialogOpen}
          onOpenChange={setRecordDialogOpen}
          onSuccess={loadData}
        />
      )}
    </div>
  )
}
