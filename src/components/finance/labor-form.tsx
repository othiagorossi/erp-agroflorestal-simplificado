import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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
import { useToast } from '@/hooks/use-toast'
import { createFinanceRecords } from '@/services/finance'
import { COST_CENTERS } from '@/lib/constants'

export function LaborForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void
  onCancel: () => void
}) {
  const { toast } = useToast()
  const [workerName, setWorkerName] = useState('')
  const [dailyRate, setDailyRate] = useState('')
  const [daysWorked, setDaysWorked] = useState('1')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [splits, setSplits] = useState([
    { id: crypto.randomUUID(), type: '', center: '', hours: '8' },
  ])

  const addSplit = () =>
    setSplits([...splits, { id: crypto.randomUUID(), type: '', center: '', hours: '' }])
  const removeSplit = (id: string) => setSplits(splits.filter((s) => s.id !== id))
  const updateSplit = (id: string, field: string, value: string) => {
    setSplits(splits.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !workerName ||
      !dailyRate ||
      !daysWorked ||
      splits.some((s) => !s.type || !s.center || !s.hours)
    ) {
      toast({ title: 'Atenção', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }

    const totalAmount = Number(dailyRate) * Number(daysWorked)
    const totalHours = splits.reduce((acc, curr) => acc + Number(curr.hours), 0)

    if (totalHours <= 0) {
      toast({
        title: 'Atenção',
        description: 'O total de horas deve ser maior que zero.',
        variant: 'destructive',
      })
      return
    }

    try {
      const records = splits.map((s) => {
        const proportion = Number(s.hours) / totalHours
        return {
          type: 'expense' as const,
          amount: totalAmount * proportion,
          description: `Mão de Obra: ${workerName} (${s.hours}h)`,
          cost_center_type: s.type,
          cost_center: s.center,
          date,
        }
      })
      await createFinanceRecords(records)
      toast({ title: 'Sucesso', description: 'Mão de obra registrada com sucesso.' })
      onSuccess()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar a mão de obra.',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nome do Trabalhador / Equipe</Label>
        <Input
          placeholder="Ex: João Silva..."
          value={workerName}
          onChange={(e) => setWorkerName(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Valor da Diária (R$)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={dailyRate}
            onChange={(e) => setDailyRate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Dias Trabalhados</Label>
          <Input
            type="number"
            step="0.5"
            min="0"
            value={daysWorked}
            onChange={(e) => setDaysWorked(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Data de Pagamento / Registro</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="space-y-3 pt-2 border-t">
        <div className="flex justify-between items-center">
          <Label>Alocação de Horas</Label>
          <span className="text-xs font-medium text-muted-foreground">
            Total: {splits.reduce((acc, curr) => acc + Number(curr.hours || 0), 0)}h
          </span>
        </div>
        {splits.map((s) => (
          <div key={s.id} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <Select
                value={s.type}
                onValueChange={(v) => {
                  updateSplit(s.id, 'type', v)
                  updateSplit(s.id, 'center', '')
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Classe..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(COST_CENTERS).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1">
              <Select
                disabled={!s.type}
                value={s.center}
                onValueChange={(v) => updateSplit(s.id, 'center', v)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Setor..." />
                </SelectTrigger>
                <SelectContent>
                  {s.type &&
                    COST_CENTERS[s.type as keyof typeof COST_CENTERS].map((cc) => (
                      <SelectItem key={cc} value={cc}>
                        {cc}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[70px] space-y-1">
              <Input
                type="number"
                className="h-9 text-xs"
                placeholder="Horas"
                value={s.hours}
                onChange={(e) => updateSplit(s.id, 'hours', e.target.value)}
              />
            </div>
            {splits.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() => removeSplit(s.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSplit}
          className="w-full mt-2 text-xs"
        >
          <Plus className="h-3 w-3 mr-2" /> Adicionar Setor
        </Button>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Mão de Obra</Button>
      </div>
    </form>
  )
}
