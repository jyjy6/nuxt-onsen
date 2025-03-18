<template>
  <v-container>
    <v-form v-model="valid" ref="registerForm">
      <v-text-field
        v-model="form.username"
        label="아이디"
        :rules="[(v) => !!v || '아이디는 필수입니다']"
        required
        :disabled="props.isPut"
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
        :required="!props.isPut"
      />

      <v-text-field
        v-model="passwordConfirm"
        label="비밀번호 확인"
        type="password"
        :rules="[
          (v) => !!v || (props.isPut ? true : '비밀번호 확인은 필수입니다'),
          (v) =>
            v === form.password ||
            (props.isPut ? true : '비밀번호가 일치하지 않습니다'),
        ]"
        :required="!props.isPut"
      />

      <v-text-field v-model="form.phone" label="전화번호" />

      <v-text-field v-model="form.address.country" label="국가" />

      <v-text-field
        v-model="form.address.mainAddress"
        label="주소"
        readonly
        @click="openKakaoAddressSearch"
      />
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
        v-if="!props.isPut"
        v-model="termsAgreed"
        label="이용약관에 동의합니다"
        :rules="[(v) => !!v || '이용약관 동의는 필수입니다']"
        required
      />
      <div>
        <v-btn
          v-if="!props.isPut"
          :disabled="!valid || !termsAgreed"
          @click="submitForm"
          color="primary"
        >
          회원가입
        </v-btn>
        <v-btn
          v-else
          @click="submitForm"
          color="primary"
          style="margin: 0 auto"
        >
          회원정보수정
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSecureApi } from "~/composables/useSecureApi";

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

const props = defineProps<{
  //수정시에 들어오는 기존 폼의 데이타
  apiURL: string;
  formData?: Partial<RegisterForm>;
  fields: RegisterForm;
  isPut?: boolean;
}>();

const valid = ref(false);
const passwordConfirm = ref("");
const termsAgreed = ref(false);
const form = ref<RegisterForm>({
  username: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  profileImage: "",
  address: { country: "", mainAddress: "", subAddress: "" },
});

watchEffect(() => {
  if (props.formData) {
    // @ts-ignore
    form.value = props.formData;
  }
});
onMounted(() => {
  if (props.isPut) {
    termsAgreed.value = true;
    valid.value = true;
  }
});

const emailRules = [
  (v: string) => !!v || "이메일은 필수입니다",
  (v: string) => /.+@.+\..+/.test(v) || "유효한 이메일을 입력해주세요",
];

const passwordRules = [
  (v: string) => !!v || (props.isPut ? true : "비밀번호 확인은 필수입니다"),
  (v: string) => v.length >= 6 || "비밀번호는 최소 6자 이상이어야 합니다",
  (v: string) => /[0-9]/.test(v) || "숫자를 포함해야 합니다",
  (v: string) => /[!@#$%^&*]/.test(v) || "특수문자를 포함해야 합니다",
];

const router = useRouter();
const api = useSecureApi();

const updateURL = (data: { fieldName: string; url: string }) => {
  if (data.fieldName && data.url) {
    (form.value as any)[data.fieldName] = data.url;
    console.log(`${data.fieldName} 필드 업데이트: ${data.url}`);
  }
};

const submitForm = async () => {
  if (props.isPut) {
    form.value.username = props.formData?.username as string;
    try {
      const response = await api.securePut(props.apiURL, form.value);
      alert("회원수정이 완료되었습니다!");
      router.push("/");
    } catch (error) {
      console.error("회원수정 실패:", error);
      alert("회원수정에 실패했습니다.");
    }
  } else {
    try {
      const response = await api.securePost(props.apiURL, form.value);
      alert("회원가입이 완료되었습니다!");
      router.push("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다.");
    }
  }
};

//카카오 주소ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

const openKakaoAddressSearch = () => {
  //@ts-ignore
  new window.daum.Postcode({
    oncomplete: (data: any) => {
      form.value.address.mainAddress = data.roadAddress; // 도로명 주소 입력
    },
  }).open();
};
// 카카오 API 스크립트 로드
onMounted(() => {
  const script = document.createElement("script");
  script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  script.onload = () => console.log("카카오 주소 API 로드 완료");
  document.head.appendChild(script);
});
</script>
