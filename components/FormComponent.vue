<!-- components/FormComponent.vue -->
<template>
  <v-container>
    <v-form v-model="valid" ref="contentForm">
      <div v-for="field in fields" :key="field.name">
        <v-text-field
          v-if="field.type === 'text'"
          v-model="form[field.name]"
          :label="field.label"
          :rules="field.rules || []"
          required
        />

        <v-select
          v-else-if="field.type === 'select'"
          v-model="form[field.name]"
          :items="field.items"
          :label="field.label"
          :rules="field.rules || []"
          :multiple="field.multiple || false"
          required
        />

        <FileUploadComponent
          v-if="field.name === 'mainImg'"
          @updateURL="updateURL"
          ref="fileUploadRef"
        />
      </div>

      <v-btn :disabled="!valid" @click="submitForm" color="primary">
        저장
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import axios from "axios";

const props = defineProps<{
  fields: {
    name: string;
    label: string;
    type: string;
    rules?: any[];
    items?: any[];
    multiple?: boolean;
  }[];
  apiUrl: string;
}>();

const emit = defineEmits(["success", "error"]);
const valid = ref(false);
const form = ref<Record<string, any>>({});

const updateURL = (url: string) => {
  form.value.mainImg = url;
};

const fileUploadRef = ref<any>(null);
const submitForm = async () => {
  // defineExpose 배열의 첫 번째 요소에 접근, 함수 실행
  await fileUploadRef.value?.[0].confirmFile();

  try {
    const response = await axios.post(props.apiUrl, form.value);
    emit("success", response.data);
    alert("저장 성공!");
  } catch (error) {
    console.error("저장 실패:", error);
    emit("error", error);
  }
};
</script>
