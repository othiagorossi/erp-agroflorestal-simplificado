import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FinanceRecord } from '@/services/finance'

export function FinanceTable({
  records,
  loading,
  onDelete,
}: {
  records: FinanceRecord[]
  loading: boolean
  onDelete: (id: string) => void
}) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
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
                        onClick={() => onDelete(record.id)}
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
  )
}
