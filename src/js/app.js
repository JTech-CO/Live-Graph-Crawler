// ===== Configuration =====
const STORAGE_KEYS = {
    GEMINI_API_KEY: 'gemini_api_key',
    SELECTED_MODEL: 'selected_model'
};

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// ===== State Management =====
let isSearching = false;

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    checkApiKey();
    loadModelSelection();
});

// ===== API Key Management =====
function checkApiKey() {
    const geminiKey = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);

    if (!geminiKey) {
        document.getElementById('apiKeyWarning').style.display = 'block';
        openApiKeyModal();
    }
}

function openApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    modal.classList.add('show');

    // Load existing values
    document.getElementById('geminiApiKey').value = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || '';
    document.getElementById('modelSelect').value = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || 'gemini-2.5-flash';
}

function closeApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    modal.classList.remove('show');
}

function saveApiKey() {
    const geminiKey = document.getElementById('geminiApiKey').value.trim();
    const model = document.getElementById('modelSelect').value;

    if (geminiKey) {
        localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, geminiKey);
        localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, model);
        updateModelIndicator();
        document.getElementById('apiKeyWarning').style.display = 'none';
        closeApiKeyModal();
    } else {
        showError('Gemini API 키를 입력해주세요.');
    }
}

function clearApiKey() {
    if (confirm('API 키를 삭제하시겠습니까?')) {
        localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
        localStorage.removeItem(STORAGE_KEYS.SELECTED_MODEL);
        document.getElementById('geminiApiKey').value = '';
        document.getElementById('apiKeyWarning').style.display = 'block';
    }
}

function loadModelSelection() {
    updateModelIndicator();
}

function updateModelIndicator() {
    const model = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || 'gemini-2.5-flash';
    const modelName = model.includes('flash') ? 'Gemini 2.5 Flash' : 'Gemini 2.5 Pro';
    document.getElementById('modelIndicator').textContent = `Model: ${modelName}`;
}

// ===== Search Handling =====
function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
}

async function performSearch() {
    const query = document.getElementById('searchInput').value.trim();

    if (!query) {
        showError('검색어를 입력해주세요.');
        return;
    }

    const geminiKey = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);

    if (!geminiKey) {
        showError('Gemini API 키가 설정되지 않았습니다. API 키를 입력해주세요.');
        openApiKeyModal();
        return;
    }

    if (isSearching) return;

    try {
        isSearching = true;
        showLoading();
        hideError();
        hideEmpty();
        clearResults();

        const model = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || 'gemini-2.5-flash';

        // Search using Gemini with grounding
        const searchResults = await searchWithGemini(query, geminiKey, model);
        console.log('Search results:', searchResults);

        if (searchResults.length === 0) {
            showEmpty();
            return;
        }

        // Validate results
        const validatedResults = await validateResults(searchResults, geminiKey, model);
        console.log('Validated results:', validatedResults);

        // Display results
        displayResults(validatedResults);

        if (validatedResults.length === 0) {
            showEmpty();
        }

    } catch (error) {
        console.error('Search error:', error);
        showError(error.message || '검색 중 오류가 발생했습니다.');
    } finally {
        isSearching = false;
        hideLoading();
    }
}

// ===== Gemini API Functions =====
async function searchWithGemini(query, apiKey, model = 'gemini-2.5-flash') {
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
                    google_search: {}
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

async function validateResults(results, apiKey, model = 'gemini-2.5-flash') {
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

function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return 'Unknown';
    }
}

// ===== UI State Management =====
function showLoading() {
    document.getElementById('loadingState').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingState').style.display = 'none';
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorState').style.display = 'block';
}

function hideError() {
    document.getElementById('errorState').style.display = 'none';
}

function showEmpty() {
    document.getElementById('emptyState').style.display = 'block';
}

function hideEmpty() {
    document.getElementById('emptyState').style.display = 'none';
}

function clearResults() {
    document.getElementById('resultsContainer').innerHTML = '';
}

// ===== Results Display =====
function displayResults(results) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';

    results.forEach(result => {
        const card = createResultCard(result);
        container.appendChild(card);
    });
}

function createResultCard(result) {
    const card = document.createElement('div');
    card.className = 'result-card';

    const title = document.createElement('div');
    title.className = 'result-title';
    title.innerHTML = `<a href="${result.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(result.title)}</a>`;

    const meta = document.createElement('div');
    meta.className = 'result-meta';

    const source = document.createElement('span');
    source.textContent = result.source;

    const badge = document.createElement('span');
    badge.className = `reliability-badge reliability-${result.reliability}`;
    badge.textContent = result.reliability === 'high' ? 'High Reliability' :
        result.reliability === 'medium' ? 'Medium Reliability' : 'Low Reliability';

    meta.appendChild(source);
    meta.appendChild(badge);

    const snippet = document.createElement('div');
    snippet.className = 'result-snippet';
    snippet.textContent = result.snippet;

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(snippet);

    return card;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Make functions globally accessible =====
window.openApiKeyModal = openApiKeyModal;
window.closeApiKeyModal = closeApiKeyModal;
window.saveApiKey = saveApiKey;
window.clearApiKey = clearApiKey;
window.handleSearchKeyPress = handleSearchKeyPress;
window.performSearch = performSearch;
