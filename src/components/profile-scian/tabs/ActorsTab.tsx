import React from 'react';
import { Actor } from '@/types/profile-scian';
import { ActorSection } from '@/components/profile-scian/common';

interface ActorsTabProps {
  actors: Actor[];
  sstCommittee: Actor[];
  cossMembers: Actor[];
  cstcMembers: Actor[];
  management: Actor[];
  onAddActor: (type: 'actors' | 'sstCommittee' | 'cossMembers' | 'cstcMembers' | 'management') => void;
  onRemoveActor: (type: 'actors' | 'sstCommittee' | 'cossMembers' | 'cstcMembers' | 'management', id: number) => void;
  onUpdateActor: (type: 'actors' | 'sstCommittee' | 'cossMembers' | 'cstcMembers' | 'management', id: number, field: keyof Actor, value: string) => void;
}

/**
 * Composant pour l'onglet Acteurs du profil SCIAN
 */
const ActorsTab: React.FC<ActorsTabProps> = ({
  actors,
  sstCommittee,
  cossMembers,
  cstcMembers,
  management,
  onAddActor,
  onRemoveActor,
  onUpdateActor
}) => {
  return (
    <div className="space-y-6">
      {/* Section des acteurs principaux */}
      <ActorSection
        title="Acteurs principaux"
        actors={actors}
        onAddActor={() => onAddActor('actors')}
        onRemoveActor={(id) => onRemoveActor('actors', id)}
        onUpdateActor={(id, field, value) => onUpdateActor('actors', id, field, value)}
      />

      {/* Section du comité SST */}
      <ActorSection
        title="Comité SST"
        actors={sstCommittee}
        onAddActor={() => onAddActor('sstCommittee')}
        onRemoveActor={(id) => onRemoveActor('sstCommittee', id)}
        onUpdateActor={(id, field, value) => onUpdateActor('sstCommittee', id, field, value)}
      />

      {/* Section des membres CoSS */}
      <ActorSection
        title="Membres CoSS"
        actors={cossMembers}
        onAddActor={() => onAddActor('cossMembers')}
        onRemoveActor={(id) => onRemoveActor('cossMembers', id)}
        onUpdateActor={(id, field, value) => onUpdateActor('cossMembers', id, field, value)}
      />

      {/* Section des membres CSTC */}
      <ActorSection
        title="Responsables CSTC (Code de sécurité pour les travaux de construction)"
        actors={cstcMembers}
        onAddActor={() => onAddActor('cstcMembers')}
        onRemoveActor={(id) => onRemoveActor('cstcMembers', id)}
        onUpdateActor={(id, field, value) => onUpdateActor('cstcMembers', id, field, value)}
      />

      {/* Section des membres de la direction */}
      <ActorSection
        title="Direction/Dirigeants"
        actors={management}
        onAddActor={() => onAddActor('management')}
        onRemoveActor={(id) => onRemoveActor('management', id)}
        onUpdateActor={(id, field, value) => onUpdateActor('management', id, field, value)}
      />
    </div>
  );
};

export default ActorsTab;