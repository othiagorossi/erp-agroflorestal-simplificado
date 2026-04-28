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
import { useToast } from '@/hooks/use-toast'
import { createFinanceRecord } from '@/services/finance'
import { COST_CENTERS } from '@/lib/constants'

export function DirectForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void
  onCancel: () => void
}) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    cost_center_type: '',
    cost_center: '',
    date: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.amount ||
      !formData.description ||
      !formData.cost_center_type ||
      !formData.cost_center
    ) {
      toast({
        title: 'Atenção',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      })
      return
    }

    try {
      await createFinanceRecord({
        type: formData.type,
        amount: Number(formData.amount),
        description: formData.description,
        cost_center_type: formData.cost_center_type,
        cost_center: formData.cost_center,
        date: formData.date,
      })
      toast({ title: 'Sucesso', description: 'Registro adicionado com sucesso.' })
      onSuccess()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o registro.',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select
            value={formData.type}
            onValueChange={(val: 'income' | 'expense') => setFormData({ ...formData, type: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Receita (+)</SelectItem>
              <SelectItem value="expense">Despesa (-)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Valor (R$)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Input
          placeholder="Ex: Venda de banana..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Data</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Classificação</Label>
        <Select
          value={formData.cost_center_type}
          onValueChange={(val) =>
            setFormData({ ...formData, cost_center_type: val, cost_center: '' })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(COST_CENTERS).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Centro de Custo</Label>
        <Select
          disabled={!formData.cost_center_type}
          value={formData.cost_center}
          onValueChange={(val) => setFormData({ ...formData, cost_center: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o setor..." />
          </SelectTrigger>
          <SelectContent>
            {formData.cost_center_type &&
              COST_CENTERS[formData.cost_center_type as keyof typeof COST_CENTERS].map((cc) => (
                <SelectItem key={cc} value={cc}>
                  {cc}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  )
}
