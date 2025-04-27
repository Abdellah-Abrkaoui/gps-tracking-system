const initialUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    is_admin: true,
    devices: [1, 2],
  },
  {
    id: 2,
    username: "user1",
    password: "user1123",
    is_admin: false,
    devices: [3],
  },
  {
    id: 3,
    username: "technician",
    password: "tech123",
    is_admin: false,
    devices: [4, 5, 6],
  },
  {
    id: 4,
    username: "manager",
    password: "manager123",
    is_admin: true,
    devices: [],
  },
  {
    id: 5,
    username: "guest",
    password: "guest123",
    is_admin: false,
    devices: [7],
  },
];

export default initialUsers;
