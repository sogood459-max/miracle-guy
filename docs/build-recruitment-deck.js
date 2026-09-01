// 2027년 사무직원 채용 계획(안) — 4:3 (10" × 7.5")
// 디자인은 학교 「2025학년도 결산(안) 보고」 자료의 서식을 따름
//   흰 배경 · 검정 본문 · 옅은 하늘색 표 머리글 · HY헤드라인M 제목
//
//   node build-recruitment-deck.js
//   python3 postprocess-linebreak.py 2027년_사무직원_채용계획안.pptx
//
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_4x3"; // 10 × 7.5
pres.author = "정석항공과학고등학교";
pres.title = "2027년 사무직원 채용 계획(안)";

// ── 서식 (참고 자료에서 추출) ──────────────────────────────────
const BLACK = "000000";
const BLUE = "263FFA"; // 표지 부제 등 강조
const RED = "FF0000";  // 예외 규정 강조
const GRAY = "404040";
const CYAN = "CCFFFF";  // 표 머리글
const CYAN2 = "D9F6FF"; // 표 보조 머리글
const BAND = "4FADD1";  // 제목 띠 (참고 자료 accent3)
const WHITE = "FFFFFF";

const TF = "HY헤드라인M"; // 슬라이드 제목
const SF = "HY동녘B";     // ■ 소제목
const BF = "맑은 고딕";   // 본문·표

const path = require("path");
const EMBLEM = path.join(__dirname, "assets", "emblem.png");

const SW = 10, SH = 7.5;
const M = 0.5;
const CW = SW - M * 2; // 9.0

const TB = () => [
  { pt: 1, color: BLACK }, { pt: 1, color: BLACK },
  { pt: 1, color: BLACK }, { pt: 1, color: BLACK },
];
const TH = { fill: { color: CYAN }, bold: true, fontSize: 10.5, color: BLACK };
const TH2 = { fill: { color: CYAN2 }, bold: true, fontSize: 10.5, color: BLACK };

// 표지·목차를 제외한 본문 페이지 — 번호는 총 장수를 알 수 있는 마지막에 찍는다
const numbered = [];

const band = (s, y, h) => s.addShape(pres.ShapeType.rect, {
  x: 0, y, w: SW, h, fill: { color: BAND }, line: { color: BAND, width: 0.5 },
});

function slideBase(isCover, noPageNo) {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  band(s, 7.24, 0.26); // 하단 띠 (공통)
  if (isCover) {
    band(s, 0, 0.26);    // 표지 상단 얇은 띠
    band(s, 2.11, 2.11); // 표지 제목 띠
  } else {
    band(s, 0, 0.78);    // 본문 제목 띠
    if (!noPageNo) numbered.push(s);
  }
  return s;
}

function stampPageNumbers() {
  numbered.forEach((s, i) => {
    s.addText(`${i + 1} / ${numbered.length}`, {
      x: (SW - 2) / 2, y: 6.88, w: 2, h: 0.3, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11, color: BLACK, align: "center", valign: "middle",
    });
  });
}

// 슬라이드 제목 (+ 우측 [ 전형 N단계 ] 표기)
function title(s, text, badge) {
  s.addText(text, {
    x: M, y: 0.09, w: CW - 3.4, h: 0.6, isTextBox: true, margin: 0,
    fontFace: TF, fontSize: 26, color: WHITE, valign: "middle",
  });
  if (badge) {
    s.addText(`[ ${badge} ]`, {
      x: 5.4, y: 0.22, w: 4.1, h: 0.34, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11.5, bold: true, color: WHITE,
      align: "right", valign: "middle",
    });
  }
}

// ■ 소제목
function h2(s, y, text) {
  s.addText(`■ ${text}`, {
    x: M, y, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: SF, fontSize: 14, color: BLACK, valign: "middle",
  });
}

// ○ 항목 (내어쓰기)
function o(s, y, text, h) {
  s.addText("○", {
    x: M + 0.22, y, w: 0.26, h: 0.26, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12, color: BLACK, valign: "top",
  });
  s.addText(text, {
    x: M + 0.5, y, w: CW - 0.6, h: h || 0.28, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12, color: BLACK, valign: "top", lineSpacing: 20,
  });
}

// - 세부 항목 (내어쓰기)
function dash(s, y, text, h) {
  s.addText("-", {
    x: M + 0.52, y, w: 0.2, h: 0.24, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11, color: BLACK, valign: "top",
  });
  s.addText(text, {
    x: M + 0.74, y, w: CW - 0.84, h: h || 0.26, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11, color: BLACK, valign: "top", lineSpacing: 18,
  });
}

// (단위 : …) 등 우측 주기
function unit(s, y, text) {
  s.addText(text, {
    x: M + CW - 3.2, y, w: 3.2, h: 0.26, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 10, color: BLACK, align: "right", valign: "middle",
  });
}

// ※ 주석
function memo(s, y, text, color) {
  s.addText(text, {
    x: M, y, w: CW, h: 0.28, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 10.5, color: color || GRAY, valign: "middle",
  });
}

// 흐름도 상자 (본문 흰 칸 + 하단 하늘색 띠)
function flowBox(s, x, y, w, h, label, foot, labelSize) {
  s.addShape(pres.ShapeType.rect, {
    x, y, w, h, fill: { color: WHITE }, line: { color: BLACK, width: 1 },
  });
  const stripH = foot ? 0.42 : 0;
  s.addText(label, {
    x: x + 0.06, y, w: w - 0.12, h: h - stripH, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: labelSize || 11, color: BLACK,
    align: "center", valign: "middle", lineSpacing: 17,
  });
  if (foot) {
    s.addShape(pres.ShapeType.rect, {
      x, y: y + h - stripH, w, h: stripH,
      fill: { color: CYAN }, line: { color: BLACK, width: 1 },
    });
    s.addText(foot, {
      x: x + 0.04, y: y + h - stripH, w: w - 0.08, h: stripH, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 10.5, bold: true, color: BLACK,
      align: "center", valign: "middle", lineSpacing: 14,
    });
  }
}

function arrow(s, x, y) {
  s.addShape(pres.ShapeType.triangle, {
    x, y, w: 0.2, h: 0.2, fill: { color: BLACK }, rotate: 90,
  });
}

// ═══════════════════════════════════════════════════════════════
// 1. 표지
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase(true);

  s.addText("2027년 사무직원 채용 계획(안)", {
    x: M, y: 2.42, w: CW, h: 0.92, isTextBox: true, margin: 0,
    fontFace: TF, fontSize: 32, bold: true, color: WHITE,
    align: "center", valign: "middle",
    shadow: { type: "outer", color: "000000", opacity: 0.43, blur: 3, offset: 3, angle: 45 },
  });
  s.addText("기술·관리운영직(9급) 1명 공개채용", {
    x: M, y: 3.42, w: CW, h: 0.4, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 15, color: WHITE, align: "center", valign: "middle",
  });

  s.addText("2026.  9.", {
    x: M, y: 4.7, w: CW, h: 0.44, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 17, color: BLUE, align: "center", valign: "middle",
  });

  s.addImage({
    path: EMBLEM, x: 3.28, y: 5.66, w: 0.72, h: 0.72,
    altText: "정석항공과학고등학교 엠블럼",
  });
  s.addText("정석항공과학고등학교", {
    x: 4.14, y: 5.66, w: 2.6, h: 0.72, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 16, color: BLACK, valign: "middle",
  });
  s.addNotes("2027년 사무직원 채용 계획(안) 개요. 기술·관리운영직 9급 1명을 공개채용하며, 2026년 9월 교육청 사전협의부터 2027년 1월 1일 임용까지 진행합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 2. 목차
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase(false, true);

  s.addText("[ 목     차 ]", {
    x: M, y: 0.09, w: CW, h: 0.6, isTextBox: true, margin: 0,
    fontFace: TF, fontSize: 26, color: WHITE, align: "center", valign: "middle",
  });

  [
    "1.  채용 인원 및 채용 사유",
    "2.  직원 현황",
    "3.  채용 계획",
    "4.  전형 절차",
    "5.  지원서 접수",
    "6.  서류 전형 (1차)",
    "7.  업무적성 및 심층면접 (2차)",
    "8.  결격사유 검증",
    "9.  기타 사항",
    "10.  채용 계획 요약",
  ].forEach((t, i) => {
    const step = i >= 4 && i <= 7;
    s.addText(t, {
      x: 1.8, y: 1.42 + i * 0.48, w: 4.6, h: 0.42, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 18, color: BLACK, valign: "middle",
    });
    if (step) {
      s.addText(`[ 전형 ${i - 3}단계 ]`, {
        x: 6.4, y: 1.42 + i * 0.48, w: 1.8, h: 0.42, isTextBox: true, margin: 0,
        fontFace: BF, fontSize: 12, color: GRAY, valign: "middle",
      });
    }
  });
  s.addNotes("목차 — 채용 인원 및 사유부터 채용 계획 요약까지 10개 항목으로 구성되며, 5~8은 전형 4단계에 해당합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 2. 채용 인원 및 채용 사유
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  title(s, "1. 채용 인원 및 채용 사유");

  h2(s, 1.14, "채용 인원");
  o(s, 1.52, "기술·관리운영직(9급) 1명 공개채용");

  h2(s, 2.12, "채용 사유");
  o(s, 2.5, "일반직 정원 8명 대비 현원 5명으로 결원 3명이 발생하여, 안정적인 학교 행정업무 수행을 위한 인력 충원이 필요함.", 0.62);
  o(s, 3.24, "결원 3명 중 1명은 공개채용을 통해 충원하고, 증치 정원 2명은 기간제 인력으로 운영하고자 함.", 0.62);

  h2(s, 4.06, "채용 개요");
  s.addTable([
    [
      { text: "구분", options: TH },
      { text: "직종", options: TH },
      { text: "채용 인원", options: TH },
      { text: "채용 방법", options: TH },
      { text: "임용 예정일", options: TH },
    ],
    [
      { text: "사무직원" }, { text: "기술·관리운영직(9급)" },
      { text: "1명", options: { bold: true } }, { text: "공개채용" }, { text: "2027. 1. 1." },
    ],
  ], {
    x: M, y: 4.46, w: CW, colW: [1.4, 2.7, 1.4, 1.7, 1.8],
    rowH: [0.36, 0.44], border: TB(), align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 10.5, color: BLACK,
  });

  memo(s, 5.44, "※ 인건비는 교육청에서 지원");
  s.addNotes("정원 8명 대비 현원 5명, 결원 3명. 그중 1명은 공개채용, 증치 정원 2명은 기간제로 운영합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 3. 직원 현황
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  title(s, "2. 직원 현황");

  h2(s, 1.14, "일반직 정원 및 현원");
  unit(s, 1.16, "(인건비 교육청 지원, 단위 : 명)");

  const NW = 0.5389;
  s.addTable([
    [
      { text: "구분", options: { ...TH, colspan: 2, rowspan: 3 } },
      { text: "일반직", options: { ...TH, colspan: 5 } },
      { text: "계", options: { ...TH, rowspan: 3 } },
      { text: "증치\n(기술직)", options: { ...TH, rowspan: 3, fontSize: 9 } },
      { text: "합계", options: { ...TH, rowspan: 3 } },
      { text: "결원", options: { ...TH, rowspan: 3 } },
      { text: "채용\n(안)", options: { ...TH, rowspan: 3 } },
      { text: "비고 (증치사유)", options: { ...TH, rowspan: 3 } },
    ],
    [
      { text: "행정직", options: { ...TH2, colspan: 4 } },
      { text: "기술·\n관리운영직", options: { ...TH2, rowspan: 2 } },
    ],
    [
      { text: "5급", options: TH2 }, { text: "6급", options: TH2 },
      { text: "7급", options: TH2 }, { text: "8급", options: TH2 },
    ],
    [
      { text: "정석고\n(24학급)", options: { rowspan: 2, bold: true, fontSize: 10.5 } },
      { text: "정원", options: { bold: true } },
      { text: "1" }, { text: "1" }, { text: "1" }, { text: "1" }, { text: "2" },
      { text: "6" }, { text: "2" }, { text: "8", options: { bold: true } },
      { text: "△3", options: { rowspan: 2, bold: true, color: RED, fontSize: 11 } },
      { text: "1명", options: { rowspan: 2, bold: true, fontSize: 11 } },
      { text: "- 15학급당  1명\n- 1,000Kw 이상 1명", options: { rowspan: 2, align: "left", fontSize: 9.5 } },
    ],
    [
      { text: "현원", options: { bold: true } },
      { text: "" }, { text: "1" }, { text: "2" }, { text: "1" }, { text: "1" },
      { text: "5" }, { text: "0" }, { text: "5", options: { bold: true } },
    ],
  ], {
    x: M, y: 1.5, w: CW,
    colW: [1.0, 0.6, NW, NW, NW, NW, 1.0, NW, NW, NW, NW, NW, 1.55],
    rowH: [0.32, 0.32, 0.32, 0.56, 0.56],
    border: TB(), align: "center", valign: "middle", margin: 2,
    fontFace: BF, fontSize: 10.5, color: BLACK,
  });

  memo(s, 3.66, "※ 증치 정원 2명은 기간제 인력으로 운영 예정");

  h2(s, 4.16, "결원 3명 충원 방안");
  s.addTable([
    [
      { text: "구분", options: { ...TH, rowspan: 2 } },
      { text: "정원", options: { ...TH, rowspan: 2 } },
      { text: "현원", options: { ...TH, rowspan: 2 } },
      { text: "결원", options: { ...TH, rowspan: 2 } },
      { text: "결원 3명 충원 방안", options: { ...TH, colspan: 2 } },
    ],
    [
      { text: "공개채용", options: TH2 },
      { text: "기간제 운영 (증치 정원)", options: TH2 },
    ],
    [
      { text: "일반직", options: { bold: true } },
      { text: "8명" }, { text: "5명" },
      { text: "3명", options: { bold: true, color: RED } },
      { text: "1명", options: { bold: true } },
      { text: "2명", options: { bold: true } },
    ],
  ], {
    x: M, y: 4.56, w: CW, colW: [1.2, 1.2, 1.2, 1.2, 2.1, 2.1],
    rowH: [0.34, 0.34, 0.46],
    border: TB(), align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 10.5, color: BLACK,
  });

  memo(s, 5.86, "※ 결원 3명 = 공개채용 1명 + 기간제 운영 2명");
  s.addNotes("정원 8명(행정직 4, 기술·관리운영직 2, 증치 2), 현원 5명. 증치 사유는 15학급당 1명, 1,000Kw 이상 1명입니다.");
}

// ═══════════════════════════════════════════════════════════════
// 4. 채용 계획
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  title(s, "3. 채용 계획");

  h2(s, 1.14, "추진 절차 및 일정");

  const steps = [
    ["교육청 사전협의 및\n채용 계획(안) 보고", "2026. 9월"],
    ["채용공고 및\n지원서 접수", "2026. 11월"],
    ["1·2차 전형\n(서류전형, 업무적성\n및 심층면접)", "2026. 12월 초"],
    ["합격자 통보 및\n결격사유 검증", "2026. 12월"],
    ["임용", "2027. 1. 1."],
  ];
  const bw = 1.6, gap = 0.25, y0 = 1.95, bh = 3.0;
  steps.forEach(([label, date], i) => {
    const x = M + i * (bw + gap);
    flowBox(s, x, y0, bw, bh, label, date, 11.5);
    if (i < 4) arrow(s, x + bw + 0.025, y0 + bh / 2 - 0.1);
  });

  memo(s, 5.2, "※ 1·2차 전형은 2026. 12월 초 실시하며, 최종합격 예정자는 법인 임용 제청을 거쳐 2027. 1. 1. 임용 예정");
  s.addNotes("전체 채용 일정은 5단계로 진행되며, 2027년 1월 1일 임용으로 마무리됩니다.");
}

// ═══════════════════════════════════════════════════════════════
// 5. 전형 절차
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  title(s, "4. 전형 절차");

  h2(s, 1.14, "전형 단계");

  const steps = [
    ["지원서 접수", "-"],
    ["서류 심사", "5배수 내외"],
    ["업무적성 및\n심층 면접", "2배수 내외\n(법인승인요청)"],
    ["결격사유 검증", "채용신체검사\n결격사유·성범죄 조회"],
    ["최종합격자 결정", "2027. 1. 1. 임용"],
  ];
  const bw = 1.6, gap = 0.25, y0 = 1.62, bh = 2.2;
  steps.forEach(([label, foot], i) => {
    const x = M + i * (bw + gap);
    flowBox(s, x, y0, bw, bh, label, foot, 11.5);
    if (i < 4) arrow(s, x + bw + 0.025, y0 + bh / 2 - 0.1);
  });

  h2(s, 4.24, "전형별 배점 및 합격배수");
  s.addTable([
    [
      { text: "구분", options: TH },
      { text: "평가 내용", options: TH },
      { text: "배점", options: TH },
      { text: "합격배수", options: TH },
    ],
    [
      { text: "1차 서류전형" },
      { text: "지원자격 요건 및 자기소개서 작성 성실도 평가", options: { align: "left" } },
      { text: "30점" }, { text: "5배수 내외" },
    ],
    [
      { text: "2차 면접전형" },
      { text: "응시원서·자기소개서를 기초로 업무 적합성 종합평가", options: { align: "left" } },
      { text: "70점" }, { text: "2배수 내외" },
    ],
    [
      { text: "계", options: { bold: true, fill: { color: CYAN2 } } },
      { text: "1·2차 전형결과 합산", options: { align: "left", fill: { color: CYAN2 } } },
      { text: "100점", options: { bold: true, fill: { color: CYAN2 } } },
      { text: "-", options: { fill: { color: CYAN2 } } },
    ],
  ], {
    x: M, y: 4.64, w: CW, colW: [1.5, 4.3, 1.4, 1.8],
    rowH: [0.34, 0.42, 0.42, 0.4],
    border: TB(), align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 10.5, color: BLACK,
  });
  s.addNotes("전형은 지원서 접수 → 서류심사(5배수) → 업무적성 및 심층면접(2배수) → 결격사유 검증 → 최종합격자 결정 순으로 진행됩니다.");
}

// ═══════════════════════════════════════════════════════════════
// 6. 지원서 접수 (전형 1단계)
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  title(s, "5. 지원서 접수", "전형 1단계 / 4단계");

  h2(s, 1.14, "지원 자격");
  o(s, 1.52, "「지방공무원법」 제31조에 결격사유에 해당하지 않는 자");
  o(s, 1.86, "공고일 현재 취업가능 법정 연령(만 18세) 이상인 자로서 「지방공무원법」 제66조(정년)에 해당되지 않는 자", 0.6);

  h2(s, 2.62, "응시원서 입력 항목");
  o(s, 3.0, "응시원서");
  o(s, 3.34, "자기소개서 (800자 이내)");

  s.addTable([
    [
      { text: "구분", options: TH },
      { text: "자기소개서 문 항", options: TH },
    ],
    [{ text: "①" }, { text: "성장배경, 본인 성격의 장·단점", options: { align: "left" } }],
    [{ text: "②" }, { text: "지원동기 (본교에 지원하게 된 이유와 응시 직종에 본인이 적합하다고 판단되는 이유)", options: { align: "left" } }],
    [{ text: "③" }, { text: "입사 후 포부 및 직무 수행 계획", options: { align: "left" } }],
    [{ text: "④" }, { text: "조직 내 갈등 상황과 이를 해결하기 위한 노력 및 극복했던 경험", options: { align: "left" } }],
  ], {
    x: M + 0.5, y: 3.74, w: CW - 0.5, colW: [0.8, 7.7],
    rowH: [0.34, 0.4, 0.44, 0.4, 0.4],
    border: TB(), align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 10.5, color: BLACK,
  });
  s.addNotes("지원 자격은 지방공무원법 제31조 결격사유 비해당, 만 18세 이상 정년 미해당자입니다. 자기소개서는 4개 문항, 800자 이내로 작성합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 7. 서류 전형(1차) — 전형 2단계
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  title(s, "6. 서류 전형 (1차)", "전형 2단계 / 4단계");

  h2(s, 1.14, "평가방법 및 심사위원");
  o(s, 1.52, "평가방법 : 지원자격 요건 및 자기소개서 작성 성실도 등을 평가");
  o(s, 1.86, "심사위원 : 3명 (교장 1명, 행정실장 1명, 외부위원 1명)");

  h2(s, 2.36, "평가 항목 및 배점");
  s.addTable([
    [
      { text: "평가항목", options: TH },
      { text: "배 점", options: TH },
      { text: "합격배수", options: TH },
    ],
    [{ text: "직무전문성", options: { align: "left" } }, { text: "10점" },
      { text: "5배수\n내외", options: { rowspan: 5, bold: true, fontSize: 12, fill: { color: CYAN2 } } }],
    [{ text: "지원동기 및 직업관", options: { align: "left" } }, { text: "8점" }],
    [{ text: "성장과정 및 활동경험", options: { align: "left" } }, { text: "6점" }],
    [{ text: "표현력", options: { align: "left" } }, { text: "6점" }],
    [{ text: "합계", options: { align: "left", bold: true, fill: { color: CYAN2 } } },
      { text: "30점", options: { bold: true, fontSize: 11, fill: { color: CYAN2 } } }],
  ], {
    x: M + 0.5, y: 2.76, w: 6.6, colW: [3.4, 1.6, 1.6],
    rowH: [0.34, 0.36, 0.36, 0.36, 0.36, 0.4],
    border: TB(), align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 10.5, color: BLACK,
  });

  h2(s, 5.06, "자기소개서 불성실 작성자 탈락 기준");
  dash(s, 5.44, "문항과 전혀 무관한 내용을 작성");
  dash(s, 5.74, "동일 내용 반복 또는 문항별 50% 미만(약 400자) 작성한 경우");
  dash(s, 6.04, "채용 기관명을 오기재하여 제출한 경우 등");
  s.addNotes("1차 서류전형은 총 30점 만점, 5배수 내외를 선발합니다. 자기소개서 불성실 작성자는 탈락 기준에 따라 배제됩니다.");
}

// ═══════════════════════════════════════════════════════════════
// 8. 업무적성 및 심층면접(2차) — 전형 3단계
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  title(s, "7. 업무적성 및 심층면접 (2차)", "전형 3단계 / 4단계");

  h2(s, 1.14, "평가방법 및 심사위원");
  o(s, 1.52, "평가방법 : 응시원서 및 자기소개서를 기초로 업무 적합성을 종합평가");
  o(s, 1.86, "심사위원 : 3명 (교장 1명, 법인관계자 1명, 외부위원 1명)");

  h2(s, 2.36, "평가 항목 및 배점");
  s.addTable([
    [
      { text: "평가항목", options: TH },
      { text: "배 점", options: TH },
      { text: "합격배수", options: TH },
    ],
    [{ text: "직무수행능력", options: { align: "left" } }, { text: "20점" },
      { text: "2배수\n내외", options: { rowspan: 5, bold: true, fontSize: 12, fill: { color: CYAN2 } } }],
    [{ text: "기본소양·태도", options: { align: "left" } }, { text: "20점" }],
    [{ text: "조직 이해도 및 적응력", options: { align: "left" } }, { text: "15점" }],
    [{ text: "발전가능성", options: { align: "left" } }, { text: "15점" }],
    [{ text: "합계", options: { align: "left", bold: true, fill: { color: CYAN2 } } },
      { text: "70점", options: { bold: true, fontSize: 11, fill: { color: CYAN2 } } }],
  ], {
    x: M + 0.5, y: 2.76, w: 6.6, colW: [3.4, 1.6, 1.6],
    rowH: [0.34, 0.36, 0.36, 0.36, 0.36, 0.4],
    border: TB(), align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 10.5, color: BLACK,
  });

  h2(s, 5.06, "최종합격 예정자 선정");
  dash(s, 5.44, "1·2차 전형결과를 합산(총 100점)하여 최고득점자 순으로 2배수 내외의 최종합격 예정자를 선정함.");
  dash(s, 5.74, "최종합격 예정자에 대하여 법인에 임용 제청을 요청함.");
  s.addNotes("2차 면접은 70점 만점이며 2배수 내외를 선발합니다. 1·2차 합산 100점 기준으로 최종 순위를 결정합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 9. 결격사유 검증 — 전형 4단계
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  title(s, "8. 결격사유 검증", "전형 4단계 / 4단계");

  h2(s, 1.14, "검증 대상 및 내용");
  o(s, 1.52, "대상자 : 최종합격 예정자");
  o(s, 1.86, "검증내용 : 임용 결격사유 해당 여부 확인");

  h2(s, 2.36, "채용신체검사");
  s.addTable([
    [
      { text: "구분", options: TH },
      { text: "내 용", options: TH },
    ],
    [{ text: "시행근거" }, { text: "사무직원 인사 규정 (신규임용자 구비서류)", options: { align: "left" } }],
    [{ text: "검사항목" }, { text: "공무원 채용신체검사 규정 적용", options: { align: "left" } }],
  ], {
    x: M + 0.5, y: 2.76, w: CW - 0.5, colW: [1.5, 7.0],
    rowH: [0.34, 0.38, 0.38],
    border: TB(), align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 10.5, color: BLACK,
  });

  h2(s, 4.06, "결격사유조회 및 범죄경력조회");
  s.addTable([
    [
      { text: "구분", options: TH },
      { text: "근거 법령", options: TH },
      { text: "조회 방법", options: TH },
    ],
    [
      { text: "결격사유 조회 및\n범죄경력 조회" },
      { text: "「교육공무원법」\n「사립학교법」", options: { align: "left" } },
      { text: "행정정보\n공동이용시스템 이용", options: { rowspan: 2, bold: true, fill: { color: CYAN2 } } },
    ],
    [
      { text: "성범죄결격 및\n아동학대 범죄전력 조회" },
      { text: "「아동·청소년 성보호에 관한 법률」", options: { align: "left" } },
    ],
  ], {
    x: M + 0.5, y: 4.46, w: CW - 0.5, colW: [2.6, 3.4, 2.5],
    rowH: [0.34, 0.62, 0.62],
    border: TB(), align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 10.5, color: BLACK,
  });

  memo(s, 6.06, "※ 검증 3종 : 채용신체검사 · 결격사유 조회 · 성범죄 및 아동학대 범죄전력 조회");
  s.addNotes("최종합격 예정자를 대상으로 채용신체검사, 결격사유·범죄경력 조회, 성범죄 및 아동학대 범죄전력 조회를 실시합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 10. 기타 사항
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  title(s, "9. 기타 사항");

  h2(s, 1.14, "최종합격 예정자 선정");
  o(s, 1.52, "1·2차 전형결과를 합산하여 최고득점자 순으로 2배수 내외의 최종합격 예정자를 선정함.", 0.6);
  o(s, 2.16, "최종합격 예정자에 대하여 법인에 임용 제청을 요청함.");

  h2(s, 2.76, "예비합격자 운영");
  o(s, 3.14, "최종합격자가 임용을 포기하거나 결격사유 발생 등으로 임용이 불가능한 경우에는 차순위자를 임용할 수 있음.", 0.6);

  h2(s, 4.0, "가점 적용");
  o(s, 4.38, "「국가유공자 등 예우 및 지원에 관한 법률」, 「독립유공자 예우에 관한 법률」에 의한 취업지원(보호)대상자", 0.6);

  memo(s, 5.24, "※ 채용예정인원이 3명 이하인 경우에는 보훈 가점을 적용하지 않음.", RED);
  s.addNotes("최종합격 예정자는 2배수 내외로 선정하여 법인에 임용 제청합니다. 채용예정인원이 3명 이하이므로 보훈 가점은 적용하지 않습니다.");
}

// ═══════════════════════════════════════════════════════════════
// 11. 요약
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  title(s, "10. 채용 계획 요약");

  h2(s, 1.14, "요약");
  s.addTable([
    [{ text: "구분", options: TH }, { text: "내 용", options: TH }],
    [{ text: "채용 인원" }, { text: "기술·관리운영직(9급) 1명 (공개채용)", options: { align: "left" } }],
    [{ text: "채용 사유" }, { text: "일반직 정원 8명 대비 현원 5명, 결원 3명 발생", options: { align: "left" } }],
    [{ text: "충원 방안" }, { text: "결원 3명 = 공개채용 1명 + 기간제 운영 2명(증치 정원)", options: { align: "left" } }],
    [{ text: "전형 방법" }, { text: "1차 서류전형(30점, 5배수) → 2차 업무적성 및 심층면접(70점, 2배수)", options: { align: "left" } }],
    [{ text: "전형 배점" }, { text: "1·2차 합산 총 100점, 최고득점자 순 2배수 내외 최종합격 예정자 선정", options: { align: "left" } }],
    [{ text: "결격사유 검증" }, { text: "채용신체검사 · 결격사유 조회 · 성범죄 및 아동학대 범죄전력 조회", options: { align: "left" } }],
    [{ text: "임용 예정일" }, { text: "2027. 1. 1. (법인 임용 제청)", options: { align: "left" } }],
  ], {
    x: M, y: 1.54, w: CW, colW: [1.8, 7.2],
    rowH: [0.34, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42],
    border: TB(), align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 10.5, color: BLACK,
  });

  h2(s, 4.9, "추진 일정");
  s.addTable([
    [
      { text: "2026. 9월", options: TH }, { text: "2026. 11월", options: TH },
      { text: "2026. 12월", options: TH }, { text: "2027. 1. 1.", options: TH },
    ],
    [
      { text: "교육청 사전협의\n및 계획(안) 보고" }, { text: "채용공고 및\n지원서 접수" },
      { text: "1·2차 전형 및\n결격사유 검증" }, { text: "임용", options: { bold: true } },
    ],
  ], {
    x: M, y: 5.3, w: CW, colW: [2.25, 2.25, 2.25, 2.25],
    rowH: [0.34, 0.6],
    border: TB(), align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 10.5, color: BLACK,
  });
  s.addNotes("채용 계획 요약: 1명 공개채용, 결원 3명, 배점 100점, 2027년 1월 1일 임용.");
}

stampPageNumbers();

pres.writeFile({ fileName: "2027년_사무직원_채용계획안.pptx" }).then((f) => console.log("wrote", f));
