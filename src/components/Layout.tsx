import { Outlet, useLocation } from 'react-router-dom'
import { Bell, Search, User } from 'lucide-react'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { AppSidebar } from './AppSidebar'
import { useIsMobile } from '@/hooks/use-mobile'

export default function Layout() {
  const location = useLocation()
  const isMobile = useIsMobile()

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <AppSidebar />
      <SidebarInset className="bg-background overflow-hidden">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="hidden md:flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-sm text-muted-foreground w-64 border border-transparent focus-within:border-primary/20 focus-within:bg-background transition-colors">
              <Search className="h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar lotes ou tarefas..."
                className="bg-transparent border-none outline-none w-full placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive"></span>
            </Button>
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage
                src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
                alt="User"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main
          key={location.pathname}
          className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in-up"
        >
          <div className="mx-auto max-w-6xl w-full">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
