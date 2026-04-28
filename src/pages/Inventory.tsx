import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PackageSearch } from 'lucide-react'

export default function Inventory() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Estoque</h1>
        <p className="text-muted-foreground mt-1">Gestão de insumos, sementes e ferramentas.</p>
      </div>

      <Card className="border-none shadow-elevation">
        <CardHeader>
          <CardTitle>Itens Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <div className="grid grid-cols-4 p-4 font-medium text-sm text-muted-foreground bg-muted/50 rounded-t-md">
              <div className="col-span-2">Item</div>
              <div>Categoria</div>
              <div className="text-right">Quantidade</div>
            </div>
            <div className="divide-y divide-border">
              {/* Empty state for inventory */}
              <div className="p-8 text-center text-muted-foreground text-sm">
                Nenhum item em estoque.
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border flex flex-col items-center justify-center text-center text-muted-foreground">
            <PackageSearch className="h-12 w-12 mb-4 opacity-50" />
            <p>Módulo de controle avançado de estoque em desenvolvimento.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
