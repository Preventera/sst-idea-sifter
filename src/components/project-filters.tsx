
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { SCIAN_SECTORS } from "@/data/scian-sectors";

interface ProjectFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  sectorFilter: string;
  setSectorFilter: (sector: string) => void;
  scoreFilter: string;
  setScoreFilter: (score: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const ProjectFilters = ({
  searchTerm,
  setSearchTerm,
  priorityFilter,
  setPriorityFilter,
  sectorFilter,
  setSectorFilter,
  scoreFilter,
  setScoreFilter,
  onClearFilters,
  hasActiveFilters
}: ProjectFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-700">Filtres et recherche</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les priorités" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les priorités</SelectItem>
              <SelectItem value="high">🟢 Haute priorité</SelectItem>
              <SelectItem value="medium">🟡 Priorité moyenne</SelectItem>
              <SelectItem value="low">🔴 Priorité faible</SelectItem>
              <SelectItem value="undefined">Non définie</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les secteurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les secteurs</SelectItem>
              {SCIAN_SECTORS.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
              <SelectItem value="undefined">Non spécifié</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les scores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les scores</SelectItem>
              <SelectItem value="8+">Score ≥ 8</SelectItem>
              <SelectItem value="6+">Score ≥ 6</SelectItem>
              <SelectItem value="4+">Score ≥ 4</SelectItem>
              <SelectItem value="&lt;4">Score &lt; 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
              <Badge variant="outline">
                Recherche: "{searchTerm}"
              </Badge>
            )}
            {priorityFilter !== "all" && (
              <Badge variant="outline">
                Priorité: {priorityFilter === "high" ? "Haute" : priorityFilter === "medium" ? "Moyenne" : priorityFilter === "low" ? "Faible" : "Non définie"}
              </Badge>
            )}
            {sectorFilter !== "all" && (
              <Badge variant="outline">
                Secteur: {sectorFilter === "undefined" ? "Non spécifié" : SCIAN_SECTORS.find(s => s.id === sectorFilter)?.name}
              </Badge>
            )}
            {scoreFilter !== "all" && (
              <Badge variant="outline">
                Score: {scoreFilter}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectFilters;
