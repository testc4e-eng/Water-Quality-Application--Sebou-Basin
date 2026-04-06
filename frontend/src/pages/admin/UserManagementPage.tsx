import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  createUser,
  deleteUser,
  listUsers,
  resetUserPassword,
  updateUser,
  updateUserStatus,
  type UserItem,
} from "@/services/userService";
import { adminForceResetUser, listResetRequests } from "@/services/passwordResetService";
import { Shield, UserPlus, RefreshCw, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ROLE_OPTIONS = [
  { value: "viewer", label: "Utilisateur" },
  { value: "manager", label: "Gestionnaire" },
  { value: "admin", label: "Administrateur" },
];

type UserFormState = {
  username: string;
  email: string;
  full_name: string;
  password: string;
  role_code: "viewer" | "manager" | "admin";
};

const emptyForm: UserFormState = {
  username: "",
  email: "",
  full_name: "",
  password: "",
  role_code: "viewer",
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [editTarget, setEditTarget] = useState<UserItem | null>(null);
  const [resetTarget, setResetTarget] = useState<UserItem | null>(null);
  const [resetPassword, setResetPasswordValue] = useState("");
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [pendingResets, setPendingResets] = useState(0);
  const navigate = useNavigate();

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur chargement utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    listResetRequests("PENDING")
      .then((rows) => setPendingResets(rows.length))
      .catch(() => setPendingResets(0));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.username, u.email, u.full_name, u.role?.code]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [users, query]);

  const submitCreate = async () => {
    try {
      await createUser(form);
      setCreateOpen(false);
      setForm(emptyForm);
      await loadUsers();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur creation utilisateur");
    }
  };

  const submitEdit = async () => {
    if (!editTarget) return;
    try {
      await updateUser(editTarget.id, {
        username: form.username,
        email: form.email,
        full_name: form.full_name,
        role_code: form.role_code,
      });
      setEditOpen(false);
      setEditTarget(null);
      setForm(emptyForm);
      await loadUsers();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur mise a jour utilisateur");
    }
  };

  const submitReset = async () => {
    if (!resetTarget) return;
    try {
      await resetUserPassword(resetTarget.id, resetPassword);
      setResetOpen(false);
      setResetTarget(null);
      setResetPasswordValue("");
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur reinitialisation mot de passe");
    }
  };

  const toggleStatus = async (user: UserItem) => {
    try {
      await updateUserStatus(user.id, !user.is_active);
      await loadUsers();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur changement statut");
    }
  };

  const handleDelete = async (user: UserItem) => {
    if (!confirm(`Supprimer l'utilisateur ${user.email} ?`)) return;
    try {
      await deleteUser(user.id);
      await loadUsers();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur suppression utilisateur");
    }
  };

  const handleForceReset = async (user: UserItem) => {
    try {
      const res = await adminForceResetUser(user.id);
      setTempPassword(res.temporary_password);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur reset temporaire");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Shield className="h-4 w-4" /> Administration
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Gestion des utilisateurs</h1>
              <p className="mt-1 text-sm text-slate-500">
                Creez, mettez a jour et securisez les comptes des membres.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={loadUsers} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Rafraichir
              </Button>
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nouvel utilisateur
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Creer un utilisateur</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-1">
                      <Label>Nom utilisateur</Label>
                      <Input
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label>Nom complet</Label>
                      <Input
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label>Mot de passe</Label>
                      <Input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label>Role</Label>
                      <select
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        value={form.role_code}
                        onChange={(e) =>
                          setForm({ ...form, role_code: e.target.value as UserFormState["role_code"] })
                        }
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={submitCreate}>Creer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {tempPassword && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Mot de passe temporaire : <strong>{tempPassword}</strong>
          </div>
        )}

        <Card className="border-slate-200">
          <CardContent className="space-y-4 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Utilisateurs</p>
                <p className="text-xs text-slate-500">{filtered.length} compte(s)</p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Rechercher par nom, email, role..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="md:max-w-xs"
                />
                <Button variant="outline" onClick={() => navigate("/admin/password-resets")}>
                  Demandes reset
                  {pendingResets > 0 && (
                    <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold text-white">
                      {pendingResets}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            <div className="overflow-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Utilisateur</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Derniere connexion</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{user.full_name || user.username}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {user.role?.code || "viewer"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {user.is_active ? (
                          <Badge className="bg-emerald-500 text-white">Actif</Badge>
                        ) : (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditTarget(user);
                              setForm({
                                username: user.username,
                                email: user.email,
                                full_name: user.full_name || "",
                                password: "",
                                role_code: (user.role?.code as UserFormState["role_code"]) || "viewer",
                              });
                              setEditOpen(true);
                            }}
                          >
                            <Pencil className="mr-1 h-3.5 w-3.5" />
                            Editer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setResetTarget(user);
                              setResetPasswordValue("");
                              setResetOpen(true);
                            }}
                          >
                            Reinitialiser
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleForceReset(user)}>
                            Temporaire
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleStatus(user)}
                          >
                            {user.is_active ? "Desactiver" : "Activer"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(user)}
                          >
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                        Aucun utilisateur.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier un utilisateur</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label>Nom utilisateur</Label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="grid gap-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid gap-1">
              <Label>Nom complet</Label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>
            <div className="grid gap-1">
              <Label>Role</Label>
              <select
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                value={form.role_code}
                onChange={(e) =>
                  setForm({ ...form, role_code: e.target.value as UserFormState["role_code"] })
                }
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Annuler
            </Button>
            <Button onClick={submitEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reinitialiser le mot de passe</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Label>Nouveau mot de passe</Label>
            <Input
              type="password"
              value={resetPassword}
              onChange={(e) => setResetPasswordValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Annuler
            </Button>
            <Button onClick={submitReset} disabled={!resetPassword}>Mettre a jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
