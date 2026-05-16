import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { addWorkerRecord } from '@/services/workers'
import { createFinanceRecord } from '@/services/finance'

export function WorkerRecordDialog({
  stats,
  preSelectedWorkerId,
  initialTab = 'shift',
  open,
  onOpenChange,
  onSuccess,
}: {
  stats: any[]
  preSelectedWorkerId?: string | null
  initialTab?: 'shift' | 'payment'
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [workerId, setWorkerId] = useState<string>('')
  const [type, setType] = useState<'shift' | 'payment'>(initialTab)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [days, setDays] = useState('1')
  const [culture, setCulture] = useState('')
  const [paymentMode, setPaymentMode] = useState<'pending' | 'specific' | 'custom'>('pending')
  const [specificDays, setSpecificDays] = useState('1')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const workerStat = stats.find((w) => w.id === workerId)
  const pendingAmount = workerStat?.pendingAmount || 0

  useEffect(() => {
    if (open) {
      setType(initialTab)
      setDate(new Date().toISOString().split('T')[0])
      setDays('1')
      setCulture('')
      setPaymentMode('pending')
      setSpecificDays('1')

      const initialWorkerId = preSelectedWorkerId || ''
      setWorkerId(initialWorkerId)

      const initialWorkerStat = stats.find((w) => w.id === initialWorkerId)
      const initialPending = initialWorkerStat?.pendingAmount || 0

      if (initialTab === 'payment') {
        setAmount(initialPending.toString())
      } else {
        setAmount('')
      }
    }
  }, [open, initialTab, preSelectedWorkerId, stats])

  const handlePaymentModeChange = (val: 'pending' | 'specific' | 'custom') => {
    setPaymentMode(val)
    if (val === 'pending') setAmount(pendingAmount.toString())
    else if (val === 'specific')
      setAmount((Number(specificDays) * (workerStat?.daily_rate || 0)).toString())
    else setAmount('')
  }

  const handleSpecificDaysChange = (val: string) => {
    setSpecificDays(val)
    setAmount((Number(val) * (workerStat?.daily_rate || 0)).toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workerStat) {
      toast({ title: 'Atenção', description: 'Selecione um funcionário.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      if (type === 'shift') {
        if (!days) throw new Error('Informe os dias.')
        if (!culture) throw new Error('Informe a cultura trabalhada.')
        await addWorkerRecord({
          worker_id: workerStat.id,
          type: 'shift',
          date,
          days: Number(days),
          culture,
        })
        toast({ title: 'Sucesso', description: 'Diária registrada.' })
      } else {
        if (!amount || Number(amount) <= 0) throw new Error('Informe um valor válido.')

        await addWorkerRecord({
          worker_id: workerStat.id,
          type: 'payment',
          date,
          amount: Number(amount),
        })

        await createFinanceRecord({
          type: 'expense',
          amount: Number(amount),
          description: `Pagamento de funcionário: ${workerStat.name}`,
          cost_center_type: 'Mão de Obra',
          cost_center: 'Geral',
          date,
        })

        toast({
          title: 'Sucesso',
          description: 'Pagamento registrado e despesa lançada no controle.',
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: 'Atenção',
        description: error.message || 'Não foi possível registrar.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-2">
          <Button
            type="button"
            variant={type === 'shift' ? 'default' : 'outline'}
            onClick={() => {
              setType('shift')
              setAmount('')
            }}
            className="flex-1"
          >
            Diária de Trabalho
          </Button>
          <Button
            type="button"
            variant={type === 'payment' ? 'default' : 'outline'}
            onClick={() => {
              setType('payment')
              setPaymentMode('pending')
              setAmount(pendingAmount.toString())
            }}
            className="flex-1"
          >
            Pagamento
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!preSelectedWorkerId && (
            <div className="space-y-2">
              <Label>Funcionário</Label>
              <Select value={workerId} onValueChange={setWorkerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {stats.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {workerStat && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {type === 'shift' && (
                <>
                  <div className="space-y-2">
                    <Label>Cultura Trabalhada</Label>
                    <Select value={culture} onValueChange={setCulture}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cacau">Cacau</SelectItem>
                        <SelectItem value="Juçara">Juçara</SelectItem>
                        <SelectItem value="Aromáticas">Aromáticas</SelectItem>
                        <SelectItem value="Geral">Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Período Trabalhado</Label>
                    <Select value={days} onValueChange={setDays}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Período Integral (1 dia)</SelectItem>
                        <SelectItem value="0.5">Meio Período (0.5 dia)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Valor equivalente: R${' '}
                      {(Number(days) * (workerStat?.daily_rate || 0)).toFixed(2)}
                    </p>
                  </div>
                </>
              )}

              {type === 'payment' && (
                <>
                  <div className="space-y-2">
                    <Label>Modo de Pagamento</Label>
                    <Select value={paymentMode} onValueChange={handlePaymentModeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          Total Pendente (R$ {pendingAmount.toFixed(2)})
                        </SelectItem>
                        <SelectItem value="specific">
                          Diária Específica (Selecionar período)
                        </SelectItem>
                        <SelectItem value="custom">Outro Valor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMode === 'specific' && (
                    <div className="space-y-2">
                      <Label>Período Específico</Label>
                      <Select value={specificDays} onValueChange={handleSpecificDaysChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Período Integral</SelectItem>
                          <SelectItem value="0.5">Meio Período</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Valor do Pagamento (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value)
                        setPaymentMode('custom')
                      }}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Este valor será lançado nas suas despesas financeiras automaticamente.
                    </p>
                  </div>
                </>
              )}

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
