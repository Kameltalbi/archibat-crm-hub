
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Mot de passe trop court (6 caractères minimum)" }),
});

const Home = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-matte-black border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-xl font-semibold text-terracotta">ArchiPlus</span>
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
              <Link to="/clients">
                Se connecter
                <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-beige to-light-gray dark:from-dark-gray dark:to-matte-black py-16 md:py-24">
        <div className="container mx-auto px-4 md:flex items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Gérer vos projets architecture avec simplicité
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
          <div className="md:w-5/12">
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
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
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
                  Vous n'avez pas de compte ? <Link to="/signup" className="text-terracotta hover:underline">Créer un compte</Link>
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
    </div>
  );
};

export default Home;
