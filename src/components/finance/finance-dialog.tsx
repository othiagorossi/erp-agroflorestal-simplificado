import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DirectForm } from './direct-form'
import { SplitForm } from './split-form'
import { LaborForm } from './labor-form'

export function FinanceDialog({
  isOpen,
  setIsOpen,
  onSuccess,
}: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  onSuccess: () => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="shrink-0 shadow-elevation">
          <Plus className="mr-2 h-4 w-4" />
          Novo Lançamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
          <DialogDescription>Escolha o tipo de registro financeiro.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="direct" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="direct">Simples</TabsTrigger>
            <TabsTrigger value="split">Rateio</TabsTrigger>
            <TabsTrigger value="labor">Mão de Obra</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="direct">
              <DirectForm onSuccess={onSuccess} onCancel={() => setIsOpen(false)} />
            </TabsContent>
            <TabsContent value="split">
              <SplitForm onSuccess={onSuccess} onCancel={() => setIsOpen(false)} />
            </TabsContent>
            <TabsContent value="labor">
              <LaborForm onSuccess={onSuccess} onCancel={() => setIsOpen(false)} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
