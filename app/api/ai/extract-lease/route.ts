import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // STUB: Here we would use 'pdf-parse' or similar to extract text from the PDF file.
    // For MVP, we simulate text extraction:
    const mockExtractedText = `
      Contrat de location meublée
      Entre le propriétaire et M. Jean Dupont.
      Le bail commence le 01/01/2024 et se termine le 31/12/2024.
      Loyer mensuel charges comprises: 850 euros.
      Dépôt de garantie: 850 euros.
    `;

    // Appel à l'API OpenAI (GPT-4o-mini)
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
            content: "Tu es un assistant expert en immobilier. Ton but est d'extraire les données JSON exactes depuis le texte d'un bail. Le format attendu est: { start_date: 'YYYY-MM-DD', end_date: 'YYYY-MM-DD', monthly_rent: number, tenant_name: string }."
          },
          {
            role: "user",
            content: `Texte du bail :\n${mockExtractedText}`
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API Error: ${openAIResponse.statusText}`);
    }

    const aiData = await openAIResponse.json();
    const extractedJson = JSON.parse(aiData.choices[0].message.content);

    return NextResponse.json({ 
      success: true, 
      data: extractedJson 
    });

  } catch (error: any) {
    console.error("Erreur API extract-lease:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
