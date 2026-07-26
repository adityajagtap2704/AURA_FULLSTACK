import type { ObjectType } from "./type";

export interface SemanticSearchResult {
  tenant_id: string;
  object_type: ObjectType;
  object_id: string;
  content: string;
  similarity: number;
  record: Record<string, unknown> | null;
}

interface SemanticSearchResponse {
  query: string;
  count: number;
  results: SemanticSearchResult[];
}

interface SearchInput {
  accessToken: string;
  tenantId: string;
  query: string;
  limit?: number;
  threshold?: number;
  objectTypes?: ObjectType[];
}

export async function searchAura(
  input: SearchInput,
): Promise<SemanticSearchResponse> {
  const response = await fetch("/api/search/semantic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.accessToken}`,
    },
    body: JSON.stringify({
      tenantId: input.tenantId,
      query: input.query,
      limit: input.limit ?? 10,
      threshold: input.threshold ?? 0,
      objectTypes: input.objectTypes,
    }),
  });

  const data = (await response.json()) as
    | SemanticSearchResponse
    | { error?: string; details?: string };

  if (!response.ok) {
    const message =
      "error" in data
        ? data.details ?? data.error
        : "Search failed.";

    throw new Error(message ?? "Search failed.");
  }

  return data as SemanticSearchResponse;
}