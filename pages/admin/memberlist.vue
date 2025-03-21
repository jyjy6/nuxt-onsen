<script setup lang="ts">
import axios from "axios";
import type { UserInfo } from "~/types/userInfoTypes";
import { ref, computed } from "vue";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const allMembers = ref<UserInfo[]>([]);
const loading = ref(true);
const search = ref("");
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [{ key: "name", order: "asc" as "asc" | "desc" }],
});
const selectedMembers = ref([]);
const headers = [
  { title: "프로필", key: "profileImage", sortable: false },
  { title: "이름", key: "name", sortable: true },
  { title: "아이디", key: "userId", sortable: true },
  { title: "이메일", key: "email", sortable: true },
  { title: "역할", key: "role", sortable: true },
  { title: "최근 로그인", key: "lastLogin", sortable: true },
  { title: "프리미엄", key: "premiumUntil", sortable: true },
  { title: "관리", key: "actions", sortable: false },
];

const editDialog = ref(false);
const deleteDialog = ref(false);
const currentMember = ref<UserInfo | null>(null);

onMounted(async () => {
  try {
    const response = await axios.get("/api/admin/members");
    allMembers.value = response.data.data;
  } catch (error) {
    console.error("멤버 목록을 불러오는 중 오류가 발생했습니다:", error);
  } finally {
    loading.value = false;
  }
});

const filteredMembers = computed(() => {
  if (!search.value) return allMembers.value;

  const searchLower = search.value.toLowerCase();
  return allMembers.value.filter(
    (member) =>
      member.name.toLowerCase().includes(searchLower) ||
      member.userId.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.role.toLowerCase().includes(searchLower)
  );
});

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isPremium = (date: string | undefined) => {
  if (!date) return false;
  return new Date(date) > new Date();
};

const editMember = (member: UserInfo) => {
  currentMember.value = { ...member };
  editDialog.value = true;
};

const confirmDelete = (member: UserInfo) => {
  currentMember.value = member;
  deleteDialog.value = true;
};

const deleteMember = async () => {
  if (!currentMember.value?._id) return;

  try {
    await axios.delete(`/api/admin/members/${currentMember.value._id}`);
    allMembers.value = allMembers.value.filter(
      (m) => m._id !== currentMember.value?._id
    );
    deleteDialog.value = false;
  } catch (error) {
    console.error("멤버 삭제 중 오류가 발생했습니다:", error);
  }
};

const saveMember = async () => {
  if (!currentMember.value) return;

  try {
    const response = await axios.put(
      `/api/admin/members/${currentMember.value._id}`,
      currentMember.value
    );
    const index = allMembers.value.findIndex(
      (m) => m._id === currentMember.value?._id
    );
    if (index !== -1) {
      allMembers.value[index] = response.data.data;
    }
    editDialog.value = false;
  } catch (error) {
    console.error("멤버 정보 수정 중 오류가 발생했습니다:", error);
  }
};
</script>

<template>
  <v-container>
    <v-card class="mb-6" elevation="2">
      <v-card-title class="d-flex align-center py-4 px-6">
        <v-icon size="large" color="primary" class="me-3"
          >mdi-account-group</v-icon
        >
        <span class="text-h4 font-weight-bold">멤버 목록 & 관리</span>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="검색"
          hide-details
          density="compact"
          variant="outlined"
          class="max-width-300"
          bg-color="grey-lighten-4"
        ></v-text-field>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table
        v-model="selectedMembers"
        :headers="headers"
        :items="filteredMembers"
        :loading="loading"
        :items-per-page="options.itemsPerPage"
        :page="options.page"
        :sort-by="options.sortBy"
        item-value="_id"
        class="elevation-0"
        @update:options="options = $event"
      >
        <template #[`item.profileImage`]="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              size="40"
              color="primary"
              class="mr-3"
              v-if="!item.profileImage"
            >
              <span class="text-white text-h6">{{ item.name.charAt(0) }}</span>
            </v-avatar>
            <v-avatar size="40" class="mr-3" v-else>
              <v-img :src="item.profileImage" :alt="item.name"></v-img>
            </v-avatar>
          </div>
        </template>

        <template #[`item.lastLogin`]="{ item }">
          <div>{{ formatDate(item.lastLogin) }}</div>
        </template>

        <template #[`item.premiumUntil`]="{ item }">
          <v-chip
            :color="isPremium(item.premiumUntil) ? 'success' : 'grey'"
            :text="isPremium(item.premiumUntil) ? '프리미엄' : '일반'"
            size="small"
            variant="elevated"
          ></v-chip>
          <div v-if="isPremium(item.premiumUntil)" class="text-caption mt-1">
            {{ formatDate(item.premiumUntil || "") }}
          </div>
        </template>

        <template #[`item.role`]="{ item }">
          <v-chip
            :color="
              item.role === 'admin'
                ? 'error'
                : item.role === 'moderator'
                ? 'warning'
                : 'info'
            "
            size="small"
            variant="elevated"
          >
            {{ item.role }}
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="d-flex">
            <v-tooltip location="top" text="수정">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  density="comfortable"
                  color="primary"
                  @click="editMember(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip location="top" text="삭제">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  density="comfortable"
                  color="error"
                  @click="confirmDelete(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>

        <template #bottom>
          <div class="d-flex align-center pa-4">
            <v-btn
              color="error"
              variant="outlined"
              :disabled="selectedMembers.length === 0"
              class="me-4"
            >
              선택 삭제 ({{ selectedMembers.length }})
            </v-btn>

            <v-btn color="success" variant="elevated" prepend-icon="mdi-plus">
              새 멤버 추가
            </v-btn>

            <v-spacer></v-spacer>

            <div class="text-caption text-grey">
              총 {{ filteredMembers.length }}명의 멤버
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- 멤버 수정 다이얼로그 -->
    <v-dialog v-model="editDialog" max-width="700px">
      <v-card>
        <v-card-title class="bg-primary text-white pa-4">
          <v-icon class="mr-2">mdi-account-edit</v-icon>
          멤버 정보 수정
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form v-if="currentMember">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentMember.name"
                  label="이름"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentMember.userId"
                  label="아이디"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentMember.email"
                  label="이메일"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="currentMember.role"
                  label="역할"
                  :items="['user', 'moderator', 'admin']"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentMember.phone"
                  label="전화번호"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentMember.premiumUntil"
                  label="프리미엄 만료일"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="currentMember.profileImage"
                  label="프로필 이미지 URL"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-expansion-panels variant="accordion">
                  <v-expansion-panel title="주소 정보">
                    <template #text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="currentMember.address.country"
                            label="국가"
                            :items="[
                              '대한민국',
                              '미국',
                              '일본',
                              '중국',
                              '기타',
                            ]"
                            variant="outlined"
                            density="comfortable"
                          ></v-select>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="currentMember.address.mainAddress"
                            label="기본 주소"
                            variant="outlined"
                            density="comfortable"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="currentMember.address.subAddress"
                            label="상세 주소"
                            variant="outlined"
                            density="comfortable"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="editDialog = false"
            >취소</v-btn
          >
          <v-btn color="primary" variant="elevated" @click="saveMember"
            >저장</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 멤버 삭제 확인 다이얼로그 -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-error text-white pa-4">
          <v-icon class="mr-2">mdi-alert-circle</v-icon>
          멤버 삭제
        </v-card-title>

        <v-card-text class="pa-4 mt-4">
          <p class="text-body-1">
            <strong>{{ currentMember?.name }}</strong> ({{
              currentMember?.userId
            }}) 멤버를 정말로 삭제하시겠습니까?
          </p>
          <p class="text-caption text-grey mt-2">
            이 작업은 되돌릴 수 없으며 모든 관련 데이터가 삭제됩니다.
          </p>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false"
            >취소</v-btn
          >
          <v-btn color="error" variant="elevated" @click="deleteMember"
            >삭제</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style>
