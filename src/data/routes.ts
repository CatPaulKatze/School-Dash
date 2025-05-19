export type routesInt = {
    pathname: string,
    name: string,
}

export const routes:routesInt[] = [
    {
        pathname: "/dashboard",
        name: "Dashboard",
    },
    {
        pathname: "/history",
        name: "History",
    },
    {
        pathname: "/maps",
        name: "Maps",
    },
]