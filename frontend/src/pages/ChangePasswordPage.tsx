import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { changePassword } from "@/services/passwordResetService";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mustChange = localStorage.getItem("must_change_password") === "true";
    if (!mustChange) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      localStorage.setItem("must_change_password", "false");
      toast.success("Mot de passe mis a jour.");
      navigate("/", { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Erreur changement mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4 py-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Changer le mot de passe</h1>
            <p className="text-sm text-slate-500">Votre mot de passe temporaire doit etre remplace.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label>Mot de passe actuel</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Nouveau mot de passe</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mise a jour..." : "Valider"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
