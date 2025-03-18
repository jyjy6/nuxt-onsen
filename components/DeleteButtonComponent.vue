<template>
  <v-btn color="red" @click="confirmDelete"> 삭제 </v-btn>
</template>

<script setup lang="ts">
import { useSecureApi } from "~/composables/useSecureApi";

const props = defineProps<{
  URL: string;
}>();

const api = useSecureApi();

const confirmDelete = async () => {
  // 확인 대화상자 또는 모달을 띄울 수 있습니다.
  const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
  if (isConfirmed) {
    try {
      // 삭제 요청
      const response = await api.secureDelete(props.URL);
      if (response.data.success) {
        alert("삭제 성공");
        window.location.reload();
      } else {
        alert("삭제 실패");
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  }
};
</script>
