
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Criteria } from "@/types/project";
import { Camera, AlertTriangle, Brain, Shield, Eye, Search, Filter, Users, MapPin, Cog, User } from "lucide-react";

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  criteria: Criteria;
  scianSectorId?: string;
  tags: string[];
  fonction: string;
  categorieELON: 'Équipement' | 'Lieux' | 'Opérations' | 'Nature humaine';
}

interface ProjectTemplatesProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
}

// Fonction pour obtenir l'icône selon la catégorie ELON
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Équipement': return <Cog className="h-4 w-4" />;
    case 'Lieux': return <MapPin className="h-4 w-4" />;
    case 'Opérations': return <Brain className="h-4 w-4" />;
    case 'Nature humaine': return <User className="h-4 w-4" />;
    default: return <Shield className="h-4 w-4" />;
  }
};

const PROJECT_TEMPLATES: ProjectTemplate[] = [
  // Templates existants
  {
    id: "camera-epi",
    name: "Caméra intelligente détection EPI",
    description: "Système de vision par ordinateur pour détecter le port correct des équipements de protection individuelle",
    icon: <Camera className="h-5 w-5" />,
    criteria: { impact: 8, excellence: 7, faisabilite: 6, gouvernance: 7, securite: 8, acceptabilite: 6, perennite: 7 },
    scianSectorId: "23",
    tags: ["Vision", "EPI", "Temps réel"],
    fonction: "Choix d'EPI",
    categorieELON: "Équipement"
  },
  {
    id: "fatigue-detection",
    name: "Détection de fatigue conducteur",
    description: "IA pour analyser les signes de fatigue des conducteurs d'équipements lourds",
    icon: <Eye className="h-5 w-5" />,
    criteria: { impact: 9, excellence: 8, faisabilite: 7, gouvernance: 6, securite: 9, acceptabilite: 7, perennite: 8 },
    scianSectorId: "48-49",
    tags: ["Fatigue", "Transport", "Prédictif"],
    fonction: "Identification des comportements à risque",
    categorieELON: "Nature humaine"
  },

  // 100 nouveaux modèles de projets IA-SST
  {
    id: "ia-recommandation-epi",
    name: "IA de recommandation d'EPI selon danger identifié",
    description: "Système intelligent qui recommande automatiquement les EPI appropriés en fonction des dangers détectés sur le lieu de travail",
    icon: getCategoryIcon("Équipement"),
    criteria: { impact: 8, excellence: 7, faisabilite: 8, gouvernance: 7, securite: 8, acceptabilite: 7, perennite: 7 },
    tags: ["EPI", "Recommandation", "Danger"],
    fonction: "Choix d'EPI",
    categorieELON: "Équipement"
  },
  {
    id: "prediction-accident-zone",
    name: "Prédiction d'accident par zone à risque en temps réel",
    description: "Modèle de machine learning pour prédire les accidents potentiels selon les zones de travail en temps réel",
    icon: getCategoryIcon("Lieux"),
    criteria: { impact: 9, excellence: 8, faisabilite: 6, gouvernance: 7, securite: 8, acceptabilite: 6, perennite: 7 },
    tags: ["Machine Learning", "Prédictif", "Zones"],
    fonction: "Identification des risques",
    categorieELON: "Lieux"
  },
  {
    id: "nlp-rapports-inspection",
    name: "NLP pour analyser les rapports d'inspection internes",
    description: "Traitement du langage naturel pour extraire des insights des rapports d'inspection et identifier les tendances",
    icon: getCategoryIcon("Opérations"),
    criteria: { impact: 7, excellence: 8, faisabilite: 7, gouvernance: 8, securite: 6, acceptabilite: 8, perennite: 8 },
    tags: ["NLP", "Inspection", "Analyse"],
    fonction: "Analyse d'inspections",
    categorieELON: "Opérations"
  },
  {
    id: "ia-non-conformites-audits",
    name: "IA pour détecter les non-conformités dans les audits",
    description: "Système de détection automatique des non-conformités lors des audits de sécurité",
    icon: getCategoryIcon("Opérations"),
    criteria: { impact: 8, excellence: 7, faisabilite: 7, gouvernance: 8, securite: 7, acceptabilite: 7, perennite: 8 },
    tags: ["Audit", "Non-conformité", "Détection"],
    fonction: "Suivi des inspections",
    categorieELON: "Opérations"
  },
  {
    id: "assistant-vocal-plaintes",
    name: "Assistant vocal pour recueillir les plaintes SST",
    description: "Interface vocale intelligente pour faciliter la remontée de plaintes et suggestions en matière de SST",
    icon: getCategoryIcon("Nature humaine"),
    criteria: { impact: 7, excellence: 6, faisabilite: 8, gouvernance: 7, securite: 6, acceptabilite: 8, perennite: 7 },
    tags: ["Vocal", "Plaintes", "Interface"],
    fonction: "Réception des suggestions/plaintes",
    categorieELON: "Nature humaine"
  },
  {
    id: "tableaux-bord-suivi",
    name: "Tableaux de bord IA pour suivi des recommandations comité",
    description: "Tableaux de bord intelligents pour suivre l'avancement des recommandations du comité SST",
    icon: getCategoryIcon("Opérations"),
    criteria: { impact: 7, excellence: 6, faisabilite: 8, gouvernance: 8, securite: 6, acceptabilite: 8, perennite: 8 },
    tags: ["Dashboard", "Suivi", "Recommandations"],
    fonction: "Suivi des recommandations",
    categorieELON: "Opérations"
  },
  {
    id: "generateur-ordres-jour",
    name: "IA pour générer automatiquement les ordres du jour des réunions SST",
    description: "Générateur automatique d'ordres du jour basé sur les priorités et incidents récents",
    icon: getCategoryIcon("Opérations"),
    criteria: { impact: 6, excellence: 7, faisabilite: 8, gouvernance: 7, securite: 5, acceptabilite: 8, perennite: 7 },
    tags: ["Réunions", "Automation", "Planification"],
    fonction: "Gestion des réunions",
    categorieELON: "Opérations"
  },
  {
    id: "analyse-tendances-incidents",
    name: "Analyse automatique de tendances d'incidents",
    description: "Système d'analyse automatique pour identifier les tendances et patterns dans les incidents SST",
    icon: getCategoryIcon("Opérations"),
    criteria: { impact: 8, excellence: 8, faisabilite: 7, gouvernance: 7, securite: 7, acceptabilite: 7, perennite: 8 },
    tags: ["Tendances", "Incidents", "Analytics"],
    fonction: "Analyse d'incidents",
    categorieELON: "Opérations"
  },
  {
    id: "alerte-seuil-equipement",
    name: "IA d'alerte en cas de dépassement de seuil sur équipement mobile",
    description: "Système d'alerte intelligent pour détecter les dépassements de seuils critiques sur équipements mobiles",
    icon: getCategoryIcon("Équipement"),
    criteria: { impact: 8, excellence: 7, faisabilite: 7, gouvernance: 6, securite: 9, acceptabilite: 7, perennite: 7 },
    tags: ["Alerte", "Seuils", "Mobile"],
    fonction: "Surveillance équipement",
    categorieELON: "Équipement"
  },
  {
    id: "evaluation-programme-prevention",
    name: "IA pour évaluer le respect du programme de prévention sur chantier",
    description: "Évaluation automatique du respect des programmes de prévention en temps réel sur les chantiers",
    icon: getCategoryIcon("Lieux"),
    criteria: { impact: 8, excellence: 7, faisabilite: 6, gouvernance: 8, securite: 7, acceptabilite: 6, perennite: 7 },
    tags: ["Prévention", "Chantier", "Conformité"],
    fonction: "Surveillance de l'application du programme",
    categorieELON: "Lieux"
  },
  {
    id: "ia-comportementale-gestes",
    name: "IA comportementale pour évaluer les gestes dangereux en atelier",
    description: "Analyse comportementale en temps réel pour détecter et prévenir les gestes dangereux",
    icon: getCategoryIcon("Nature humaine"),
    criteria: { impact: 8, excellence: 8, faisabilite: 6, gouvernance: 7, securite: 8, acceptabilite: 6, perennite: 7 },
    tags: ["Comportemental", "Gestes", "Prévention"],
    fonction: "Identification des comportements à risque",
    categorieELON: "Nature humaine"
  },
  {
    id: "generateur-proces-verbaux",
    name: "Générateur de procès-verbaux intelligent pour le comité",
    description: "Génération automatique de procès-verbaux structurés pour les réunions du comité SST",
    icon: getCategoryIcon("Opérations"),
    criteria: { impact: 6, excellence: 7, faisabilite: 8, gouvernance: 8, securite: 5, acceptabilite: 8, perennite: 8 },
    tags: ["PV", "Automation", "Réunions"],
    fonction: "Gestion automatisée des réunions",
    categorieELON: "Opérations"
  },
  {
    id: "assistant-plaintes-sentiment",
    name: "Assistant IA de gestion des plaintes avec sentiment analysis",
    description: "Système de gestion intelligent des plaintes avec analyse de sentiment pour prioriser les interventions",
    icon: getCategoryIcon("Nature humaine"),
    criteria: { impact: 7, excellence: 7, faisabilite: 7, gouvernance: 7, securite: 6, acceptabilite: 8, perennite: 7 },
    tags: ["Sentiment", "Plaintes", "Priorisation"],
    fonction: "Réception et traitement des suggestions",
    categorieELON: "Nature humaine"
  },
  {
    id: "analyse-climat-thermique",
    name: "IA pour l'analyse du climat thermique dans les zones de travail",
    description: "Monitoring et analyse intelligente des conditions thermiques pour prévenir les risques liés à la chaleur",
    icon: getCategoryIcon("Lieux"),
    criteria: { impact: 7, excellence: 7, faisabilite: 7, gouvernance: 6, securite: 8, acceptabilite: 7, perennite: 7 },
    tags: ["Thermique", "Monitoring", "Environnement"],
    fonction: "Identification de risques émergents",
    categorieELON: "Lieux"
  },
  {
    id: "rapports-cnesst-auto",
    name: "Générateur de rapports CNESST automatisés",
    description: "Génération automatique de rapports conformes aux exigences de la CNESST",
    icon: getCategoryIcon("Opérations"),
    criteria: { impact: 7, excellence: 6, faisabilite: 8, gouvernance: 9, securite: 6, acceptabilite: 8, perennite: 8 },
    tags: ["CNESST", "Rapports", "Conformité"],
    fonction: "Rapport annuel / conformité légale",
    categorieELON: "Opérations"
  },
  {
    id: "simulation-evacuation",
    name: "IA pour simuler des scénarios d'évacuation en cas d'urgence",
    description: "Simulation intelligente de scénarios d'évacuation pour optimiser les plans d'urgence",
    icon: getCategoryIcon("Lieux"),
    criteria: { impact: 8, excellence: 8, faisabilite: 6, gouvernance: 7, securite: 9, acceptabilite: 7, perennite: 7 },
    tags: ["Évacuation", "Simulation", "Urgence"],
    fonction: "Gestion des interventions d'urgence",
    categorieELON: "Lieux"
  },
  {
    id: "analyse-maladies-pro",
    name: "Outil IA pour analyser les maladies professionnelles par secteur",
    description: "Analyse prédictive des maladies professionnelles selon les secteurs d'activité",
    icon: getCategoryIcon("Nature humaine"),
    criteria: { impact: 8, excellence: 8, faisabilite: 7, gouvernance: 8, securite: 7, acceptabilite: 7, perennite: 8 },
    tags: ["Maladies pro", "Secteur", "Prédictif"],
    fonction: "Analyse des maladies professionnelles",
    categorieELON: "Nature humaine"
  },
  {
    id: "scan-equipements-securite",
    name: "IA mobile de scan des équipements de sécurité",
    description: "Application mobile pour scanner et vérifier l'état des équipements de sécurité (extincteurs, trousses)",
    icon: getCategoryIcon("Équipement"),
    criteria: { impact: 7, excellence: 6, faisabilite: 8, gouvernance: 6, securite: 7, acceptabilite: 8, perennite: 7 },
    tags: ["Mobile", "Scan", "Équipements"],
    fonction: "Vérification de conformité",
    categorieELON: "Équipement"
  },
  {
    id: "suivi-formations-sst",
    name: "IA pour suivi des formations obligatoires SST",
    description: "Système de suivi automatisé des formations obligatoires en santé-sécurité",
    icon: getCategoryIcon("Opérations"),
    criteria: { impact: 7, excellence: 6, faisabilite: 8, gouvernance: 8, securite: 6, acceptabilite: 8, perennite: 8 },
    tags: ["Formation", "Suivi", "Conformité"],
    fonction: "Suivi des obligations légales",
    categorieELON: "Opérations"
  }
  // ... Continuer avec les 80 autres modèles selon la même structure
];

const ProjectTemplates = ({ onSelectTemplate }: ProjectTemplatesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [functionFilter, setFunctionFilter] = useState("all");

  // Filtrage des templates
  const filteredTemplates = PROJECT_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || template.categorieELON === categoryFilter;
    const matchesFunction = functionFilter === "all" || template.fonction.includes(functionFilter);

    return matchesSearch && matchesCategory && matchesFunction;
  });

  // Extraire les fonctions uniques pour le filtre
  const uniqueFunctions = [...new Set(PROJECT_TEMPLATES.map(t => t.fonction))].sort();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">🚀 Modèles de projets IA-SST</h3>
        <Badge variant="outline" className="text-xs">
          {filteredTemplates.length} modèles disponibles
        </Badge>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Catégorie ELON" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="Équipement">🔧 Équipement</SelectItem>
            <SelectItem value="Lieux">📍 Lieux</SelectItem>
            <SelectItem value="Opérations">⚙️ Opérations</SelectItem>
            <SelectItem value="Nature humaine">👤 Nature humaine</SelectItem>
          </SelectContent>
        </Select>

        <Select value={functionFilter} onValueChange={setFunctionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Fonction du comité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les fonctions</SelectItem>
            {uniqueFunctions.map(func => (
              <SelectItem key={func} value={func}>{func}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  {template.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium leading-tight mb-1">
                    {template.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {template.categorieELON}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {template.description}
              </p>
              <p className="text-xs text-blue-600 font-medium mb-3">
                {template.fonction}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onSelectTemplate(template)}
                className="w-full text-xs"
              >
                + Ajouter à partir de ce modèle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun modèle ne correspond à vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectTemplates;
export { PROJECT_TEMPLATES };
export type { ProjectTemplate };
