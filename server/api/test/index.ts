// /server/api/test.ts
export default defineEventHandler(async (event) => {
  // 여기서는 단순히 'Hello from the API' 메시지를 반환하는 예시입니다.
  return { message: "Hello from the API" };
});
