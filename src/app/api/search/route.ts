import { NextRequest, NextResponse } from "next/server";

import { semanticSearch } from "@/lib/embeddings/search";
import type { ObjectType } from "@/lib/embeddings/type";
import { generateQueryEmbedding } from "@/lib/embeddings/generate";

/*
 * Change this import to match your existing Supabase server client.
 */
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

function parseObjectTypes(value: unknown): ObjectType[] | undefined {
  if (value === undefined) {
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
    const body = (await request.json()) as SearchRequestBody;

    if (
      typeof body.query !== "string" ||
      !body.query.trim()
    ) {
      return NextResponse.json(
        { error: "query is required." },
        { status: 400 },
      );
    }

    const supabase = supabaseServer;

    /*
     * Do not accept tenant_id directly from the browser in production.
     * Resolve it from the authenticated user/session.
     */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    /*
     * Replace this with your actual tenant-membership lookup if tenant_id
     * is not stored in app_metadata.
     */
    const tenantId =
      (user.app_metadata?.tenant_id as string | undefined) ??
      (user.user_metadata?.tenant_id as string | undefined) ??
      user.id;

    if (
      typeof tenantId !== "string" ||
      !tenantId.trim()
    ) {
      return NextResponse.json(
        { error: "No tenant is assigned to this user." },
        { status: 403 },
      );
    }


    const limit =
      typeof body.limit === "number"
        ? body.limit
        : undefined;

    const threshold =
      typeof body.threshold === "number"
        ? body.threshold
        : undefined;

    const objectTypes = parseObjectTypes(
      body.objectTypes,
    );

    const results = await semanticSearch(supabase, {
      tenantId,
      query: body.query,
      limit,
      threshold,
      objectTypes,
    });

    return NextResponse.json({
      query: body.query,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Search route failed", error);

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