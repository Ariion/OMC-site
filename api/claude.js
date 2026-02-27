// api/claude.js
// Proxy serverless Vercel → API Anthropic (Claude)
// La clé ANTHROPIC_API_KEY est une variable d'environnement Vercel — jamais exposée.

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const MAX_ALLOWED_TOKENS = 4096;

function sanitizePayload(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return { error: 'Corps de requête invalide (JSON attendu).' };
    }

    if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
        return { error: 'Le champ "messages" est requis et doit être un tableau non vide.' };
    }

    const rawMaxTokens = Number(payload.max_tokens);
    const max_tokens = Number.isFinite(rawMaxTokens)
        ? Math.max(1, Math.min(Math.floor(rawMaxTokens), MAX_ALLOWED_TOKENS))
        : 1024;

    const rawTemperature = Number(payload.temperature);
    const temperature = Number.isFinite(rawTemperature)
        ? Math.max(0, Math.min(rawTemperature, 1))
        : undefined;

    return {
        payload: {
            model: payload.model || DEFAULT_MODEL,
            max_tokens,
            messages: payload.messages,
            ...(temperature !== undefined ? { temperature } : {}),
        },
    };
}

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY manquante dans les variables Vercel' });

    const { payload, error } = sanitizePayload(req.body);
    if (error) return res.status(400).json({ error });

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) return res.status(response.status).json(data);
        return res.status(200).json(data);
    } catch (err) {
        console.error('Proxy erreur :', err);
        return res.status(500).json({ error: 'Erreur proxy : ' + err.message });
    }
}
