# Live Graph Crawler

**버전**: 3.0  
**최종 업데이트**: 2026년 1월 15일

**[실행하기](<https://jtech-co.github.io/Live-Graph-Crawler/index.html>)**

## 개요

**Live Graph Crawler**는 순수 HTML, CSS, JavaScript로 구축된 AI 기반 실시간 그래프 검색 엔진입니다. **Gemini API만 사용**하여 그래프와 통계 데이터가 포함된 신뢰할 수 있는 웹페이지를 찾아줍니다.

## 주요 특징

- **🤖 Gemini 전용**: Google Search API 불필요 - Gemini의 Google Search 도구 활용
- **📊 그래프 테마**: 수학적 그래프 디자인 (좌표축, 그리드 배경, 데이터 포인트 스타일)
- **🚀 프레임워크 없음**: 순수 HTML, CSS, JavaScript
- **🎨 모던 디자인**: 그래프 페이퍼 배경, 데이터 시각화 컬러 팔레트
- **📱 반응형**: 데스크톱과 모바일 모두 지원
- **🔒 안전한 키 관리**: API 키는 브라우저 로컬 스토리지에만 저장

## 시작하기

### 필요한 것

**Gemini API 키만 있으면 됩니다!**
- [Google AI Studio](https://aistudio.google.com/app/apikey)에서 무료로 발급

### 로컬 실행

1. 프로젝트 폴더를 다운로드합니다.
2. `index.html` 파일을 브라우저에서 엽니다.
3. Gemini API 키를 입력합니다.
4. 검색을 시작합니다!

## 사용 방법

### 1. API 키 설정
- "API 키 설정" 버튼 클릭
- Gemini API 키 입력
- 모델 선택:
  - **Gemini 2.5 Flash**: 빠른 응답, 일반 검색에 적합
  - **Gemini 2.5 Pro**: 높은 정확도, 복잡한 쿼리에 적합

### 2. 검색
자연어로 원하는 데이터를 입력:
- "2024년 반도체 시장 점유율 그래프"
- "Global AI market growth chart 2023-2024"
- "기후 변화 온도 상승 추이"

### 3. 결과 확인
AI가 검증한 신뢰도 높은 웹페이지 목록을 확인하고 클릭하여 방문합니다.

## 작동 원리

```
사용자 쿼리
    ↓
Gemini AI (Google Search 도구 사용)
    ↓
웹 검색 결과 수집
    ↓
AI 분석 및 검증 (그래프 포함 가능성 평가)
    ↓
신뢰도 점수 계산
    ↓
결과 표시 (그래프 테마 카드)
```

### 핵심 기술

1. **Gemini Google Search**: Gemini가 내장된 Google Search 도구로 웹 검색
2. **AI 검증**: 각 결과를 분석하여 그래프/차트 포함 가능성 평가
3. **신뢰도 평가**: 도메인 신뢰도 + AI 신뢰도 결합
4. **스마트 정렬**: 신뢰도 순으로 자동 정렬

## 파일 구조

```
Live Graph Crawler - onlyF/
├── index.html              # 메인 HTML
├── src/
│   ├── css/
│   │   ├── main.css        # 기본 스타일
│   │   ├── graph-theme.css # 그래프 테마 디자인
│   │   └── components.css  # 컴포넌트 스타일
│   └── js/
│       └── app.js          # 통합 애플리케이션 로직
└── README.md
```

## 보안 참고사항

- API 키는 브라우저의 로컬 스토리지에만 저장됩니다.
- 외부 서버로 전송되지 않습니다.
- 공용 컴퓨터 사용 시 "삭제" 버튼으로 키를 제거하세요.

## 문제 해결

### API 오류가 발생할 때
- API 키가 올바른지 확인하세요.
- [Google AI Studio](https://aistudio.google.com/app/apikey)에서 키가 활성화되어 있는지 확인하세요.
- 브라우저 콘솔(F12)에서 자세한 오류 메시지를 확인하세요.

### 검색 결과가 없을 때
- 다른 키워드로 시도해보세요.
- Gemini 2.5 Pro 모델로 변경해보세요 (더 정확함).
- 영어 키워드를 사용해보세요.

### 버튼이 작동하지 않을 때
- 페이지를 새로고침하세요 (Ctrl+F5).
- 브라우저 콘솔에서 JavaScript 오류를 확인하세요.

## 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6)
- **API**: Google Gemini API (gemini-2.5-flash, gemini-2.5-pro)
- **Storage**: Browser LocalStorage
- **Design**: Graph-themed CSS with animations

## 변경 이력

### v3.0 (2026-01-15)
- ✅ Google Search API 제거, Gemini 전용으로 전환
- ✅ Gemini Google Search 도구 활용
- ✅ 수학적 그래프 테마 디자인 추가
- ✅ 파일 구조 재구성 (src/css, src/js)
- ✅ ES6 모듈 제거, 단일 파일로 통합
- ✅ `google_search` 도구로 업데이트

## 라이선스


MIT License
