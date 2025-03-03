import axios from "axios";
import { ref } from "vue";

export const uploadedUrl = ref("");

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const formData = new FormData();
  formData.append("file", target.files[0]);

  try {
    const response = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.url) {
      uploadedUrl.value = response.data.url;
    }
  } catch (error) {
    console.error("파일 업로드 실패", error);
  }
};

export { handleFileUpload };
