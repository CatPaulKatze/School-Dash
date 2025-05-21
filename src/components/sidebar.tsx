"use client"

import * as React from "react"

import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {useTheme} from "next-themes";
import {GraduationCap, Laptop, Moon, Sun} from "lucide-react";
import {NavUser} from "@/components/NavUser";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";

const routes = {
    navMain: [
        {
            title: "",
            url: "/",
            items: [
                {
                    title: "Dashboard",
                    url: "/",
                },
                {
                    title: "Homework",
                    url: "/homework",
                },
                {
                    title: "Exams",
                    url: "/exams",
                },
                {
                    title: "Changes",
                    url: "/changes",
                },
            ],
        },

    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const ThemeIcon = React.useMemo(() => {
        if (!mounted) return null

        if (theme === "dark") return Moon
        if (theme === "light") return Sun
        return Laptop
    }, [theme, mounted])

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <Link href="/">
                    <h1 className="flex justify-center font-semibold text-3xl"><GraduationCap size={40} className="mr-1"/> School Dash</h1>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                {routes.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.url == usePathname()}>
                                            <Link href={item.url}>{item.title}</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 justify-end ml-auto mr-2"
                    onClick={() => {
                        setTheme(theme === "light" ? "dark" : "light")
                    }}
                >
                    {mounted && ThemeIcon && <ThemeIcon className="h-4 w-4" />}
                    <span className="sr-only">Toggle theme</span>
                </Button>
                <NavUser/>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
