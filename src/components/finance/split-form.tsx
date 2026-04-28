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

export function SplitForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void
  onCancel: () => void
}) {
  const { toast } = useToast()
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [total, setTotal] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [splits, setSplits] = useState([
    { id: crypto.randomUUID(), type: '', center: '', percentage: '100' },
  ])

  const addSplit = () =>
    setSplits([...splits, { id: crypto.randomUUID(), type: '', center: '', percentage: '' }])
  const removeSplit = (id: string) => setSplits(splits.filter((s) => s.id !== id))
  const updateSplit = (id: string, field: string, value: string) => {
    setSplits(splits.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!total || !description || splits.some((s) => !s.type || !s.center || !s.percentage)) {
      toast({
        title: 'Atenção',
        description: 'Preencha todos os campos e setores.',
        variant: 'destructive',
      })
      return
    }

    const sum = splits.reduce((acc, curr) => acc + Number(curr.percentage), 0)
    if (Math.abs(sum - 100) > 0.01) {
      toast({
        title: 'Atenção',
        description: 'A soma das porcentagens deve ser exatamente 100%.',
        variant: 'destructive',
      })
      return
    }

    try {
      const records = splits.map((s) => ({
        type,
        amount: (Number(total) * Number(s.percentage)) / 100,
        description: `${description} (Rateio ${s.percentage}%)`,
        cost_center_type: s.type,
        cost_center: s.center,
        date,
      }))
      await createFinanceRecords(records)
      toast({ title: 'Sucesso', description: 'Rateio registrado com sucesso.' })
      onSuccess()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar o rateio.',
        variant: 'destructive',
      })
    }
  }

  const currentTotal = splits.reduce((acc, curr) => acc + Number(curr.percentage || 0), 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select value={type} onValueChange={(val: 'income' | 'expense') => setType(val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Despesa (-)</SelectItem>
              <SelectItem value="income">Receita (+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Valor Total Global (R$)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Descrição da Despesa Global</Label>
        <Input
          placeholder="Ex: Compra de Diesel..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Data</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="space-y-3 pt-2 border-t">
        <div className="flex justify-between items-center">
          <Label>Centros de Custo (Rateio em %)</Label>
          <span
            className={`text-xs font-medium ${currentTotal !== 100 ? 'text-destructive' : 'text-green-600'}`}
          >
            Total: {currentTotal}%
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
                placeholder="%"
                value={s.percentage}
                onChange={(e) => updateSplit(s.id, 'percentage', e.target.value)}
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
          <Plus className="h-3 w-3 mr-2" /> Adicionar Centro de Custo
        </Button>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={currentTotal !== 100}>
          Salvar Rateio
        </Button>
      </div>
    </form>
  )
}
