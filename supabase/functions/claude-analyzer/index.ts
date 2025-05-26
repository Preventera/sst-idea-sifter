
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
      throw new Error('Anthropic API key not configured')
    }

    const systemPrompts = {
      questionnaire_analysis: "Tu es un expert en analyse de données SST. Analyse les réponses du questionnaire IGNITIA et identifie les patterns, priorités et recommandations clés. Fournis une analyse structurée avec des insights actionnables.",
      response_patterns: "Tu es un analyste de données spécialisé en SST. Détecte les patterns dans les réponses et identifie les lacunes ou incohérences potentielles.",
      risk_assessment: "Tu es un expert en évaluation des risques SST. Analyse le contenu fourni et identifie les risques prioritaires à adresser.",
      compliance_check: "Tu es un expert en conformité réglementaire SST. Vérifie la conformité du projet avec les exigences réglementaires et identifie les points d'attention."
    }

    const systemPrompt = systemPrompts[analysisType as keyof typeof systemPrompts] || systemPrompts.questionnaire_analysis

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

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Claude API error')
    }

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
