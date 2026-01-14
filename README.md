# Live Graph Crawler - Frontend Only Version

**버전**: 1.0  
**작성일**: 2026년 1월 14일

## 개요

이 폴더는 백엔드 없이 프론트엔드만으로 작동하는 독립 버전입니다. 브라우저에서 직접 Gemini API와 Google Custom Search API를 호출합니다.

## 주요 특징

- **백엔드 불필요**: 별도의 서버 없이 브라우저에서 직접 실행
- **독립 실행**: GitHub Pages 등 정적 호스팅 서비스에 배포 가능
- **동일한 기능**: 기존 버전과 동일한 검색 및 검증 기능 제공
- **API 키 직접 입력**: 환경 변수 없이 UI에서 직접 API 키를 입력할 수 있습니다
- **로컬 스토리지 저장**: 입력한 API 키는 브라우저 로컬 스토리지에 저장되어 다음 방문 시에도 유지됩니다
- **백엔드 불필요**: 별도의 서버 없이 브라우저에서 직접 실행
- **독립 실행**: GitHub Pages 등 정적 호스팅 서비스에 배포 가능

## 링크

[실행하기](<https://jtech-co.github.io/Live-Graph-Crawler/index.html>)

## 설치 방법

### 사전 요구사항
- Node.js 18+

### 의존성 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### API 키 설정

1. 앱 실행 시 자동으로 API 키 입력 모달이 표시됩니다
2. 또는 상단의 "API 키 설정" 버튼을 클릭하여 모달을 열 수 있습니다
3. 다음 API 키들을 입력하세요:
   - **Gemini API 키**: Google AI Studio에서 발급
   - **Google Custom Search API 키**: Google Cloud Console에서 발급
   - **Google Custom Search Engine ID**: Custom Search Engine 생성 시 발급

API 키는 브라우저 로컬 스토리지에 저장되며, 다음 방문 시에도 유지됩니다.

## 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### GitHub Pages 배포

1. GitHub 레포지토리에 푸시
2. GitHub Actions 또는 수동으로 빌드
3. `dist/` 폴더의 내용을 `gh-pages` 브랜치에 배포

또는 Vercel, Netlify 등 정적 호스팅 서비스 사용 가능

## API 키 발급 방법

### Gemini API 키
1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. API 키 생성
3. 도메인 제한 설정 권장

### Google Custom Search API 키
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Custom Search API 활성화
3. API 키 생성
4. Custom Search Engine 생성 및 Engine ID 획득

## 프로젝트 구조

```
etc/
├── src/
│   ├── components/      # UI 컴포넌트
│   ├── hooks/          # React 훅
│   ├── services/       # API 서비스 (Gemini, Google Search)
│   ├── utils/          # 유틸리티 함수
│   ├── assets/         # 스타일 파일
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

## 기존 버전과의 차이점

- 백엔드 API 호출 제거
- 프론트엔드에서 직접 Gemini API 및 Google Search API 호출
- **API 키 직접 입력 방식**: 환경 변수 대신 UI에서 직접 입력
- 로컬 스토리지를 사용한 API 키 저장
- 동일한 UI/UX 및 기능 제공

## 문제 해결

### CORS 오류
Google Custom Search API는 CORS 제한이 있을 수 있습니다. 이 경우:
- Google Cloud Console에서 API 키에 허용된 도메인 설정
- 또는 CORS 프록시 사용 (개발 환경만)

### API 키 노출 경고
프로덕션 환경에서는 API 키 노출을 최소화하기 위해:
- API 키에 도메인/IP 제한 설정
- Google API 할당량 제한 설정
- 필요시 백엔드 프록시 사용 고려

## 라이선스

MIT License



