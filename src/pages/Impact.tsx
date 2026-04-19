import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Leaf, ArrowUpRight } from 'lucide-react'
import useMainStore from '@/stores/main'

const bioData = [
  { name: 'Cacau', value: 40 },
  { name: 'Palmito', value: 30 },
  { name: 'Banana', value: 20 },
  { name: 'Ervas', value: 10 },
]

const soilData = [
  { month: 'Jan', organic: 3.2 },
  { month: 'Mar', organic: 3.5 },
  { month: 'Mai', organic: 3.8 },
  { month: 'Jul', organic: 4.1 },
  { month: 'Set', organic: 4.5 },
  { month: 'Nov', organic: 4.9 },
]

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
]

const bioConfig = {
  cacau: { label: 'Cacau', color: 'hsl(var(--chart-1))' },
  palmito: { label: 'Palmito', color: 'hsl(var(--chart-2))' },
  banana: { label: 'Banana', color: 'hsl(var(--chart-3))' },
  ervas: { label: 'Ervas', color: 'hsl(var(--chart-4))' },
}

export default function Impact() {
  const { metrics } = useMainStore()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Impacto Ambiental</h1>
        <p className="text-muted-foreground mt-1">Métricas de regeneração e sustentabilidade.</p>
      </div>

      <Card className="bg-primary text-primary-foreground border-none shadow-elevation overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Leaf className="w-64 h-64" />
        </div>
        <CardContent className="p-8 md:p-12 relative z-10">
          <p className="text-primary-foreground/80 font-medium mb-2 uppercase tracking-wider text-sm">
            Carbono Sequestrado
          </p>
          <div className="flex items-end gap-4">
            <h2 className="text-6xl md:text-8xl font-display font-bold">{metrics.carbon}</h2>
            <span className="text-2xl md:text-3xl mb-2 font-light">toneladas</span>
          </div>
          <p className="mt-4 flex items-center gap-2 text-accent">
            <ArrowUpRight className="h-5 w-5" /> +12% em relação ao ano anterior
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-elevation">
          <CardHeader>
            <CardTitle>Índice de Biodiversidade</CardTitle>
            <CardDescription>Distribuição de espécies no sistema</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ChartContainer config={bioConfig} className="w-full h-full">
              <PieChart>
                <Pie
                  data={bioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {bioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-elevation">
          <CardHeader>
            <CardTitle>Saúde do Solo</CardTitle>
            <CardDescription>Evolução da Matéria Orgânica (%)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{ organic: { label: 'Matéria Orgânica', color: 'hsl(var(--primary))' } }}
              className="w-full h-full"
            >
              <LineChart data={soilData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="organic"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
