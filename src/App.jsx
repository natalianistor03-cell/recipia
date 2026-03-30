import { useState, useRef } from "react";

const MODELS = [
  { id: "openrouter/free", label: "Auto (mejor modelo gratuito disponible)" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B" },
  { id: "deepseek/deepseek-r1:free", label: "DeepSeek R1" },
  { id: "google/gemma-3-27b-it:free", label: "Gemma 3 27B" },
  { id: "nvidia/llama-3.1-nemotron-70b-instruct:free", label: "Nemotron 70B" },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --cream: #faf6ef; --ink: #1a1410; --terracotta: #c4622d; --sage: #7a8c6e; --warm-grey: #e8e0d5; --accent: #d4a853; }
  body { background: var(--cream); color: var(--ink); font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  .app { max-width: 820px; margin: 0 auto; padding: 48px 24px; }
  .header { text-align: center; margin-bottom: 56px; }
  .header-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: var(--terracotta); margin-bottom: 16px; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: clamp(36px, 6vw, 64px); font-weight: 400; line-height: 1.1; color: var(--ink); margin-bottom: 12px; }
  .header h1 em { font-style: italic; color: var(--terracotta); }
  .header p { font-size: 15px; color: #7a6f63; font-weight: 300; max-width: 420px; margin: 0 auto; line-height: 1.6; }
  .divider { width: 60px; height: 1px; background: var(--accent); margin: 24px auto; }
  .api-section { background: white; border: 1px solid var(--warm-grey); border-radius: 4px; padding: 28px; margin-bottom: 32px; position: relative; overflow: hidden; }
  .api-section::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--terracotta); }
  .api-label { font-size: 11px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--sage); margin-bottom: 10px; display: block; }
  .api-key-row { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; }
  .api-input { flex: 1; padding: 12px 16px; border: 1px solid var(--warm-grey); border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 14px; background: var(--cream); color: var(--ink); outline: none; transition: border-color 0.2s; }
  .api-input:focus { border-color: var(--terracotta); }
  .api-link { font-size: 12px; color: var(--terracotta); text-decoration: none; white-space: nowrap; border-bottom: 1px solid transparent; transition: border-color 0.2s; }
  .api-link:hover { border-color: var(--terracotta); }
  .section-label { font-size: 11px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--sage); margin-bottom: 14px; }
  .ingredient-input-row { display: flex; gap: 10px; margin-bottom: 16px; }
  .text-input { flex: 1; padding: 12px 16px; border: 1px solid var(--warm-grey); border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 15px; background: white; color: var(--ink); outline: none; transition: border-color 0.2s; }
  .text-input:focus { border-color: var(--terracotta); }
  .text-input::placeholder { color: #b5a99b; }
  .btn-add { padding: 12px 20px; background: var(--ink); color: var(--cream); border: none; border-radius: 2px; font-size: 20px; cursor: pointer; transition: background 0.2s; line-height: 1; }
  .btn-add:hover { background: var(--terracotta); }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; min-height: 40px; margin-bottom: 8px; }
  .tag { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: white; border: 1px solid var(--warm-grey); border-radius: 100px; font-size: 13px; color: var(--ink); animation: popIn 0.2s ease; }
  @keyframes popIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .tag-remove { background: none; border: none; cursor: pointer; color: #b5a99b; font-size: 16px; line-height: 1; padding: 0; transition: color 0.15s; }
  .tag-remove:hover { color: var(--terracotta); }
  .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 28px 0; }
  .option-group label { display: block; font-size: 11px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--sage); margin-bottom: 8px; }
  .select { width: 100%; padding: 12px 16px; border: 1px solid var(--warm-grey); border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 14px; background: white; color: var(--ink); outline: none; cursor: pointer; appearance: none; }
  .select:focus { border-color: var(--terracotta); }
  .btn-generate { width: 100%; padding: 18px; background: var(--terracotta); color: white; border: none; border-radius: 2px; font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
  .btn-generate:hover:not(:disabled) { background: #a8501f; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(196,98,45,0.25); }
  .btn-generate:disabled { opacity: 0.5; cursor: not-allowed; }
  .loading { text-align: center; padding: 56px 0; }
  .loading-dots { display: inline-flex; gap: 8px; margin-bottom: 16px; }
  .loading-dots span { width: 8px; height: 8px; border-radius: 50%; background: var(--terracotta); animation: bounce 1.2s infinite; }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-10px); opacity: 1; } }
  .loading p { font-family: 'Playfair Display', serif; font-style: italic; color: #7a6f63; font-size: 16px; }
  .recipe-card { margin-top: 48px; animation: fadeUp 0.5s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .recipe-header { border-bottom: 1px solid var(--warm-grey); padding-bottom: 28px; margin-bottom: 32px; }
  .recipe-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: var(--terracotta); margin-bottom: 12px; }
  .recipe-title { font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 42px); font-weight: 400; line-height: 1.15; color: var(--ink); margin-bottom: 12px; }
  .recipe-meta { display: flex; gap: 24px; flex-wrap: wrap; }
  .meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #7a6f63; }
  .recipe-body { display: grid; grid-template-columns: 1fr 2fr; gap: 48px; }
  @media (max-width: 600px) { .recipe-body { grid-template-columns: 1fr; } .options-grid { grid-template-columns: 1fr; } }
  .recipe-section-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 400; color: var(--ink); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--warm-grey); }
  .ingredients-list { list-style: none; }
  .ingredients-list li { padding: 8px 0; font-size: 14px; color: var(--ink); border-bottom: 1px solid #f0ebe3; line-height: 1.5; display: flex; gap: 8px; }
  .ingredients-list li::before { content: '—'; color: var(--terracotta); flex-shrink: 0; }
  .steps-list { list-style: none; counter-reset: steps; }
  .steps-list li { counter-increment: steps; padding: 0 0 20px 44px; position: relative; font-size: 15px; line-height: 1.7; color: #3d342c; }
  .steps-list li::before { content: counter(steps); position: absolute; left: 0; top: 2px; width: 28px; height: 28px; background: var(--terracotta); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; }
  .tip-box { margin-top: 32px; padding: 20px 24px; background: white; border-left: 3px solid var(--accent); border-radius: 0 4px 4px 0; }
  .tip-label { font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
  .tip-box p { font-size: 14px; color: #6b5f52; line-height: 1.6; font-style: italic; }
  .error-box { background: #fff5f2; border: 1px solid #f5c6b8; border-radius: 4px; padding: 16px 20px; margin-top: 16px; font-size: 14px; color: #8b2500; line-height: 1.5; }
  .model-used { font-size: 11px; color: #b5a99b; margin-top: 8px; font-style: italic; }
`;

function parseRecipe(text) {
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const recipe = { title: '', time: '', servings: '', difficulty: '', ingredients: [], steps: [], tip: '' };
  let mode = '';
  for (const line of lines) {
    const clean = line.replace(/^[\*\#\-]+\s*/, '').trim();
    if (!recipe.title && (line.startsWith('# ') || line.toLowerCase().includes('receta:'))) {
      recipe.title = clean.replace(/^receta:\s*/i, '');
    } else if (/tiempo|time/i.test(line) && line.includes(':')) {
      recipe.time = line.split(':')[1].trim();
    } else if (/raciones|porciones|servings/i.test(line) && line.includes(':')) {
      recipe.servings = line.split(':')[1].trim();
    } else if (/dificultad|difficulty/i.test(line) && line.includes(':')) {
      recipe.difficulty = line.split(':')[1].trim();
    } else if (/ingredientes/i.test(line)) {
      mode = 'ingredients';
    } else if (/preparaci|instrucciones|pasos|elaboraci/i.test(line)) {
      mode = 'steps';
    } else if (/consejo|tip|nota/i.test(line)) {
      mode = 'tip';
    } else if (mode === 'ingredients' && clean) {
      recipe.ingredients.push(clean.replace(/^[\-\*]\s*/, ''));
    } else if (mode === 'steps' && clean && !/^##/.test(line)) {
      recipe.steps.push(clean.replace(/^\d+[\.\)]\s*/, ''));
    } else if (mode === 'tip' && clean) {
      recipe.tip += (recipe.tip ? ' ' : '') + clean;
    } else if (!recipe.title && clean.length > 3 && clean.length < 80 && !clean.includes(':')) {
      recipe.title = recipe.title || clean;
    }
  }
  return recipe;
}

export default function RecipeGenerator() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(MODELS[0].id);
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [cuisine, setCuisine] = useState('cualquiera');
  const [diet, setDiet] = useState('ninguna');
  const [time, setTime] = useState('cualquiera');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [usedModel, setUsedModel] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef();

  const addIngredient = () => {
    const val = ingredient.trim();
    if (val && !ingredients.includes(val)) {
      setIngredients([...ingredients, val]);
      setIngredient('');
      inputRef.current?.focus();
    }
  };

  const removeIngredient = (i) => setIngredients(ingredients.filter((_, idx) => idx !== i));
  const handleKeyDown = (e) => { if (e.key === 'Enter') addIngredient(); };

  const generate = async () => {
    if (!apiKey) { setError('Introduce tu API key de OpenRouter.'); return; }
    if (ingredients.length === 0) { setError('Añade al menos un ingrediente.'); return; }
    setError(''); setLoading(true); setRecipe(null); setUsedModel('');

    const prompt = `Eres un chef experto. Crea una receta detallada usando principalmente estos ingredientes: ${ingredients.join(', ')}.
${cuisine !== 'cualquiera' ? `Estilo de cocina: ${cuisine}.` : ''}
${diet !== 'ninguna' ? `Restricción dietética: ${diet}.` : ''}
${time !== 'cualquiera' ? `Tiempo máximo de preparación: ${time}.` : ''}

Responde SOLO con la receta en este formato:
# [Nombre creativo de la receta]
Tiempo: [X minutos]
Raciones: [N personas]
Dificultad: [Fácil/Media/Difícil]

## Ingredientes
- [cantidad] ingrediente

## Preparación
1. [Paso detallado]
(mínimo 5 pasos)

## Consejo del chef
[Un consejo útil]`;

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://claude.ai',
          'X-Title': 'Generador de Recetas',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500,
          temperature: 0.9,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || `Error ${res.status}`);
      const text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error('Respuesta vacía del modelo.');
      setUsedModel(data?.model || '');
      setRecipe(parseRecipe(text));
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <header className="header">
          <p className="header-eyebrow">Recipia</p>
          <h1>Genera tu <em>receta</em> perfecta</h1>
          <div className="divider" />
          <p>Dinos qué tienes en la nevera y te creamos una receta deliciosa al instante.</p>
        </header>

        <div className="api-section">
          <label className="api-label">OpenRouter API Key</label>
          <div className="api-key-row">
            <input type="password" className="api-input" placeholder="sk-or-v1-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            <a className="api-link" href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">Obtener gratis →</a>
          </div>
          <label className="api-label">Modelo</label>
          <select className="select" value={model} onChange={(e) => setModel(e.target.value)}>
            {MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 28 }}>
          <p className="section-label">Ingredientes disponibles</p>
          <div className="ingredient-input-row">
            <input ref={inputRef} type="text" className="text-input" placeholder="ej. tomate, huevos, queso..." value={ingredient} onChange={(e) => setIngredient(e.target.value)} onKeyDown={handleKeyDown} />
            <button className="btn-add" onClick={addIngredient}>+</button>
          </div>
          <div className="tags">
            {ingredients.map((ing, i) => (
              <span key={i} className="tag">{ing}<button className="tag-remove" onClick={() => removeIngredient(i)}>×</button></span>
            ))}
          </div>
        </div>

        <div className="options-grid">
          <div className="option-group">
            <label>Tipo de cocina</label>
            <select className="select" value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
              <option value="cualquiera">Cualquiera</option>
              <option value="española">Española</option>
              <option value="italiana">Italiana</option>
              <option value="mexicana">Mexicana</option>
              <option value="asiática">Asiática</option>
              <option value="mediterránea">Mediterránea</option>
              <option value="francesa">Francesa</option>
            </select>
          </div>
          <div className="option-group">
            <label>Dieta</label>
            <select className="select" value={diet} onChange={(e) => setDiet(e.target.value)}>
              <option value="ninguna">Sin restricciones</option>
              <option value="vegetariana">Vegetariana</option>
              <option value="vegana">Vegana</option>
              <option value="sin gluten">Sin gluten</option>
              <option value="sin lactosa">Sin lactosa</option>
              <option value="keto">Keto</option>
            </select>
          </div>
          <div className="option-group">
            <label>Tiempo máximo</label>
            <select className="select" value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="cualquiera">Sin límite</option>
              <option value="15 minutos">15 minutos</option>
              <option value="30 minutos">30 minutos</option>
              <option value="45 minutos">45 minutos</option>
              <option value="1 hora">1 hora</option>
            </select>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        <button className="btn-generate" onClick={generate} disabled={loading}>
          {loading ? 'Creando tu receta...' : 'Generar receta'}
        </button>

        {loading && (
          <div className="loading">
            <div className="loading-dots"><span /><span /><span /></div>
            <p>Consultando al chef...</p>
          </div>
        )}

        {recipe && !loading && (
          <div className="recipe-card">
            <div className="recipe-header">
              <p className="recipe-eyebrow">Tu receta</p>
              <h2 className="recipe-title">{recipe.title || 'Receta especial'}</h2>
              <div className="recipe-meta">
                {recipe.time && <span className="meta-item">⏱ {recipe.time}</span>}
                {recipe.servings && <span className="meta-item">👥 {recipe.servings}</span>}
                {recipe.difficulty && <span className="meta-item">📊 {recipe.difficulty}</span>}
              </div>
              {usedModel && <p className="model-used">Generado con: {usedModel}</p>}
            </div>
            <div className="recipe-body">
              <div>
                <h3 className="recipe-section-title">Ingredientes</h3>
                <ul className="ingredients-list">
                  {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="recipe-section-title">Preparación</h3>
                <ol className="steps-list">
                  {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
                {recipe.tip && (
                  <div className="tip-box">
                    <p className="tip-label">Consejo del chef</p>
                    <p>{recipe.tip}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}