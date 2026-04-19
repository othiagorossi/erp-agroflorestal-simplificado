import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Droplets, Info, MapPin } from 'lucide-react'
import useMainStore, { Crop } from '@/stores/main'

const CATEGORIES = ['Todos', 'Cacau', 'Palmito', 'Banana', 'Ervas']

export default function Crops() {
  const { crops } = useMainStore()
  const [activeTab, setActiveTab] = useState('Todos')
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)

  const filteredCrops = activeTab === 'Todos' ? crops : crops.filter((c) => c.name === activeTab)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Gestão de Cultivos</h1>
        <p className="text-muted-foreground mt-1">
          Monitore o desenvolvimento das espécies no campo.
        </p>
      </div>

      <Tabs defaultValue="Todos" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="rounded-md px-6">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <Card
                key={crop.id}
                className="cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-200 border-border/50"
                onClick={() => setSelectedCrop(crop)}
              >
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{crop.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{crop.variety}</p>
                  </div>
                  <Badge
                    variant={crop.health === 'green' ? 'default' : 'secondary'}
                    className={
                      crop.health === 'green'
                        ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                        : 'bg-amber-100 text-amber-800'
                    }
                  >
                    {crop.health === 'green' ? 'Saudável' : 'Atenção'}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Info className="h-3 w-3" /> Desenvolvimento
                      </span>
                      <span className="font-medium">{crop.ageProgress}%</span>
                    </div>
                    <Progress value={crop.ageProgress} className="h-2 bg-muted" />
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                    <span className="flex items-center text-muted-foreground gap-1.5">
                      <MapPin className="h-4 w-4" /> {crop.plot}
                    </span>
                    <span className="font-medium text-primary">Mix: {crop.ratio}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={!!selectedCrop} onOpenChange={(open) => !open && setSelectedCrop(null)}>
        <SheetContent className="sm:max-w-md border-l-border">
          {selectedCrop && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl font-display">
                  {selectedCrop.name} - {selectedCrop.variety}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4" /> Localização: {selectedCrop.plot}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-muted/50 space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-accent" /> Status Nutricional
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A última análise de solo indicou níveis adequados de matéria orgânica.
                    Recomenda-se adubação de cobertura nos próximos 15 dias para otimizar o
                    florescimento.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Histórico de Insumos</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Composto Orgânico</span>
                      <span className="font-medium">10/04/2026</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Poda de Manutenção</span>
                      <span className="font-medium">22/03/2026</span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
