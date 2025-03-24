// types/userInfoTypes.ts

// 기본 사용자 정보 인터페이스 (공통 필드)
export interface BaseUserInfo {
  _id?: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  address: {
    country: string;
    mainAddress: string;
    subAddress: string;
  };
}

// 일반 사용자 정보 인터페이스
export interface UserInfo extends BaseUserInfo {
  _id: string;
  role: string;
  lastLogin: string;
  premiumUntil?: string;
}

// 업데이트용 사용자 데이터 인터페이스 (일반 사용자가 수정 가능한 필드)
export interface UpdateUserData {
  name?: string;
  email?: string;
  phone: string;
  address?: {
    country?: string;
    mainAddress?: string;
    subAddress?: string;
  };
  profileImage?: string;
  password?: string; // 선택적 속성
}

// 운영자용 사용자 데이터 업데이트 인터페이스 (운영자가 수정 가능한 필드)
export interface AdminUpdateUserData extends UpdateUserData {
  _id: string; // 운영자는 특정 사용자 ID를 지정해야 함
  role?: string; // 역할 변경 가능
  premiumUntil?: string; // 프리미엄 만료일 설정 가능

  // 기타 운영자만 수정 가능한 필드 추가
}
