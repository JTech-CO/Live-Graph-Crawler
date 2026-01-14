// ===== Gemini API Integration Module =====

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Search for graph sources using Gemini with Google Search grounding
 */
export async function searchWithGemini(query, apiKey, model = 'gemini-2.5-flash') {
    const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

    const prompt = `You are a specialized search assistant for finding statistical graphs and charts.

User query: "${query}"

Please find and list 5-10 reliable web sources that contain graphs, charts, or statistical visualizations related to this query.

For each source, provide:
1. Title of the page/article
2. Full URL
3. Brief description (1-2 sentences) explaining what graph/chart data it contains
4. Confidence score (0.0-1.0) indicating how likely it is to contain relevant graphs

Return your response in the following JSON format ONLY (no additional text):
{
    "results": [
        {
            "title": "Page title",
            "url": "https://example.com/page",
            "description": "Description of the graph content",
            "confidence": 0.85
        }
    ]
}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                tools: [{
                    googleSearchRetrieval: {
                        dynamicRetrievalConfig: {
                            mode: "MODE_DYNAMIC",
                            dynamicThreshold: 0.7
                        }
                    }
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Gemini API 오류: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text.trim();

        // Parse JSON response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return parsed.results || [];
        }

        throw new Error('Invalid JSON response from Gemini');
    } catch (error) {
        console.error('Gemini search error:', error);
        throw error;
    }
}

/**
 * Validate and enhance results using Gemini
 */
export async function validateResults(results, apiKey, model = 'gemini-2.5-flash') {
    const validatedResults = [];

    for (const result of results) {
        try {
            const validation = await validateSingleResult(
                result.title,
                result.description,
                apiKey,
                model
            );

            if (validation.valid) {
                const reliability = calculateReliability(
                    result.confidence || validation.confidence,
                    extractDomain(result.url)
                );

                validatedResults.push({
                    title: result.title,
                    url: result.url,
                    snippet: result.description,
                    source: extractDomain(result.url),
                    reliability: reliability.level,
                    reliabilityScore: reliability.score
                });
            }
        } catch (error) {
            console.warn('Validation error for result:', error);
            // Use fallback validation
            const fallback = fallbackValidation(result.title, result.description);
            if (fallback.valid) {
                const reliability = calculateReliability(
                    result.confidence || 0.6,
                    extractDomain(result.url)
                );

                validatedResults.push({
                    title: result.title,
                    url: result.url,
                    snippet: result.description,
                    source: extractDomain(result.url),
                    reliability: reliability.level,
                    reliabilityScore: reliability.score
                });
            }
        }
    }

    // Sort by reliability score
    validatedResults.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
    return validatedResults;
}

/**
 * Validate a single result
 */
async function validateSingleResult(title, description, apiKey, model) {
    const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

    const prompt = `Analyze if this web page likely contains graphs, charts, or statistical visualizations:

Title: ${title}
Description: ${description}

Respond with JSON only (no additional text):
{
    "valid": true/false,
    "confidence": 0.0-1.0,
    "reason": "brief explanation"
}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });

    if (!response.ok) {
        throw new Error('Validation API error');
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text.trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
            valid: parsed.valid === true || parsed.valid === 'true',
            confidence: parseFloat(parsed.confidence) || 0.5,
            reason: parsed.reason || 'No reason provided'
        };
    }

    throw new Error('Invalid JSON response');
}

/**
 * Fallback validation using keywords
 */
function fallbackValidation(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    const keywords = [
        'graph', 'chart', 'figure', 'statistic', 'data visualization',
        '그래프', '차트', '통계', '데이터', 'plot', 'diagram'
    ];
    const hasKeyword = keywords.some(keyword => text.includes(keyword));

    return {
        valid: hasKeyword,
        confidence: hasKeyword ? 0.6 : 0.3,
        reason: 'Keyword-based fallback validation'
    };
}

/**
 * Calculate reliability score
 */
function calculateReliability(confidence, domain) {
    const trustedDomains = [
        'arxiv.org', 'nature.com', 'science.org', 'ieee.org', 'acm.org',
        'statista.com', 'gartner.com', 'ourworldindata.org', 'worldbank.org',
        'who.int', 'oecd.org', 'wikipedia.org'
    ];
    const domainLower = domain.toLowerCase();

    let score = confidence;

    // Boost score for trusted domains
    if (trustedDomains.some(trusted => domainLower.includes(trusted))) {
        score = Math.min(score + 0.2, 1.0);
    }

    let level;
    if (score >= 0.7) {
        level = 'high';
    } else if (score >= 0.5) {
        level = 'medium';
    } else {
        level = 'low';
    }

    return { score, level };
}

/**
 * Extract domain from URL
 */
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return 'Unknown';
    }
}
