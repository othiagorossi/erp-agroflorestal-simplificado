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
              {[
                { name: 'Adubo Orgânico Compostado', category: 'Insumos', qty: '450 kg' },
                { name: 'Sementes de Adubação Verde', category: 'Sementes', qty: '25 kg' },
                { name: 'Mudas de Cacau PS-1319', category: 'Mudas', qty: '120 un' },
                { name: 'Tesoura de Poda', category: 'Ferramentas', qty: '8 un' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 p-4 text-sm items-center hover:bg-muted/30 transition-colors"
                >
                  <div className="col-span-2 font-medium">{item.name}</div>
                  <div className="text-muted-foreground">{item.category}</div>
                  <div className="text-right">{item.qty}</div>
                </div>
              ))}
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
