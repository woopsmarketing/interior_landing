# AI 인테리어 이미지 생성 프롬프트 설계 비교

> 파일 위치: `src/app/api/generate-interior/route.ts`
> 최종 업데이트: 2026-03-12

---

## 핵심 설계 원칙 (변경 후 기준)

> **좋은 범용 프롬프트는 "예쁘게 만들어라"가 아니라**
> **"현실적인 상업공간 시안처럼 만들어라"를 강제해야 한다.**
> 스타일 키워드보다 먼저 들어가야 하는 건 감성이 아니라 제약조건이다.

---

## 구조 비교

### 변경 전 (스타일 우선)

```
[목적] → [제약] → [스타일] → [추가요청] → [품질]
```

**문제점**: AI가 스타일 키워드를 먼저 읽고 렌더링 방향을 잡은 뒤,
뒤에 오는 제약조건을 낮은 우선순위로 처리하는 경향 발생.

### 변경 후 (제약 우선 3-Layer)

```
[LAYER 1: 출력 타입 + 절대 제약]  ← 항상 첫 번째
[LAYER 2: 원본 공간 구조]          ← 두 번째
[LAYER 3: 디자인 콘셉트]           ← 마지막
```

---

## 상세 프롬프트 전문

---

### ▶ 변경 전 — 1단계 (공간 사진 있음)

```
Interior renovation visualization of this exact {area}sqm {spaceType}.
CRITICAL: Preserve the existing room structure exactly —
same ceiling height, same wall layout, same floor plan, same door and window positions,
same camera angle and perspective as the input photo.
Only change the surface finishes, furniture, and decorative elements.
Apply interior design style: {styles}. Atmosphere: {atmosphere}.
Priority: {priorities}.
{referenceNote}
{additionalRequest}
This must look like a realistic renovation photograph, NOT a 3D render or illustration.
DSLR photo quality, realistic materials and lighting,
same room proportions as the original photo.
```

**평가**:
- ❌ 스타일/분위기 키워드가 CRITICAL 앞에 위치
- ❌ "DSLR photo quality"가 마지막 → 힘이 약함
- ❌ 카메라 스펙 미지정 → 렌더링 느낌 통제 불가
- ❌ 재질/조명/스케일 제약이 없어 과장된 결과 발생

---

### ▶ 변경 전 — 2단계 (GPT-4o 분석 주입)

```
Interior renovation visualization of this exact {area}sqm {spaceType}.
SPACE STRUCTURE (must be preserved exactly): {GPT-4o 분석 결과}
CRITICAL: Keep the same ceiling height, wall positions, structural columns,
door/window locations, floor plan, and camera angle as the original photo.
Only replace surface materials, furniture, lighting fixtures, and decorative elements.
Design style: {styles}. Atmosphere: {atmosphere}. Priority: {priorities}.
{referenceNote}
{additionalRequest}
Result must look like a realistic renovation photograph taken with a DSLR camera,
NOT a 3D render or CGI illustration. Photorealistic, same perspective as the input.
```

**평가**:
- ✅ GPT-4o 구조 분석 주입은 효과 있음
- ❌ 구조 분석 뒤에 스타일 키워드가 바로 오면 희석됨
- ❌ GPT-4o 분석 프롬프트가 "현재 상태 묘사"에 그침 → FIXED/REMOVABLE 구분 없음
- ❌ 카메라 스펙 없음

---

### ▶ 변경 후 — LAYER 1: 출력 타입 + 절대 제약 (항상 고정)

```
OUTPUT TYPE: Photorealistic commercial interior renovation proposal photo.
This must look like a completed renovation photographed on-site with a DSLR camera —
NOT a 3D render, NOT CGI, NOT an illustration, NOT an architectural visualization.

ABSOLUTE CONSTRAINTS (non-negotiable):
- GEOMETRY: Do not alter room dimensions, ceiling height, wall positions, or floor plan.
  Spatial proportions must match the original photo exactly.
- STRUCTURE: Preserve all permanent elements — structural columns, exposed pipes/ducts,
  ceiling-mounted AC units, fixed openings (doors, windows).
  These may be painted or trimmed but not removed or repositioned.
- SCALE: Furniture and fixtures must match the actual room volume.
  No exaggerated spatial expansion. No impossible architectural changes.
- MATERIALS: Use physically plausible materials — real wood grain with natural variation,
  actual tile with visible grout lines, fabric with natural texture and drape.
  No plastic-looking surfaces.
- LIGHTING: Match the realistic light level for the space size and concept.
  Warm ambient light is acceptable. No HDR-style over-illumination.
  No studio-bright artificial flatness.
- REALISM: No decorative excess, no fantasy props, no unbuilt structural elements.
  The result must be persuasive as an actual construction proposal.
- PERSPECTIVE: Maintain the exact same camera angle, viewpoint height,
  and lens perspective as the input photo.
- CAMERA SIMULATION: Render as if shot on a DSLR (Canon EOS R5, 16–24mm wide lens,
  ISO 800–1600, f/2.8, available light). Subtle natural grain,
  slight depth-of-field falloff in background, no post-processing filter look.
```

**평가**:
- ✅ 모든 제약이 프롬프트 최상단에 위치
- ✅ 카메라 스펙이 시스템 레벨에 포함 → 고객 입력 불필요
- ✅ GEOMETRY / STRUCTURE / SCALE / MATERIALS / LIGHTING / REALISM 6가지 완비
- ✅ "NOT CGI, NOT illustration" 명시적 부정 → 렌더링 억제

---

### ▶ 변경 후 — LAYER 2 (1단계: 사진 있음, 인퍼드)

```
ORIGINAL SPACE: The input photo shows the current state of this space.
Identify and preserve all fixed structural elements visible in the photo
(ceiling structure, columns, pipe runs, AC units, wall openings).
Only replace surface finishes, furniture, and lighting fixtures.
```

---

### ▶ 변경 후 — LAYER 2 (2단계: GPT-4o 분석 결과 주입)

```
ORIGINAL SPACE STRUCTURE (from photo analysis — preserve exactly):
{GPT-4o 분석 결과 — FIXED elements / REMOVABLE elements 구분됨}
```

**GPT-4o 분석 프롬프트 개선사항**:
- 변경 전: "공간 묘사" 단순 요청
- 변경 후: FIXED(구조체, 제거 불가) / REMOVABLE(마감재, 교체 가능) 명시적 분류 요청
  → 모델이 어떤 요소를 보존해야 할지 명확히 인식

---

### ▶ 변경 후 — LAYER 3: 디자인 콘셉트 (사용자 입력)

```
DESIGN CONCEPT for {area}sqm {spaceType}:
- Style direction: {styles}
- Atmosphere: {atmosphere}
- Layout and design requirements: {additionalRequest}
- [referenceNote if image provided]
```

**평가**:
- ✅ 스타일이 마지막에 위치 → 제약 조건 이후 처리
- ✅ 추가 요청사항은 "Layout and design requirements"로 라벨링 → 레이아웃/디자인만 반영
- ✅ 참고 이미지는 "mood/color/material inspiration only, do NOT copy layout" 명시

---

## 파이프라인별 최종 조합

### 1단계 (공간 사진 있음)
```
[LAYER 1: CONSTRAINT_LAYER]
+
[LAYER 2: "identify and preserve fixed elements from input photo"]
+
[LAYER 3: DESIGN CONCEPT]
```

### 1단계 (공간 사진 없음)
```
["Photorealistic interior design proposal photo of {space}. DSLR quality."]
+
[LAYER 3: DESIGN CONCEPT]
```

### 2단계 (공간 사진 있음)
```
[LAYER 1: CONSTRAINT_LAYER]
+
[LAYER 2: GPT-4o Vision 분석 결과 (FIXED/REMOVABLE 구분)]
+
[LAYER 3: DESIGN CONCEPT]
```

---

## 테스트 관찰 결과

| 테스트 | 파이프라인 | 천장 구조 보존 | 현실감 | 스타일 반영 |
|--------|-----------|--------------|--------|------------|
| 최초 테스트 | 1단계 (구버전) | ✗ | ⭐⭐ | ✓ |
| 구조 보존 추가 | 2단계 (구버전) | ✓ AC유닛/배관 | ⭐⭐⭐ | ✓ |
| 카메라 스펙 추가 (사용자 입력) | 2단계 | ✓ | ⭐⭐⭐ | ✓ 에디슨 전구 등 더 자연스러움 |
| 신규 3-Layer 구조 | 미테스트 | - | - | - |

---

## 다음 개선 포인트 (미구현)

1. **우드톤 포화도 제어**: 현재 전체가 동일한 갈색 → `"varied wood tones with light/dark material contrast"` 추가 고려
2. **테이블 위 소품**: 2단계에서 자동으로 나오는 경향 → 명시적으로 `"tableware and operational props appropriate to concept"` 지정 가능
3. **3단계 파이프라인 가능성**: GPT-4o 분석 → 별도 스타일 해석 → 이미지 생성 (비용 ↑↑, 품질 ↑↑)
