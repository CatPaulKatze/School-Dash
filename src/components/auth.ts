import {Homework, Exams, User, Role} from "../interfaces/authint.ts";

type PermissionCheck<Key extends keyof Permissions> =
    | boolean
    | ((user: User, data: Permissions[Key]["dataType"]) => boolean)

type RolesWithPermissions = {
    [R in Role]: Partial<{
        [Key in keyof Permissions]: Partial<{
            [Action in Permissions[Key]["action"]]: PermissionCheck<Key>
        }>
    }>
}

type Permissions = {
    homework: {
        dataType: Homework
        action: "view" | "create" | "edit" | "delete"
    }
    exams: {
        dataType: Exams
        action: "view" | "create" | "edit" | "delete"
    }
}

const ROLES = {
    admin: {
        homework: {
            view: true,
            create: true,
            edit: true,
            delete: true,
        },
        exams: {
            view: true,
            create: true,
            edit: true,
            delete: true,
        },
    },
    moderator: {
        homework: {
            view: true,
            create: true,
            edit: true,
            delete: true,
        },
        exams: {
            view: true,
            create: true,
            edit: true,
            delete: true,
        }
    },
    user: {
        homework: {
            view: true,
        },
        exams: {
            view: true,
        },
    },
} as const satisfies RolesWithPermissions

export function hasPerms<Resource extends keyof Permissions>(
    user: User,
    resource: Resource,
    action: Permissions[Resource]["action"],
) {
    return user.roles.some(role => {
        const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action]
        if (permission == null) return false

        return permission
    })
}