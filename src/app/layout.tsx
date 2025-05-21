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
                <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdyYWR1YXRpb24tY2FwLWljb24gbHVjaWRlLWdyYWR1YXRpb24tY2FwIj48cGF0aCBkPSJNMjEuNDIgMTAuOTIyYTEgMSAwIDAgMC0uMDE5LTEuODM4TDEyLjgzIDUuMThhMiAyIDAgMCAwLTEuNjYgMEwyLjYgOS4wOGExIDEgMCAwIDAgMCAxLjgzMmw4LjU3IDMuOTA4YTIgMiAwIDAgMCAxLjY2IDB6Ii8+PHBhdGggZD0iTTIyIDEwdjYiLz48cGF0aCBkPSJNNiAxMi41VjE2YTYgMyAwIDAgMCAxMiAwdi0zLjUiLz48L3N2Zz4="/>
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
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}
