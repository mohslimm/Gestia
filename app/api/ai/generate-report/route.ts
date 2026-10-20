import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { owner_id } = await request.json();

    if (!owner_id) {
      return NextResponse.json({ error: 'owner_id is required' }, { status: 400 });
    }

    const supabase = createClient();

    // STUB: Fetch real metrics for the owner from Supabase
    // const { data: reports } = await supabase.from('monthly_reports')...
    const mockMetrics = {
      period: "Novembre 2024",
      total_revenue: 4500,
      total_expenses: 320,
      occupancy_rate: 95,
      resolved_tickets: 2,
      late_payments: 1
    };

    // Génération du résumé par OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant expert en immobilier. Tu rédiges un petit paragraphe de synthèse très professionnel et bienveillant à destination d'un propriétaire bailleur, pour résumer son mois."
          },
          {
            role: "user",
            content: `Voici les données du mois :\n${JSON.stringify(mockMetrics)}`
          }
        ]
      })
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API Error: ${openAIResponse.statusText}`);
    }

    const aiData = await openAIResponse.json();
    const ai_summary = aiData.choices[0].message.content;

    // STUB: Save report in DB
    // await supabase.from('monthly_reports').insert({ owner_id, period: mockMetrics.period, ... })

    return NextResponse.json({ 
      success: true, 
      summary: ai_summary,
      metrics: mockMetrics
    });

  } catch (error: any) {
    console.error("Erreur API generate-report:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
