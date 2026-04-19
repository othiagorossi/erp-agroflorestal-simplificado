import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Droplets, Info, MapPin, Plus, Calendar } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useMainStore, { Crop } from '@/stores/main'

const CATEGORIES = ['Todos', 'Cacau', 'Palmito', 'Banana', 'Ervas']

export default function Crops() {
  const { crops, addCrop } = useMainStore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('Todos')
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)
  const [openNew, setOpenNew] = useState(false)

  const [formData, setFormData] = useState({
    name: 'Cacau',
    variety: '',
    plantingDate: '',
    growthStage: 'Muda',
    health: 'green' as any,
    plot: '',
    ratio: '10%',
    ageProgress: 0,
  })

  const filteredCrops = activeTab === 'Todos' ? crops : crops.filter((c) => c.name === activeTab)

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.variety || !formData.plantingDate || !formData.plot) {
      toast({
        title: 'Atenção',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }
    let progress = 10
    if (formData.growthStage === 'Vegetativo') progress = 50
    if (formData.growthStage === 'Produtivo') progress = 100

    addCrop({ ...formData, ageProgress: progress })
    setOpenNew(false)
    toast({
      title: 'Cultivo adicionado',
      description: 'A nova espécie foi registrada com sucesso.',
    })
    setFormData({
      name: 'Cacau',
      variety: '',
      plantingDate: '',
      growthStage: 'Muda',
      health: 'green',
      plot: '',
      ratio: '10%',
      ageProgress: 0,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Gestão de Cultivos</h1>
          <p className="text-muted-foreground mt-1">
            Monitore o desenvolvimento das espécies no campo.
          </p>
        </div>

        <Sheet open={openNew} onOpenChange={setOpenNew}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Novo Cultivo
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md border-l-border overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Adicionar Espécie</SheetTitle>
              <SheetDescription>Cadastre um novo lote ou cultivo no sistema.</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleAddCrop} className="space-y-5 mt-6 pb-6">
              <div className="space-y-2">
                <Label>Espécie</Label>
                <Select
                  value={formData.name}
                  onValueChange={(v) => setFormData((p) => ({ ...p, name: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cacau">Cacau</SelectItem>
                    <SelectItem value="Palmito">Palmito</SelectItem>
                    <SelectItem value="Banana">Banana</SelectItem>
                    <SelectItem value="Ervas">Ervas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  Variedade <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={formData.variety}
                  onChange={(e) => setFormData((p) => ({ ...p, variety: e.target.value }))}
                  placeholder="Ex: CCN-51, Prata..."
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Data de Plantio <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => setFormData((p) => ({ ...p, plantingDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Estágio de Crescimento</Label>
                <Select
                  value={formData.growthStage}
                  onValueChange={(v) => setFormData((p) => ({ ...p, growthStage: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Muda">Muda</SelectItem>
                    <SelectItem value="Vegetativo">Vegetativo</SelectItem>
                    <SelectItem value="Produtivo">Produtivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status de Saúde</Label>
                <Select
                  value={formData.health}
                  onValueChange={(v) => setFormData((p) => ({ ...p, health: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green">Saudável</SelectItem>
                    <SelectItem value="yellow">Atenção</SelectItem>
                    <SelectItem value="red">Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  Área/Lote <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={formData.plot}
                  onChange={(e) => setFormData((p) => ({ ...p, plot: e.target.value }))}
                  placeholder="Ex: Setor A"
                />
              </div>
              <Button type="submit" className="w-full">
                Salvar Cultivo
              </Button>
            </form>
          </SheetContent>
        </Sheet>
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
                        : crop.health === 'yellow'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-destructive/10 text-destructive'
                    }
                  >
                    {crop.health === 'green'
                      ? 'Saudável'
                      : crop.health === 'yellow'
                        ? 'Atenção'
                        : 'Crítico'}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Info className="h-3 w-3" /> {crop.growthStage || 'Vegetativo'}
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
                <SheetDescription className="flex flex-col gap-2 mt-2">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Localização: {selectedCrop.plot}
                  </span>
                  {selectedCrop.plantingDate && (
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Plantio: {selectedCrop.plantingDate}
                    </span>
                  )}
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
