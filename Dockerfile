FROM node:20 AS builder
WORKDIR /app

# package.jsonと lock ファイルコピー後、depenncy 設置
COPY package*.json ./
RUN ["npm", "ci"]

# 全プロジェクトコピー、ビルド
COPY . .
RUN npm run build

# 2️⃣ 実行段階（もっと軽いイメージ使用）
FROM node:20-alpine
WORKDIR /app

# 실행에 필요한 파일만 복사　実行に必要なファイルだけコピー
COPY --from=builder /app/.output .output
COPY package.json package-lock.json ./
RUN npm install --omit=dev
# 실행에 필요한 패키지만 설치


# PORT 設定（基本：３０００）
EXPOSE 3000

# サバー実行
CMD ["node", ".output/server/index.mjs"]
