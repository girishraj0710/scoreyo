import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";

/**
 * AI Classification Result
 */
export interface ClassificationResult {
  examId: string;
  examName: string;
  subjectId: string;
  subjectName: string;
  topics: string[];
  confidence: number;
  reasoning: string;
}

/**
 * Classify study material content to detect exam, subject, and topics
 * Uses GPT-4o-mini for reliable classification
 */
export async function classifyContent(content: string): Promise<ClassificationResult> {
  const prompt = `You are an expert in Indian competitive exams. Analyze this study material and classify it.

STUDY MATERIAL (first 2000 chars):
${content.slice(0, 2000)}

AVAILABLE EXAMS:
- JEE Main (Engineering entrance - NIT, IIIT) - exam_id: jee-main
- JEE Advanced (IIT entrance) - exam_id: jee-advanced
- NEET (Medical entrance) - exam_id: neet
- UPSC Civil Services (IAS, IPS) - exam_id: upsc
- SSC (Staff Selection Commission) - exam_id: ssc
- CAT (MBA entrance) - exam_id: cat
- GATE (Engineering postgraduate) - exam_id: gate
- Banking (IBPS, SBI) - exam_id: banking
- NDA (National Defence Academy) - exam_id: nda
- State Engineering (Karnataka CET, MHT CET, etc.) - exam_id: state-engg

AVAILABLE SUBJECTS (examples):
- Physics (JEE/NEET): Mechanics, Thermodynamics, Electromagnetism, Optics, Modern Physics - subject_id: physics
- Chemistry (JEE/NEET): Physical, Organic, Inorganic - subject_id: chemistry
- Mathematics (JEE): Calculus, Algebra, Trigonometry, Coordinate Geometry - subject_id: mathematics
- Biology (NEET): Botany, Zoology, Human Physiology - subject_id: biology
- General Studies (UPSC): Polity, Geography, History, Economy - subject_id: general-studies
- Quantitative Aptitude (CAT/Banking): Arithmetic, Data Interpretation - subject_id: quantitative-aptitude
- Reasoning (CAT/Banking/SSC): Logical, Verbal, Analytical - subject_id: reasoning
- English (All exams): Grammar, Comprehension, Vocabulary - subject_id: english

TASK:
Analyze the content and return classification in JSON format.

OUTPUT FORMAT (return ONLY valid JSON, no markdown, no other text):
{
  "examId": "jee-main",
  "examName": "JEE Main",
  "subjectId": "physics",
  "subjectName": "Physics",
  "topics": ["Thermodynamics", "Heat Transfer", "Work and Energy"],
  "confidence": 0.95,
  "reasoning": "Content discusses work-energy theorem, angular momentum in collisions, and energy conservation - typical JEE Main Physics Mechanics topics."
}

Return ONLY the JSON object, no other text.`;

  try {
    const { text } = await generateText({
      model: openrouter("openai/gpt-4o-mini"),
      prompt: prompt,
      maxOutputTokens: 500,
      temperature: 0.3, // Lower temp for classification
    });

    // Clean up response (remove markdown code blocks if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const result = JSON.parse(cleanedText) as ClassificationResult;

    // Validate result has required fields
    if (!result.examId || !result.subjectId || !result.topics || !Array.isArray(result.topics)) {
      throw new Error('Invalid classification result: missing required fields');
    }

    // Ensure confidence is between 0 and 1
    if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
      result.confidence = 0.5; // Default to medium confidence
    }

    console.log('[classifyContent] Classification result:', {
      exam: result.examName,
      subject: result.subjectName,
      topics: result.topics.length,
      confidence: result.confidence,
    });

    return result;
  } catch (error: any) {
    console.error('[classifyContent] Error:', error);

    // Return fallback classification
    return {
      examId: 'general',
      examName: 'General',
      subjectId: 'general',
      subjectName: 'General',
      topics: ['Mixed Topics'],
      confidence: 0.1,
      reasoning: `Classification failed: ${error.message}. Defaulting to general category.`,
    };
  }
}

/**
 * Calculate quality score for a question (0-100)
 * Based on multiple quality metrics
 */
export function calculateQualityScore(question: {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  trapAlerts?: string[];
}): number {
  let score = 100;

  // Question length (ideal: 50-200 chars)
  const qLen = question.question.length;
  if (qLen < 30) score -= 20;
  if (qLen > 300) score -= 10;

  // Options length consistency
  const optLengths = question.options.map(o => o.length);
  const avgLen = optLengths.reduce((a, b) => a + b) / 4;
  const variance = optLengths.reduce((sum, len) => sum + Math.abs(len - avgLen), 0) / 4;
  if (variance > 50) score -= 15; // Options too different

  // Explanation quality
  const expLen = question.explanation.length;
  if (expLen < 50) score -= 20;
  if (expLen > 500) score -= 5;

  // Trap alerts present
  if (!question.trapAlerts || question.trapAlerts.length < 3) {
    score -= 10;
  }

  // Check for LaTeX complexity (penalize overly complex)
  const latexCount = (question.question.match(/\\/g) || []).length;
  if (latexCount > 10) score -= 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * Check if question is a duplicate
 * Normalizes text and checks against existing questions
 */
export async function checkDuplicate(
  questionText: string,
  queryFn: (sql: string, params: any[]) => Promise<any[]>
): Promise<boolean> {
  // Normalize: lowercase, remove punctuation, trim spaces
  const normalized = questionText
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Check against existing questions in fact_exam_questions
  const existing = await queryFn(
    `SELECT question FROM fact_exam_questions
     WHERE LOWER(REGEXP_REPLACE(REGEXP_REPLACE(question, '[^\\w\\s]', '', 'g'), '\\s+', ' ', 'g'))
     LIKE $1
     LIMIT 1`,
    [`%${normalized.slice(0, 50)}%`]
  );

  if (existing.length > 0) {
    return true;
  }

  // Also check pending questions
  const pending = await queryFn(
    `SELECT question FROM pending_questions
     WHERE status = 'pending'
     AND LOWER(REGEXP_REPLACE(REGEXP_REPLACE(question, '[^\\w\\s]', '', 'g'), '\\s+', ' ', 'g'))
     LIKE $1
     LIMIT 1`,
    [`%${normalized.slice(0, 50)}%`]
  );

  return pending.length > 0;
}
