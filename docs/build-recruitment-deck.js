const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "정석항공과학고등학교";
pres.title = "2027년 사무직원 채용 계획(안)";

// ── Palette: Midnight Executive ────────────────────────────────
const NAVY = "1E2761";
const NAVY_D = "141B44";
const ICE = "CADCFC";
const ICE_L = "E8EFFC";
const WHITE = "FFFFFF";
const BG = "F5F7FC";
const INK = "22263A";
const MUTED = "6B7186";
const ACCENT = "B23A34";

const HF = "맑은 고딕"; // header font (Malgun Gothic)
const BF = "맑은 고딕"; // body font

// 학교 상징 (정석항공과학고등학교 홈페이지 교표·엠블럼에서 추출, 배경 투명 처리)
const path = require("path");
const GYOPYO = path.join(__dirname, "assets", "gyopyo_gray.png");
const EMBLEM = path.join(__dirname, "assets", "emblem.png");

const M = 0.62; // page margin
const CW = 13.3 - M * 2; // content width = 12.06

const shadow = () => ({ type: "outer", color: "1E2761", opacity: 0.1, blur: 8, offset: 2, angle: 90 });

let pageNo = 0;

function slideBase(bg, isCover) {
  const s = pres.addSlide();
  s.background = { color: bg || BG };
  if (!isCover) {
    // 교표 — 모든 페이지 우측 상단 브랜드 마크
    s.addImage({
      path: GYOPYO, x: 13.3 - M - 0.92, y: 0.42, w: 0.92, h: 0.394,
      altText: "정석항공과학고등학교 교표",
    });
    // 페이지 번호 — 표지 제외, 하단 중앙
    pageNo += 1;
    s.addText(`- ${pageNo} -`, {
      x: (13.3 - 2) / 2, y: 6.9, w: 2, h: 0.32, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11, color: bg === NAVY ? "8E9AC0" : MUTED,
      align: "center", valign: "middle",
    });
  }
  return s;
}

// 전형 단계 표시 (지원서 접수 → 서류전형 → 면접 → 결격사유 검증)
const STEPS = ["접수", "서류", "면접", "검증"];
function stepTracker(s, current) {
  const cw = 0.95, gap = 0.08;
  const total = STEPS.length * cw + (STEPS.length - 1) * gap;
  const x0 = 13.3 - M - 0.92 - 0.34 - total; // 교표 왼쪽에 붙여 우측 정렬
  STEPS.forEach((label, i) => {
    const on = i + 1 === current;
    const x = x0 + i * (cw + gap);
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 0.62, w: cw, h: 0.44, rectRadius: 0.22,
      fill: { color: on ? NAVY : "E8EFFC" },
    });
    s.addText(`${i + 1} ${label}`, {
      x, y: 0.62, w: cw, h: 0.44, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11.5, bold: on, color: on ? WHITE : "8A93AD",
      align: "center", valign: "middle",
    });
  });
}

// Section header: eyebrow + title, no accent line
function header(s, title, eyebrow) {
  if (eyebrow) {
    s.addText(eyebrow, {
      x: M, y: 0.36, w: CW, h: 0.26, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 12, bold: true, color: MUTED, charSpacing: 1.6,
    });
  }
  s.addText(title, {
    x: M, y: eyebrow ? 0.62 : 0.5, w: CW, h: 0.62, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 30, bold: true, color: NAVY, valign: "middle",
  });
}

// Numbered circle motif
function numCircle(s, n, x, y, d, fill, txt) {
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d, fill: { color: fill || NAVY },
  });
  s.addText(String(n), {
    x, y, w: d, h: d, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: d >= 0.46 ? 15 : 12, bold: true,
    color: txt || WHITE, align: "center", valign: "middle",
  });
}

function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.07,
    fill: { color: fill || WHITE }, line: { color: "E3E8F4", width: 1 },
    shadow: shadow(),
  });
}

const tblBorder = [
  { pt: 1, color: "C6CEE2" }, { pt: 1, color: "C6CEE2" },
  { pt: 1, color: "C6CEE2" }, { pt: 1, color: "C6CEE2" },
];

// ═══════════════════════════════════════════════════════════════
// 1. Title
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase(NAVY, true);

  // 엠블럼 — 우측 세로 중앙 워터마크
  s.addImage({
    path: EMBLEM, x: 13.3 - 0.7 - 3.8, y: (7.5 - 3.8) / 2, w: 3.8, h: 3.8, transparency: 84,
    altText: "정석항공과학고등학교 엠블럼",
  });
  // 교표 — 좌측 상단 브랜드 마크
  s.addImage({
    path: GYOPYO, x: 0.72, y: 0.5, w: 1.24, h: 0.53,
    altText: "정석항공과학고등학교 교표",
  });

  s.addText("정석항공과학고등학교 (24학급)", {
    x: 1.0, y: 1.9, w: 8.4, h: 0.34, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 15, bold: true, color: ICE, charSpacing: 2,
  });
  s.addText("2027년 사무직원\n채용 계획(안)", {
    x: 1.0, y: 2.35, w: 9.0, h: 1.9, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 46, bold: true, color: WHITE, lineSpacing: 54,
  });
  s.addShape(pres.ShapeType.roundRect, {
    x: 1.0, y: 4.62, w: 5.35, h: 0.56, rectRadius: 0.28,
    fill: { color: ICE },
  });
  s.addText("기술·관리운영직(9급) 1명 공개채용", {
    x: 1.0, y: 4.62, w: 5.35, h: 0.56, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 15, bold: true, color: NAVY, align: "center", valign: "middle",
  });

  const facts = [
    ["사전협의·계획 보고", "2026. 9월"],
    ["채용공고 및 접수", "2026. 11월"],
    ["임용", "2027. 1. 1."],
  ];
  facts.forEach(([k, v], i) => {
    const x = 1.0 + i * 2.95;
    s.addText(k, {
      x, y: 5.72, w: 2.7, h: 0.26, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11, color: "9AA6C7",
    });
    s.addText(v, {
      x, y: 5.98, w: 2.7, h: 0.34, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 16, bold: true, color: WHITE,
    });
  });

  s.addText("인건비 교육청 지원 · 학교법인 임용 제청", {
    x: 1.0, y: 6.72, w: 8, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12, italic: true, color: "8E9AC0",
  });
  s.addNotes("2027년 사무직원 채용 계획(안) 개요. 기술·관리운영직 9급 1명을 공개채용하며, 2026년 9월 교육청 사전협의부터 2027년 1월 1일 임용까지 진행합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 2. 채용 인원 · 채용 사유
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "채용 인원 및 채용 사유", "01  OVERVIEW");

  // Left: stat cards
  const stats = [
    { n: "8", l: "일반직 정원", c: NAVY },
    { n: "5", l: "일반직 현원", c: NAVY },
    { n: "-3", l: "결원 발생", c: ACCENT },
  ];
  stats.forEach((st, i) => {
    const x = M + i * 2.06;
    card(s, x, 1.72, 1.86, 1.5);
    s.addText(st.n, {
      x, y: 1.86, w: 1.86, h: 0.7, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 40, bold: true, color: st.c, align: "center",
    });
    s.addText(st.l, {
      x, y: 2.6, w: 1.86, h: 0.3, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 12, color: MUTED, align: "center",
    });
  });

  card(s, M, 3.42, 5.78, 1.34, NAVY);
  s.addText("1명", {
    x: M + 0.34, y: 3.62, w: 1.5, h: 0.62, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 34, bold: true, color: WHITE, valign: "middle",
  });
  s.addText("공개채용", {
    x: M + 0.34, y: 4.24, w: 2.2, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12, color: ICE,
  });
  s.addText("기술·관리운영직 9급\n2027. 1. 1. 임용 예정", {
    x: M + 2.5, y: 3.66, w: 3.1, h: 0.9, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13, color: ICE, lineSpacing: 21, valign: "middle",
  });

  card(s, M, 4.96, 5.78, 1.1, ICE_L);
  s.addText("2명", {
    x: M + 0.34, y: 5.08, w: 1.2, h: 0.5, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 24, bold: true, color: NAVY, valign: "middle",
  });
  s.addText("증치 정원 — 기간제 인력으로 운영 예정", {
    x: M + 1.5, y: 5.08, w: 4.1, h: 0.86, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13, color: INK, valign: "middle",
  });

  // Right: 채용 사유
  const rx = M + 6.28;
  card(s, rx, 1.72, CW - 6.28, 4.34);
  s.addText("채용 사유", {
    x: rx + 0.4, y: 2.0, w: 4.5, h: 0.36, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 19, bold: true, color: NAVY,
  });

  const reasons = [
    "일반직 정원 8명 대비 현원 5명으로 결원 3명이 발생하여, 안정적인 학교 행정업무 수행을 위한 인력 충원이 필요함.",
    "결원 3명 중 1명은 공개채용을 통해 충원하고, 증치 정원 2명은 기간제 인력으로 운영하고자 함.",
  ];
  reasons.forEach((t, i) => {
    const y = 2.62 + i * 1.72;
    numCircle(s, i + 1, rx + 0.4, y + 0.58, 0.34);
    s.addText(t, {
      x: rx + 0.92, y, w: CW - 6.28 - 1.32, h: 1.5, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 14, color: INK, lineSpacing: 25, valign: "middle",
    });
  });

  s.addText("※ 인건비는 교육청에서 지원", {
    x: M, y: 6.32, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11, color: MUTED,
  });
  s.addNotes("정원 8명 대비 현원 5명, 결원 3명. 그중 1명은 공개채용, 증치 정원 2명은 기간제로 운영합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 3. 직원 현황
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "직원 현황", "02  STAFFING");
  s.addText("인건비 교육청 지원", {
    x: M, y: 1.32, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13, color: MUTED,
  });

  const hd = { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 11 };
  const hd2 = { fill: { color: ICE_L }, color: NAVY, bold: true, fontSize: 11 };
  const acc = { fill: { color: "FBEDEC" }, color: ACCENT, bold: true, fontSize: 14 };

  const rows = [
    [
      { text: "구분", options: { ...hd, colspan: 2, rowspan: 3 } },
      { text: "일반직", options: { ...hd, colspan: 5 } },
      { text: "계", options: { ...hd, rowspan: 3 } },
      { text: "증치\n(기술직)", options: { ...hd, rowspan: 3 } },
      { text: "합계", options: { ...hd, rowspan: 3 } },
      { text: "결원", options: { ...hd, rowspan: 3 } },
      { text: "채용(안)", options: { ...hd, rowspan: 3 } },
      { text: "비고 (증치사유)", options: { ...hd, rowspan: 3 } },
    ],
    [
      { text: "행정직", options: { ...hd2, colspan: 4 } },
      { text: "기술·\n관리운영직", options: { ...hd2, rowspan: 2 } },
    ],
    [
      { text: "5급", options: hd2 }, { text: "6급", options: hd2 },
      { text: "7급", options: hd2 }, { text: "8급", options: hd2 },
    ],
    [
      { text: "정석고\n(24학급)", options: { rowspan: 2, bold: true, color: NAVY, fill: { color: "FAFBFE" }, fontSize: 12 } },
      { text: "정원", options: { bold: true, color: INK, fill: { color: "FAFBFE" } } },
      { text: "1" }, { text: "1" }, { text: "1" }, { text: "1" }, { text: "2" },
      { text: "6" }, { text: "2" }, { text: "8", options: { bold: true, color: NAVY } },
      { text: "-3", options: { ...acc, rowspan: 2 } },
      { text: "1명", options: { rowspan: 2, bold: true, color: NAVY, fontSize: 14, fill: { color: "FBEDEC" } } },
      { text: "- 15학급당  1명\n- 1,000Kw 이상 1명", options: { rowspan: 2, align: "left", color: INK, fontSize: 11 } },
    ],
    [
      { text: "현원", options: { bold: true, color: INK, fill: { color: "FAFBFE" } } },
      { text: "" }, { text: "1" }, { text: "2" }, { text: "1" }, { text: "1" },
      { text: "5" }, { text: "0" }, { text: "5", options: { bold: true, color: NAVY } },
    ],
  ];

  // 숫자·단답 열 9개(5급~채용(안))는 폭을 동일하게, 구분·기술직·비고만 내용에 맞춰 넓힘
  const NW = 0.7467;
  s.addTable(rows, {
    x: 0.72, y: 1.82, w: 11.86,
    colW: [1.20, 0.74, NW, NW, NW, NW, 1.25, NW, NW, NW, NW, NW, 1.95],
    rowH: [0.40, 0.40, 0.40, 0.74, 0.74],
    border: tblBorder, align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 12, color: INK,
  });

  s.addText("※ 증치 정원 2명은 기간제 인력으로 운영 예정", {
    x: 0.72, y: 4.62, w: CW, h: 0.34, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12, color: MUTED, valign: "middle",
  });

  // 요약 — 정원 − 현원 = 결원, 그 결원 3명을 어떻게 채우는지 하위로 묶어 표시
  const sy = 5.08, sh = 1.46, cwd = 1.46, opw = 0.4;

  [["정원", "8명", NAVY], ["현원", "5명", NAVY], ["결원", "3명", ACCENT]].forEach(([k, v, c], i) => {
    const x = 0.72 + i * (cwd + opw);
    card(s, x, sy, cwd, sh, i === 2 ? "FBEDEC" : WHITE);
    s.addText(k, {
      x, y: sy + 0.26, w: cwd, h: 0.3, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 12, color: MUTED, align: "center", valign: "middle",
    });
    s.addText(v, {
      x, y: sy + 0.62, w: cwd, h: 0.56, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 24, bold: true, color: c, align: "center", valign: "middle",
    });
    if (i < 2) {
      s.addText(i === 0 ? "-" : "=", {
        x: x + cwd, y: sy, w: opw, h: sh, isTextBox: true, margin: 0,
        fontFace: HF, fontSize: 20, bold: true, color: MUTED,
        align: "center", valign: "middle",
      });
    }
  });

  // 결원 → 충원 방안
  const arrowX = 0.72 + 3 * cwd + 2 * opw;
  s.addShape(pres.ShapeType.triangle, {
    x: arrowX + 0.14, y: sy + sh / 2 - 0.12, w: 0.24, h: 0.24,
    fill: { color: NAVY }, rotate: 90,
  });

  const bx = arrowX + 0.52;
  const bw = 0.72 + CW - bx;
  card(s, bx, sy, bw, sh, WHITE);
  s.addText("결원 3명 충원 방안", {
    x: bx + 0.28, y: sy + 0.16, w: bw - 0.56, h: 0.32, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 14, bold: true, color: NAVY, valign: "middle",
  });

  const iw = (bw - 0.56 - 0.18) / 2;
  [["공개채용", "1명", NAVY, WHITE, ICE], ["기간제 운영", "2명", ICE_L, NAVY, INK]].forEach(
    ([k, v, fill, numColor, labelColor], i) => {
      const x = bx + 0.28 + i * (iw + 0.18);
      s.addShape(pres.ShapeType.roundRect, {
        x, y: sy + 0.56, w: iw, h: 0.72, rectRadius: 0.07, fill: { color: fill },
      });
      s.addText(v, {
        x: x + 0.2, y: sy + 0.56, w: 0.9, h: 0.72, isTextBox: true, margin: 0,
        fontFace: HF, fontSize: 22, bold: true, color: numColor, valign: "middle",
      });
      s.addText(k, {
        x: x + 1.12, y: sy + 0.56, w: iw - 1.28, h: 0.72, isTextBox: true, margin: 0,
        fontFace: BF, fontSize: 12.5, color: labelColor, valign: "middle",
      });
    }
  );
  s.addNotes("정원 8명(행정직 4, 기술·관리운영직 2, 증치 2), 현원 5명. 증치 사유는 15학급당 1명, 1,000Kw 이상 1명입니다.");
}

// ═══════════════════════════════════════════════════════════════
// 4. 채용 계획 (일정)
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "채용 계획", "03  SCHEDULE");

  const steps = [
    ["교육청 사전협의 및\n채용 계획(안) 보고", "2026. 9월"],
    ["채용공고 및\n지원서 접수", "2026. 11월"],
    ["1·2차 전형\n(서류전형, 업무적성\n및 심층면접)", "2026. 12월 초"],
    ["합격자 통보 및\n결격사유 검증", "2026. 12월"],
    ["임용", "2027. 1. 1."],
  ];

  const bw = 2.1, gap = 0.39, y0 = 2.2, bh = 3.0;
  const x0 = (13.3 - (bw * 5 + gap * 4)) / 2;

  steps.forEach(([label, date], i) => {
    const x = x0 + i * (bw + gap);
    const last = i === 4;
    card(s, x, y0, bw, bh, last ? NAVY : WHITE);
    numCircle(s, i + 1, x + bw / 2 - 0.23, y0 + 0.3, 0.46, last ? ICE : ICE_L, NAVY);
    s.addText(label, {
      x: x + 0.14, y: y0 + 0.9, w: bw - 0.28, h: 1.15, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 13, bold: true, color: last ? WHITE : INK,
      align: "center", valign: "middle", lineSpacing: 20,
    });
    s.addText(date, {
      x: x + 0.1, y: y0 + 2.15, w: bw - 0.2, h: 0.5, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 14, bold: true, color: last ? ICE : NAVY,
      align: "center", valign: "middle",
    });
    if (i < 4) {
      s.addShape(pres.ShapeType.triangle, {
        x: x + bw + 0.09, y: y0 + bh / 2 - 0.115, w: 0.22, h: 0.23,
        fill: { color: NAVY }, rotate: 90,
      });
    }
  });

  card(s, x0, 5.72, bw * 5 + gap * 4, 0.98, ICE_L);
  s.addText("교육청 사전협의(9월) → 공고·접수(11월) → 전형(12월 초) → 검증·통보(12월) → 임용(2027. 1. 1.)", {
    x: x0 + 0.3, y: 5.72, w: bw * 5 + gap * 4 - 0.6, h: 0.98, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13, bold: true, color: NAVY, align: "center", valign: "middle",
  });
  s.addNotes("전체 채용 일정은 5단계로 진행되며, 2027년 1월 1일 임용으로 마무리됩니다.");
}

// ═══════════════════════════════════════════════════════════════
// 5. 전형 절차
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "전형 절차", "04  PROCESS");

  const steps = [
    ["지원서 접수", [], ""],
    ["서류 심사", [], "5배수 내외"],
    ["업무적성 및\n심층 면접", [], "2배수 내외\n(법인승인요청)"],
    ["결격사유\n검증", ["채용신체검사", "결격사유 조회", "성범죄 조회"], ""],
    ["최종합격자\n결정", [], "2027. 1. 1. 임용"],
  ];

  const bw = 2.1, gap = 0.39, y0 = 1.94, bh = 3.36;
  const x0 = (13.3 - (bw * 5 + gap * 4)) / 2;

  steps.forEach(([label, list, foot], i) => {
    const x = x0 + i * (bw + gap);
    const last = i === 4;
    card(s, x, y0, bw, bh, last ? NAVY : WHITE);
    numCircle(s, i + 1, x + bw / 2 - 0.23, y0 + 0.28, 0.46, last ? ICE : ICE_L, NAVY);
    s.addText(label, {
      x: x + 0.12, y: y0 + 0.9, w: bw - 0.24, h: 0.86, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 15, bold: true, color: last ? WHITE : NAVY,
      align: "center", valign: "middle", lineSpacing: 21,
    });

    if (list.length) {
      s.addText(list.map((t, k) => ({
        text: t, options: { bullet: true, breakLine: k !== list.length - 1 },
      })), {
        x: x + 0.28, y: y0 + 1.96, w: bw - 0.44, h: 1.2, isTextBox: true, margin: 0,
        fontFace: BF, fontSize: 11.5, color: INK, paraSpaceAfter: 6, valign: "top",
      });
    }
    if (foot) {
      s.addText(foot, {
        x: x + 0.1, y: y0 + 2.1, w: bw - 0.2, h: 0.92, isTextBox: true, margin: 0,
        fontFace: BF, fontSize: 12.5, bold: true, color: last ? ICE : NAVY,
        align: "center", valign: "middle", lineSpacing: 18,
      });
    }
    if (i < 4) {
      s.addShape(pres.ShapeType.triangle, {
        x: x + bw + 0.09, y: y0 + bh / 2 - 0.115, w: 0.22, h: 0.23,
        fill: { color: NAVY }, rotate: 90,
      });
    }
  });

  const notes = [
    ["1차 서류전형 30점", "지원자격 요건 및 자기소개서 작성 성실도 평가"],
    ["2차 면접전형 70점", "응시원서·자기소개서를 기초로 업무 적합성 종합평가"],
  ];
  notes.forEach(([k, v], i) => {
    const x = x0 + i * (bw * 2.5 + gap * 2.5);
    const w = bw * 2.5 + gap * 1.5;
    card(s, x, 5.66, w, 0.9, ICE_L);
    s.addText(k, {
      x: x + 0.26, y: 5.66, w: 1.86, h: 0.9, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 14, bold: true, color: NAVY, valign: "middle",
    });
    s.addText(v, {
      x: x + 2.1, y: 5.66, w: w - 2.32, h: 0.9, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11.5, color: INK, valign: "middle", lineSpacing: 17,
    });
  });
  s.addNotes("전형은 지원서 접수 → 서류심사(5배수) → 업무적성 및 심층면접(2배수) → 결격사유 검증 → 최종합격자 결정 순으로 진행됩니다.");
}

// ═══════════════════════════════════════════════════════════════
// 6. ① 지원서 접수
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "지원서 접수", "전형 절차   1단계 / 4단계");
  stepTracker(s, 1);

  // Left card: 지원 자격
  const lw = 5.4;
  card(s, M, 1.72, lw, 2.9);
  s.addText("지원 자격", {
    x: M + 0.38, y: 2.0, w: lw - 0.76, h: 0.36, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 19, bold: true, color: NAVY,
  });
  const quals = [
    "「지방공무원법」 제31조에 결격사유에 해당하지 않는 자",
    "공고일 현재 취업가능 법정 연령(만 18세) 이상인 자로서 「지방공무원법」 제66조(정년)에 해당되지 않는 자",
  ];
  quals.forEach((t, i) => {
    const y = 2.56 + i * 0.94;
    s.addShape(pres.ShapeType.ellipse, { x: M + 0.4, y: y + 0.11, w: 0.11, h: 0.11, fill: { color: NAVY } });
    s.addText(t, {
      x: M + 0.68, y, w: lw - 1.1, h: 0.86, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 13.5, color: INK, lineSpacing: 23,
    });
  });

  card(s, M, 4.78, lw, 1.28, NAVY);
  s.addText("응시원서 입력 항목", {
    x: M + 0.38, y: 4.98, w: lw - 0.76, h: 0.32, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 15, bold: true, color: WHITE,
  });
  s.addText("응시원서  ·  자기소개서(800자 이내)", {
    x: M + 0.38, y: 5.36, w: lw - 0.76, h: 0.34, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13.5, color: ICE,
  });

  // Right: 자기소개서 4문항
  const rx = M + lw + 0.42;
  const rw = CW - lw - 0.42;
  s.addText("자기소개서 문항 (800자 이내)", {
    x: rx, y: 1.72, w: rw, h: 0.36, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 19, bold: true, color: NAVY,
  });

  const items = [
    "성장배경, 본인 성격의 장·단점",
    "지원동기 (본교에 지원하게 된 이유와 응시 직종에 본인이 적합하다고 판단되는 이유)",
    "입사 후 포부 및 직무 수행 계획",
    "조직 내 갈등 상황과 이를 해결하기 위한 노력 및 극복했던 경험",
  ];
  items.forEach((t, i) => {
    const y = 2.24 + i * 1.06;
    card(s, rx, y, rw, 0.92);
    numCircle(s, i + 1, rx + 0.26, y + 0.24, 0.44, ICE_L, NAVY);
    s.addText(t, {
      x: rx + 0.86, y: y + 0.06, w: rw - 1.12, h: 0.8, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 13, color: INK, valign: "middle", lineSpacing: 20,
    });
  });
  s.addNotes("지원 자격은 지방공무원법 제31조 결격사유 비해당, 만 18세 이상 정년 미해당자입니다. 자기소개서는 4개 문항, 800자 이내로 작성합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 7. ② 서류 전형(1차)
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "서류 전형 (1차)", "전형 절차   2단계 / 4단계");
  stepTracker(s, 2);

  const lw = 6.9;
  s.addText([
    { text: "평가방법  ", options: { bold: true, color: NAVY } },
    { text: "지원자격 요건 및 자기소개서 작성 성실도 등을 평가", options: { color: INK } },
  ], {
    x: M, y: 1.66, w: lw, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13,
  });
  s.addText([
    { text: "심사위원  ", options: { bold: true, color: NAVY } },
    { text: "3명 (교장 1명, 행정실장 1명, 외부위원 1명)", options: { color: INK } },
  ], {
    x: M, y: 2.0, w: lw, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13,
  });

  const hd = { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 12.5 };
  const rows = [
    [{ text: "평가항목", options: hd }, { text: "배 점", options: hd }, { text: "합격배수", options: hd }],
    [{ text: "직무전문성", options: { align: "left" } }, { text: "10점" },
      { text: "5배수\n내외", options: { rowspan: 5, bold: true, fontSize: 17, color: NAVY, fill: { color: ICE_L } } }],
    [{ text: "지원동기 및 직업관", options: { align: "left" } }, { text: "8점" }],
    [{ text: "성장과정 및 활동경험", options: { align: "left" } }, { text: "6점" }],
    [{ text: "표현력", options: { align: "left" } }, { text: "6점" }],
    [{ text: "합계", options: { align: "left", bold: true, color: NAVY, fill: { color: "FAFBFE" } } },
      { text: "30점", options: { bold: true, color: NAVY, fontSize: 15, fill: { color: "FAFBFE" } } }],
  ];
  s.addTable(rows, {
    x: M, y: 2.5, w: lw, colW: [3.5, 1.7, 1.7],
    rowH: [0.4, 0.44, 0.44, 0.44, 0.44, 0.48],
    border: tblBorder, align: "center", valign: "middle",
    fontFace: BF, fontSize: 13, color: INK,
  });

  // Right: 탈락 기준
  const rx = M + lw + 0.5;
  const rw = CW - lw - 0.5;
  card(s, rx, 1.66, rw, 3.7, "FBEDEC");
  s.addText("자기소개서 불성실 작성자\n탈락 기준", {
    x: rx + 0.36, y: 1.98, w: rw - 0.72, h: 0.78, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 18, bold: true, color: ACCENT, lineSpacing: 26, valign: "middle",
  });
  const outs = [
    "문항과 전혀 무관한 내용을 작성",
    "동일 내용 반복 또는 문항별 50% 미만(약 400자) 작성한 경우",
    "채용 기관명을 오기재하여 제출한 경우 등",
  ];
  outs.forEach((t, i) => {
    const y = 2.96 + i * 0.76;
    s.addShape(pres.ShapeType.ellipse, { x: rx + 0.38, y: y + 0.26, w: 0.11, h: 0.11, fill: { color: ACCENT } });
    s.addText(t, {
      x: rx + 0.66, y, w: rw - 1.06, h: 0.64, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 13, color: INK, lineSpacing: 21, valign: "middle",
    });
  });

  card(s, M, 5.66, CW, 0.82, NAVY);
  s.addText("1차 서류전형 30점 · 합격배수 5배수 내외 — 심사위원 3명(교장 1, 행정실장 1, 외부위원 1)", {
    x: M, y: 5.66, w: CW, h: 0.82, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13, bold: true, color: WHITE, align: "center", valign: "middle",
  });
  s.addNotes("1차 서류전형은 총 30점 만점, 5배수 내외를 선발합니다. 자기소개서 불성실 작성자는 탈락 기준에 따라 배제됩니다.");
}

// ═══════════════════════════════════════════════════════════════
// 8. ③ 업무적성 및 심층면접(2차)
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "업무적성 및 심층면접 (2차)", "전형 절차   3단계 / 4단계");
  stepTracker(s, 3);

  const lw = 6.9;
  s.addText([
    { text: "평가방법  ", options: { bold: true, color: NAVY } },
    { text: "응시원서 및 자기소개서를 기초로 업무 적합성을 종합평가", options: { color: INK } },
  ], {
    x: M, y: 1.66, w: lw, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13,
  });
  s.addText([
    { text: "심사위원  ", options: { bold: true, color: NAVY } },
    { text: "3명 (교장 1명, 법인관계자 1명, 외부위원 1명)", options: { color: INK } },
  ], {
    x: M, y: 2.0, w: lw, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13,
  });

  const hd = { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 12.5 };
  const rows = [
    [{ text: "평가항목", options: hd }, { text: "배 점", options: hd }, { text: "합격배수", options: hd }],
    [{ text: "직무수행능력", options: { align: "left" } }, { text: "20점" },
      { text: "2배수\n내외", options: { rowspan: 5, bold: true, fontSize: 17, color: NAVY, fill: { color: ICE_L } } }],
    [{ text: "기본소양·태도", options: { align: "left" } }, { text: "20점" }],
    [{ text: "조직 이해도 및 적응력", options: { align: "left" } }, { text: "15점" }],
    [{ text: "발전가능성", options: { align: "left" } }, { text: "15점" }],
    [{ text: "합계", options: { align: "left", bold: true, color: NAVY, fill: { color: "FAFBFE" } } },
      { text: "70점", options: { bold: true, color: NAVY, fontSize: 15, fill: { color: "FAFBFE" } } }],
  ];
  s.addTable(rows, {
    x: M, y: 2.5, w: lw, colW: [3.5, 1.7, 1.7],
    rowH: [0.4, 0.44, 0.44, 0.44, 0.44, 0.48],
    border: tblBorder, align: "center", valign: "middle",
    fontFace: BF, fontSize: 13, color: INK,
  });

  // Right: 배점 구성 도넛 chart
  const rx = M + lw + 0.5;
  const rw = CW - lw - 0.5;
  card(s, rx, 1.66, rw, 4.82);
  s.addText("전형별 배점 구성", {
    x: rx + 0.36, y: 1.94, w: rw - 0.72, h: 0.36, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 18, bold: true, color: NAVY,
  });
  s.addChart(pres.ChartType.doughnut, [{
    name: "배점",
    labels: ["2차 면접전형", "1차 서류전형"],
    values: [70, 30],
  }], {
    x: rx + 0.55, y: 2.32, w: rw - 1.1, h: 2.2,
    holeSize: 58, chartColors: [NAVY, ICE],
    showLegend: false, showValue: false, showTitle: false,
  });

  [["2차 면접전형", "70점", NAVY], ["1차 서류전형", "30점", ICE]].forEach(([k, v, c], i) => {
    const y = 4.62 + i * 0.42;
    s.addShape(pres.ShapeType.roundRect, {
      x: rx + 0.5, y: y + 0.09, w: 0.2, h: 0.2, rectRadius: 0.05, fill: { color: c },
    });
    s.addText(k, {
      x: rx + 0.86, y, w: 2.2, h: 0.38, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 13, color: INK, valign: "middle",
    });
    s.addText(v, {
      x: rx + 2.4, y, w: 1.4, h: 0.38, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 15, bold: true, color: NAVY, align: "right", valign: "middle",
    });
  });

  s.addText("1·2차 전형결과 합산 총 100점", {
    x: rx + 0.3, y: 5.58, w: rw - 0.6, h: 0.38, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 15, bold: true, color: NAVY, align: "center", valign: "middle",
  });
  s.addText("최고득점자 순으로 2배수 내외 최종합격 예정자 선정", {
    x: rx + 0.3, y: 5.96, w: rw - 0.6, h: 0.34, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12, color: MUTED, align: "center", valign: "middle",
  });
  s.addNotes("2차 면접은 70점 만점이며 2배수 내외를 선발합니다. 1·2차 합산 100점 기준으로 최종 순위를 결정합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 9. ④ 결격사유 검증
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "결격사유 검증", "전형 절차   4단계 / 4단계");
  stepTracker(s, 4);

  s.addText([
    { text: "대 상 자  ", options: { bold: true, color: NAVY } },
    { text: "최종합격 예정자", options: { color: INK } },
    { text: "         검증내용  ", options: { bold: true, color: NAVY } },
    { text: "임용 결격사유 해당 여부 확인", options: { color: INK } },
  ], {
    x: M, y: 1.62, w: CW, h: 0.32, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13.5,
  });

  // 채용신체검사 card
  const lw = 4.5;
  card(s, M, 2.14, lw, 2.5, NAVY);
  s.addText("채용신체검사", {
    x: M + 0.36, y: 2.48, w: lw - 0.72, h: 0.4, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 20, bold: true, color: WHITE,
  });
  [["시행근거", "사무직원 인사 규정\n(신규임용자 구비서류)"], ["검사항목", "공무원 채용신체검사\n규정 적용"]].forEach(([k, v], i) => {
    const y = 3.06 + i * 0.78;
    s.addText(k, {
      x: M + 0.36, y, w: 1.1, h: 0.7, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 12, bold: true, color: ICE, valign: "middle",
    });
    s.addText(v, {
      x: M + 1.5, y, w: lw - 1.86, h: 0.7, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 12.5, color: WHITE, valign: "middle", lineSpacing: 18,
    });
  });

  // 조회 table
  const rx = M + lw + 0.46;
  const rw = CW - lw - 0.46;
  s.addText("결격사유조회 및 범죄경력조회", {
    x: rx, y: 2.14, w: rw, h: 0.36, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 18, bold: true, color: NAVY,
  });

  const hd = { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 12.5 };
  const rows = [
    [{ text: "구분", options: hd }, { text: "근거 법령", options: hd }, { text: "조회 방법", options: hd }],
    [
      { text: "결격사유 조회 및\n범죄경력 조회", options: { bold: true, color: INK } },
      { text: "「교육공무원법」\n「사립학교법」", options: { align: "left" } },
      { text: "행정정보\n공동이용시스템 이용", options: { rowspan: 2, bold: true, color: NAVY, fill: { color: ICE_L }, fontSize: 12.5 } },
    ],
    [
      { text: "성범죄결격 및\n아동학대 범죄전력 조회", options: { bold: true, color: INK, fontSize: 12 } },
      { text: "「아동·청소년 성보호에\n관한 법률」", options: { align: "left" } },
    ],
  ];
  s.addTable(rows, {
    x: rx, y: 2.64, w: rw, colW: [2.44, 2.4, 2.26],
    rowH: [0.4, 0.8, 0.8],
    border: tblBorder, align: "center", valign: "middle",
    fontFace: BF, fontSize: 12.5, color: INK,
  });

  card(s, M, 5.12, CW, 1.28, ICE_L);
  s.addText("검증 3종", {
    x: M + 0.4, y: 5.12, w: 1.5, h: 1.28, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 16, bold: true, color: NAVY, valign: "middle",
  });
  ["채용신체검사", "결격사유 조회", "성범죄·아동학대 조회"].forEach((t, i) => {
    const x = M + 2.1 + i * 3.3;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 5.44, w: 3.0, h: 0.64, rectRadius: 0.32, fill: { color: WHITE },
    });
    s.addText(t, {
      x, y: 5.44, w: 3.0, h: 0.64, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 13, bold: true, color: NAVY, align: "center", valign: "middle",
    });
  });
  s.addNotes("최종합격 예정자를 대상으로 채용신체검사, 결격사유·범죄경력 조회, 성범죄 및 아동학대 범죄전력 조회를 실시합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 10. 기타 사항
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "기타 사항", "05  OTHERS");

  const blocks = [
    {
      t: "최종합격 예정자 선정",
      lines: [
        "1·2차 전형결과를 합산하여 최고득점자 순으로 2배수 내외의 최종합격 예정자를 선정함.",
        "최종합격 예정자에 대하여 법인에 임용 제청을 요청함.",
      ],
    },
    {
      t: "예비합격자 운영",
      lines: [
        "최종합격자가 임용을 포기하거나 결격사유 발생 등으로 임용이 불가능한 경우에는 차순위자를 임용할 수 있음.",
      ],
    },
    {
      t: "가점 적용",
      lines: [
        "「국가유공자 등 예우 및 지원에 관한 법률」, 「독립유공자 예우에 관한 법률」에 의한 취업지원(보호)대상자",
      ],
    },
  ];

  const bw = (CW - 0.72) / 3;
  blocks.forEach((b, i) => {
    const x = M + i * (bw + 0.36);
    card(s, x, 1.76, bw, 3.2);
    numCircle(s, i + 1, x + 0.36, 2.06, 0.46, ICE_L, NAVY);
    s.addText(b.t, {
      x: x + 0.36, y: 2.62, w: bw - 0.72, h: 0.5, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 18, bold: true, color: NAVY, valign: "middle",
    });
    s.addText(b.lines.map((t, k) => ({
      text: t, options: { bullet: true, breakLine: k !== b.lines.length - 1 },
    })), {
      x: x + 0.38, y: 3.26, w: bw - 0.76, h: 1.9, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 13, color: INK, lineSpacing: 22, paraSpaceAfter: 10,
      valign: "top",
    });
  });

  card(s, M, 5.34, CW, 0.96, "FBEDEC");
  s.addText("※ 채용예정인원이 3명 이하인 경우에는 보훈 가점을 적용하지 않음.", {
    x: M, y: 5.34, w: CW, h: 0.96, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 14, bold: true, color: ACCENT, align: "center", valign: "middle",
  });
  s.addNotes("최종합격 예정자는 2배수 내외로 선정하여 법인에 임용 제청합니다. 채용예정인원이 3명 이하이므로 보훈 가점은 적용하지 않습니다.");
}

// ═══════════════════════════════════════════════════════════════
// 11. 요약 (closing)
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase(NAVY);
  s.addText("한눈에 보는 채용 계획", {
    x: M + 0.4, y: 0.86, w: CW, h: 0.6, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 32, bold: true, color: WHITE,
  });
  s.addText("정석항공과학고등학교 · 기술·관리운영직(9급) 1명 공개채용", {
    x: M + 0.4, y: 1.5, w: CW, h: 0.34, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 14, color: "9AA6C7",
  });

  const kpis = [
    ["채용 인원", "1명", "기술·관리운영직 9급"],
    ["결원", "3명", "정원 8 / 현원 5"],
    ["전형 배점", "100점", "서류 30 + 면접 70"],
    ["임용일", "2027. 1. 1.", "법인 임용 제청"],
  ];
  const kw = (CW - 0.9) / 4;
  kpis.forEach(([k, v, sub], i) => {
    const x = M + i * (kw + 0.3);
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 2.3, w: kw, h: 1.94, rectRadius: 0.08,
      fill: { color: NAVY_D }, line: { color: "34406F", width: 1 },
    });
    s.addText(k, {
      x: x + 0.26, y: 2.52, w: kw - 0.52, h: 0.28, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 12, color: ICE,
    });
    s.addText(v, {
      x: x + 0.26, y: 2.86, w: kw - 0.52, h: 0.62, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 28, bold: true, color: WHITE, valign: "middle",
    });
    s.addText(sub, {
      x: x + 0.26, y: 3.56, w: kw - 0.52, h: 0.46, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11.5, color: "9AA6C7", lineSpacing: 16,
    });
  });

  s.addText("추진 일정", {
    x: M, y: 4.66, w: CW, h: 0.32, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 15, bold: true, color: ICE,
  });
  const tl = [
    ["2026. 9월", "교육청 사전협의·계획 보고"],
    ["2026. 11월", "채용공고 및 지원서 접수"],
    ["2026. 12월", "1·2차 전형 및 결격사유 검증"],
    ["2027. 1. 1.", "임용"],
  ];
  tl.forEach(([d, t], i) => {
    const x = M + i * (kw + 0.3);
    s.addShape(pres.ShapeType.ellipse, { x, y: 5.24, w: 0.16, h: 0.16, fill: { color: ICE } });
    s.addText(d, {
      x, y: 5.5, w: kw, h: 0.3, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 14, bold: true, color: WHITE,
    });
    s.addText(t, {
      x, y: 5.84, w: kw - 0.1, h: 0.6, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 12, color: "9AA6C7", lineSpacing: 17,
    });
  });
  s.addNotes("채용 계획 요약: 1명 공개채용, 결원 3명, 배점 100점, 2027년 1월 1일 임용.");
}

pres.writeFile({ fileName: "2027년_사무직원_채용계획안.pptx" }).then((f) => console.log("wrote", f));
