<template>
  <div>
    <h2>파일 업로드</h2>
    <input
      type="file"
      @change="handleFileChange"
      :disabled="isUploading"
      accept="image/*,video/*,audio/*"
    />

    <div v-if="isUploading" class="progress">
      업로드 진행 중: {{ uploadProgress }}%
    </div>

    <div v-if="uploadError" class="error">
      {{ uploadError }}
    </div>

    <div v-if="uploadedUrl" class="success">
      <p>업로드 성공!</p>
      <a :href="uploadedUrl" target="_blank">{{ uploadedUrl }}</a>

      <!-- 파일 타입에 따른 미리보기 -->
      <div v-if="fileType === 'image'" class="preview">
        <img
          :src="uploadedUrl"
          alt="업로드된 이미지"
          style="max-width: 300px"
        />
      </div>

      <div v-else-if="fileType === 'video'" class="preview">
        <video controls style="max-width: 300px">
          <source :src="uploadedUrl" :type="selectedFile?.type" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
      </div>

      <div v-else-if="fileType === 'audio'" class="preview">
        <audio controls>
          <source :src="uploadedUrl" :type="selectedFile?.type" />
          브라우저가 오디오 태그를 지원하지 않습니다.
        </audio>
      </div>

      <div v-else class="preview">
        <p>파일 이름: {{ selectedFile?.name }}</p>
        <p>파일 타입: {{ selectedFile?.type || "알 수 없음" }}</p>
        <p>파일 크기: {{ formatFileSize(selectedFile?.size || 0) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useS3Upload } from "~/composables/useS3Upload";

const { isUploading, uploadProgress, uploadError, uploadedUrl, uploadToS3 } =
  useS3Upload();
const selectedFile = ref<File | null>(null);

// 파일 타입 감지
const fileType = computed(() => {
  if (!selectedFile.value) return null;

  const type = selectedFile.value.type;
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  return "other";
});

// 파일 크기 형식화
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];

    // 파일 선택 시 자동 업로드 처리
    await uploadToS3(selectedFile.value);
  }
};
</script>

<style scoped>
.progress {
  margin-top: 10px;
  padding: 5px;
  background-color: #e0e0e0;
  border-radius: 4px;
}

.error {
  margin-top: 10px;
  padding: 5px;
  color: red;
  background-color: #ffeeee;
  border-radius: 4px;
}

.success {
  margin-top: 10px;
  padding: 5px;
  color: green;
  background-color: #eeffee;
  border-radius: 4px;
}

.preview {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
