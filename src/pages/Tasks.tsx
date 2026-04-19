import { useState } from 'react'
import { Plus, GripVertical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
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
import useMainStore, { TaskStatus } from '@/stores/main'

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'A Fazer' },
  { id: 'in-progress', title: 'Em Andamento' },
  { id: 'done', title: 'Concluído' },
]

export default function Tasks() {
  const { tasks, addTask, updateTaskStatus } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ title: '', crop: 'Cacau', priority: 'Média' as any })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return
    addTask({ ...formData, status: 'todo' })
    setOpen(false)
    setFormData({ title: '', crop: 'Cacau', priority: 'Média' })
    toast({ title: 'Tarefa adicionada', description: 'Nova tarefa cadastrada com sucesso.' })
  }

  const cycleStatus = (id: string, current: TaskStatus) => {
    const next = current === 'todo' ? 'in-progress' : current === 'in-progress' ? 'done' : 'todo'
    updateTaskStatus(id, next)
    if (next === 'done')
      toast({ title: 'Tarefa Concluída!', description: 'O painel foi atualizado.' })
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Operações</h1>
          <p className="text-muted-foreground mt-1">Gerencie as atividades de campo.</p>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Nova Tarefa
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Adicionar Tarefa</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="title">Descrição da Tarefa</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Ex: Poda no Setor B"
                />
              </div>
              <div className="space-y-2">
                <Label>Cultivo Afetado</Label>
                <Select
                  value={formData.crop}
                  onValueChange={(v) => setFormData((p) => ({ ...p, crop: v }))}
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
                <Label>Prioridade</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) => setFormData((p) => ({ ...p, priority: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Salvar
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id)
          return (
            <div
              key={col.id}
              className="bg-muted/30 rounded-xl p-4 border border-border/50 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-semibold text-foreground">{col.title}</h3>
                <Badge variant="secondary" className="bg-background">
                  {colTasks.length}
                </Badge>
              </div>
              <div className="space-y-3 flex-1">
                {colTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="border-none shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal border-primary/20 text-primary"
                        >
                          {task.crop}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 -mt-1 -mr-2 text-muted-foreground"
                          onClick={() => cycleStatus(task.id, task.status)}
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-medium text-sm mb-3 leading-snug">{task.title}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-sm ${
                            task.priority === 'Alta'
                              ? 'bg-destructive/10 text-destructive'
                              : task.priority === 'Média'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
