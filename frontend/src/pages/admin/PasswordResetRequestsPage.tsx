import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  approveResetRequest,
  listResetRequests,
  rejectResetRequest,
  type ResetRequestItem,
} from "@/services/passwordResetService";

export default function PasswordResetRequestsPage() {
  const [requests, setRequests] = useState<ResetRequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listResetRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter((r) =>
      [r.username_requested, r.email_requested, r.status]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(q))
    );
  }, [requests, query]);

  const handleApprove = async (req: ResetRequestItem) => {
    const res = await approveResetRequest(req.id);
    setTempPassword(res.temporary_password);
    await load();
  };

  const handleReject = async (req: ResetRequestItem) => {
    await rejectResetRequest(req.id);
    await load();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-slate-900">Demandes de réinitialisation</h1>
          <p className="text-sm text-slate-500">Validez ou rejetez les demandes de mot de passe oublié.</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {tempPassword && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Mot de passe temporaire : <strong>{tempPassword}</strong>
          </div>
        )}

        <Card className="border-slate-200">
          <CardContent className="space-y-4 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Input
                placeholder="Rechercher par email, username, statut..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="md:max-w-xs"
              />
              <Button variant="outline" onClick={load} disabled={loading}>
                Rafraichir
              </Button>
            </div>

            <div className="overflow-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Utilisateur</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filtered.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">{req.username_requested || "-"}</td>
                      <td className="px-4 py-3">{req.email_requested || "-"}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{req.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {new Date(req.requested_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button size="sm" onClick={() => handleApprove(req)} disabled={req.status !== "PENDING"}>
                            Approuver
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(req)} disabled={req.status !== "PENDING"}>
                            Rejeter
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                        Aucune demande.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
