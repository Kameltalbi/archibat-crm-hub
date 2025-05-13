
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, CheckCircle, Phone, Eye, EyeOff, Calendar, BarChart3, Clock, Users } from "lucide-react";
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
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/6e406553-32da-493a-87fe-c175bc00e795.png" 
              alt="Archibat Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm text-foreground hover:text-terracotta transition-colors">
              Fonctionnalités
            </a>
            <a href="#testimonials" className="text-sm text-foreground hover:text-terracotta transition-colors">
              Témoignages
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
      
      {/* Hero Section avec background amélioré */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-beige to-light-gray dark:from-dark-gray dark:to-matte-black opacity-80 z-0"></div>
        <div className="absolute inset-0 bg-[url('/lovable-uploads/cd2bb4ea-8bca-441f-bdff-c9319ac0e042.png')] bg-cover bg-center opacity-10 z-0"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-1">
          <div className="md:flex items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="bg-white/80 dark:bg-matte-black/80 p-6 rounded-lg backdrop-blur-sm">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-charcoal dark:text-white">
                  Gérez vos projets avec simplicité et précision
                </h1>
                <p className="text-lg mb-8 text-muted-foreground">
                  ArchiPlus vous offre une solution complète pour gérer vos projets
                  d'architecture, vos clients, et vos ventes en toute simplicité.
                </p>
                <div className="space-y-4 mb-8">
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
                <Button size="lg" className="bg-terracotta hover:bg-terracotta/90">
                  Demander une démo
                </Button>
              </div>
            </div>
            
            {/* Login Form */}
            <div id="login-section" className="md:w-5/12">
              <Card className="shadow-lg border-0 bg-white/95 dark:bg-dark-gray/95 backdrop-blur-sm">
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
        </div>
      </section>
      
      {/* Features Section améliorée */}
      <section id="features" className="py-16 bg-white dark:bg-matte-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Des fonctionnalités conçues pour les architectes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre plateforme intègre tout ce dont vous avez besoin pour gérer efficacement votre cabinet d'architecture.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-terracotta" />
                </div>
                <CardTitle className="text-xl">Gestion de projets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Suivez tous vos projets de la conception à la livraison avec un système intuitif et personnalisable.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-terracotta" />
                </div>
                <CardTitle className="text-xl">Gestion clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Centralisez et organisez toutes les informations de vos clients pour une meilleure communication.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-terracotta" />
                </div>
                <CardTitle className="text-xl">Suivi financier</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visualisez vos objectifs et suivez vos ventes avec des tableaux de bord détaillés et personnalisables.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-terracotta" />
                </div>
                <CardTitle className="text-xl">Gestion des congés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Planifiez et suivez les congés de votre équipe pour une meilleure organisation interne.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-beige dark:bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ce que disent nos clients</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des cabinets d'architecture de toutes tailles font confiance à notre solution pour simplifier leur gestion quotidienne.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-md border-0">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center text-white font-bold mr-3">
                    M
                  </div>
                  <div>
                    <h4 className="font-semibold">Mehdi Bouaziz</h4>
                    <p className="text-xs text-muted-foreground">Cabinet Architecture Moderne</p>
                  </div>
                </div>
                <p className="italic">
                  "ArchiPlus nous a permis d'améliorer notre productivité de 40% en centralisant toutes nos données de projets et de clients."
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-0">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center text-white font-bold mr-3">
                    S
                  </div>
                  <div>
                    <h4 className="font-semibold">Sofia Hamdi</h4>
                    <p className="text-xs text-muted-foreground">Architectes Associés</p>
                  </div>
                </div>
                <p className="italic">
                  "L'interface intuitive nous permet de gérer facilement nos projets et de suivre notre chiffre d'affaires en temps réel."
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-0">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center text-white font-bold mr-3">
                    A
                  </div>
                  <div>
                    <h4 className="font-semibold">Ahmed Ben Ali</h4>
                    <p className="text-xs text-muted-foreground">Studio Design Architecture</p>
                  </div>
                </div>
                <p className="italic">
                  "Depuis que nous utilisons ArchiPlus, le suivi des projets est beaucoup plus simple et nous avons une meilleure visibilité sur notre activité."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white dark:bg-matte-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos formules</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choisissez l'offre adaptée à la taille de votre cabinet et à vos besoins.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Starter</CardTitle>
                <div className="mt-2 text-3xl font-bold">399 TND<span className="text-sm font-normal text-muted-foreground">/mois</span></div>
                <CardDescription>Pour les petits cabinets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="text-terracotta mr-2 h-4 w-4" />
                  <span>Jusqu'à 5 utilisateurs</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-terracotta mr-2 h-4 w-4" />
                  <span>Gestion de projets</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-terracotta mr-2 h-4 w-4" />
                  <span>Gestion des clients</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Commencer</Button>
              </CardFooter>
            </Card>
            
            <Card className="border-0 shadow-md relative bg-gradient-to-br from-terracotta/5 to-white dark:from-terracotta/20 dark:to-dark-gray">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-terracotta text-white text-xs px-3 py-1 rounded-full">
                Populaire
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Professional</CardTitle>
                <div className="mt-2 text-3xl font-bold">699 TND<span className="text-sm font-normal text-muted-foreground">/mois</span></div>
                <CardDescription>Pour les cabinets de taille moyenne</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="text-terracotta mr-2 h-4 w-4" />
                  <span>Jusqu'à 15 utilisateurs</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-terracotta mr-2 h-4 w-4" />
                  <span>Toutes les fonctionnalités Starter</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-terracotta mr-2 h-4 w-4" />
                  <span>Rapports avancés</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-terracotta mr-2 h-4 w-4" />
                  <span>Support prioritaire</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Essai gratuit de 14 jours</Button>
              </CardFooter>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <div className="mt-2 text-3xl font-bold">Sur mesure</div>
                <CardDescription>Pour les grands cabinets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="text-terracotta mr-2 h-4 w-4" />
                  <span>Utilisateurs illimités</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-terracotta mr-2 h-4 w-4" />
                  <span>Toutes les fonctionnalités Professional</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-terracotta mr-2 h-4 w-4" />
                  <span>API personnalisée</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-terracotta mr-2 h-4 w-4" />
                  <span>Support dédié 24/7</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Contacter les ventes</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-16 bg-beige dark:bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nous contacter</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vous avez des questions ? Notre équipe est là pour vous aider.
            </p>
          </div>
          
          <div className="max-w-md mx-auto p-6 bg-white dark:bg-dark-gray rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="h-6 w-6 text-terracotta" />
                <span className="text-xl font-bold">55 053 505</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="mb-4">Ou envoyez-nous un email à:</p>
              <p className="font-semibold text-terracotta">contact@archibat.com</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-charcoal text-light-gray py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img 
                src="/lovable-uploads/6e406553-32da-493a-87fe-c175bc00e795.png" 
                alt="Archibat Logo" 
                className="h-8 w-auto object-contain mb-4"
              />
              <p className="text-sm text-muted-foreground mb-4">
                La solution complète pour les cabinets d'architecture moderne.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-light-gray hover:text-terracotta">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-light-gray hover:text-terracotta">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-light-gray hover:text-terracotta">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-light-gray hover:text-terracotta">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-terracotta">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-terracotta">Tarifs</a></li>
                <li><a href="#" className="hover:text-terracotta">Nouveautés</a></li>
                <li><a href="#" className="hover:text-terracotta">Feuille de route</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-terracotta">Blog</a></li>
                <li><a href="#" className="hover:text-terracotta">Documentation</a></li>
                <li><a href="#" className="hover:text-terracotta">Tutoriels</a></li>
                <li><a href="#" className="hover:text-terracotta">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-terracotta">À propos</a></li>
                <li><a href="#" className="hover:text-terracotta">Carrières</a></li>
                <li><a href="#" className="hover:text-terracotta">Mentions légales</a></li>
                <li><a href="#" className="hover:text-terracotta">Politique de confidentialité</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-muted pt-8 mt-8 text-sm text-muted-foreground text-center">
            <p>&copy; {new Date().getFullYear()} Archibat. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

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
