// app/api/festivals/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// festival.json 한 줄의 타입 정의
type Festival = {
  festival_name: string;
  period: string;
  start: string;             // "2025-11-01"
  end: string;               // "2025-11-01"
  contact: string;
  region: string;            // "서울"
  detailed_location: string;
  URL: string;
  description: string;
  category: string;          // "마라톤온라인"
};

// 프로젝트 루트 기준 JSON 경로
const DATA_PATH = path.join(process.cwd(), "json", "festival.json");

// JSON 파일 읽기
async function loadFestivals(): Promise<Festival[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

// GET /api/festivals
// 예) /api/festivals?region=서울&date=2025-11-01&key=KSW_TEST_KEY_123
export async function GET(req: NextRequest) {
  // 1) API 키 확인 (헤더 우선, 없으면 쿼리 ?key=)
  const apiKey =
    req.headers.get("x-api-key") ||
    req.nextUrl.searchParams.get("key");

  if (apiKey !== process.env.API_SECRET_KEY) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2) 쿼리 파라미터 읽기
  const url = req.nextUrl;
  const region = url.searchParams.get("region");   // 예: "서울"
  const date = url.searchParams.get("date");       // 예: "2025-11-01"

  // 3) 축제 데이터 로드
  const festivals = await loadFestivals();

  // 4) region, date 조건에 맞게 필터링
  const filtered = festivals.filter((f) => {
    const okRegion = region ? f.region === region : true;

    // date가 start~end 사이에 있으면 통과
    const okDate = date
      ? f.start <= date && f.end >= date
      : true;

    return okRegion && okDate;
  });

  // 5) 응답 반환
  return NextResponse.json({
    count: filtered.length,
    items: filtered,
  });
}