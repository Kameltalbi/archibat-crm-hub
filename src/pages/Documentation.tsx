
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, FileText, Users, Package, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Documentation = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Documentation CRM</h1>
          <p className="text-muted-foreground">
            Guide d'utilisation et tâches prioritaires pour les collaborateurs
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Tâches prioritaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>Compléter les informations manquantes des clients (RAS)</li>
              <li>Mettre à jour la liste des produits par catégorie</li>
              <li>Commencer à saisir les ventes par projet</li>
            </ul>
            <div className="mt-4 flex flex-col space-y-2">
              <Button 
                variant="outline" 
                onClick={() => navigate("/clients")}
                className="justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Aller à la liste des clients
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/products")}
                className="justify-start"
              >
                <Package className="mr-2 h-4 w-4" />
                Aller à la liste des produits
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/projects")}
                className="justify-start"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Aller aux projets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Guide d'utilisation du CRM</CardTitle>
          <CardDescription>
            Découvrez comment utiliser efficacement notre système de gestion de la relation client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="overview">
              <AccordionTrigger>Vue d'ensemble du CRM</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  Notre CRM Archibat est un outil complet conçu pour gérer les clients, les projets, 
                  les produits et les ventes. Il vous permet de suivre l'activité commerciale,
                  de planifier les projets et de générer des rapports sur les performances.
                </p>
                <p>
                  Le système est composé de plusieurs modules interconnectés :
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Tableau de bord</strong> : Affiche une vue synthétique de l'activité</li>
                  <li><strong>Clients</strong> : Gestion complète de la base clients</li>
                  <li><strong>Projets</strong> : Suivi des projets en cours et terminés</li>
                  <li><strong>Produits</strong> : Catalogue des produits et services</li>
                  <li><strong>Ventes</strong> : Enregistrement des ventes par projet</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="clients">
              <AccordionTrigger>Gestion des clients</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="font-medium text-red-600">
                  ⚠️ ACTION REQUISE : Compléter les informations RAS pour tous les clients
                </p>
                <p>
                  Le module Clients vous permet de gérer l'ensemble de votre base clients. 
                  Pour chaque client, nous devons disposer d'informations complètes et à jour.
                </p>
                <h3 className="text-lg font-medium mt-4">Comment ajouter un client :</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Accédez à la page Clients</li>
                  <li>Cliquez sur le bouton "Ajouter un client"</li>
                  <li>Remplissez le formulaire avec toutes les informations requises</li>
                  <li>Assurez-vous de compléter tous les champs, même facultatifs si possible</li>
                  <li>Cliquez sur "Enregistrer" pour créer le client</li>
                </ol>
                
                <h3 className="text-lg font-medium mt-4">Comment mettre à jour un client existant :</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Accédez à la page Clients</li>
                  <li>Trouvez le client dans la liste (utilisez la recherche si nécessaire)</li>
                  <li>Cliquez sur l'icône de modification à côté du client</li>
                  <li>Mettez à jour les informations manquantes (RAS)</li>
                  <li>Cliquez sur "Enregistrer" pour sauvegarder les modifications</li>
                </ol>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4 dark:bg-blue-950/20 dark:border-blue-900">
                  <h4 className="text-md font-medium text-blue-700 dark:text-blue-400">Rappel important</h4>
                  <p className="text-sm mt-1 text-blue-700 dark:text-blue-300">
                    Pour chaque client, assurez-vous d'avoir :
                    <br />- Nom complet
                    <br />- Email professionnel
                    <br />- Numéro de téléphone
                    <br />- Adresse complète
                    <br />- Numéro TVA (si applicable)
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="products">
              <AccordionTrigger>Gestion des produits</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="font-medium text-red-600">
                  ⚠️ ACTION REQUISE : Mettre à jour la liste des produits par catégorie
                </p>
                <p>
                  Le module Produits vous permet de gérer votre catalogue de produits et services.
                  Une bonne organisation par catégories est essentielle pour faciliter la saisie des ventes.
                </p>
                
                <h3 className="text-lg font-medium mt-4">Comment ajouter un produit :</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Accédez à la page Produits</li>
                  <li>Cliquez sur le bouton "Ajouter un produit"</li>
                  <li>Sélectionnez la catégorie appropriée (ou créez-en une nouvelle)</li>
                  <li>Remplissez tous les détails du produit : nom, prix, description</li>
                  <li>Cliquez sur "Enregistrer" pour ajouter le produit au catalogue</li>
                </ol>
                
                <h3 className="text-lg font-medium mt-4">Comment organiser les catégories :</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Créez des catégories distinctes pour chaque type de produit ou service</li>
                  <li>Utilisez des noms clairs et descriptifs pour les catégories</li>
                  <li>Pensez à créer des catégories pour : Travaux, Services, Matériaux, Études, etc.</li>
                  <li>Assignez chaque produit à la catégorie appropriée</li>
                </ul>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4 dark:bg-blue-950/20 dark:border-blue-900">
                  <h4 className="text-md font-medium text-blue-700 dark:text-blue-400">Conseil</h4>
                  <p className="text-sm mt-1 text-blue-700 dark:text-blue-300">
                    Pour faciliter la saisie des ventes, assurez-vous que vos produits soient correctement 
                    catégorisés et que leurs prix soient à jour. Cela permettra de gagner du temps lors de 
                    l'enregistrement des ventes par projet.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="projects">
              <AccordionTrigger>Gestion des projets et ventes</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="font-medium text-red-600">
                  ⚠️ ACTION REQUISE : Commencer à saisir les ventes par projet
                </p>
                <p>
                  Le module Projets permet de suivre vos projets et d'y associer des ventes.
                  Pour chaque projet, vous pouvez enregistrer les ventes réalisées, ce qui permet de 
                  suivre la progression par rapport à l'objectif de chiffre d'affaires.
                </p>
                
                <h3 className="text-lg font-medium mt-4">Comment ajouter des ventes à un projet :</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Accédez à la page Projets</li>
                  <li>Cliquez sur un projet pour accéder à sa page détaillée</li>
                  <li>Cliquez sur le bouton "Ajouter une vente"</li>
                  <li>Sélectionnez un client et un produit dans les listes</li>
                  <li>Vérifiez ou ajustez le montant de la vente</li>
                  <li>Ajoutez une date et des remarques si nécessaire</li>
                  <li>Cliquez sur "Enregistrer la vente"</li>
                </ol>
                
                <h3 className="text-lg font-medium mt-4">Suivi de la progression du projet :</h3>
                <p>
                  Sur la page détaillée d'un projet, vous pouvez voir :
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>L'objectif de chiffre d'affaires défini pour le projet</li>
                  <li>Le montant total des ventes déjà réalisées</li>
                  <li>Une barre de progression montrant l'avancement par rapport à l'objectif</li>
                  <li>La liste détaillée de toutes les ventes associées au projet</li>
                </ul>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4 dark:bg-blue-950/20 dark:border-blue-900">
                  <h4 className="text-md font-medium text-blue-700 dark:text-blue-400">Important</h4>
                  <p className="text-sm mt-1 text-blue-700 dark:text-blue-300">
                    Pour une bonne gestion, veillez à saisir les ventes régulièrement et à les catégoriser 
                    correctement. Cela permettra d'obtenir des statistiques précises et des prévisions fiables.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="reports">
              <AccordionTrigger>Rapports et statistiques</AccordionTrigger>
              <AccordionContent>
                <p>
                  Le tableau de bord principal vous donne une vue d'ensemble des performances :
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Chiffre d'affaires total et par période</li>
                  <li>Répartition des ventes par catégorie</li>
                  <li>Liste des projets récents</li>
                  <li>Top clients par chiffre d'affaires</li>
                </ul>
                <p className="mt-4">
                  Pour des analyses plus détaillées, consultez les pages spécifiques de chaque module.
                  Plus les données saisies seront complètes, plus les rapports seront précis et utiles.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="bestpractices">
              <AccordionTrigger>Bonnes pratiques</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-4">
                  <li>
                    <strong>Saisie régulière</strong> : Prenez l'habitude de mettre à jour le CRM 
                    quotidiennement ou au moins plusieurs fois par semaine.
                  </li>
                  <li>
                    <strong>Données complètes</strong> : Renseignez le maximum d'informations pour 
                    chaque entité (client, projet, produit, vente).
                  </li>
                  <li>
                    <strong>Standardisation</strong> : Utilisez des conventions de nommage cohérentes 
                    pour les clients, projets et produits.
                  </li>
                  <li>
                    <strong>Catégorisation</strong> : Assignez toujours une catégorie aux projets 
                    et produits pour faciliter l'analyse.
                  </li>
                  <li>
                    <strong>Commentaires</strong> : N'hésitez pas à ajouter des remarques pour 
                    contextualiser les informations importantes.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="support">
              <AccordionTrigger>Besoin d'aide ?</AccordionTrigger>
              <AccordionContent>
                <p>
                  En cas de question ou de difficulté avec le CRM, n'hésitez pas à contacter 
                  votre administrateur système ou à consulter cette documentation.
                </p>
                <p className="mt-4">
                  La réussite de notre CRM dépend de la participation de tous. Merci de votre contribution !
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="flex justify-center mt-8">
            <Button 
              variant="default" 
              size="lg"
              className="flex items-center gap-2"
              onClick={() => window.print()}
            >
              <FileText className="h-4 w-4" />
              Imprimer cette documentation
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
            Points clés à retenir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Le CRM permet de gérer clients, projets, produits et ventes</li>
            <li>Actions prioritaires : compléter les informations RAS des clients</li>
            <li>Organiser les produits par catégories pour faciliter la saisie</li>
            <li>Enregistrer les ventes par projet pour suivre la progression</li>
            <li>Mettre à jour le CRM régulièrement pour des données fiables</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documentation;
