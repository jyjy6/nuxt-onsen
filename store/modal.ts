// src/stores/modal.ts
import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    isOpen: false,
  }),
  actions: {
    openModal() {
      console.log("모달창열림");
      this.isOpen = true;
    },
    closeModal() {
      console.log("모달창닫힘");
      this.isOpen = false;
    },
    toggleModal() {
      this.isOpen = !this.isOpen;
    },
  },
});
