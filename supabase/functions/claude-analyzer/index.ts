import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, analysisType, context } = await req.json()
    
    const claudeApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!claudeApiKey) {
      console.error('ANTHROPIC_API_KEY not found in environment')
      throw new Error('Anthropic API key not configured')
    }

    console.log('Processing Claude request with analysisType:', analysisType)

    const systemPrompts = {
      questionnaire_analysis: "Tu es un expert en analyse de données SST. Analyse les réponses du questionnaire IGNITIA et identifie les patterns, priorités et recommandations clés. Fournis une analyse structurée avec des insights actionnables pour l'amélioration de la sécurité au travail.",
      response_patterns: "Tu es un analyste de données spécialisé en SST. Détecte les patterns dans les réponses et identifie les lacunes ou incohérences potentielles.",
      risk_assessment: "Tu es un expert en évaluation des risques SST. Analyse le contenu fourni et identifie les risques prioritaires à adresser.",
      compliance_check: "Tu es un expert en conformité réglementaire SST. Vérifie la conformité du projet avec les exigences réglementaires et identifie les points d'attention.",
      project_ideas: `Tu es un expert HSE spécialisé dans l'application de l'intelligence artificielle pour la prévention des accidents et l'amélioration de la performance sécurité. 

Génère une étude de cas d'usage d'IA structurée selon ce format:

Étape 1 : Identification du problème
- Description spécifique du risque SST ciblé
- Impact en termes de sécurité, coûts, opérations

Étape 2 : Applicabilité de l'IA
- Technologies IA pertinentes (Machine Learning, Computer Vision, NLP, etc.)
- Valeur ajoutée de l'IA pour la prévention proactive

Étape 3 : Conception de la solution
- Architecture IA proposée avec type de modèle adapté
- Modules clés: alertes temps réel, tableaux de bord HSE, etc.

Étape 4 : Données nécessaires
- Sources de données: historiques incidents, logs machine, vidéos, capteurs
- Processus de nettoyage, structuration et labellisation

Étape 5 : Développement du modèle
- Algorithme sélectionné (Random Forest, CNN, LSTM, etc.)
- Métriques de performance et méthodes de test

Étape 6 : Intégration dans le système HSE
- Intégration avec environnement existant (ERP, plateforme sécurité, app mobile)
- Formation nécessaire pour les utilisateurs

Étape 7 : Évaluation continue
- Métriques de succès: réduction incidents, taux d'alerte, faux positifs
- Stratégie d'amélioration continue avec feedback utilisateurs

Étape 8 : Catégorie ELON
- Catégorie prioritaire: [Équipement / Lieux / Opérations / Nature Humaine]
- Justification de cette catégorisation

Réponds de manière structurée et concrète, adaptée au contexte SST fourni.`
    }

    const systemPrompt = systemPrompts[analysisType as keyof typeof systemPrompts] || systemPrompts.questionnaire_analysis

    console.log('Making request to Claude API...')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claudeApiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nTexte à analyser: ${text}\n\nContexte: ${context || ''}`
          }
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Claude API error:', errorData)
      throw new Error(errorData.error?.message || `Claude API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Claude response received successfully')

    return new Response(
      JSON.stringify({ 
        result: data.content[0].text,
        usage: data.usage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Claude Analyzer Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})