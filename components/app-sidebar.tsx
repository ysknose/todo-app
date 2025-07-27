"use client"

import { Database, FileText, Home, Kanban, Package, Shuffle, Table, Wand2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// メニューアイテムの定義
const menuItems = [
  {
    title: "ホーム",
    url: "/",
    icon: Home,
  },
  {
    title: "基本的なソート機能",
    url: "/dnd-demo",
    icon: Shuffle,
  },
  {
    title: "カンバンボード",
    url: "/dnd-demo/multi-container",
    icon: Kanban,
  },
  {
    title: "JSON Server API",
    url: "/api-demo",
    icon: Database,
  },
  {
    title: "React Hook Form",
    url: "/form-demo",
    icon: FileText,
  },
  {
    title: "自動フォーム生成",
    url: "/auto-form-demo",
    icon: Wand2,
  },
  {
    title: "TanStack Table",
    url: "/table-demo",
    icon: Table,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Package className="h-6 w-6" />
          <span className="font-semibold">Todo App</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
