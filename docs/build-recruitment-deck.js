// 2027년 사무직원 채용 계획(안) — 4:3 (10" × 7.5") 슬라이드 생성기
//
//   node build-recruitment-deck.js
//   python3 postprocess-linebreak.py 2027년_사무직원_채용계획안.pptx
//
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_4x3"; // 10 × 7.5
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

// 학교 상징 (정석항공과학고등학교 교표·엠블럼, 배경 투명 처리)
const path = require("path");
const GYOPYO = path.join(__dirname, "assets", "gyopyo_gray.png");
const EMBLEM = path.join(__dirname, "assets", "emblem.png");

const SW = 10;   // 슬라이드 폭
const SH = 7.5;  // 슬라이드 높이
const M = 0.5;   // 페이지 여백
const CW = SW - M * 2; // 본문 폭 = 9.0

const shadow = () => ({ type: "outer", color: "1E2761", opacity: 0.1, blur: 7, offset: 2, angle: 90 });

let pageNo = 0;

function slideBase(bg, isCover) {
  const s = pres.addSlide();
  s.background = { color: bg || BG };
  if (!isCover) {
    // 교표 — 모든 페이지 우측 상단 브랜드 마크
    s.addImage({
      path: GYOPYO, x: SW - M - 0.8, y: 0.4, w: 0.8, h: 0.343,
      altText: "정석항공과학고등학교 교표",
    });
    // 페이지 번호 — 표지 제외, 하단 중앙
    pageNo += 1;
    s.addText(`- ${pageNo} -`, {
      x: (SW - 2) / 2, y: 6.92, w: 2, h: 0.3, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 10.5, color: bg === NAVY ? "8E9AC0" : MUTED,
      align: "center", valign: "middle",
    });
  }
  return s;
}

// Section header: eyebrow + title, no accent line
function header(s, title, eyebrow) {
  if (eyebrow) {
    s.addText(eyebrow, {
      x: M, y: 0.34, w: CW - 1.0, h: 0.24, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11, bold: true, color: MUTED, charSpacing: 1.4,
    });
  }
  s.addText(title, {
    x: M, y: eyebrow ? 0.58 : 0.48, w: CW - 1.0, h: 0.56, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 26, bold: true, color: NAVY, valign: "middle",
  });
}

// 전형 단계 표시 (지원서 접수 → 서류전형 → 면접 → 결격사유 검증)
const STEPS = ["접수", "서류", "면접", "검증"];
function stepTracker(s, current) {
  const cw = 1.0, gap = 0.1;
  STEPS.forEach((label, i) => {
    const on = i + 1 === current;
    const x = M + i * (cw + gap);
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 1.22, w: cw, h: 0.4, rectRadius: 0.2,
      fill: { color: on ? NAVY : ICE_L },
    });
    s.addText(`${i + 1} ${label}`, {
      x, y: 1.22, w: cw, h: 0.4, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11, bold: on, color: on ? WHITE : "8A93AD",
      align: "center", valign: "middle",
    });
  });
}

// Numbered circle motif
function numCircle(s, n, x, y, d, fill, txt) {
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d, fill: { color: fill || NAVY },
  });
  s.addText(String(n), {
    x, y, w: d, h: d, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: d >= 0.42 ? 13 : 11, bold: true,
    color: txt || WHITE, align: "center", valign: "middle",
  });
}

function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: fill || WHITE }, line: { color: "E3E8F4", width: 1 },
    shadow: shadow(),
  });
}

const tblBorder = [
  { pt: 1, color: "C6CEE2" }, { pt: 1, color: "C6CEE2" },
  { pt: 1, color: "C6CEE2" }, { pt: 1, color: "C6CEE2" },
];

// ═══════════════════════════════════════════════════════════════
// 1. 표지
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase(NAVY, true);

  s.addImage({
    path: EMBLEM, x: SW - 0.55 - 2.9, y: (SH - 2.9) / 2, w: 2.9, h: 2.9,
    transparency: 84, altText: "정석항공과학고등학교 엠블럼",
  });
  s.addImage({
    path: GYOPYO, x: 0.55, y: 0.45, w: 1.05, h: 0.45,
    altText: "정석항공과학고등학교 교표",
  });

  s.addText("정석항공과학고등학교 (24학급)", {
    x: 0.85, y: 1.92, w: 5.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13, bold: true, color: ICE, charSpacing: 1.6,
  });
  s.addText("2027년 사무직원\n채용 계획(안)", {
    x: 0.85, y: 2.36, w: 5.5, h: 1.6, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 38, bold: true, color: WHITE, lineSpacing: 46,
  });
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.85, y: 4.4, w: 4.55, h: 0.52, rectRadius: 0.26, fill: { color: ICE },
  });
  s.addText("기술·관리운영직(9급) 1명 공개채용", {
    x: 0.85, y: 4.4, w: 4.55, h: 0.52, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13.5, bold: true, color: NAVY,
    align: "center", valign: "middle",
  });

  const facts = [
    ["사전협의·계획 보고", "2026. 9월"],
    ["채용공고 및 접수", "2026. 11월"],
    ["임용", "2027. 1. 1."],
  ];
  facts.forEach(([k, v], i) => {
    const x = 0.85 + i * 1.95;
    s.addText(k, {
      x, y: 5.4, w: 1.9, h: 0.24, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 10, color: "9AA6C7", valign: "middle",
    });
    s.addText(v, {
      x, y: 5.66, w: 1.9, h: 0.32, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 15, bold: true, color: WHITE, valign: "middle",
    });
  });

  s.addText("인건비 교육청 지원 · 학교법인 임용 제청", {
    x: 0.85, y: 6.5, w: 6.0, h: 0.28, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11, italic: true, color: "8E9AC0", valign: "middle",
  });
  s.addNotes("2027년 사무직원 채용 계획(안) 개요. 기술·관리운영직 9급 1명을 공개채용하며, 2026년 9월 교육청 사전협의부터 2027년 1월 1일 임용까지 진행합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 2. 채용 인원 · 채용 사유
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "채용 인원 및 채용 사유", "01  OVERVIEW");

  const lx = M, lw = 4.35;
  const rx = M + 4.65, rw = 4.35;

  // 정원 / 현원 / 결원
  [["8", "일반직 정원", NAVY], ["5", "일반직 현원", NAVY], ["-3", "결원 발생", ACCENT]]
    .forEach(([n, l, c], i) => {
      const x = lx + i * 1.5;
      card(s, x, 1.75, 1.35, 1.32);
      s.addText(n, {
        x, y: 1.88, w: 1.35, h: 0.62, isTextBox: true, margin: 0,
        fontFace: HF, fontSize: 32, bold: true, color: c, align: "center", valign: "middle",
      });
      s.addText(l, {
        x, y: 2.54, w: 1.35, h: 0.28, isTextBox: true, margin: 0,
        fontFace: BF, fontSize: 11, color: MUTED, align: "center", valign: "middle",
      });
    });

  card(s, lx, 3.28, lw, 1.24, NAVY);
  s.addText("1명", {
    x: lx + 0.28, y: 3.44, w: 1.1, h: 0.5, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 28, bold: true, color: WHITE, valign: "middle",
  });
  s.addText("공개채용", {
    x: lx + 0.28, y: 3.96, w: 1.4, h: 0.26, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11, color: ICE, valign: "middle",
  });
  s.addText("기술·관리운영직 9급\n2027. 1. 1. 임용 예정", {
    x: lx + 1.85, y: 3.5, w: 2.3, h: 0.8, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11.5, color: ICE, lineSpacing: 19, valign: "middle",
  });

  card(s, lx, 4.68, lw, 0.95, ICE_L);
  s.addText("2명", {
    x: lx + 0.28, y: 4.68, w: 0.85, h: 0.95, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 21, bold: true, color: NAVY, valign: "middle",
  });
  s.addText("증치 정원 — 기간제 인력으로 운영 예정", {
    x: lx + 1.15, y: 4.68, w: 2.95, h: 0.95, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11.5, color: INK, valign: "middle",
  });

  // 채용 사유
  card(s, rx, 1.75, rw, 3.88);
  s.addText("채용 사유", {
    x: rx + 0.32, y: 2.0, w: 3.0, h: 0.32, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 16, bold: true, color: NAVY, valign: "middle",
  });
  [
    "일반직 정원 8명 대비 현원 5명으로 결원 3명이 발생하여, 안정적인 학교 행정업무 수행을 위한 인력 충원이 필요함.",
    "결원 3명 중 1명은 공개채용을 통해 충원하고, 증치 정원 2명은 기간제 인력으로 운영하고자 함.",
  ].forEach((t, i) => {
    const y = 2.5 + i * 1.55;
    numCircle(s, i + 1, rx + 0.32, y + 0.53, 0.3);
    s.addText(t, {
      x: rx + 0.78, y, w: rw - 1.1, h: 1.36, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 12, color: INK, lineSpacing: 21, valign: "middle",
    });
  });

  s.addText("※ 인건비는 교육청에서 지원", {
    x: M, y: 5.82, w: CW, h: 0.28, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 10.5, color: MUTED, valign: "middle",
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
    x: M, y: 1.2, w: CW, h: 0.28, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11.5, color: MUTED, valign: "middle",
  });

  const hd = { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 9.5 };
  const hd2 = { fill: { color: ICE_L }, color: NAVY, bold: true, fontSize: 9.5 };
  const acc = { fill: { color: "FBEDEC" }, color: ACCENT, bold: true, fontSize: 12 };

  const rows = [
    [
      { text: "구분", options: { ...hd, colspan: 2, rowspan: 3 } },
      { text: "일반직", options: { ...hd, colspan: 5 } },
      { text: "계", options: { ...hd, rowspan: 3 } },
      { text: "증치\n(기술직)", options: { ...hd, rowspan: 3, fontSize: 9 } },
      { text: "합계", options: { ...hd, rowspan: 3 } },
      { text: "결원", options: { ...hd, rowspan: 3 } },
      { text: "채용\n(안)", options: { ...hd, rowspan: 3 } },
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
      { text: "정석고\n(24학급)", options: { rowspan: 2, bold: true, color: NAVY, fill: { color: "FAFBFE" }, fontSize: 10.5 } },
      { text: "정원", options: { bold: true, color: INK, fill: { color: "FAFBFE" } } },
      { text: "1" }, { text: "1" }, { text: "1" }, { text: "1" }, { text: "2" },
      { text: "6" }, { text: "2" }, { text: "8", options: { bold: true, color: NAVY } },
      { text: "-3", options: { ...acc, rowspan: 2 } },
      { text: "1명", options: { rowspan: 2, bold: true, color: NAVY, fontSize: 12, fill: { color: "FBEDEC" } } },
      { text: "- 15학급당  1명\n- 1,000Kw 이상 1명", options: { rowspan: 2, align: "left", color: INK, fontSize: 9.5 } },
    ],
    [
      { text: "현원", options: { bold: true, color: INK, fill: { color: "FAFBFE" } } },
      { text: "" }, { text: "1" }, { text: "2" }, { text: "1" }, { text: "1" },
      { text: "5" }, { text: "0" }, { text: "5", options: { bold: true, color: NAVY } },
    ],
  ];

  // 숫자·단답 열 9개는 폭을 동일하게, 구분·기술직·비고만 내용에 맞춰 넓힘
  const NW = 0.5389;
  s.addTable(rows, {
    x: M, y: 1.58, w: CW,
    colW: [1.0, 0.6, NW, NW, NW, NW, 1.0, NW, NW, NW, NW, NW, 1.55],
    rowH: [0.36, 0.36, 0.36, 0.62, 0.62],
    border: tblBorder, align: "center", valign: "middle", margin: 2,
    fontFace: BF, fontSize: 10.5, color: INK,
  });

  s.addText("※ 증치 정원 2명은 기간제 인력으로 운영 예정", {
    x: M, y: 4.02, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 10.5, color: MUTED, valign: "middle",
  });

  // 요약 — 정원 − 현원 = 결원, 그 결원 3명을 어떻게 채우는지 하위로 묶어 표시
  const sy = 4.55, sh = 1.45, cwd = 1.15, opw = 0.3;

  [["정원", "8명", NAVY], ["현원", "5명", NAVY], ["결원", "3명", ACCENT]].forEach(([k, v, c], i) => {
    const x = M + i * (cwd + opw);
    card(s, x, sy, cwd, sh, i === 2 ? "FBEDEC" : WHITE);
    s.addText(k, {
      x, y: sy + 0.24, w: cwd, h: 0.28, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11, color: MUTED, align: "center", valign: "middle",
    });
    s.addText(v, {
      x, y: sy + 0.6, w: cwd, h: 0.54, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 21, bold: true, color: c, align: "center", valign: "middle",
    });
    if (i < 2) {
      s.addText(i === 0 ? "-" : "=", {
        x: x + cwd, y: sy, w: opw, h: sh, isTextBox: true, margin: 0,
        fontFace: HF, fontSize: 17, bold: true, color: MUTED,
        align: "center", valign: "middle",
      });
    }
  });

  const arrowX = M + 3 * cwd + 2 * opw;
  s.addShape(pres.ShapeType.triangle, {
    x: arrowX + 0.09, y: sy + sh / 2 - 0.1, w: 0.2, h: 0.2,
    fill: { color: NAVY }, rotate: 90,
  });

  const bx = arrowX + 0.42;
  const bw = M + CW - bx;
  card(s, bx, sy, bw, sh, WHITE);
  s.addText("결원 3명 충원 방안", {
    x: bx + 0.24, y: sy + 0.14, w: bw - 0.48, h: 0.3, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 12.5, bold: true, color: NAVY, valign: "middle",
  });

  const iw = (bw - 0.48 - 0.14) / 2;
  [["공개채용", "1명", NAVY, WHITE, ICE], ["기간제 운영", "2명", ICE_L, NAVY, INK]].forEach(
    ([k, v, fill, numColor, labelColor], i) => {
      const x = bx + 0.24 + i * (iw + 0.14);
      s.addShape(pres.ShapeType.roundRect, {
        x, y: sy + 0.52, w: iw, h: 0.72, rectRadius: 0.06, fill: { color: fill },
      });
      s.addText(v, {
        x: x + 0.16, y: sy + 0.52, w: 0.7, h: 0.72, isTextBox: true, margin: 0,
        fontFace: HF, fontSize: 17, bold: true, color: numColor, valign: "middle",
      });
      s.addText(k, {
        x: x + 0.9, y: sy + 0.52, w: iw - 1.04, h: 0.72, isTextBox: true, margin: 0,
        fontFace: BF, fontSize: 10.5, color: labelColor, valign: "middle",
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

  const bw = 1.52, gap = 0.35, y0 = 2.05, bh = 2.85;
  const x0 = M;

  steps.forEach(([label, date], i) => {
    const x = x0 + i * (bw + gap);
    const last = i === 4;
    card(s, x, y0, bw, bh, last ? NAVY : WHITE);
    numCircle(s, i + 1, x + bw / 2 - 0.21, y0 + 0.26, 0.42, last ? ICE : ICE_L, NAVY);
    s.addText(label, {
      x: x + 0.05, y: y0 + 0.82, w: bw - 0.1, h: 1.1, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11, bold: true, color: last ? WHITE : INK,
      align: "center", valign: "middle", lineSpacing: 17,
    });
    s.addText(date, {
      x: x + 0.06, y: y0 + 2.02, w: bw - 0.12, h: 0.46, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 12, bold: true, color: last ? ICE : NAVY,
      align: "center", valign: "middle",
    });
    if (i < 4) {
      s.addShape(pres.ShapeType.triangle, {
        x: x + bw + 0.08, y: y0 + bh / 2 - 0.1, w: 0.2, h: 0.2,
        fill: { color: NAVY }, rotate: 90,
      });
    }
  });

  card(s, M, 5.32, CW, 0.95, ICE_L);
  s.addText("교육청 사전협의(9월) → 공고·접수(11월) → 전형(12월 초) → 검증·통보(12월) → 임용(2027. 1. 1.)", {
    x: M + 0.3, y: 5.32, w: CW - 0.6, h: 0.95, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11.5, bold: true, color: NAVY,
    align: "center", valign: "middle", lineSpacing: 19,
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
    ["최종합격자\n결정", [], "2027. 1. 1.\n임용"],
  ];

  const bw = 1.52, gap = 0.35, y0 = 1.95, bh = 3.15;
  const x0 = M;

  steps.forEach(([label, list, foot], i) => {
    const x = x0 + i * (bw + gap);
    const last = i === 4;
    card(s, x, y0, bw, bh, last ? NAVY : WHITE);
    numCircle(s, i + 1, x + bw / 2 - 0.21, y0 + 0.24, 0.42, last ? ICE : ICE_L, NAVY);
    s.addText(label, {
      x: x + 0.08, y: y0 + 0.8, w: bw - 0.16, h: 0.8, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 12.5, bold: true, color: last ? WHITE : NAVY,
      align: "center", valign: "middle", lineSpacing: 18,
    });

    if (list.length) {
      s.addText(list.map((t, k) => ({
        text: t,
        options: { bullet: { indent: 10 }, breakLine: k !== list.length - 1 },
      })), {
        x: x + 0.08, y: y0 + 1.75, w: bw - 0.16, h: 1.1, isTextBox: true, margin: 0,
        fontFace: BF, fontSize: 9.5, color: INK, paraSpaceAfter: 5, valign: "top",
      });
    }
    if (foot) {
      s.addText(foot, {
        x: x + 0.06, y: y0 + 1.9, w: bw - 0.12, h: 0.9, isTextBox: true, margin: 0,
        fontFace: BF, fontSize: 11, bold: true, color: last ? ICE : NAVY,
        align: "center", valign: "middle", lineSpacing: 16,
      });
    }
    if (i < 4) {
      s.addShape(pres.ShapeType.triangle, {
        x: x + bw + 0.08, y: y0 + bh / 2 - 0.1, w: 0.2, h: 0.2,
        fill: { color: NAVY }, rotate: 90,
      });
    }
  });

  [
    ["1차 서류전형 30점", "지원자격 요건 및 자기소개서 작성 성실도 평가"],
    ["2차 면접전형 70점", "응시원서·자기소개서를 기초로 업무 적합성 종합평가"],
  ].forEach(([k, v], i) => {
    const x = M + i * 4.65;
    card(s, x, 5.42, 4.35, 0.9, ICE_L);
    s.addText(k, {
      x: x + 0.26, y: 5.52, w: 3.9, h: 0.3, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 12.5, bold: true, color: NAVY, valign: "middle",
    });
    s.addText(v, {
      x: x + 0.26, y: 5.84, w: 3.9, h: 0.34, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 10.5, color: INK, valign: "middle",
    });
  });
  s.addNotes("전형은 지원서 접수 → 서류심사(5배수) → 업무적성 및 심층면접(2배수) → 결격사유 검증 → 최종합격자 결정 순으로 진행됩니다.");
}

// ═══════════════════════════════════════════════════════════════
// 6. 지원서 접수 (전형 1단계)
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "지원서 접수", "전형 절차   1단계 / 4단계");
  stepTracker(s, 1);

  // 좌·우 블록의 제목선(1.82)과 카드 상단(2.2)·하단(5.5)을 맞춤
  const TOP = 2.2, BOTTOM = 5.5;
  const lx = M, lw = 4.2;
  const rx = M + 4.5, rw = 4.5;

  s.addText("지원 자격", {
    x: lx, y: 1.82, w: lw, h: 0.32, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 15, bold: true, color: NAVY, valign: "middle",
  });
  card(s, lx, TOP, lw, 2.05);
  [
    "「지방공무원법」 제31조에 결격사유에 해당하지 않는 자",
    "공고일 현재 취업가능 법정 연령(만 18세) 이상인 자로서 「지방공무원법」 제66조(정년)에 해당되지 않는 자",
  ].forEach((t, i) => {
    const y = TOP + 0.22 + i * 0.86;
    s.addShape(pres.ShapeType.ellipse, { x: lx + 0.3, y: y + 0.1, w: 0.09, h: 0.09, fill: { color: NAVY } });
    s.addText(t, {
      x: lx + 0.52, y, w: lw - 0.84, h: 0.8, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11.5, color: INK, lineSpacing: 19, valign: "top",
    });
  });

  card(s, lx, BOTTOM - 1.05, lw, 1.05, NAVY);
  s.addText("응시원서 입력 항목", {
    x: lx + 0.3, y: BOTTOM - 0.9, w: lw - 0.6, h: 0.3, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 13.5, bold: true, color: WHITE, valign: "middle",
  });
  s.addText("응시원서  ·  자기소개서(800자 이내)", {
    x: lx + 0.3, y: BOTTOM - 0.56, w: lw - 0.6, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11.5, color: ICE, valign: "middle",
  });

  s.addText("자기소개서 문항 (800자 이내)", {
    x: rx, y: 1.82, w: rw, h: 0.32, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 15, bold: true, color: NAVY, valign: "middle",
  });
  [
    "성장배경, 본인 성격의 장·단점",
    "지원동기 (본교에 지원하게 된 이유와 응시 직종에 본인이 적합하다고 판단되는 이유)",
    "입사 후 포부 및 직무 수행 계획",
    "조직 내 갈등 상황과 이를 해결하기 위한 노력 및 극복했던 경험",
  ].forEach((t, i) => {
    const y = TOP + i * 0.85;
    card(s, rx, y, rw, 0.75);
    numCircle(s, i + 1, rx + 0.18, y + 0.185, 0.38, ICE_L, NAVY);
    s.addText(t, {
      x: rx + 0.66, y: y + 0.03, w: rw - 0.86, h: 0.69, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11, color: INK, valign: "middle", lineSpacing: 17,
    });
  });
  s.addNotes("지원 자격은 지방공무원법 제31조 결격사유 비해당, 만 18세 이상 정년 미해당자입니다. 자기소개서는 4개 문항, 800자 이내로 작성합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 7. 서류 전형(1차) — 전형 2단계
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "서류 전형 (1차)", "전형 절차   2단계 / 4단계");
  stepTracker(s, 2);

  const lw = 5.0;
  s.addText([
    { text: "평가방법  ", options: { bold: true, color: NAVY } },
    { text: "지원자격 요건 및 자기소개서 작성 성실도 등을 평가", options: { color: INK } },
  ], {
    x: M, y: 1.82, w: lw + 0.4, h: 0.28, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11, valign: "middle",
  });
  s.addText([
    { text: "심사위원  ", options: { bold: true, color: NAVY } },
    { text: "3명 (교장 1명, 행정실장 1명, 외부위원 1명)", options: { color: INK } },
  ], {
    x: M, y: 2.12, w: lw + 0.4, h: 0.28, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11, valign: "middle",
  });

  const hd = { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 11 };
  s.addTable([
    [{ text: "평가항목", options: hd }, { text: "배 점", options: hd }, { text: "합격배수", options: hd }],
    [{ text: "직무전문성", options: { align: "left" } }, { text: "10점" },
      { text: "5배수\n내외", options: { rowspan: 5, bold: true, fontSize: 14, color: NAVY, fill: { color: ICE_L } } }],
    [{ text: "지원동기 및 직업관", options: { align: "left" } }, { text: "8점" }],
    [{ text: "성장과정 및 활동경험", options: { align: "left" } }, { text: "6점" }],
    [{ text: "표현력", options: { align: "left" } }, { text: "6점" }],
    [{ text: "합계", options: { align: "left", bold: true, color: NAVY, fill: { color: "FAFBFE" } } },
      { text: "30점", options: { bold: true, color: NAVY, fontSize: 13, fill: { color: "FAFBFE" } } }],
  ], {
    x: M, y: 2.5, w: lw, colW: [2.5, 1.25, 1.25],
    rowH: [0.4, 0.42, 0.42, 0.42, 0.42, 0.46],
    border: tblBorder, align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 11, color: INK,
  });

  const rx = M + lw + 0.3, rw = M + CW - (M + lw + 0.3);
  card(s, rx, 2.5, rw, 2.54, "FBEDEC");
  s.addText("자기소개서 불성실 작성자\n탈락 기준", {
    x: rx + 0.26, y: 2.66, w: rw - 0.52, h: 0.62, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 13.5, bold: true, color: ACCENT, lineSpacing: 21, valign: "middle",
  });
  [
    "문항과 전혀 무관한 내용을 작성",
    "동일 내용 반복 또는 문항별 50% 미만(약 400자) 작성한 경우",
    "채용 기관명을 오기재하여 제출한 경우 등",
  ].forEach((t, i) => {
    const y = 3.42 + i * 0.5;
    s.addShape(pres.ShapeType.ellipse, { x: rx + 0.26, y: y + 0.09, w: 0.08, h: 0.08, fill: { color: ACCENT } });
    s.addText(t, {
      x: rx + 0.46, y, w: rw - 0.72, h: 0.46, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 10.5, color: INK, lineSpacing: 16, valign: "top",
    });
  });

  card(s, M, 5.5, CW, 0.8, NAVY);
  s.addText("1차 서류전형 30점 · 합격배수 5배수 내외 — 심사위원 3명(교장 1, 행정실장 1, 외부위원 1)", {
    x: M + 0.2, y: 5.5, w: CW - 0.4, h: 0.8, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11.5, bold: true, color: WHITE, align: "center", valign: "middle",
  });
  s.addNotes("1차 서류전형은 총 30점 만점, 5배수 내외를 선발합니다. 자기소개서 불성실 작성자는 탈락 기준에 따라 배제됩니다.");
}

// ═══════════════════════════════════════════════════════════════
// 8. 업무적성 및 심층면접(2차) — 전형 3단계
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "업무적성 및 심층면접 (2차)", "전형 절차   3단계 / 4단계");
  stepTracker(s, 3);

  const lw = 5.0;
  s.addText([
    { text: "평가방법  ", options: { bold: true, color: NAVY } },
    { text: "응시원서 및 자기소개서를 기초로 업무 적합성을 종합평가", options: { color: INK } },
  ], {
    x: M, y: 1.82, w: lw + 0.4, h: 0.28, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11, valign: "middle",
  });
  s.addText([
    { text: "심사위원  ", options: { bold: true, color: NAVY } },
    { text: "3명 (교장 1명, 법인관계자 1명, 외부위원 1명)", options: { color: INK } },
  ], {
    x: M, y: 2.12, w: lw + 0.4, h: 0.28, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11, valign: "middle",
  });

  const hd = { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 11 };
  s.addTable([
    [{ text: "평가항목", options: hd }, { text: "배 점", options: hd }, { text: "합격배수", options: hd }],
    [{ text: "직무수행능력", options: { align: "left" } }, { text: "20점" },
      { text: "2배수\n내외", options: { rowspan: 5, bold: true, fontSize: 14, color: NAVY, fill: { color: ICE_L } } }],
    [{ text: "기본소양·태도", options: { align: "left" } }, { text: "20점" }],
    [{ text: "조직 이해도 및 적응력", options: { align: "left" } }, { text: "15점" }],
    [{ text: "발전가능성", options: { align: "left" } }, { text: "15점" }],
    [{ text: "합계", options: { align: "left", bold: true, color: NAVY, fill: { color: "FAFBFE" } } },
      { text: "70점", options: { bold: true, color: NAVY, fontSize: 13, fill: { color: "FAFBFE" } } }],
  ], {
    x: M, y: 2.5, w: lw, colW: [2.5, 1.25, 1.25],
    rowH: [0.4, 0.42, 0.42, 0.42, 0.42, 0.46],
    border: tblBorder, align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 11, color: INK,
  });

  const rx = M + lw + 0.3, rw = M + CW - (M + lw + 0.3);
  card(s, rx, 2.5, rw, 3.5);
  s.addText("전형별 배점 구성", {
    x: rx + 0.26, y: 2.7, w: rw - 0.52, h: 0.32, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 14.5, bold: true, color: NAVY, valign: "middle",
  });
  s.addChart(pres.ChartType.doughnut, [{
    name: "배점", labels: ["2차 면접전형", "1차 서류전형"], values: [70, 30],
  }], {
    x: rx + 0.5, y: 3.02, w: rw - 1.0, h: 1.5,
    holeSize: 58, chartColors: [NAVY, ICE],
    showLegend: false, showValue: false, showTitle: false,
  });

  [["2차 면접전형", "70점", NAVY], ["1차 서류전형", "30점", ICE]].forEach(([k, v, c], i) => {
    const y = 4.6 + i * 0.34;
    s.addShape(pres.ShapeType.roundRect, {
      x: rx + 0.4, y: y + 0.08, w: 0.18, h: 0.18, rectRadius: 0.04, fill: { color: c },
    });
    s.addText(k, {
      x: rx + 0.7, y, w: 1.7, h: 0.34, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11.5, color: INK, valign: "middle",
    });
    s.addText(v, {
      x: rx + 2.0, y, w: 1.0, h: 0.34, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 13, bold: true, color: NAVY, align: "right", valign: "middle",
    });
  });

  s.addText("1·2차 전형결과 합산 총 100점", {
    x: rx + 0.26, y: 5.3, w: rw - 0.52, h: 0.32, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 12.5, bold: true, color: NAVY, align: "center", valign: "middle",
  });
  s.addText("최고득점자 순으로 2배수 내외\n최종합격 예정자 선정", {
    x: rx + 0.26, y: 5.6, w: rw - 0.52, h: 0.4, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 10.5, color: MUTED, align: "center", valign: "middle", lineSpacing: 15,
  });
  s.addNotes("2차 면접은 70점 만점이며 2배수 내외를 선발합니다. 1·2차 합산 100점 기준으로 최종 순위를 결정합니다.");
}

// ═══════════════════════════════════════════════════════════════
// 9. 결격사유 검증 — 전형 4단계
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase();
  header(s, "결격사유 검증", "전형 절차   4단계 / 4단계");
  stepTracker(s, 4);

  s.addText([
    { text: "대 상 자  ", options: { bold: true, color: NAVY } },
    { text: "최종합격 예정자", options: { color: INK } },
    { text: "      검증내용  ", options: { bold: true, color: NAVY } },
    { text: "임용 결격사유 해당 여부 확인", options: { color: INK } },
  ], {
    x: M, y: 1.84, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11.5, valign: "middle",
  });

  // 좌·우 블록의 제목선(2.28)과 본문 상단(2.68)·하단(4.48)을 맞춤
  const TOP = 2.68;
  const lw = 3.4;
  s.addText("채용신체검사", {
    x: M, y: 2.28, w: lw, h: 0.32, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 14.5, bold: true, color: NAVY, valign: "middle",
  });
  card(s, M, TOP, lw, 1.8, NAVY);
  [["시행근거", "사무직원 인사 규정\n(신규임용자 구비서류)"], ["검사항목", "공무원 채용신체검사\n규정 적용"]]
    .forEach(([k, v], i) => {
      const y = TOP + 0.18 + i * 0.74;
      s.addText(k, {
        x: M + 0.26, y, w: 0.9, h: 0.68, isTextBox: true, margin: 0,
        fontFace: BF, fontSize: 10.5, bold: true, color: ICE, valign: "middle",
      });
      s.addText(v, {
        x: M + 1.18, y, w: lw - 1.44, h: 0.68, isTextBox: true, margin: 0,
        fontFace: BF, fontSize: 10.5, color: WHITE, valign: "middle", lineSpacing: 15,
      });
    });

  const rx = M + lw + 0.3, rw = M + CW - (M + lw + 0.3);
  s.addText("결격사유조회 및 범죄경력조회", {
    x: rx, y: 2.28, w: rw, h: 0.32, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 14.5, bold: true, color: NAVY, valign: "middle",
  });

  const hd = { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 11 };
  s.addTable([
    [{ text: "구분", options: hd }, { text: "근거 법령", options: hd }, { text: "조회 방법", options: hd }],
    [
      { text: "결격사유 조회 및\n범죄경력 조회", options: { bold: true, color: INK } },
      { text: "「교육공무원법」\n「사립학교법」", options: { align: "left" } },
      { text: "행정정보\n공동이용시스템 이용", options: { rowspan: 2, bold: true, color: NAVY, fill: { color: ICE_L } } },
    ],
    [
      { text: "성범죄결격 및\n아동학대 범죄전력 조회", options: { bold: true, color: INK, fontSize: 10 } },
      { text: "「아동·청소년 성보호에\n관한 법률」", options: { align: "left" } },
    ],
  ], {
    x: rx, y: TOP, w: rw, colW: [1.85, 1.75, 1.6],
    rowH: [0.36, 0.72, 0.72],
    border: tblBorder, align: "center", valign: "middle", margin: 3,
    fontFace: BF, fontSize: 10.5, color: INK,
  });

  card(s, M, 5.12, CW, 1.1, ICE_L);
  s.addText("검증 3종", {
    x: M + 0.3, y: 5.12, w: 1.2, h: 1.1, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 14, bold: true, color: NAVY, valign: "middle",
  });
  ["채용신체검사", "결격사유 조회", "성범죄·아동학대 조회"].forEach((t, i) => {
    const x = M + 1.6 + i * 2.5;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 5.38, w: 2.3, h: 0.58, rectRadius: 0.29, fill: { color: WHITE },
    });
    s.addText(t, {
      x, y: 5.38, w: 2.3, h: 0.58, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11, bold: true, color: NAVY, align: "center", valign: "middle",
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

  const bw = (CW - 0.6) / 3;
  blocks.forEach((b, i) => {
    const x = M + i * (bw + 0.3);
    card(s, x, 1.72, bw, 3.35);
    numCircle(s, i + 1, x + 0.3, 1.98, 0.42, ICE_L, NAVY);
    s.addText(b.t, {
      x: x + 0.3, y: 2.52, w: bw - 0.6, h: 0.44, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 14.5, bold: true, color: NAVY, valign: "middle", lineSpacing: 20,
    });
    s.addText(b.lines.map((t, k) => ({
      text: t, options: { bullet: true, breakLine: k !== b.lines.length - 1 },
    })), {
      x: x + 0.32, y: 3.08, w: bw - 0.64, h: 1.8, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11, color: INK, lineSpacing: 18, paraSpaceAfter: 8, valign: "top",
    });
  });

  card(s, M, 5.32, CW, 0.85, "FBEDEC");
  s.addText("※ 채용예정인원이 3명 이하인 경우에는 보훈 가점을 적용하지 않음.", {
    x: M + 0.2, y: 5.32, w: CW - 0.4, h: 0.85, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12.5, bold: true, color: ACCENT, align: "center", valign: "middle",
  });
  s.addNotes("최종합격 예정자는 2배수 내외로 선정하여 법인에 임용 제청합니다. 채용예정인원이 3명 이하이므로 보훈 가점은 적용하지 않습니다.");
}

// ═══════════════════════════════════════════════════════════════
// 11. 한눈에 보는 채용 계획
// ═══════════════════════════════════════════════════════════════
{
  const s = slideBase(NAVY);

  s.addText("한눈에 보는 채용 계획", {
    x: M + 0.2, y: 0.78, w: CW - 1.0, h: 0.5, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 27, bold: true, color: WHITE, valign: "middle",
  });
  s.addText("정석항공과학고등학교 · 기술·관리운영직(9급) 1명 공개채용", {
    x: M + 0.2, y: 1.32, w: CW - 0.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12, color: "9AA6C7", valign: "middle",
  });

  const kw = (CW - 0.87) / 4;
  const kpis = [
    ["채용 인원", "1명", "기술·관리운영직 9급"],
    ["결원", "3명", "정원 8 / 현원 5"],
    ["전형 배점", "100점", "서류 30 + 면접 70"],
    ["임용일", "2027. 1. 1.", "법인 임용 제청"],
  ];
  kpis.forEach(([k, v, sub], i) => {
    const x = M + i * (kw + 0.29);
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 2.15, w: kw, h: 1.78, rectRadius: 0.07,
      fill: { color: NAVY_D }, line: { color: "34406F", width: 1 },
    });
    s.addText(k, {
      x: x + 0.2, y: 2.35, w: kw - 0.4, h: 0.26, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 10.5, color: ICE, valign: "middle",
    });
    s.addText(v, {
      x: x + 0.2, y: 2.65, w: kw - 0.4, h: 0.56, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: v.length > 5 ? 17 : 22, bold: true, color: WHITE, valign: "middle",
    });
    s.addText(sub, {
      x: x + 0.2, y: 3.25, w: kw - 0.4, h: 0.46, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 10, color: "9AA6C7", lineSpacing: 14, valign: "top",
    });
  });

  s.addText("추진 일정", {
    x: M, y: 4.46, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 13.5, bold: true, color: ICE, valign: "middle",
  });
  [
    ["2026. 9월", "교육청 사전협의·계획 보고"],
    ["2026. 11월", "채용공고 및 지원서 접수"],
    ["2026. 12월", "1·2차 전형 및 결격사유 검증"],
    ["2027. 1. 1.", "임용"],
  ].forEach(([d, t], i) => {
    const x = M + i * (kw + 0.29);
    s.addShape(pres.ShapeType.ellipse, { x, y: 4.98, w: 0.14, h: 0.14, fill: { color: ICE } });
    s.addText(d, {
      x, y: 5.22, w: kw, h: 0.3, isTextBox: true, margin: 0,
      fontFace: HF, fontSize: 12.5, bold: true, color: WHITE, valign: "middle",
    });
    s.addText(t, {
      x, y: 5.54, w: kw - 0.1, h: 0.6, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 10.5, color: "9AA6C7", lineSpacing: 15, valign: "top",
    });
  });
  s.addNotes("채용 계획 요약: 1명 공개채용, 결원 3명, 배점 100점, 2027년 1월 1일 임용.");
}

pres.writeFile({ fileName: "2027년_사무직원_채용계획안.pptx" }).then((f) => console.log("wrote", f));
