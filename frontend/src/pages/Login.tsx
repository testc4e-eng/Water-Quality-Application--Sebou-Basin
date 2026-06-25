// /* frontend/src/pages/Login.tsx */
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Eye, EyeOff, UserCheck, Clock } from "lucide-react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { postLoginForm, postRegister } from "@/api/client";
// import type { RegisterPayload } from "@/api/client";

// /** ---- Helpers erreur (sans dépendre de AxiosError) ---- */
// type ApiErrorBody = { message?: string; detail?: string; error?: string };

// function isAxiosErrorLike<T = unknown>(
//   err: unknown
// ): err is { isAxiosError: boolean; response?: { data?: T } } {
//   return typeof err === "object" && err !== null && "isAxiosError" in (err as Record<string, unknown>);
// }

// function extractApiError(err: unknown): string {
//   if (isAxiosErrorLike<ApiErrorBody>(err)) {
//     const body = err.response?.data;
//     const axiosMsg = body?.message || body?.detail || body?.error;
//     if (axiosMsg) return axiosMsg;
//   }
//   if (err instanceof Error && err.message) return err.message;
//   if (typeof err === "string") return err;
//   try {
//     return JSON.stringify(err);
//   } catch {
//     return "Erreur inconnue";
//   }
// }

// const AuthPage = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showRegisterAlert, setShowRegisterAlert] = useState(false);
//   const [loginError, setLoginError] = useState<string | null>(null);
//   const [registerError, setRegisterError] = useState<string | null>(null);

//   // State login
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");

//   // State register
//   const [registerEmail, setRegisterEmail] = useState("");
//   const [registerPassword, setRegisterPassword] = useState("");
//   const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
//   const [registerFirstName, setRegisterFirstName] = useState("");
//   const [registerLastName, setRegisterLastName] = useState("");
//   const [registerRole, setRegisterRole] = useState("");

//   // ----- LOGIN -----
//   const handleLoginSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoginError(null);
//     try {
//       const data = await postLoginForm(loginEmail, loginPassword);
//       localStorage.setItem("access_token", data.access_token);
//       localStorage.setItem("auth_email", data.email);
//       localStorage.setItem("is_superuser", String(!!data.is_superuser));
//       navigate("/dashboard-cartographique");
//     } catch (err) {
//       const message = extractApiError(err);
//       setLoginError(message);
//     }
//   };

//   // ----- REGISTER -----
//   const handleRegisterSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (registerPassword !== registerConfirmPassword) {
//       alert("Les mots de passe ne correspondent pas !");
//       return;
//     }

//     const payload: RegisterPayload = {
//       email: registerEmail,
//       password: registerPassword,
//       firstName: registerFirstName,
//       lastName: registerLastName,
//       role: registerRole,
//     };

//     try {
//       const data = await postRegister(payload);
//       console.log("Inscription réussie :", data);
//       setRegisterError(null);
//       setShowRegisterAlert(true);
//     } catch (err) {
//       const message = extractApiError(err);
//       setRegisterError(message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <NavLink to="/" className="inline-flex items-center space-x-3 mb-6">
//             <div className="flex items-center gap-2">
//               <img src="/logo.jpg" alt="Logo" className="h-20 w-auto" />
//             </div>
//             <div className="text-left">
//               <h1 className="font-roboto font-bold text-2xl text-primary">WaterQual SEBOU</h1>
//               <p className="text-sm text-muted-foreground">Système d'aide à la décision</p>
//             </div>
//           </NavLink>
//         </div>

//         <Tabs defaultValue="login" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-6">
//             <TabsTrigger value="login">Connexion</TabsTrigger>
//             <TabsTrigger value="register">Inscription</TabsTrigger>
//           </TabsList>

//           {/* Login Tab */}
//           <TabsContent value="login">
//             <Card className="border-border shadow-card">
//               <CardHeader>
//                 <CardTitle className="text-2xl font-roboto">Connexion</CardTitle>
//                 <CardDescription>Accédez à votre tableau de bord WaterQual SEBOU</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {loginError && (
//                   <Alert className="mb-4 border-destructive/40 bg-destructive/10">
//                     <AlertDescription>{loginError}</AlertDescription>
//                   </Alert>
//                 )}
//                 <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
//                   <div className="space-y-2">
//                     <Label htmlFor="loginEmail">Email</Label>
//                     <Input
//                       id="loginEmail"
//                       name="loginEmail"
//                       type="email"
//                       placeholder="votre@email.fr"
//                       required
//                       value={loginEmail}
//                       onChange={(e) => setLoginEmail(e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="loginPassword">Mot de passe</Label>
//                     <div className="relative">
//                       <Input
//                         id="loginPassword"
//                         name="loginPassword"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="••••••••"
//                         required
//                         value={loginPassword}
//                         onChange={(e) => setLoginPassword(e.target.value)}
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
//                         onClick={() => setShowPassword(!showPassword)}
//                         aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
//                       >
//                         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2 text-sm">
//                       <input
//                         id="rememberMe"
//                         name="rememberMe"
//                         type="checkbox"
//                         className="rounded border-border"
//                         aria-label="Se souvenir de moi"
//                       />
//                       <Label htmlFor="rememberMe">Se souvenir de moi</Label>
//                     </div>
//                     <Button type="button" variant="link" className="px-0 text-sm">
//                       Mot de passe oublié ?
//                     </Button>
//                   </div>

//                   <Button type="submit" className="w-full">
//                     Se connecter
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Register Tab */}
//           <TabsContent value="register">
//             <Card className="border-border shadow-card">
//               <CardHeader>
//                 <CardTitle className="text-2xl font-roboto">Inscription</CardTitle>
//                 <CardDescription>Créez votre compte pour accéder à WaterQual SEBOU</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {registerError && (
//                   <Alert className="mb-4 border-destructive/40 bg-destructive/10">
//                     <AlertDescription>{registerError}</AlertDescription>
//                   </Alert>
//                 )}
//                 {showRegisterAlert && (
//                   <Alert className="mb-4 border-warning bg-warning/10">
//                     <Clock className="h-4 w-4 text-warning" />
//                     <AlertDescription>
//                       Inscription réussie. Vous pouvez vous connecter maintenant avec un accès utilisateur standard.
//                     </AlertDescription>
//                   </Alert>
//                 )}
//                 <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="firstName">Prénom</Label>
//                       <Input
//                         id="firstName"
//                         name="firstName"
//                         placeholder="Jean"
//                         required
//                         value={registerFirstName}
//                         onChange={(e) => setRegisterFirstName(e.target.value)}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="lastName">Nom</Label>
//                       <Input
//                         id="lastName"
//                         name="lastName"
//                         placeholder="Dupont"
//                         required
//                         value={registerLastName}
//                         onChange={(e) => setRegisterLastName(e.target.value)}
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="registerEmail">Email professionnel</Label>
//                     <Input
//                       id="registerEmail"
//                       name="registerEmail"
//                       type="email"
//                       placeholder="jean.dupont@organisation.fr"
//                       required
//                       value={registerEmail}
//                       onChange={(e) => setRegisterEmail(e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="role">Fonction</Label>
//                     <Input
//                       id="role"
//                       name="role"
//                       placeholder="Chercheur, Ingénieur, Analyste..."
//                       required
//                       value={registerRole}
//                       onChange={(e) => setRegisterRole(e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="registerPassword">Mot de passe</Label>
//                     <div className="relative">
//                       <Input
//                         id="registerPassword"
//                         name="registerPassword"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="••••••••"
//                         required
//                         value={registerPassword}
//                         onChange={(e) => setRegisterPassword(e.target.value)}
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
//                         onClick={() => setShowPassword(!showPassword)}
//                         aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
//                       >
//                         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
//                     <Input
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       type="password"
//                       placeholder="••••••••"
//                       required
//                       value={registerConfirmPassword}
//                       onChange={(e) => setRegisterConfirmPassword(e.target.value)}
//                     />
//                   </div>

//                   <div className="bg-accent/50 p-4 rounded-lg">
//                     <div className="flex items-start space-x-3">
//                       <UserCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
//                       <div>
//                         <h4 className="font-medium text-sm mb-1">Processus de validation</h4>
//                         <p className="text-xs text-muted-foreground">
//                           Les comptes utilisateurs ont un accès limité : Accueil, Dashboard, Dashboard Climate et Contact. Les données brutes restent réservées aux admins.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-start space-x-2">
//                     <input
//                       id="terms"
//                       name="terms"
//                       type="checkbox"
//                       className="mt-1 rounded border-border"
//                       required
//                       aria-label="Accepter les conditions d'utilisation et la politique de confidentialité"
//                     />
//                     <div>
//                       <Label htmlFor="terms" className="text-sm leading-5">
//                         J'accepte les conditions d'utilisation et la politique de confidentialité
//                       </Label>
//                       <div className="text-xs mt-1">
//                         <Button type="button" variant="link" className="px-0 h-auto text-xs">
//                           conditions d'utilisation
//                         </Button>
//                         <span aria-hidden> · </span>
//                         <Button type="button" variant="link" className="px-1 h-auto text-xs">
//                           politique de confidentialité
//                         </Button>
//                       </div>
//                     </div>
//                   </div>

//                   <Button type="submit" className="w-full">
//                     Créer mon compte
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         <div className="text-center mt-6">
//           <p className="text-sm text-muted-foreground">
//             Besoin d'aide ?{" "}
//             <NavLink to="/contact" className="text-primary hover:underline">
//               Contactez-nous
//             </NavLink>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;



/* frontend/src/pages/Login.tsx */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Eye, 
  EyeOff, 
  UserCheck, 
  Clock, 
  Droplets, 
  Waves, 
  Shield, 
  Sparkles,
  Mail,
  Lock,
  User,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { postLoginForm, postRegister } from "@/api/client";
import type { RegisterPayload } from "@/api/client";
import { storeAuthSession } from "@/lib/authz";
import { forgotPassword } from "@/services/passwordResetService";

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
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterAlert, setShowRegisterAlert] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("login");

  // State login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State register
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerRole, setRegisterRole] = useState<string>("ROLE_CONSULTANT");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // ----- LOGIN -----
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const data = await postLoginForm(loginEmail, loginPassword);
      storeAuthSession(data);
      if (data.must_change_password) {
        navigate("/change-password");
      } else {
        navigate("/dashboard-cartographique");
      }
    } catch (err) {
      const message = extractApiError(err);
      setLoginError(message);
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
      setRegisterError(null);
      setShowRegisterAlert(true);
      setTimeout(() => setActiveTab("login"), 3000);
    } catch (err) {
      const message = extractApiError(err);
      setRegisterError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
        
        {/* Motif de vagues */}
        <svg className="absolute bottom-0 left-0 w-full opacity-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#3b82f6" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header avec animation */}
        <div className="text-center mb-8 animate-fadeIn">
          <NavLink to="/" className="inline-flex items-center space-x-4 mb-6 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <img 
                src="/logo.jpg" 
                alt="Logo" 
                className="h-20 w-auto rounded-2xl shadow-2xl ring-4 ring-white/50 group-hover:scale-105 transition-transform duration-300 relative" 
              />
            </div>
            <div className="text-left">
              <h1 className="font-roboto font-bold text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                WaterQual SEBOU
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Droplets className="h-4 w-4 text-blue-500" />
                Système d'aide à la décision
              </p>
            </div>
          </NavLink>
          
          <div className="flex items-center justify-center gap-2">
            <span className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            <span className="text-sm text-gray-500">Plateforme de monitoring hydrologique</span>
            <span className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
            <TabsTrigger 
              value="login"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Connexion
            </TabsTrigger>
            <TabsTrigger 
              value="register"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Inscription
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Barre de gradient */}
              <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Bienvenue
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Accédez à votre tableau de bord WaterQual SEBOU
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {loginError && (
                  <Alert className="mb-4 border-red-200 bg-red-50 text-red-700 animate-shake">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleLoginSubmit} className="space-y-5" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="loginEmail" className="text-gray-700 font-medium">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="loginEmail"
                        name="loginEmail"
                        type="email"
                        placeholder="votre@email.fr"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loginPassword" className="text-gray-700 font-medium">Mot de passe</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="loginPassword"
                        name="loginPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-gray-100"
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
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label="Se souvenir de moi"
                      />
                      <Label htmlFor="rememberMe" className="text-gray-600">Se souvenir de moi</Label>
                    </div>
                    <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="link" className="px-0 text-sm text-blue-600 hover:text-blue-700">
                          Mot de passe oublié ?
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Mot de passe oublié</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 text-sm text-slate-600">
                          <p>Saisis ton email ou username pour envoyer une demande.</p>
                          <Input
                            type="email"
                            placeholder="email ou username"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setForgotOpen(false)}>
                            Annuler
                          </Button>
                          <Button
                            onClick={async () => {
                              await forgotPassword(forgotEmail);
                              setForgotEmail("");
                              setForgotOpen(false);
                              alert("Si le compte existe, la demande a été envoyée.");
                            }}
                          >
                            Envoyer
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/25 transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <span>Se connecter</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                {/* Séparateur */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
                  </div>
                </div>

                {/* Boutons sociaux */}
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Barre de gradient */}
              <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
              
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Créer un compte
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Rejoignez la communauté WaterQual SEBOU
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {registerError && (
                  <Alert className="mb-4 border-red-200 bg-red-50 text-red-700 animate-shake">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{registerError}</AlertDescription>
                  </Alert>
                )}
                
                {showRegisterAlert && (
                  <Alert className="mb-4 border-green-200 bg-green-50 text-green-700 animate-slideDown">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription className="flex items-center gap-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      Inscription réussie ! Redirection vers la connexion...
                    </AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700 font-medium">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Jean"
                          required
                          value={registerFirstName}
                          onChange={(e) => setRegisterFirstName(e.target.value)}
                          className="pl-10 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700 font-medium">Nom</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Dupont"
                        required
                        value={registerLastName}
                        onChange={(e) => setRegisterLastName(e.target.value)}
                        className="border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail" className="text-gray-700 font-medium">Email professionnel</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="registerEmail"
                        name="registerEmail"
                        type="email"
                        placeholder="jean.dupont@organisation.fr"
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-700 font-medium">Rôle</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        id="role"
                        name="role"
                        value={registerRole}
                        onChange={(e) => setRegisterRole(e.target.value)}
                        className="h-11 w-full rounded-md border-2 border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="ROLE_CONSULTANT">Consultant</option>
                        <option value="ROLE_EXPERT">Expert</option>
                        <option value="ROLE_DATA_ADMIN">Data Admin</option>
                        <option value="ROLE_SYS_ADMIN">System Admin</option>
                        <option value="ROLE_DECIDEUR">Décideur</option>
                        <option value="ROLE_AI_AGENT">AI Agent</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerPassword" className="text-gray-700 font-medium">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="registerPassword"
                        name="registerPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-10 pr-10 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm text-purple-900 mb-1 flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          Processus de validation
                        </h4>
                        <p className="text-xs text-purple-700">
                          Les droits d'accès dépendent du rôle choisi (utilisateur, gestionnaire ou admin).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      required
                    />
                    <div>
                      <Label htmlFor="terms" className="text-sm text-gray-700 leading-5">
                        J'accepte les{" "}
                        <Button type="button" variant="link" className="px-0 h-auto text-purple-600 hover:text-purple-700">
                          conditions d'utilisation
                        </Button>{" "}
                        et la{" "}
                        <Button type="button" variant="link" className="px-0 h-auto text-purple-600 hover:text-purple-700">
                          politique de confidentialité
                        </Button>
                      </Label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-600/25 transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <span>Créer mon compte</span>
                    <UserCheck className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Besoin d'aide ?{" "}
            <NavLink to="/contact" className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              Contactez-nous
            </NavLink>
          </p>
        </div>

        {/* Badge de sécurité */}
        <div className="mt-6 flex justify-center items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Connexion sécurisée</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>Chiffrement SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
