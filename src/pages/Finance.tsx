import { useState, useEffect } from 'react'
import { Plus, ArrowUpRight, ArrowDownRight, Wallet, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import {
  getFinanceRecords,
  createFinanceRecord,
  deleteFinanceRecord,
  FinanceRecord,
} from '@/services/finance'

const costCenters = {
  Operacional: ['Setor Agrícola', 'Setor Florestal', 'Setor de Frutíferas', 'Setor Pecuário'],
  Apoio: ['Administrativo', 'Maquinário e Manutenção', 'Infraestrutura'],
  Investimento: ['Implantação', 'Melhorias de Longo Prazo'],
}

export default function Finance() {
  const [records, setRecords] = useState<FinanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    cost_center_type: '',
    cost_center: '',
    date: new Date().toISOString().split('T')[0],
  })

  const loadRecords = async () => {
    try {
      const data = await getFinanceRecords()
      setRecords(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os registros financeiros.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [])

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
      setIsOpen(false)
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        cost_center_type: '',
        cost_center: '',
        date: new Date().toISOString().split('T')[0],
      })
      loadRecords()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o registro.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFinanceRecord(id)
      toast({ title: 'Sucesso', description: 'Registro removido.' })
      loadRecords()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o registro.',
        variant: 'destructive',
      })
    }
  }

  const income = records
    .filter((r) => r.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0)
  const expense = records
    .filter((r) => r.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0)
  const balance = income - expense

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Controle Financeiro</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de receitas e despesas por centro de custo.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 shadow-elevation">
              <Plus className="mr-2 h-4 w-4" />
              Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Lançamento</DialogTitle>
              <DialogDescription>
                Registre uma nova transação separando pelo centro de custo correto.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Lançamento</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val: 'income' | 'expense') =>
                      setFormData({ ...formData, type: val })
                    }
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
                  placeholder="Ex: Venda de banana, Compra de adubo..."
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
                <Label>Classificação (Tipo de Custo)</Label>
                <Select
                  value={formData.cost_center_type}
                  onValueChange={(val) =>
                    setFormData({ ...formData, cost_center_type: val, cost_center: '' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(costCenters).map((type) => (
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
                      costCenters[formData.cost_center_type as keyof typeof costCenters].map(
                        (cc) => (
                          <SelectItem key={cc} value={cc}>
                            {cc}
                          </SelectItem>
                        ),
                      )}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Lançamento</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-none shadow-elevation hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Receitas</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(income)}</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-full dark:bg-green-900/30">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-elevation hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Despesas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(expense)}</p>
              </div>
              <div className="p-3 bg-red-100 text-red-600 rounded-full dark:bg-red-900/30">
                <ArrowDownRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-elevation hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Saldo Líquido</p>
                <p
                  className={`text-2xl font-bold ${balance >= 0 ? 'text-primary' : 'text-red-600'}`}
                >
                  {formatCurrency(balance)}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${balance >= 0 ? 'bg-primary/10 text-primary' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}
              >
                <Wallet className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-elevation">
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Centro de Custo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Carregando lançamentos...
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum registro financeiro encontrado. Comece adicionando um novo lançamento.
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.id} className="group">
                      <TableCell className="whitespace-nowrap">
                        {format(parseISO(record.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell
                        className="font-medium max-w-[200px] truncate"
                        title={record.description}
                      >
                        {record.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{record.cost_center}</span>
                          <span className="text-xs text-muted-foreground">
                            {record.cost_center_type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium whitespace-nowrap ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {record.type === 'income' ? '+' : '-'}
                        {formatCurrency(Number(record.amount))}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(record.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
