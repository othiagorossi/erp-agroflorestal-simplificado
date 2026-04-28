import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function FinanceSummary({
  income,
  expense,
  balance,
}: {
  income: number
  expense: number
  balance: number
}) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
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
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-primary' : 'text-red-600'}`}>
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
  )
}
