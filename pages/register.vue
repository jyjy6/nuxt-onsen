<!-- components/RegisterForm.vue -->
<template>
  <v-container>
    <v-form v-model="valid" ref="registerForm">
      <v-text-field
        v-model="form.username"
        label="아이디"
        :rules="[(v) => !!v || '아이디는 필수입니다']"
        required
      />

      <v-text-field
        v-model="form.name"
        label="이름"
        :rules="[(v) => !!v || '이름은 필수입니다']"
        required
      />

      <v-text-field
        v-model="form.email"
        label="이메일"
        type="email"
        :rules="emailRules"
        required
      />

      <v-text-field
        v-model="form.password"
        label="비밀번호"
        type="password"
        :rules="passwordRules"
        required
      />

      <v-text-field
        v-model="passwordConfirm"
        label="비밀번호 확인"
        type="password"
        :rules="[
          (v) => !!v || '비밀번호 확인은 필수입니다',
          (v) => v === form.password || '비밀번호가 일치하지 않습니다',
        ]"
        required
      />

      <v-text-field v-model="form.phone" label="전화번호" />

      <v-text-field v-model="form.address.country" label="국가" />

      <v-text-field v-model="form.address.mainAddress" label="주소" />

      <v-text-field v-model="form.address.subAddress" label="상세주소" />

      <v-text-field
        v-model="form.profileImage"
        label="프로필 이미지를 업로드해주세요!"
        readonly
      />
      <FileUploadComponent
        fieldName="profileImage"
        @updateURL="updateURL"
        style="margin-top: 10px"
      />

      <v-checkbox
        v-model="termsAgreed"
        label="이용약관에 동의합니다"
        :rules="[(v) => !!v || '이용약관 동의는 필수입니다']"
        required
      />

      <v-btn
        :disabled="!valid || !termsAgreed"
        @click="submitForm"
        color="primary"
      >
        회원가입
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const valid = ref(false);
const passwordConfirm = ref("");
const termsAgreed = ref(false);
const profileImage = ref(null);

interface RegisterForm {
  username: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImage: string;
  address: {
    country: string;
    mainAddress: string;
    subAddress: string;
  };
}

const form = ref<RegisterForm>({
  username: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  profileImage: "",
  address: {
    country: "",
    mainAddress: "",
    subAddress: "",
  },
});

const emailRules = [
  (v: string) => !!v || "이메일은 필수입니다",
  (v: string) => /.+@.+\..+/.test(v) || "유효한 이메일을 입력해주세요",
];

const passwordRules = [
  (v: string) => !!v || "비밀번호는 필수입니다",
  (v: string) => v.length >= 6 || "비밀번호는 최소 6자 이상이어야 합니다",
  (v: string) => /[0-9]/.test(v) || "숫자를 포함해야 합니다",
  (v: string) => /[!@#$%^&*]/.test(v) || "특수문자를 포함해야 합니다",
];

const router = useRouter();

const updateURL = (data: { fieldName: string; url: string }) => {
  if (data.fieldName && data.url) {
    (form.value as any)[data.fieldName] = data.url;
    console.log(`${data.fieldName} 필드 업데이트: ${data.url}`);
  }
};

const submitForm = async () => {
  try {
    const response = await axios.post("/api/auth/register", form.value);
    alert("회원가입이 완료되었습니다!");
    router.push("/login");
  } catch (error) {
    console.error("회원가입 실패:", error);
    alert("회원가입에 실패했습니다.");
  }
};
</script>
