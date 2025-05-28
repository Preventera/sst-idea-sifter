
import React, { useState } from 'react';
import { Building2, Users, Shield, User, Plus, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SCIAN_SECTORS, calculateSectorPriorityScore, getPriorityLevel, getPriorityText } from '@/data/scian-sectors';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  hireDate: string;
  certifications: string[];
}

interface Policy {
  id: string;
  title: string;
  type: string;
  lastUpdate: string;
  status: 'active' | 'draft' | 'archived';
  description: string;
}

interface AIProject {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  estimatedBudget: number;
  timeline: string;
  aiTechnology: string;
  expectedBenefits: string[];
}

const AdvancedProfile = () => {
  const { toast } = useToast();
  
  // États pour les données
  const [companyData, setCompanyData] = useState({
    name: 'Entreprise Exemple',
    scianiId: '23',
    address: '123 Rue Example, Ville, QC',
    employees: 150,
    foundedYear: 2010,
    description: 'Une entreprise de construction spécialisée dans les projets résidentiels et commerciaux.'
  });

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Jean Dupont',
      role: 'Superviseur SST',
      department: 'Sécurité',
      hireDate: '2020-01-15',
      certifications: ['CNESST', 'Premiers Soins']
    },
    {
      id: '2',
      name: 'Marie Lambert',
      role: 'Coordonnatrice HSE',
      department: 'HSE',
      hireDate: '2019-03-10',
      certifications: ['ISO 45001', 'Gestion des risques']
    }
  ]);

  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      title: 'Politique de sécurité au travail',
      type: 'Sécurité',
      lastUpdate: '2024-01-15',
      status: 'active',
      description: 'Politique générale de sécurité au travail'
    },
    {
      id: '2',
      title: 'Procédure d\'urgence',
      type: 'Urgence',
      lastUpdate: '2024-02-01',
      status: 'active',
      description: 'Procédures en cas d\'urgence'
    }
  ]);

  const [aiProjects, setAIProjects] = useState<AIProject[]>([
    {
      id: '1',
      name: 'Système de détection des EPI',
      description: 'Système basé sur la vision par ordinateur pour détecter le port d\'EPI',
      status: 'in-progress',
      priority: 'high',
      estimatedBudget: 50000,
      timeline: '6 mois',
      aiTechnology: 'Computer Vision',
      expectedBenefits: ['Réduction des accidents', 'Conformité automatisée']
    }
  ]);

  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({});
  const [newPolicy, setNewPolicy] = useState<Partial<Policy>>({});
  const [newAIProject, setNewAIProject] = useState<Partial<AIProject>>({});

  // Fonctions utilitaires
  const addEmployee = () => {
    if (newEmployee.name && newEmployee.role) {
      const employee: Employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        role: newEmployee.role,
        department: newEmployee.department || '',
        hireDate: newEmployee.hireDate || new Date().toISOString().split('T')[0],
        certifications: []
      };
      setEmployees([...employees, employee]);
      setNewEmployee({});
      toast({ title: "Employé ajouté avec succès" });
    }
  };

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast({ title: "Employé supprimé" });
  };

  const addPolicy = () => {
    if (newPolicy.title && newPolicy.type) {
      const policy: Policy = {
        id: Date.now().toString(),
        title: newPolicy.title,
        type: newPolicy.type,
        lastUpdate: new Date().toISOString().split('T')[0],
        status: 'draft',
        description: newPolicy.description || ''
      };
      setPolicies([...policies, policy]);
      setNewPolicy({});
      toast({ title: "Politique ajoutée avec succès" });
    }
  };

  const removePolicy = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
    toast({ title: "Politique supprimée" });
  };

  const addAIProject = () => {
    if (newAIProject.name && newAIProject.description) {
      const project: AIProject = {
        id: Date.now().toString(),
        name: newAIProject.name,
        description: newAIProject.description,
        status: 'planned',
        priority: 'medium',
        estimatedBudget: newAIProject.estimatedBudget || 0,
        timeline: newAIProject.timeline || '',
        aiTechnology: newAIProject.aiTechnology || '',
        expectedBenefits: []
      };
      setAIProjects([...aiProjects, project]);
      setNewAIProject({});
      toast({ title: "Projet IA ajouté avec succès" });
    }
  };

  const removeAIProject = (id: string) => {
    setAIProjects(aiProjects.filter(project => project.id !== id));
    toast({ title: "Projet IA supprimé" });
  };

  const updateAIProject = (id: string, field: keyof AIProject, value: any) => {
    setAIProjects(projects => 
      projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const currentSector = SCIAN_SECTORS.find(sector => sector.id === companyData.scianiId);
  const priorityScore = currentSector ? calculateSectorPriorityScore(currentSector) : 0;
  const priorityLevel = currentSector ? getPriorityLevel(priorityScore) : 'low';

  return (
    <div className="space-y-6">
      {/* En-tête avec informations de l'entreprise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Profil Avancé - {companyData.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Secteur SCIAN</label>
              <p className="text-lg font-semibold">{currentSector?.name || 'Non défini'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Priorité IA</label>
              <p className="text-lg font-semibold">{getPriorityText(priorityLevel)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Score</label>
              <p className="text-lg font-semibold">{priorityScore}/5</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Employés</label>
              <p className="text-lg font-semibold">{employees.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Gestion des employés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Employés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Formulaire d'ajout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
              <input
                type="text"
                placeholder="Nom complet"
                value={newEmployee.name || ''}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Poste"
                value={newEmployee.role || ''}
                onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Département"
                value={newEmployee.department || ''}
                onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={addEmployee} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>

            {/* Liste des employés */}
            <div className="space-y-2">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div className="flex-1">
                    <h4 className="font-medium">{employee.name}</h4>
                    <p className="text-sm text-gray-600">{employee.role} - {employee.department}</p>
                    <div className="flex gap-1 mt-1">
                      {employee.certifications.map((cert, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEmployee(employee.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Projets IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Projets d'Intelligence Artificielle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Formulaire d'ajout de projet IA */}
            <div className="grid grid-cols-1 gap-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom du projet"
                  value={newAIProject.name || ''}
                  onChange={(e) => setNewAIProject({...newAIProject, name: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Technologie IA"
                  value={newAIProject.aiTechnology || ''}
                  onChange={(e) => setNewAIProject({...newAIProject, aiTechnology: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <textarea
                placeholder="Description du projet"
                value={newAIProject.description || ''}
                onChange={(e) => setNewAIProject({...newAIProject, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Budget estimé ($)"
                  value={newAIProject.estimatedBudget || ''}
                  onChange={(e) => setNewAIProject({...newAIProject, estimatedBudget: Number(e.target.value)})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Timeline"
                  value={newAIProject.timeline || ''}
                  onChange={(e) => setNewAIProject({...newAIProject, timeline: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={addAIProject} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter Projet
                </Button>
              </div>
            </div>

            {/* Liste des projets IA */}
            <div className="space-y-4">
              {aiProjects.map((project) => (
                <div key={project.id} className="border rounded-lg bg-white">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => updateAIProject(project.id, 'name', e.target.value)}
                            className="font-medium text-lg border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                          />
                          <Badge variant={project.priority === 'high' ? 'destructive' : project.priority === 'medium' ? 'default' : 'secondary'}>
                            {project.priority}
                          </Badge>
                          <Badge variant="outline">
                            {project.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Description</label>
                            <textarea
                              value={project.description}
                              onChange={(e) => updateAIProject(project.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={3}
                              placeholder="Description détaillée du projet IA"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Technologie IA</label>
                              <input
                                type="text"
                                value={project.aiTechnology}
                                onChange={(e) => updateAIProject(project.id, 'aiTechnology', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ex: Computer Vision, NLP, ML"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-gray-600">Budget estimé</label>
                              <input
                                type="number"
                                value={project.estimatedBudget}
                                onChange={(e) => updateAIProject(project.id, 'estimatedBudget', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Montant en $"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-gray-600">Timeline</label>
                              <input
                                type="text"
                                value={project.timeline}
                                onChange={(e) => updateAIProject(project.id, 'timeline', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ex: 6 mois, Q2 2024"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Statut</label>
                              <select
                                value={project.status}
                                onChange={(e) => updateAIProject(project.id, 'status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="planned">Planifié</option>
                                <option value="in-progress">En cours</option>
                                <option value="completed">Terminé</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-gray-600">Priorité</label>
                              <select
                                value={project.priority}
                                onChange={(e) => updateAIProject(project.id, 'priority', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="low">Faible</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAIProject(project.id)}
                        className="ml-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Sauvegarder le profil
        </Button>
      </div>
    </div>
  );
};

export default AdvancedProfile;
