import { getDb } from "./mongodb";
import { embedQuery } from "./gemini";

const SB_STRONG = 0.78;
const MAN_STRONG = 0.74;

function extractErrorNumber(text: string): string | null {
  const m = text.match(/(\d{1,4})/);
  return m ? m[1] : null;
}

export interface SearchResult {
  source: "shiftbook" | "manual";
  score: number;
  error_number?: string;
  error_message?: string;
  description?: string;
  supplier?: string;
  error_no?: string;
  category?: string;
  causes?: string;
  resolution?: string;
}

export async function vectorSearch(
  query: string,
  supplier?: string,
  topK = 5
): Promise<SearchResult[]> {
  const db = await getDb();
  const qVec = await embedQuery(query);
  const errNo = extractErrorNumber(query);

  const runSearch = async (
    collection: string,
    indexName: string,
    errorField: string,
    source: "shiftbook" | "manual"
  ) => {
    try {
      return await db.collection(collection).aggregate([
        {
          $vectorSearch: {
            index: indexName,
            path: "embedding",
            queryVector: qVec,
            numCandidates: 100,
            limit: topK * 2,
          },
        },
        {
          $addFields: { score: { $meta: "vectorSearchScore" } },
        },
        { $limit: topK * 2 },
      ]).toArray().then(docs =>
        docs.map(d => ({
          ...d,
          source,
          score: (d.score as number) +
            (errNo && d[errorField] === errNo ? 0.35 : 0) +
            (supplier && d.supplier?.toLowerCase() === supplier.toLowerCase() ? 0.05 : 0),
        }))
      );
    } catch {
      // Atlas vector index not yet created — return empty
      return [];
    }
  };

  const [sbResults, manResults] = await Promise.all([
    runSearch("shiftbook", "shiftbook_vector_index", "error_number", "shiftbook"),
    runSearch("manual_errors", "manual_errors_vector_index", "error_no", "manual"),
  ]);

  const combined = [...sbResults, ...manResults]
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return combined as SearchResult[];
}

export async function getStrongSources(query: string, supplier?: string) {
  const results = await vectorSearch(query, supplier, 10);
  return results.filter(r =>
    (r.source === "shiftbook" && r.score >= SB_STRONG) ||
    (r.source === "manual" && r.score >= MAN_STRONG)
  );
}
