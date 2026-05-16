import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  const [culture, setCulture] = useState('')
  const [period, setPeriod] = useState('')
  const [dailyRate, setDailyRate] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !culture || !period || !dailyRate) {
      toast({ title: 'Atenção', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      await createWorker({ name, culture, period, daily_rate: Number(dailyRate) })
      toast({ title: 'Sucesso', description: 'Funcionário cadastrado.' })
      setOpen(false)
      setName('')
      setCulture('')
      setPeriod('')
      setDailyRate('')
      onSuccess()
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível cadastrar.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Novo Funcionário
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
            <Label>Cultura de Trabalho</Label>
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
            <Label>Período</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Meio período">Meio período</SelectItem>
                <SelectItem value="Integral">Integral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Valor da Diária (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              placeholder="Ex: 100.00"
            />
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
