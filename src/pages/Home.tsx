
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, CheckCircle, Phone, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Mot de passe trop court (6 caractères minimum)" }),
});

const Home = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
        navigate("/dashboard");
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      
      // Rediriger vers le tableau de bord après connexion
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects",
        variant: "destructive",
      });
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-matte-black border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-xl font-semibold text-terracotta">Archibat CRM</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm text-foreground hover:text-terracotta transition-colors">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-sm text-foreground hover:text-terracotta transition-colors">
              Tarifs
            </a>
            <a href="#contact" className="text-sm text-foreground hover:text-terracotta transition-colors">
              Contact
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <a href="#login-section">
                Se connecter
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-beige to-light-gray dark:from-dark-gray dark:to-matte-black py-16 md:py-24">
        <div className="container mx-auto px-4 md:flex items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Gérer vos projets de vente et faites vos prévisions annuelles avec simplicité
            </h1>
            <p className="text-lg mb-8 text-muted-foreground">
              ArchiPlus vous offre une solution complète pour gérer vos projets
              d'architecture, vos clients, et vos ventes.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="text-terracotta mr-2 h-5 w-5" />
                <span>Suivi de projet en temps réel</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-terracotta mr-2 h-5 w-5" />
                <span>Gestion des clients simplifiée</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-terracotta mr-2 h-5 w-5" />
                <span>Rapports et analyses détaillés</span>
              </div>
            </div>
            <div className="mt-8">
              <Button size="lg" className="bg-terracotta hover:bg-terracotta/90">
                Commencer maintenant
              </Button>
            </div>
          </div>
          
          {/* Login Form */}
          <div id="login-section" className="md:w-5/12">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Connectez-vous à votre compte</CardTitle>
                <CardDescription>
                  Entrez vos identifiants pour accéder à votre tableau de bord
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@exemple.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                {...field} 
                              />
                            </FormControl>
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                              onClick={toggleShowPassword}
                            >
                              {showPassword ? 
                                <EyeOff className="h-4 w-4" /> : 
                                <Eye className="h-4 w-4" />
                              }
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">Se connecter</Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Vous n'avez pas de compte ? <Button variant="link" className="p-0 h-auto text-terracotta hover:underline" onClick={() => setIsDialogOpen(true)}>Créer un compte</Button>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Features Section (placeholder) */}
      <section id="features" className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Fonctionnalités principales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Gestion de projets</h3>
              <p className="text-muted-foreground">
                Suivez facilement l'avancement de vos projets d'architecture de la conception à la livraison.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Gestion clients</h3>
              <p className="text-muted-foreground">
                Centralisez toutes les informations de vos clients et suivez leurs interactions.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Suivi financier</h3>
              <p className="text-muted-foreground">
                Visualisez vos objectifs et suivez vos ventes avec des tableaux de bord détaillés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Create Account Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Création de compte</DialogTitle>
            <DialogDescription>
              Pour créer un compte, veuillez contacter l'administrateur:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2 text-lg">
                <Phone className="h-5 w-5 text-terracotta" />
                <span className="font-medium">55 053 505</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
