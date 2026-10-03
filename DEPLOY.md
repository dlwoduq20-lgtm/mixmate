# MIXMATE 배포 가이드 (Deployment Guide)

이 문서는 MIXMATE 앱을 웹에 배포하는 방법을 안내합니다.

---

## 📌 주요 사전 정보 및 특징

- **라우팅 방식**: `HashRouter` (`#/cocktail/...`)를 사용하므로, 정적 호스팅 서비스(GitHub Pages, Vercel, Netlify, Cloudflare Pages 등)에서 별도의 SPA rewrite/redirect 설정 없이도 URL이 깨지지 않고 정상 작동합니다.
- **상대 경로 에셋**: Vite의 `base: './'` 설정이 적용되어 있어 루트 도메인(`https://example.com/`)뿐만 아니라 서브 경로(`https://username.github.io/cocktail/`)에서도 모든 정적 파일이 완벽하게 로드됩니다.
- **환경 변수**: GA4 측정 ID(`G-W1FTWVW53V`)는 클라이언트 공개 상수로 지정되어 있어 별도의 `.env` 비밀키 설정이 필요 없습니다.
- **권장 Node 버전**: Node 20+ (배포 CI는 Node 22 기준 설정됨)
- **빌드 명령어**: `npm run build` (결과물: `dist/` 폴더)
  > ⚠️ `npm run build:singlefile`은 오프라인 단일 파일 배포용이므로 웹 호스팅 실배포에는 사용하지 마세요.

---

## 방법 1: GitHub Pages로 배포 (가장 추천, 완전 무료)

저장소에 `.github/workflows/deploy.yml`이 이미 구성되어 있어 푸시만 하면 자동으로 빌드 및 배포됩니다.

### 1단계: GitHub 저장소 생성 및 푸시
```bash
# 1. GitHub에서 새 Repository 생성 (예: mixmate)
# 2. 로컬 저장소와 원격 저장소 연결 및 푸시
git remote add origin https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
git branch -M main
git push -u origin main
```

### 2단계: GitHub Pages 활성화
1. GitHub 저장소의 **Settings** 탭으로 이동합니다.
2. 좌측 메뉴에서 **Pages**를 클릭합니다.
3. **Build and deployment > Source** 옵션을 **GitHub Actions**로 변경합니다.
4. 이제 `main` 브랜치에 코드를 푸시할 때마다 자동으로 배포되며, 배포 완료 후 제공되는 링크(`https://<YOUR-USERNAME>.github.io/<REPO-NAME>/`)로 접속할 수 있습니다.

---

## 방법 2: Vercel로 배포 (1분 완료)

### CLI 이용 시
```bash
npx vercel
```
- 화면의 안내에 따라 기본값(Enter)으로 진행하면 즉시 배포 URL이 발급됩니다.

### 웹 대시보드 이용 시
1. [vercel.com](https://vercel.com)에 로그인 후 **Add New Project**를 선택합니다.
2. GitHub의 MIXMATE 저장소를 Import합니다.
3. `vercel.json`이 이미 포함되어 있으므로 추가 설정 없이 **Deploy** 버튼을 누르면 배포 완료됩니다.

---

## 방법 3: Netlify로 배포

### CLI 이용 시
```bash
npx netlify deploy --prod
```

### 웹 대시보드 이용 시
1. [netlify.com](https://netlify.com) 로그인 후 **Add new site > Import an existing project**를 선택합니다.
2. 저장소를 연동하면 `netlify.toml` 설정에 맞춰 자동으로 배포됩니다.

---

## 🛠️ 로컬에서 빌드 및 미리보기 테스트

```bash
# 의존성 설치
npm install

# 프로덕션 빌드 (dist/ 폴더 생성)
npm run build

# 빌드된 결과물 로컬 서빙 및 미리보기
npm run preview
```
