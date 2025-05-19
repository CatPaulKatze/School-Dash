"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface ActiveLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
    activeClassName?: string
    className?: string
}

export function ActiveLink({ children, activeClassName = "text-foreground", className, ...props }: ActiveLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === props.href

    return (
        <Link
            className={cn(
                "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                isActive && activeClassName,
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    )
}
