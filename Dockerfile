FROM node:20 AS builder
WORKDIR /app

# 메모리 설정 추가
ENV NODE_OPTIONS="--max-old-space-size=4096"

# package.json과 lock 파일 복사 후 의존성 설치
COPY package*.json ./
RUN ["npm", "ci"]

# 전체 프로젝트 복사, 빌드
COPY . .
RUN npm run build

# 실행 단계
FROM node:20-alpine
WORKDIR /app

# 실행에 필요한 파일만 복사
COPY --from=builder /app/.output .output
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# PORT 설정
EXPOSE 3000

# 서버 실행
CMD ["node", ".output/server/index.mjs"]