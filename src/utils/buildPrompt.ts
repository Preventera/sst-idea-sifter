import type { ProfileData } from "@/components/profile-scian/types";

export const buildPrompt = (profile: ProfileData) => {
  const { company, riskProfile, maturityScores } = profile;

  return `
🔹 *Contexte entreprise*
Nom : ${company.name}
Secteur SCIAN : ${company.scianCode} – ${company.scianDescription}
Taille : ${company.numberOfEmployees || "NC"} salariés

🔹 *Profil de risques*
Niveau global : ${riskProfile.overallRiskLevel}
Principaux risques : ${riskProfile.primaryRisks.join(", ") || "NC"}

🔹 *Maturité IA (échelle 1-5)*
Gouvernance données : ${maturityScores.dataGovernance}
Intégration processus : ${maturityScores.processIntegration}
Change management : ${maturityScores.changeManagement}

🟢 **Ta mission** : propose 3 idées de projets IA-SST innovants et réalistes.
Pour chaque idée, fournis :
1. Titre (max 10 mots)
2. Problème SST ciblé
3. Technologie IA principale
4. Gains mesurables (SST + ROI)
5. Complexité (1-5)
`;
};
