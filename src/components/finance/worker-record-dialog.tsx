import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { addWorkerRecord } from '@/services/workers'
import { createFinanceRecord } from '@/services/finance'

export function WorkerRecordDialog({
  worker,
  initialTab = 'shift',
  open,
  onOpenChange,
  onSuccess,
}: {
  worker: any
  initialTab?: 'shift' | 'payment'
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [type, setType] = useState<'shift' | 'payment'>(initialTab)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [days, setDays] = useState('1')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setType(initialTab)
      setDate(new Date().toISOString().split('T')[0])
      setDays('1')
      setAmount('')
    }
  }, [open, initialTab])

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
        if (!amount) throw new Error('Informe o valor.')

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
          description: 'Pagamento registrado também no controle financeiro.',
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
            onClick={() => setType('shift')}
            className="flex-1"
          >
            Diária de Trabalho
          </Button>
          <Button
            type="button"
            variant={type === 'payment' ? 'default' : 'outline'}
            onClick={() => setType('payment')}
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
              <Label>Dias Trabalhados</Label>
              <Input
                type="number"
                step="0.5"
                min="0"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Utilize 0.5 para meio período.</p>
            </div>
          )}

          {type === 'payment' && (
            <div className="space-y-2">
              <Label>Valor do Pagamento (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Este valor será lançado nas suas despesas financeiras automaticamente.
              </p>
            </div>
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
