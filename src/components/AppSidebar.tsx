import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Sprout,
  ClipboardList,
  LineChart,
  Package,
  Leaf,
  LogOut,
  DollarSign,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

const navItems = [
  { title: 'Início', icon: LayoutDashboard, url: '/' },
  { title: 'Cultivos', icon: Sprout, url: '/cultivos' },
  { title: 'Tarefas', icon: ClipboardList, url: '/tarefas' },
  { title: 'Financeiro', icon: DollarSign, url: '/financeiro' },
  { title: 'Impacto', icon: LineChart, url: '/impacto' },
  { title: 'Estoque', icon: Package, url: '/estoque' },
]

export function AppSidebar() {
  const location = useLocation()
  const { signOut } = useAuth()
  const { toast } = useToast()

  const handleLogout = async () => {
    await signOut()
    toast({ title: 'Sessão encerrada', description: 'Você saiu do sistema.' })
  }

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 text-sidebar-primary-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground text-primary">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Courageous</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-primary-foreground/60">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="px-4 py-6"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
