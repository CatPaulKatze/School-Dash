export type Homework = {
    id: string
    body: string
    authorId: string
    createdAt: Date
}

export type Exams = {
    id: string
    title: string
    userId: string
    completed: boolean
    invitedUsers: string[]
}

export type Role = "admin" | "editor" | "user"
export type User = { roles: Role[]; id: string }