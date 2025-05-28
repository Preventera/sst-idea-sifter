
import React, { useState } from 'react';
import { Building2, Users, Shield, User, ChevronRight, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const SCIANProfileInterface = () => {
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    company: {
      name: '',
      scianCode: '',
      sector: '',
      size: '',
      address: '',
      phone: '',
      email: ''
    },
    actors: [],
    sstCommittee: [],
    cossMembers: [],
    cstcMembers: [],
    management: [],
    hsePolicies: {
      hasWrittenPolicy: false,
      lastReview: '',
      complianceFramework: []
    },
    sstManagementSystem: {
      hasImplementedSystem: false,
      systemType: '',
      certifications: [],
      lastAudit: '',
      systemComponents: []
    },
    riskProfile: {
      primaryRisks: [],
      riskLevel: '',
      previousIncidents: false,
      organizationalContext: {
        workOrganization: '',
        shiftPatterns: [],
        subcontractingLevel: '',
        workforceStability: '',
        safetyClimate: '',
        communicationMethods: [],
        decisionMakingProcess: '',
        changeManagement: ''
      },
      specificSectorRisks: []
    }
  });

  const [activeTab, setActiveTab] = useState('company');

  const scianSectors = [
    { code: '11', name: 'Agriculture, foresterie, pêche et chasse' },
    { code: '21', name: 'Extraction minière, exploitation en carrière, et extraction de pétrole et de gaz' },
    { code: '22', name: 'Services publics' },
    { code: '23', name: 'Construction' },
    { code: '31-33', name: 'Fabrication' },
    { code: '41', name: 'Commerce de gros' },
    { code: '44-45', name: 'Commerce de détail' },
    { code: '48-49', name: 'Transport et entreposage' },
    { code: '51', name: 'Industrie de l\'information et industrie culturelle' },
    { code: '52', name: 'Finance et assurances' },
    { code: '53', name: 'Services immobiliers et services de location et de location à bail' },
    { code: '54', name: 'Services professionnels, scientifiques et techniques' },
    { code: '55', name: 'Gestion de sociétés et d\'entreprises' },
    { code: '56', name: 'Services administratifs, services de soutien, services de gestion des déchets et services d\'assainissement' },
    { code: '61', name: 'Services d\'enseignement' },
    { code: '62', name: 'Soins de santé et assistance sociale' },
    { code: '71', name: 'Arts, spectacles et loisirs' },
    { code: '72', name: 'Services d\'hébergement et de restauration' },
    { code: '81', name: 'Autres services (sauf les administrations publiques)' },
    { code: '91', name: 'Administrations publiques' }
  ];

  const companySizes = [
    'Micro-entreprise (1-4 employés)',
    'Petite entreprise (5-49 employés)',
    'Moyenne entreprise (50-249 employés)',
    'Grande entreprise (250+ employés)'
  ];

  const riskLevels = [
    'Faible',
    'Modéré',
    'Élevé',
    'Très élevé'
  ];

  const complianceFrameworks = [
    'CNESST (Quebec)',
    'RSST (Règlement sur la santé et la sécurité du travail)',
    'CSTC (Code de sécurité pour les travaux de construction)',
    'ISO 45001',
    'ISO 14001',
    'OHSAS 18001',
    'CSA Z1000',
    'ILO-OSH 2001',
    'Autre'
  ];

  const sstSystemTypes = [
    'ISO 45001:2018 - Systèmes de management de la santé et de la sécurité au travail',
    'CSA Z1000-14 - Gestion de la santé et sécurité au travail',
    'ILO-OSH 2001 - Principes directeurs de l\'OIT concernant les systèmes de gestion de la SST',
    'OHSAS 18001 - Systèmes de management de la santé et de la sécurité au travail (obsolète)',
    'AS/NZS 4801 - Systèmes de management de la santé et de la sécurité au travail',
    'BS 8800 - Guide pour les systèmes de management de la santé et de la sécurité au travail',
    'ANSI/AIHA Z10 - Systèmes de management de la santé et sécurité au travail',
    'Système CNESST - Approche québécoise de prévention',
    'DuPont STOP - Sécurité par l\'observation préventive',
    'Behaviour Based Safety (BBS)',
    'Six Sigma SST',
    'Lean Safety Management',
    'Système personnalisé hybride',
    'Pas de système formalisé'
  ];

  const sstCertifications = [
    'ISO 45001:2018 - Certification internationale',
    'CSA Z1000-14 - Certification canadienne',
    'OHSAS 18001 - Certification (en transition)',
    'Certification CNESST Québec',
    'AS/NZS 4801 - Certification Australie/Nouvelle-Zélande',
    'ANSI/AIHA Z10 - Certification américaine',
    'Autre certification nationale',
    'Aucune certification formelle'
  ];

  // Mapping des risques spécifiques par secteur SCIAN
  const sectorSpecificRisks = {
    '11': ['Accidents avec machines agricoles', 'Exposition aux pesticides', 'Chutes', 'Coupures', 'Noyade'],
    '21': ['Effondrement', 'Explosions', 'Exposition à la silice', 'Bruit intense', 'Émanations toxiques'],
    '22': ['Chocs électriques', 'Chutes de hauteur', 'Exposition à l\'amiante', 'Risques chimiques'],
    '23': ['Chutes de hauteur', 'Écrasement par engins', 'Électrocution', 'Bruit', 'Poussières'],
    '31-33': ['Happement par machines', 'Brûlures', 'Exposition chimique', 'Troubles musculosquelettiques', 'Vibrations'],
    '41': ['Manutention manuelle', 'Écrasement', 'Accidents avec chariots élévateurs'],
    '44-45': ['Vol et violence', 'Troubles musculosquelettiques', 'Chutes', 'Coupures'],
    '48-49': ['Accidents de la route', 'Manutention lourde', 'Exposition à substances dangereuses'],
    '62': ['Exposition aux agents biologiques', 'Violence au travail', 'Troubles musculosquelettiques'],
    '72': ['Brûlures', 'Coupures', 'Troubles musculosquelettiques', 'Exposition à agents biologiques']
  };

  const addActor = (type) => {
    const newActor = {
      id: Date.now(),
      name: '',
      role: '',
      department: '',
      email: '',
      phone: '',
      certifications: []
    };

    setProfileData(prev => ({
      ...prev,
      [type]: [...prev[type], newActor]
    }));
  };

  const removeActor = (type, id) => {
    setProfileData(prev => ({
      ...prev,
      [type]: prev[type].filter(actor => actor.id !== id)
    }));
  };

  const updateActor = (type, id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [type]: prev[type].map(actor => 
        actor.id === id ? { ...actor, [field]: value } : actor
      )
    }));
  };

  const updateCompany = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      company: { ...prev.company, [field]: value }
    }));
  };

  const updateSSTSystem = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      sstManagementSystem: { ...prev.sstManagementSystem, [field]: value }
    }));
  };

  const updateRiskProfile = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        riskProfile: { 
          ...prev.riskProfile, 
          [parent]: { ...prev.riskProfile[parent], [child]: value }
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        riskProfile: { ...prev.riskProfile, [field]: value }
      }));
    }
  };

  const updateHSEPolicies = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      hsePolicies: { ...prev.hsePolicies, [field]: value }
    }));
  };

  const getSectorRisks = () => {
    const sector = profileData.company.sector;
    return sectorSpecificRisks[sector] || [];
  };

  const toggleArrayItem = (array, item, updateFunction) => {
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
    updateFunction(newArray);
  };

  const saveProfile = () => {
    toast({
      title: "Profil sauvegardé",
      description: "Le profil SCIAN HSE a été sauvegardé avec succès."
    });
  };

  const renderActorSection = (type, title, actors) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button onClick={() => addActor(type)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {actors.length === 0 ? (
          <p className="text-gray-500 italic">Aucun membre ajouté</p>
        ) : (
          <div className="space-y-4">
            {actors.map((actor) => (
              <div key={actor.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-800">Membre #{actor.id}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeActor(type, actor.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`${type}-${actor.id}-name`}>Nom complet</Label>
                    <Input
                      id={`${type}-${actor.id}-name`}
                      value={actor.name}
                      onChange={(e) => updateActor(type, actor.id, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`${type}-${actor.id}-role`}>Rôle/Fonction</Label>
                    <Input
                      id={`${type}-${actor.id}-role`}
                      value={actor.role}
                      onChange={(e) => updateActor(type, actor.id, 'role', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`${type}-${actor.id}-department`}>Département</Label>
                    <Input
                      id={`${type}-${actor.id}-department`}
                      value={actor.department}
                      onChange={(e) => updateActor(type, actor.id, 'department', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`${type}-${actor.id}-email`}>Email</Label>
                    <Input
                      id={`${type}-${actor.id}-email`}
                      type="email"
                      value={actor.email}
                      onChange={(e) => updateActor(type, actor.id, 'email', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const tabs = [
    { id: 'company', name: 'Entreprise', icon: Building2 },
    { id: 'actors', name: 'Acteurs', icon: Users },
    { id: 'policies', name: 'Politiques HSE', icon: Shield },
    { id: 'system', name: 'Système SST', icon: Shield },
    { id: 'risks', name: 'Profil de Risque', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              Questionnaire IGNITIA - Profil SCIAN HSE
            </CardTitle>
            <p className="text-gray-600">
              Configuration du profil utilisateur pour l'évaluation des risques en santé, sécurité et environnement
            </p>
          </CardHeader>
        </Card>

        {/* Navigation Tabs */}
        <Card className="mb-6">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={20} />
                {tab.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'company' && (
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'entreprise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="company-name">Nom de l'entreprise</Label>
                    <Input
                      id="company-name"
                      value={profileData.company.name}
                      onChange={(e) => updateCompany('name', e.target.value)}
                      placeholder="Nom complet de l'entreprise"
                    />
                  </div>

                  <div>
                    <Label htmlFor="scian-code">Code SCIAN</Label>
                    <Input
                      id="scian-code"
                      value={profileData.company.scianCode}
                      onChange={(e) => updateCompany('scianCode', e.target.value)}
                      placeholder="Ex: 23621"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sector">Secteur d'activité</Label>
                    <Select onValueChange={(value) => updateCompany('sector', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        {scianSectors.map((sector) => (
                          <SelectItem key={sector.code} value={sector.code}>
                            {sector.code} - {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="company-size">Taille de l'entreprise</Label>
                    <Select onValueChange={(value) => updateCompany('size', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la taille" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={profileData.company.address}
                      onChange={(e) => updateCompany('address', e.target.value)}
                      placeholder="Adresse complète"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.company.phone}
                      onChange={(e) => updateCompany('phone', e.target.value)}
                      placeholder="(XXX) XXX-XXXX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.company.email}
                      onChange={(e) => updateCompany('email', e.target.value)}
                      placeholder="contact@entreprise.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'actors' && (
            <div className="space-y-6">
              {renderActorSection('actors', 'Acteurs principaux', profileData.actors)}
              {renderActorSection('sstCommittee', 'Comité SST', profileData.sstCommittee)}
              {renderActorSection('cossMembers', 'Membres CoSS', profileData.cossMembers)}
              {renderActorSection('cstcMembers', 'Responsables CSTC', profileData.cstcMembers)}
              {renderActorSection('management', 'Direction/Dirigeants', profileData.management)}
            </div>
          )}

          {activeTab === 'policies' && (
            <Card>
              <CardHeader>
                <CardTitle>Politiques HSE</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-policy"
                    checked={profileData.hsePolicies.hasWrittenPolicy}
                    onCheckedChange={(checked) => updateHSEPolicies('hasWrittenPolicy', checked)}
                  />
                  <Label htmlFor="has-policy">
                    L'entreprise possède une politique HSE écrite
                  </Label>
                </div>

                <div>
                  <Label htmlFor="last-review">Dernière révision de la politique</Label>
                  <Input
                    id="last-review"
                    type="date"
                    value={profileData.hsePolicies.lastReview}
                    onChange={(e) => updateHSEPolicies('lastReview', e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Cadres de conformité appliqués
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {complianceFrameworks.map((framework) => (
                      <div key={framework} className="flex items-center space-x-2">
                        <Checkbox
                          id={`framework-${framework}`}
                          checked={profileData.hsePolicies.complianceFramework.includes(framework)}
                          onCheckedChange={() => toggleArrayItem(
                            profileData.hsePolicies.complianceFramework,
                            framework,
                            (newArray) => updateHSEPolicies('complianceFramework', newArray)
                          )}
                        />
                        <Label htmlFor={`framework-${framework}`} className="text-sm">{framework}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'system' && (
            <Card>
              <CardHeader>
                <CardTitle>Système de Gestion SST</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-system"
                    checked={profileData.sstManagementSystem.hasImplementedSystem}
                    onCheckedChange={(checked) => updateSSTSystem('hasImplementedSystem', checked)}
                  />
                  <Label htmlFor="has-system">
                    L'entreprise a mis en place un système de gestion SST formalisé
                  </Label>
                </div>

                {profileData.sstManagementSystem.hasImplementedSystem && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="system-type">Type de système SST</Label>
                        <Select onValueChange={(value) => updateSSTSystem('systemType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le système de gestion SST" />
                          </SelectTrigger>
                          <SelectContent>
                            {sstSystemTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="last-audit">Dernier audit du système</Label>
                        <Input
                          id="last-audit"
                          type="date"
                          value={profileData.sstManagementSystem.lastAudit}
                          onChange={(e) => updateSSTSystem('lastAudit', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Certifications SST obtenues
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sstCertifications.map((cert) => (
                          <div key={cert} className="flex items-center space-x-2">
                            <Checkbox
                              id={`cert-${cert}`}
                              checked={profileData.sstManagementSystem.certifications.includes(cert)}
                              onCheckedChange={() => toggleArrayItem(
                                profileData.sstManagementSystem.certifications,
                                cert,
                                (newArray) => updateSSTSystem('certifications', newArray)
                              )}
                            />
                            <Label htmlFor={`cert-${cert}`} className="text-sm">{cert}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risques spécifiques par secteur SCIAN</CardTitle>
                </CardHeader>
                <CardContent>
                  {profileData.company.sector ? (
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-3">
                        Risques identifiés pour le secteur {profileData.company.sector}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getSectorRisks().map((risk) => (
                          <div key={risk} className="flex items-center space-x-2">
                            <Checkbox
                              id={`risk-${risk}`}
                              checked={profileData.riskProfile.specificSectorRisks.includes(risk)}
                              onCheckedChange={() => toggleArrayItem(
                                profileData.riskProfile.specificSectorRisks,
                                risk,
                                (newArray) => updateRiskProfile('specificSectorRisks', newArray)
                              )}
                            />
                            <Label htmlFor={`risk-${risk}`} className="text-sm">{risk}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-amber-600 bg-amber-50 p-4 rounded-lg">
                      Veuillez d'abord sélectionner un secteur d'activité dans l'onglet "Entreprise" pour voir les risques spécifiques.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Évaluation globale des risques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="risk-level">Niveau de risque global évalué</Label>
                    <Select onValueChange={(value) => updateRiskProfile('riskLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Évaluer le niveau de risque" />
                      </SelectTrigger>
                      <SelectContent>
                        {riskLevels.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="previous-incidents"
                      checked={profileData.riskProfile.previousIncidents}
                      onCheckedChange={(checked) => updateRiskProfile('previousIncidents', checked)}
                    />
                    <Label htmlFor="previous-incidents">
                      L'entreprise a eu des incidents HSE significatifs dans les 3 dernières années
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline">
            Annuler
          </Button>
          <Button onClick={saveProfile}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder le profil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SCIANProfileInterface;
