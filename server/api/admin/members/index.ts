import { defineEventHandler, getQuery } from "h3";
import MembersModel from "@/server/models/auth/RegisterModel";
import type { SortOrder } from "mongoose";

export default defineEventHandler(async (event) => {
  try {
    // 요청에서 쿼리 파라미터 가져오기
    const query = getQuery(event);

    // 페이지네이션 파라미터
    const page = parseInt(String(query.page || "1"));
    const itemsPerPage = parseInt(String(query.itemsPerPage || "10"));
    const skip = (page - 1) * itemsPerPage;

    // 정렬 파라미터
    const sortBy = String(query.sortBy || "name");
    const sortOrder: SortOrder = query.sortOrder === "desc" ? -1 : 1;

    // MongoDB의 sort 메서드에 맞는 타입으로 정의
    const sortOptions: Record<string, SortOrder> = {};
    sortOptions[sortBy] = sortOrder;

    // 검색 파라미터
    const search = String(query.search || "");
    
    // 한글 자음 매핑 (입력된 자음 -> 실제 저장된 형태)
    const jamoMap: Record<string, string> = {
      'ㄱ': 'ᄀ', 'ㄲ': 'ᄁ', 'ㄴ': 'ᄂ', 'ㄷ': 'ᄃ', 'ㄸ': 'ᄄ',
      'ㄹ': 'ᄅ', 'ㅁ': 'ᄆ', 'ㅂ': 'ᄇ', 'ㅃ': 'ᄈ', 'ㅅ': 'ᄉ',
      'ㅆ': 'ᄊ', 'ㅇ': 'ᄋ', 'ㅈ': 'ᄌ', 'ㅉ': 'ᄍ', 'ㅊ': 'ᄎ',
      'ㅋ': 'ᄏ', 'ㅌ': 'ᄐ', 'ㅍ': 'ᄑ', 'ㅎ': 'ᄒ'
    };
    
    // 검색어 변환 (ㅈㅈ -> ᄌᄌ)
    let convertedSearch = search;
    if (search) {
      convertedSearch = [...search].map(char => jamoMap[char] || char).join('');
    }
    
    // 검색 쿼리 생성 - 원본 검색어와 변환된 검색어 둘 다 사용
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: convertedSearch, $options: "i" } },
            { userId: { $regex: convertedSearch, $options: "i" } },
            { email: { $regex: convertedSearch, $options: "i" } },
            { role: { $regex: convertedSearch, $options: "i" } },
          ],
        }
      : {};

    // 데이터 가져오기 (페이지네이션, 정렬, 검색 적용)
    const members = await MembersModel.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage);

    // 전체 항목 숫자 가져오기 (페이지네이션에 필요)
    const total = await MembersModel.countDocuments(searchQuery);

    return {
      success: true,
      data: members,
      total,
      page,
      itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
});