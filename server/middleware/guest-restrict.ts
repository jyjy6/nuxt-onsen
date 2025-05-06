import type { H3Event } from 'h3';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { createError } from 'h3';
import { getRequestHeader } from 'h3';

export default defineEventHandler(async (event) => {
  // 토큰 검증
  const token = getRequestHeader(event, "authorization")?.split(" ")[1];
  
  if (!token) {
    return; // 토큰이 없으면 통과 (비로그인 사용자도 제한하지 않음)
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET_KEY as string
    ) as JwtPayload;

    // POST, PUT, DELETE 요청을 제한
    if (['POST', 'PUT', 'DELETE'].includes(event.method)) {
      if (decoded.role === 'guest') {
        return createError({
          statusCode: 403,
          message: "게스트 사용자는 이 요청을 수행할 수 없습니다.",
        });
      }
    }
  } catch (error) {
    return; // 토큰 검증 실패시 통과
  }
});
