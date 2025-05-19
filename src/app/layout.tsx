import './globals.css'
import React from "react";
import { ThemeProvider } from "@/components/theme-provider"
import {cn} from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
import { AppSidebar } from "@/components/sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";

export default function RootLayout({children,}: {children: React.ReactNode}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="UTF-8"/>
                <link rel="icon" type="image/svg+xml" href=""/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>School Dash</title>
            </head>
            <body className={cn("min-h-screen bg-background font-sans antialiased")}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                            <div className="flex-1">{children}</div>
                        </SidebarInset>
                    </SidebarProvider>
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    )
}
