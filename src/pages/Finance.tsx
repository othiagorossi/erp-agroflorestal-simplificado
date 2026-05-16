import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { getFinanceRecords, deleteFinanceRecord, FinanceRecord } from '@/services/finance'
import { FinanceDialog } from '@/components/finance/finance-dialog'
import { FinanceSummary } from '@/components/finance/finance-summary'
import { FinanceTable } from '@/components/finance/finance-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorkersTab } from '@/components/finance/workers-tab'

export default function Finance() {
  const [records, setRecords] = useState<FinanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

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

  const handleSuccess = () => {
    setIsOpen(false)
    loadRecords()
  }

  const income = records
    .filter((r) => r.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0)
  const expense = records
    .filter((r) => r.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0)
  const balance = income - expense

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Controle Financeiro</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de receitas e despesas com rateio inteligente por centro de custo.
          </p>
        </div>
        <FinanceDialog isOpen={isOpen} setIsOpen={setIsOpen} onSuccess={handleSuccess} />
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="workers">Equipe & Mão de Obra</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="space-y-8">
          <FinanceSummary income={income} expense={expense} balance={balance} />
          <FinanceTable records={records} loading={loading} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="workers">
          <WorkersTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
