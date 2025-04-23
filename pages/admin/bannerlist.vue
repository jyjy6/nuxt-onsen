<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import type { Banner } from "~/types/bannerTypes";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const banners = ref<Banner[]>([]);
const loading = ref(true);
const error = ref("");
const page = ref(1);
const itemsPerPage = ref(5);
const totalItems = ref(0);

// Enhanced API function with pagination
const fetchBanners = async () => {
  loading.value = true;
  try {
    const response = await axios.get("/api/admin/banners", {
      params: {
        page: page.value,
        limit: itemsPerPage.value,
      },
    });
    banners.value = response.data.data;
    totalItems.value = response.data.total;
  } catch (err) {
    error.value = "배너 목록을 불러오는 중 오류가 발생했습니다.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const api = useSecureApi();
// For toggling banner selection
const toggleSelection = async (banner: Banner) => {
  try {
    // v-switch에서 먼저 banner의 selected값을 toggle하기때문에
    // !banner.selected가 아닌 banner.selected값을 그대로 전달.
    const newSelectedValue = banner.selected;
    await api.securePut(`/api/admin/banners/${banner._id}`, {
      selected: newSelectedValue,
    });

    // Update local state
    const index = banners.value.findIndex((b) => b._id === banner._id);
    if (index !== -1) {
      banners.value[index].selected = newSelectedValue;
    }
  } catch (err) {
    console.error("배너 상태 업데이트 중 오류:", err);
  }
};

const getBannerNumberLabel = (number: number) => {
  return `라인 ${number}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(fetchBanners);

const handlePageChange = (newPage: number) => {
  page.value = newPage;
  fetchBanners();
};
</script>

<template>
  <v-container fluid>
    <v-card class="mb-6">
      <v-card-title class="text-h5 font-weight-bold">
        배너 관리
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          :to="'/admin/add/banner'"
        >
          새 배너 등록
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Loading and Error states -->
        <v-alert v-if="error" type="error" variant="tonal">{{ error }}</v-alert>

        <v-skeleton-loader v-if="loading" type="table"></v-skeleton-loader>

        <!-- Banner List -->
        <v-data-table
          v-else
          :headers="[
            { title: '배너 이미지', key: 'mainImg', sortable: false },
            { title: '제목', key: 'title', sortable: true },
            { title: '위치', key: 'bannerNumber', sortable: true },
            { title: '등록일', key: 'timestamp', sortable: true },
            { title: '팝업 링크', key: 'bannerPopup', sortable: false },
            { title: '사용 여부', key: 'selected', sortable: true },
            { title: '관리', key: 'actions', sortable: false },
          ]"
          :items="banners"
          :items-per-page="itemsPerPage"
          class="elevation-1"
          hide-default-footer
        >
          <!-- Image column -->
          <template v-slot:item.mainImg="{ item }">
            <v-img
              :src="item.mainImg"
              max-width="120"
              max-height="60"
              class="rounded"
              cover
            ></v-img>
          </template>

          <!-- Banner number -->
          <template v-slot:item.bannerNumber="{ item }">
            <v-chip
              :color="item.bannerNumber === 1 ? 'primary' : 'secondary'"
              text-color="white"
              size="small"
            >
              {{ getBannerNumberLabel(item.bannerNumber) }}
            </v-chip>
          </template>

          <!-- Date formatting -->
          <template v-slot:item.timestamp="{ item }">
            {{ formatDate(item.timestamp) }}
          </template>

          <!-- Popup link -->
          <template v-slot:item.bannerPopup="{ item }">
            <v-chip
              v-if="item.bannerPopup"
              color="info"
              size="small"
              variant="outlined"
            >
              <v-icon start size="small">mdi-link</v-icon>
              설정됨
            </v-chip>
            <span v-else class="text-grey">미설정</span>
          </template>

          <!-- Active status -->
          <template v-slot:item.selected="{ item }">
            <v-switch
              v-model="item.selected"
              color="success"
              hide-details
              @change="toggleSelection(item)"
              density="compact"
            ></v-switch>
          </template>

          <!-- Action buttons -->
          <template v-slot:item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                size="small"
                color="primary"
                variant="text"
                :to="`/admin/banners/edit/${item._id}`"
              >
                <v-icon size="small">mdi-pencil</v-icon>
              </v-btn>
              <v-btn size="small" color="error" variant="text">
                <v-icon size="small">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>

        <!-- Pagination -->
        <div class="d-flex justify-center mt-6">
          <v-pagination
            v-model="page"
            :length="Math.ceil(totalItems / itemsPerPage)"
            rounded="circle"
            @update:model-value="handlePageChange"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
