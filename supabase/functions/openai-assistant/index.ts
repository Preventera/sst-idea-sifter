
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
    const { prompt, context, type } = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not found in environment')
      throw new Error('OpenAI API key not configured')
    }

    console.log('Processing request with type:', type)

    const systemPrompts = {
      project_description: "Tu es un expert en IA-SST qui aide à rédiger des descriptions de projets claires et précises. Génère une description professionnelle et concrète d'un projet d'intelligence artificielle pour la santé-sécurité au travail, basée sur les critères fournis. La description doit être pratique, réalisable et spécifique au domaine SST.",
      project_improvement: "Tu es un assistant de rédaction spécialisé en SST. Améliore le texte fourni pour le rendre plus clair, professionnel et adapté au contexte IA-SST.",
      questionnaire_synthesis: "Tu es un analyste expert en SST qui génère des synthèses structurées. Analyse les réponses du questionnaire et produis une synthèse claire avec des recommandations.",
      project_suggestions: "Tu es un consultant en IA-SST qui suggère des noms de projets pertinents basés sur le secteur d'activité et les critères."
    }

    const systemPrompt = systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.project_description

    console.log('Making request to OpenAI API...')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${prompt}\n\nContexte: ${context || ''}` }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('OpenAI response received successfully')
    
    return new Response(
      JSON.stringify({ 
        result: data.choices[0].message.content,
        usage: data.usage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('OpenAI Assistant Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
