/* frontend/src/pages/Contact.tsx */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  Users,
  Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    setIsSubmitted(true);
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@hydroqual-dss.fr",
      description: "Support technique et commercial"
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "+33 (0)4 XX XX XX XX",
      description: "Lundi à vendredi, 9h-18h"
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "Laboratoire C4E",
      description: "Université de Recherche, Campus Sciences"
    },
    {
      icon: Clock,
      title: "Horaires",
      value: "Lun-Ven: 9h-18h",
      description: "Support disponible 24/7"
    }
  ];

  const departments = [
    {
      icon: Users,
      title: "Support Technique",
      email: "support@hydroqual-dss.fr",
      description: "Assistance technique et dépannage"
    },
    {
      icon: Building,
      title: "Partenariats",
      email: "partenariats@hydroqual-dss.fr",
      description: "Collaborations et projets"
    },
    {
      icon: Mail,
      title: "Administration",
      email: "admin@hydroqual-dss.fr", 
      description: "Validation des comptes et accès"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-roboto font-bold mb-6">
              Nous Contacter
            </h1>
            <p className="text-xl opacity-90">
              Notre équipe d'experts est à votre disposition pour vous accompagner
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl font-roboto">Envoyez-nous un message</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <Alert className="border-secondary bg-secondary/10">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <AlertDescription>
                      Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input
                          id="firstName"
                          placeholder="Jean"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                          id="lastName"
                          placeholder="Dupont"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jean.dupont@organisation.fr"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organisation</Label>
                        <Input
                          id="organization"
                          placeholder="Université, Laboratoire, Entreprise..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+212 X XX XX XX XX"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet *</Label>
                      <Input
                        id="subject"
                        placeholder="Demande d'information, support technique..."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Décrivez votre demande en détail..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        En soumettant ce formulaire, vous acceptez que vos données soient utilisées 
                        pour traiter votre demande conformément à notre politique de confidentialité.
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full md:w-auto">
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl font-roboto">Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{info.title}</h4>
                        <p className="text-sm font-medium text-primary">{info.value}</p>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Departments */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl font-roboto">Départements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept, index) => {
                  const Icon = dept.icon;
                  return (
                    <div key={index} className="border-b border-border last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start space-x-3">
                        <div className="bg-secondary/10 p-2 rounded-lg">
                          <Icon className="h-4 w-4 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{dept.title}</h4>
                          <p className="text-sm text-primary font-medium">{dept.email}</p>
                          <p className="text-xs text-muted-foreground">{dept.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Location Map Placeholder */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl font-roboto">Localisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Carte interactive</p>
                    <p className="text-xs text-muted-foreground">Laboratoire C4E</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;