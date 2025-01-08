'use server';

import { encode } from 'html-entities';

export async function generateReport(achados: string, exame: string, includeImpressions: boolean = false, includeDifferentialDiagnosis: boolean = false, includeFollowUpRecommendations: boolean = false): Promise<string> {
 try {
   // 1) ENVIRONMENT READINESS CHECK
   if (!process.env.RADIOLOGY_SYSTEM_PROMPT) {
     throw new Error('RADIOLOGY_SYSTEM_PROMPT is not set in the environment variables');
   }
   const systemPrompt = process.env.RADIOLOGY_SYSTEM_PROMPT;

   // 2) CHAIN-OF-THOUGHT SUB-AGENT
   const chainOfThought = await chainOfThoughtSubAgent(achados, exame);

   // 3) FINAL REPORT SUB-AGENT
   const reportContentResponse = await finalReportSubAgent(achados, exame, systemPrompt);
   const content = reportContentResponse.choices?.[0]?.message?.content;

   if (!content) {
     throw new Error('No content in response');
   }

   // Create the report object
   const reportData = {
     examType: exame,
     findings: achados,
     generatedReport: content, 
     aiInsights: await generateAIInsights(content)
   };

   // 4) PARSE ORGANIZED SECTIONS
   const sections = parseReportSections(reportData.generatedReport, chainOfThought);

   // 5) DEEP AI INSIGHTS SUB-AGENT
   sections.aiInsights = await aiInsightsSubAgent(sections.report, exame);

   // 6) GENERATE IMPRESSIONS (if requested)
   if (includeImpressions) {
     sections.impressions = await generateImpressions(sections.report, exame);
   }

   // 7) GENERATE DIFFERENTIAL DIAGNOSIS
   if (includeDifferentialDiagnosis) {
     const differentialDiagnosisXml = await generateDifferentialDiagnosis(sections.report, exame);
     sections.differentialDiagnosis = sanitizeXml(differentialDiagnosisXml);
   }

   // 8) GENERATE FOLLOW-UP RECOMMENDATIONS
   if (includeFollowUpRecommendations) {
     const followUpRecommendationsXml = await generateFollowUpRecommendations(sections.report, exame);
     sections.followUpRecommendations = sanitizeXml(followUpRecommendationsXml);
   }

   // Ensure we're returning a properly formatted JSON string with sanitized XML
   const result = JSON.stringify({
     thinking: sanitizeXml(chainOfThought),
     report: sections.report,
     aiInsights: sanitizeXml(sections.aiInsights),
     impressions: includeImpressions ? sections.impressions : undefined,
     logica: sanitizeXml(sections.logica),
     differentialDiagnosis: includeDifferentialDiagnosis ? sections.differentialDiagnosis : undefined,
     followUpRecommendations: includeFollowUpRecommendations ? sections.followUpRecommendations : undefined
   }, null, 2);

   console.log('Generated report sections:', sections);
   return result;
 } catch (error) {
   console.error('Error in generateReport:', error);
   return JSON.stringify({
     error: error instanceof Error ? error.message : 'Failed to generate report',
     details: error instanceof Error ? error.stack : 'No stack trace available'
   });
 }
}

// Helper function to sanitize XML content
function sanitizeXml(content: string): string {
 if (!content) return '';
 
 // Encode XML special characters while preserving XML tags
 return content.replace(/(<[^>]*>)|([^<>]+)/g, (match, tag, text) => {
   if (tag) {
     // Don't encode content inside XML tags
     return tag;
   }
   // Encode text content
   return encode(text, { level: 'xml' });
 });
}

async function chainOfThoughtSubAgent(achados: string, exame: string): Promise<string> {
 try {
   const systemPrompt = `Você é um renomado radiologista clínico e pesquisador, com extenso conhecimento de técnicas avançadas de imagem, ampla experiência em correlações clínicas complexas e domínio de diretrizes internacionais. 

IMPORTANTE:
1. Forneça uma análise detalhada em 5 a 10 passos lógicos.
2. Cada citação DEVE ter confiança mínima de 0.8 (80%).
3. APENAS inclua citações que você tenha CERTEZA ABSOLUTA da existência e precisão.
4. Para informações sem citações diretas confiáveis, recomende livros-texto ou diretrizes específicas.
5. Priorize citações de:
   - Artigos indexados no PubMed/MEDLINE
   - Diretrizes de sociedades radiológicas reconhecidas
   - Livros-texto clássicos da radiologia
6. Se houver qualquer dúvida sobre a precisão da citação, SUBSTITUA por uma recomendação de literatura.

Analyze step-by-step the given findings, explaining your detailed thought process e priorizando uma linha de raciocínio sólido e fundamentado. Preserve clareza, objetividade e rigor técnico em todas as fases. Após concluir a análise, forneça uma seção 'Lógica' bem estruturada com no mínimo 5 e no máximo 10 etapas. Para cada etapa, apresente:

- Título
- Descrição detalhada
- Implicação clínica
- Citação (APENAS se tiver 100% de certeza) OU recomendação de literatura

Formate o resultado conforme:

${encode(`<logica>
<step1>
<title>Título do Passo 1</title>
<description>Descrição detalhada do passo 1</description>
<implication>Implicação clínica do passo 1</implication>
<citation>Citação verificada com alta confiança OU recomendação de literatura</citation>
</step1>
<step2>
...
</step2>
[até step10]
</logica>`, { level: 'xml' })}`;

   const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
       'HTTP-Referer': 'https://v0.dev',
       'X-Title': 'Radiology CoT Generator'
     },
     body: JSON.stringify({
       model: "anthropic/claude-3.5-sonnet-20241022:beta",
       messages: [
         {
           role: "system",
           content: systemPrompt
         },
         {
           role: "user",
           content: `Exame: ${exame}
Achados: ${achados}

Forneça uma análise em cadeia de pensamento (Chain of Thought) para estes achados, em PT-BR, passo a passo, concisa mas impressionante para radiologistas. Inclua uma seção 'Lógica' com 5-10 passos estruturados, cada um com título, descrição, implicação e citação verificada ou recomendação de literatura.`
         }
       ],
       temperature: 0.3, // Reduced temperature for more precise outputs
       max_tokens: 2000
     })
   });

   if (!response.ok) {
     throw new Error(`Chain of Thought API request failed: ${response.statusText}`);
   }

   const data = await response.json();
   return sanitizeXml(data.choices?.[0]?.message?.content || "Não foi possível gerar cadeia de pensamento.");
 } catch (error) {
   console.error('Error in chainOfThoughtSubAgent:', error);
   throw error;
 }
}

async function finalReportSubAgent(achados: string, exame: string, systemPrompt: string): Promise<{ choices: { message: { content: string } }[] }> {
 try {
   const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
       'HTTP-Referer': 'https://v0.dev',
       'X-Title': 'Radiology Report Generator'
     },
     body: JSON.stringify({
       model: "anthropic/claude-3.5-sonnet-20241022:beta",
       messages: [
         {
           role: "system",
           content: systemPrompt
         },
         {
           role: "user",
           content: `Exame: ${exame}
Achados: ${achados}

Como um radiologista de referência, gere um laudo radiológico detalhado para este exame de ${exame}, usando linguagem clara, correlacionando os achados com possíveis diagnósticos, e integrando conhecimento técnico avançado com diretrizes clínicas.`
         }
       ],
       temperature: 0.3,
       max_tokens: 6000
     })
   });

   if (!response.ok) {
     throw new Error(`Final report API request failed: ${response.statusText}`);
   }

   const data = await response.json();
   return data;
 } catch (error) {
   console.error('Error in finalReportSubAgent:', error);
   throw error;
 }
}

function parseReportSections(reportContent: string, chainOfThought: string) {
 const sections = {
   thinking: chainOfThought,
   planning: '',
   report: reportContent,
   aiInsights: '',
   impressions: '',
   logica: '',
   differentialDiagnosis: '',
   followUpRecommendations: ''
 };

 const planningMatch = reportContent.match(/<planejamento_laudo>([\s\S]*?)<\/planejamento_laudo>/);
 if (planningMatch) {
   sections.planning = planningMatch[1].trim();
   sections.report = reportContent.replace(planningMatch[0], '').trim();
 }

 const logicaMatch = chainOfThought.match(/<logica>([\s\S]*?)<\/logica>/);
 if (logicaMatch) {
   sections.logica = logicaMatch[1].trim();
 }

 return sections;
}

async function aiInsightsSubAgent(report: string, examType: string): Promise<string> {
 try {
   const systemPrompt = `Você é um radiologista reconhecido internacionalmente, versado em técnicas de ponta de imagem, conhecimento profundo sobre condições raras e familiarizado com a literatura científica mais recente. 

IMPORTANTE:
1. Forneça no mínimo 5 insights avançados.
2. Cada citação DEVE ter confiança mínima de 0.8 (80%).
3. APENAS inclua citações que você tenha CERTEZA ABSOLUTA da existência e precisão.
4. Para informações sem citações diretas confiáveis, recomende livros-texto ou diretrizes específicas.
5. Priorize citações de:
   - Artigos indexados no PubMed/MEDLINE
   - Diretrizes de sociedades radiológicas reconhecidas
   - Livros-texto clássicos da radiologia
6. Se houver qualquer dúvida sobre a precisão da citação, SUBSTITUA por uma recomendação de literatura.

Ao analisar o laudo radiológico a seguir, apresente insights que sejam genuinamente avançados e agreguem alto valor clínico. Vá além de constatações triviais, mencionando possíveis diagnósticos raros, correlação com estudos recentes, e implicações clínicas relevantes. Siga estritamente o seguinte formato:

${encode(`<insights>
<insight1>
<title>Título do Insight 1</title>
<description>Descrição detalhada do insight avançado</description>
<implication>Implicação clínica aprofundada</implication>
<citation>Citação verificada com alta confiança OU recomendação de literatura</citation>
</insight1>
<insight2>...
</insight2>
</insights>`, { level: 'xml' })}`;

   const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
       'HTTP-Referer': 'https://v0.dev',
       'X-Title': 'Insights Radiológicos Avançados'
     },
     body: JSON.stringify({
       model: "anthropic/claude-3.5-sonnet-20241022:beta",
       messages: [
         {
           role: "system",
           content: systemPrompt
         },
         {
           role: "user",
           content: `Tipo de exame: ${examType}

Laudo radiológico:

${report}

Baseado neste laudo, forneça ao menos 5 insights radiológicos extremamente avançados e aprofundados, com citações verificadas ou recomendações de literatura.`
         }
       ],
       temperature: 0.3,
       max_tokens: 3000
     })
   });

   if (!response.ok) {
     throw new Error(`Falha na requisição da API de Insights: ${response.statusText}`);
   }

   const data = await response.json();
   return sanitizeXml(data.choices?.[0]?.message?.content || "Não foi possível gerar insights avançados.");
 } catch (error) {
   console.error('Erro em aiInsightsSubAgent:', error);
   throw error;
 }
}

export async function generateImpressions(findings: string, examType: string): Promise<string> {
 try {
   const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
       'HTTP-Referer': 'https://v0.dev',
       'X-Title': 'Radiology Impressions Generator'
     },
     body: JSON.stringify({
       model: "anthropic/claude-3.5-sonnet-20241022:beta",
       messages: [
         {
           role: "system",
           content: "Você é um radiologista especialista com profundo conhecimento de técnicas avançadas de imagem e correlações clínicas. Com base no laudo radiológico fornecido, gere uma impressão concisa e precisa que destaque os achados mais significativos e sintetize uma conclusão clara. Use linguagem precisa para garantir que a impressão seja imediatamente útil para outros profissionais de saúde."
         },
         {
           role: "user",
           content: `Tipo de exame: ${examType}

Laudo radiológico:

${findings}

Gere uma impressão concisa e precisa para este laudo radiológico de ${examType}.`
         }
       ],
       temperature: 0.3,
       max_tokens: 500
     })
   });

   if (!response.ok) {
     throw new Error(`Impressions API request failed: ${response.statusText}`);
   }

   const data = await response.json();
   return data.choices?.[0]?.message?.content || "Não foi possível gerar impressões.";
 } catch (error) {
   console.error('Error in generateImpressions:', error);
   throw error;
 }
}

export async function generateDifferentialDiagnosis(findings: string, examType: string): Promise<string> {
 try {
   const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
       'HTTP-Referer': 'https://v0.dev',
       'X-Title': 'Radiology Differential Diagnosis Generator'
     },
     body: JSON.stringify({
       model: "anthropic/claude-3.5-sonnet-20241022:beta",
       messages: [
         {
           role: "system",
           content: `Você é um radiologista altamente respeitado com extensa expertise em diagnósticos diferenciais em diversas modalidades de imagem. Com base nos achados radiológicos fornecidos, produza um diagnóstico diferencial completo que abranja patologias comuns e raras. 

IMPORTANTE:
1. Cada diagnóstico deve ter fundamentação sólida nos achados de imagem.
2. Inclua probabilidades baseadas em evidências.
3. Cite apenas referências com alta confiança (>80%).
4. Para informações sem citações diretas confiáveis, recomende literatura específica.

Estruture a saída conforme:

<discussion>
<ddx1>
<diagnosis>Diagnóstico 1</diagnosis>
<reasoning>Raciocínio clínico detalhado</reasoning>
<probability>Avaliação de probabilidade fundamentada</probability>
<keyfindings>Achados principais de suporte</keyfindings>
<citation>Citação verificada ou recomendação de literatura</citation>
</ddx1>
<ddx2>...
</ddx2>
</discussion>`
         },
         {
           role: "user",
           content: `Tipo de exame: ${examType}

Achados radiológicos:

${findings}

Gere um diagnóstico diferencial abrangente para estes achados radiológicos de ${examType}.`
         }
       ],
       temperature: 0.3,
       max_tokens: 2000
     })
   });

   if (!response.ok) {
     throw new Error(`Differential Diagnosis API request failed: ${response.statusText}`);
   }

   const data = await response.json();
   return sanitizeXml(data.choices?.[0]?.message?.content || "<discussion></discussion>");
 } catch (error) {
   console.error("Error in generateDifferentialDiagnosis:", error);
   throw error;
 }
}

export async function generateFollowUpRecommendations(findings: string, examType: string): Promise<string> {
 try {
   const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
       'HTTP-Referer': 'https://v0.dev',
       'X-Title': 'Radiology Follow-up Recommendations Generator'
     },
     body: JSON.stringify({
       model: "anthropic/claude-3.5-sonnet-20241022:beta",
       messages: [
         {
           role: "system",
           content: `Você é um radiologista especialista com extensa experiência clínica e de pesquisa, versado em estratégias de acompanhamento para diversos achados de imagem. 

IMPORTANTE:
1. Baseie as recomendações em diretrizes atuais.
2. Inclua apenas citações com alta confiança (>80%).
3. Para recomendações sem citações diretas confiáveis, referencie diretrizes específicas.
4. Forneça alternativas quando apropriado.

Formate a saída conforme:

<discussion>
<rec1>
<timeframe>Período de acompanhamento</timeframe>
<action>Ação recomendada detalhada</action>
<rationale>Justificativa clínica fundamentada</rationale>
<alternative>Abordagem alternativa se necessário</alternative>
<citation>Citação verificada ou referência a diretriz</citation>
</rec1>
<rec2>...
</rec2>
</discussion>`
         },
         {
           role: "user",
           content: `Tipo de exame: ${examType}

Achados radiológicos:

${findings}

Gere recomendações de acompanhamento apropriadas para estes achados radiológicos de ${examType}.`
         }
       ],
       temperature: 0.3,
       max_tokens: 2000
     })
   });

   if (!response.ok) {
     throw new Error(`Follow-up Recommendations API request failed: ${response.statusText}`);
   }

   const data = await response.json();
   return sanitizeXml(data.choices?.[0]?.message?.content || "<discussion></discussion>");
 } catch (error) {
   console.error("Error in generateFollowUpRecommendations:", error);
   throw error;
 }
}

function xmlToJson(xml: string): string {
 if (!xml || !xml.includes('<discussion>')) {
   return '';
 }
 return xml;
}

async function generateAIInsights(report: string): Promise<string> {
 try {
   return await aiInsightsSubAgent(report, "");
 } catch (error) {
   console.error("Error in generateAIInsights:", error);
   throw error;
 }
}

