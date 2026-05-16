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
  worker,
  pendingAmount = 0,
  initialTab = 'shift',
  open,
  onOpenChange,
  onSuccess,
}: {
  worker: any
  pendingAmount?: number
  initialTab?: 'shift' | 'payment'
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [type, setType] = useState<'shift' | 'payment'>(initialTab)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [days, setDays] = useState('1')
  const [paymentMode, setPaymentMode] = useState<'pending' | 'specific' | 'custom'>('pending')
  const [specificDays, setSpecificDays] = useState('1')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setType(initialTab)
      setDate(new Date().toISOString().split('T')[0])
      setDays('1')
      setPaymentMode('pending')
      setSpecificDays('1')
      if (initialTab === 'payment') {
        setAmount(pendingAmount.toString())
      } else {
        setAmount('')
      }
    }
  }, [open, initialTab, pendingAmount])

  const handlePaymentModeChange = (val: 'pending' | 'specific' | 'custom') => {
    setPaymentMode(val)
    if (val === 'pending') setAmount(pendingAmount.toString())
    else if (val === 'specific')
      setAmount((Number(specificDays) * (worker?.daily_rate || 0)).toString())
    else setAmount('')
  }

  const handleSpecificDaysChange = (val: string) => {
    setSpecificDays(val)
    setAmount((Number(val) * (worker?.daily_rate || 0)).toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (type === 'shift') {
        if (!days) throw new Error('Informe os dias.')
        await addWorkerRecord({
          worker_id: worker.id,
          type: 'shift',
          date,
          days: Number(days),
        })
        toast({ title: 'Sucesso', description: 'Diária registrada.' })
      } else {
        if (!amount || Number(amount) <= 0) throw new Error('Informe um valor válido.')

        await addWorkerRecord({
          worker_id: worker.id,
          type: 'payment',
          date,
          amount: Number(amount),
        })

        await createFinanceRecord({
          type: 'expense',
          amount: Number(amount),
          description: `Pagamento de funcionário: ${worker.name}`,
          cost_center_type: 'Mão de Obra',
          cost_center: worker.culture,
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
          <DialogTitle>Lançamento - {worker?.name}</DialogTitle>
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
          <div className="space-y-2">
            <Label>Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          {type === 'shift' && (
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
                Valor equivalente: R$ {(Number(days) * (worker?.daily_rate || 0)).toFixed(2)}
              </p>
            </div>
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
                    <SelectItem value="specific">Diária Específica (Selecionar período)</SelectItem>
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
        </form>
      </DialogContent>
    </Dialog>
  )
}
