import { defineStore } from 'pinia'
import { ref } from 'vue'
export const uiStore = defineStore('uiStore', () => {
    const newOrderModal = ref(false)
    function showNewOrderModal(shouldShow: boolean) {
        newOrderModal.value = shouldShow
    }
    return {
        newOrderModal,
        showNewOrderModal
    }
})