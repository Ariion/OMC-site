// api/claude.js
// Proxy serverless Vercel → API Anthropic (Claude)
// La clé ANTHROPIC_API_KEY est une variable d'environnement Vercel — jamais exposée.

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST')   return res.status(405).json({ error: 'Méthode non autorisée' });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY manquante dans les variables Vercel' });

    // Le body vient directement du client (model, max_tokens, messages)
    const body = req.body;

    // Sécurité : force le modèle à haiku si non précisé
    if (!body.model) body.model = 'claude-haiku-4-5-20251001';

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type':      'application/json',
                'x-api-key':         apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) return res.status(response.status).json(data);
        return res.status(200).json(data);

    } catch (err) {
        console.error('Proxy erreur :', err);
        return res.status(500).json({ error: 'Erreur proxy : ' + err.message });
    }
}