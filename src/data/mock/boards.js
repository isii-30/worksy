// Fake "database" for boards until the real API is ready.
// Each board belongs to a workspace and has an adminId (the Board Admin).

export let mockBoards = [
  {
    id: "b1",
    name: "Design Print",
    description: "Everything for the Q3 product launch.",
    workspaceId: "w1",
    workspaceName: "Product Team",
    adminId: "u1",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "b2",
    name: "Design Print",
    description: "Marketing collateral for print.",
    workspaceId: "w1",
    workspaceName: "Product Team",
    adminId: "u1",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "b3",
    name: "Marketing Plan",
    description: "Q3 marketing roadmap.",
    workspaceId: "w2",
    workspaceName: "Marketing Team",
    adminId: "u2",
    updatedAt: "2026-08-17T10:00:00Z",
  },
];

// Members that belong to a given board (workspace members who've been added to it)
export let mockBoardMembers = {
  b1: [
    { id: "u1", name: "Senali Jayasundara", email: "senali@example.com", avatar: null, role: "Admin" },
    { id: "u3", name: "Isira Liyanage", email: "isira@example.com", avatar: null, role: "Member" },
    { id: "u4", name: "Pawani Jayakody", email: "pawani@example.com", avatar: null, role: "Member" },
  ],
  b2: [
    { id: "u2", name: "Dimithri Dias", email: "dimithri@example.com", avatar: null, role: "Admin" },
  ],
  b3: [
    { id: "u2", name: "Dimithri Dias", email: "dimithri@example.com", avatar: null, role: "Admin" },
  ],
};

// Workspace members available to be *added* to a board (superset — must belong to the workspace, FR-17)
export let mockWorkspaceMembers = {
  w1: [
    { id: "u1", name: "Senali Jayasundara", email: "senali@example.com" },
    { id: "u3", name: "Isira Liyanage", email: "isira@example.com" },
    { id: "u4", name: "Pawani Jayakody", email: "pawani@example.com" },
    { id: "u5", name: "Rashmi Samarakoon", email: "rashmi@example.com" },
  ],
  w2: [
    { id: "u2", name: "Dimithri Dias", email: "dimithri@example.com" },
  ],
};