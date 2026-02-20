/* frontend/src/pages/Login.tsx */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, UserCheck, Clock } from "lucide-react";
import { NavLink } from "react-router-dom";
import { postLoginForm, postRegister } from "@/api/client";
import type { RegisterPayload } from "@/api/client";

/** ---- Helpers erreur (sans dépendre de AxiosError) ---- */
type ApiErrorBody = { message?: string; detail?: string; error?: string };

function isAxiosErrorLike<T = unknown>(
  err: unknown
): err is { isAxiosError: boolean; response?: { data?: T } } {
  return typeof err === "object" && err !== null && "isAxiosError" in (err as Record<string, unknown>);
}

function extractApiError(err: unknown): string {
  if (isAxiosErrorLike<ApiErrorBody>(err)) {
    const body = err.response?.data;
    const axiosMsg = body?.message || body?.detail || body?.error;
    if (axiosMsg) return axiosMsg;
  }
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Erreur inconnue";
  }
}

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterAlert, setShowRegisterAlert] = useState(false);

  // State login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State register
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerRole, setRegisterRole] = useState("");

  // ----- LOGIN -----
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await postLoginForm(loginEmail, loginPassword);
      console.log("Connexion réussie :", data);
      // TODO: stocker token + navigate("/dashboard")
    } catch (err) {
      const message = extractApiError(err);
      console.error("Erreur connexion :", message);
      // TODO: toast/Alert UI
    }
  };

  // ----- REGISTER -----
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerPassword !== registerConfirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    const payload: RegisterPayload = {
      email: registerEmail,
      password: registerPassword,
      firstName: registerFirstName,
      lastName: registerLastName,
      role: registerRole,
    };

    try {
      const data = await postRegister(payload);
      console.log("Inscription réussie :", data);
      setShowRegisterAlert(true);
    } catch (err) {
      const message = extractApiError(err);
      console.error("Erreur inscription :", message);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <NavLink to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Logo" className="h-20 w-auto" />
            </div>
            <div className="text-left">
              <h1 className="font-roboto font-bold text-2xl text-primary">WaterQual SEBOU</h1>
              <p className="text-sm text-muted-foreground">Système d'aide à la décision</p>
            </div>
          </NavLink>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card className="border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl font-roboto">Connexion</CardTitle>
                <CardDescription>Accédez à votre tableau de bord WaterQual SEBOU</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="loginEmail">Email</Label>
                    <Input
                      id="loginEmail"
                      name="loginEmail"
                      type="email"
                      placeholder="votre@email.fr"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loginPassword">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="loginPassword"
                        name="loginPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        className="rounded border-border"
                        aria-label="Se souvenir de moi"
                      />
                      <Label htmlFor="rememberMe">Se souvenir de moi</Label>
                    </div>
                    <Button type="button" variant="link" className="px-0 text-sm">
                      Mot de passe oublié ?
                    </Button>
                  </div>

                  <Button type="submit" className="w-full">
                    Se connecter
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card className="border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl font-roboto">Inscription</CardTitle>
                <CardDescription>Créez votre compte pour accéder à WaterQual SEBOU</CardDescription>
              </CardHeader>
              <CardContent>
                {showRegisterAlert && (
                  <Alert className="mb-4 border-warning bg-warning/10">
                    <Clock className="h-4 w-4 text-warning" />
                    <AlertDescription>
                      Votre demande d'inscription a été envoyée. Un administrateur validera votre compte sous 24-48h.
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Jean"
                        required
                        value={registerFirstName}
                        onChange={(e) => setRegisterFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Dupont"
                        required
                        value={registerLastName}
                        onChange={(e) => setRegisterLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email professionnel</Label>
                    <Input
                      id="registerEmail"
                      name="registerEmail"
                      type="email"
                      placeholder="jean.dupont@organisation.fr"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Fonction</Label>
                    <Input
                      id="role"
                      name="role"
                      placeholder="Chercheur, Ingénieur, Analyste..."
                      required
                      value={registerRole}
                      onChange={(e) => setRegisterRole(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="registerPassword"
                        name="registerPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className="bg-accent/50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <UserCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm mb-1">Processus de validation</h4>
                        <p className="text-xs text-muted-foreground">
                          Votre compte sera validé par un administrateur avant activation. Vous recevrez un email de confirmation une fois approuvé.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="mt-1 rounded border-border"
                      required
                      aria-label="Accepter les conditions d'utilisation et la politique de confidentialité"
                    />
                    <div>
                      <Label htmlFor="terms" className="text-sm leading-5">
                        J'accepte les conditions d'utilisation et la politique de confidentialité
                      </Label>
                      <div className="text-xs mt-1">
                        <Button type="button" variant="link" className="px-0 h-auto text-xs">
                          conditions d'utilisation
                        </Button>
                        <span aria-hidden> · </span>
                        <Button type="button" variant="link" className="px-1 h-auto text-xs">
                          politique de confidentialité
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Créer mon compte
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Besoin d'aide ?{" "}
            <NavLink to="/contact" className="text-primary hover:underline">
              Contactez-nous
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
