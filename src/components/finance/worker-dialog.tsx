import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { createWorker } from '@/services/workers'
import { Plus } from 'lucide-react'

export function WorkerDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [dailyRate, setDailyRate] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !dailyRate) {
      toast({ title: 'Atenção', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      await createWorker({ name, daily_rate: Number(dailyRate) })
      toast({ title: 'Sucesso', description: 'Funcionário cadastrado.' })
      setOpen(false)
      setName('')
      setDailyRate('')
      onSuccess()
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error?.message || 'Não foi possível cadastrar.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 sm:mr-2" />{' '}
          <span className="hidden sm:inline">Novo Funcionário</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Funcionário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
            />
          </div>
          <div className="space-y-2">
            <Label>Valor da Diária Base (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              placeholder="Ex: 100.00"
            />
            <p className="text-xs text-muted-foreground">
              Este valor será usado como base para os cálculos de diárias.
            </p>
          </div>
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
