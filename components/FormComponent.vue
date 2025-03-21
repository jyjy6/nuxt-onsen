<!-- components/FormComponent.vue -->
<template>
  <v-container>
    <v-form v-model="valid" ref="contentForm">
      <div v-for="field in fields" :key="field.name">
        <FileUploadComponent
          v-if="
            field.name === 'mainImg' ||
            field.name === 'contentsLink' ||
            field.name === 'omake'
          "
          :fieldName="field.name"
          @updateURL="updateURL"
          :ref="
            (el) => {
              if (el) fileUploadRefs[field.name] = el;
            }
          "
          style="margin-top: 10px"
        />
        <v-text-field
          v-if="field.type === 'text' || field.type === 'date'"
          v-model="form[field.name]"
          :label="field.label"
          :rules="field.rules || []"
          :type="field.type"
          required
        />

        <v-autocomplete
          v-else-if="field.type === 'select'"
          v-model="form[field.name]"
          :items="field.items"
          :label="field.label"
          :rules="field.rules || []"
          :multiple="field.multiple || false"
          :filter="customFilter"
          clearable
          autocomplete="off"
          chips
          required
          @update:search="handleSearch"
        />
      </div>

      <v-btn :disabled="!valid" @click="submitForm" color="primary">
        저장
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import { useSecureApi } from "~/composables/useSecureApi";

const search = ref<string>(""); // 검색어 상태 추가

// 커스텀 필터 함수 타입 명시
const customFilter = (
  queryText: string,
  itemText: { value: string }
): boolean => {
  const text = itemText.value.toLowerCase();
  const searchText = queryText.toLowerCase();
  return text.includes(searchText);
};

// 검색 핸들러 추가
const handleSearch = (val: string) => {
  search.value = val;
};

const props = defineProps<{
  //수정시에 들어오는 기존 폼의 데이타
  formData?: Record<string, any>;
  fields: {
    name: string;
    label: string;
    type: string;
    rules?: any[];
    items?: any[];
    contentsTag?: string[];
    multiple?: boolean;
  }[];
  apiUrl: string;
}>();

// Initialize form with default values
const form = ref<Record<string, any>>({});
const valid = ref(false);
const isPut = ref(false);
const router = useRouter();
const api = useSecureApi();

const fileUploadRefs = ref<Record<string, any>>({});

// formData가 바뀔 때마다 form을 업데이트
watch(
  () => props.formData,
  (newData) => {
    if (newData) {
      form.value = { ...newData };
      isPut.value = true;
      console.log("isput여부" + isPut.value);
    }
  },
  { deep: true, immediate: true }
);

const updateURL = (data: { fieldName: string; url: string }) => {
  if (data.fieldName && data.url) {
    form.value[data.fieldName] = data.url;
    console.log(`${data.fieldName} 필드 업데이트: ${data.url}`);
  }
};

const submitForm = async () => {
  try {
    // 모든 파일 업로드 컴포넌트의 confirmFile 호출

    const confirmPromises = Object.entries(fileUploadRefs.value).map(
      ([fieldName, component]) => {
        return component.confirmFile();
      }
    );

    await Promise.all(confirmPromises);

    if (!isPut.value) {
      console.log("작성코드발동");
      console.log(form.value);
      const response = await api.securePost(props.apiUrl, form.value);
      alert("저장성공!");
      router.push("/broadcast/list");
    } else {
      console.log("수정코드발동");
      console.log(form.value);
      const response = await api.securePut(props.apiUrl, form.value);
      alert("저장성공!");
      router.push("/broadcast/list");
      isPut.value = false;
    }
  } catch (error) {
    console.error("저장 실패:", error);
    alert("저장실패");
  }
};
</script>
