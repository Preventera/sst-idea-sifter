
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
      throw new Error('OpenAI API key not configured')
    }

    const systemPrompts = {
      project_description: "Tu es un expert en IA-SST qui aide à rédiger des descriptions de projets claires et précises. Génère une description professionnelle basée sur les critères fournis.",
      project_improvement: "Tu es un assistant de rédaction spécialisé en SST. Améliore le texte fourni pour le rendre plus clair, professionnel et adapté au contexte IA-SST.",
      questionnaire_synthesis: "Tu es un analyste expert en SST qui génère des synthèses structurées. Analyse les réponses du questionnaire et produis une synthèse claire avec des recommandations.",
      project_suggestions: "Tu es un consultant en IA-SST qui suggère des noms de projets pertinents basés sur le secteur d'activité et les critères."
    }

    const systemPrompt = systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.project_improvement

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

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error')
    }

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
