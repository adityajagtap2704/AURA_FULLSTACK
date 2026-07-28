import { NextRequest, NextResponse } from "next/server";

import { semanticSearch } from "@/lib/embeddings/search";
import type { ObjectType } from "@/lib/embeddings/type";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SearchRequestBody {
  query?: unknown;
  limit?: unknown;
  threshold?: unknown;
  objectTypes?: unknown;
}

const VALID_OBJECT_TYPES = new Set<ObjectType>([
  "task",
  "event",
  "message",
  "document",
]);

function parseObjectTypes(
  value: unknown,
): ObjectType[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new Error("objectTypes must be an array.");
  }

  const objectTypes = value.filter(
    (item): item is ObjectType =>
      typeof item === "string" &&
      VALID_OBJECT_TYPES.has(item as ObjectType),
  );

  if (objectTypes.length !== value.length) {
    throw new Error(
      "objectTypes may only contain task, event, message, or document.",
    );
  }

  return objectTypes;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseServer;

    const authHeader =
      request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error:
            "Missing or invalid Authorization header.",
        },
        { status: 401 },
      );
    }

    const accessToken = authHeader
      .slice(7)
      .trim();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required." },
        { status: 401 },
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
          details:
            authError?.message ??
            "Authenticated user was not found.",
        },
        { status: 401 },
      );
    }

    const body =
      (await request.json()) as SearchRequestBody;

    if (
      typeof body.query !== "string" ||
      !body.query.trim()
    ) {
      return NextResponse.json(
        { error: "query is required." },
        { status: 400 },
      );
    }

    /*
     * AURA Phase 1:
     * one authenticated user = one tenant
     */
    const tenantId = user.id;

    const limit =
      typeof body.limit === "number" &&
      Number.isFinite(body.limit) &&
      body.limit > 0
        ? Math.floor(body.limit)
        : undefined;

    const threshold =
      typeof body.threshold === "number" &&
      Number.isFinite(body.threshold)
        ? body.threshold
        : undefined;

    const objectTypes = parseObjectTypes(
      body.objectTypes,
    );

    const query = body.query.trim();

    const results = await semanticSearch(
      supabase,
      {
        tenantId,
        query,
        limit,
        threshold,
        objectTypes,
      },
    );

    return NextResponse.json({
      query,
      count: results.length,
      results,
    });
  } catch (error) {
    const isClientAbort =
      request.signal.aborted ||
      (error instanceof Error &&
        (error.name === "AbortError" ||
          error.message === "aborted")) ||
      (error as { code?: string } | undefined)?.code ===
        "ECONNRESET";

    if (isClientAbort) {
      return new NextResponse(null, { status: 499 });
    }

    console.error(
      "Semantic search route failed:",
      error,
    );

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error:
            "Request body must contain valid JSON.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Search failed.",
      },
      { status: 500 },
    );
  }
}