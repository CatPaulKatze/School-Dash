import './globals.css'
import Sidebar from "../components/sidebar";
import {ClerkProvider} from "@clerk/nextjs";
import {SchoolProvider} from "../components/syncedVars";
import {dark} from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import React from "react";

export default function RootLayout({children,}: {children: React.ReactNode}) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
            }}
        >

                <html lang="en">
                    <head>
                        <meta charSet="UTF-8"/>
                        <link rel="icon" type="image/svg+xml" href="/school.svg"/>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                        <title>School Dash</title>
                    </head>
                    <body>
                        <SchoolProvider>
                            <Sidebar/>
                            <div className="absolute top-4 left-64 ml-2">
                                {children}
                            </div>
                        </SchoolProvider>
                    <Analytics/>
                    <SpeedInsights/>
                    </body>
                </html>
        </ClerkProvider>
    )
}
