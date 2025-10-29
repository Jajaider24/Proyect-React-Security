import { User } from "../models/User";

const fakeDelay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

let _users: User[] = [
  { id: 1, name: "Juan Perez", email: "juan@example.com" },
  { id: 2, name: "María García", email: "maria@example.com" },
  { id: 3, name: "Luis Martínez", email: "luis@example.com" },
];

const usersService = {
  async list(): Promise<User[]> {
    await fakeDelay();
    // devolver copia para evitar mutaciones externas
    return JSON.parse(JSON.stringify(_users));
  },

  async get(id?: number): Promise<User | undefined> {
    await fakeDelay();
    return _users.find((u) => u.id === id);
  },

  async create(payload: Omit<User, "id">): Promise<User> {
    await fakeDelay();
    const nextId = _users.length ? Math.max(..._users.map((u) => u.id || 0)) + 1 : 1;
    const newUser: User = { id: nextId, ...payload };
    _users.push(newUser);
    return newUser;
  },

  async update(id: number, payload: Partial<User>): Promise<User | undefined> {
    await fakeDelay();
    const idx = _users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    _users[idx] = { ..._users[idx], ...payload };
    return _users[idx];
  },

  async remove(id: number): Promise<boolean> {
    await fakeDelay();
    const before = _users.length;
    _users = _users.filter((u) => u.id !== id);
    return _users.length < before;
  },
};

export default usersService;
