export interface RoleInterface {
  name: string;
  permissions: string[];
}

const roles: RoleInterface[] = [
  {
    name: "admin",
    permissions: ["create_task", "read_task", "update_task", "delete_task"],
  },
  {
    name: "manager",
    permissions: ["create_task", "read_task", "update_task"],
  },
  {
    name: "employee",
    permissions: ["create_task", "read_task"],
  },
  {
    name: "employee",
    permissions: ["create_task", "read_task"],
  },
];

export function getRoleByName(name: string) {
  return roles.find((role: RoleInterface) => role.name === name);
}

export function getRoles() {
  return roles;
}

export function getPermissionsByRoleName(roleName: string) {
  const role = roles.find((r) => r.name === roleName);
  return role ? role.permissions : [];
}
