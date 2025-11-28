<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('dashboard.manage_offices') }}</h1>
      <BaseButton @click="openModal()">
        {{ $t('dashboard.add_office') }}
      </BaseButton>
    </div>

    <BaseCard>
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ $t('office.name') }}</th>
              <th class="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ $t('office.gov') }}</th>
              <th class="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ $t('dashboard.actions') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="office in offices" :key="office._id || office.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ office.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ office.gov_code }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 rtl:space-x-reverse">
                <button @click="openModal(office)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">{{ $t('dashboard.edit_office') }}</button>
                <button v-if="canDelete" @click="deleteOffice(office._id || office.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">{{ $t('dashboard.delete_office') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4" id="modal-title">
              {{ isEditing ? $t('dashboard.edit_office') : $t('dashboard.add_office') }}
            </h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <BaseInput v-model="form.name" :label="$t('office.name')" />
                <BaseInput v-model="form.gov_code" :label="$t('office.gov')" />
                <BaseInput v-model="form.address" :label="$t('office.address')" />
                <BaseInput v-model="form.postal_code" :label="$t('office.postal_code')" />
                <BaseInput v-model="form.phone1" :label="$t('office.phone') + ' 1'" />
                <BaseInput v-model="form.phone2" :label="$t('office.phone') + ' 2'" />
                
                <div class="grid grid-cols-2 gap-4">
                  <BaseInput v-model="form.x" label="Latitude (x)" />
                  <BaseInput v-model="form.y" label="Longitude (y)" />
                </div>
              </div>

              <div class="h-[400px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <LeafletMap 
                  :x="form.x" 
                  :y="form.y" 
                  :readonly="false" 
                  @update:location="updateLocation"
                />
                <p class="text-xs text-gray-500 mt-1 text-center">Click on map to set location</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <BaseButton @click="saveOffice" :loading="saving" class="w-full sm:w-auto sm:ml-3">
              {{ $t('dashboard.save') }}
            </BaseButton>
            <BaseButton @click="closeModal" variant="secondary" class="mt-3 w-full sm:w-auto sm:mt-0">
              {{ $t('dashboard.cancel') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import LeafletMap from '@/components/map/LeafletMap.vue';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const offices = ref([]);
const loading = ref(true);
const showModal = ref(false);
const saving = ref(false);
const isEditing = ref(false);
const currentId = ref(null);

const form = ref({
  name: '',
  gov_code: '',
  address: '',
  postal_code: '',
  phone1: '',
  phone2: '',
  x: '',
  y: '',
});

const canDelete = computed(() => ['owner', 'admin'].includes(authStore.user?.role));

const fetchOffices = async () => {
  try {
    loading.value = true;
    const response = await api.get('/posts');
    // Handle both flat and grouped responses for robustness
    const data = response.data;
    if (Array.isArray(data)) {
      offices.value = data;
    } else {
      const flatList = [];
      Object.values(data).forEach(list => flatList.push(...list));
      offices.value = flatList;
    }
  } catch (error) {
    console.error('Failed to fetch offices:', error);
  } finally {
    loading.value = false;
  }
};

const openModal = (office = null) => {
  if (office) {
    isEditing.value = true;
    currentId.value = office._id || office.id;
    form.value = { ...office };
  } else {
    isEditing.value = false;
    currentId.value = null;
    form.value = {
      name: '',
      gov_code: '',
      address: '',
      postal_code: '',
      phone1: '',
      phone2: '',
      x: 30.0444,
      y: 31.2357,
    };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const updateLocation = ({ x, y }) => {
  form.value.x = x;
  form.value.y = y;
};

const saveOffice = async () => {
  try {
    saving.value = true;
    if (isEditing.value) {
      await api.put(`/posts/${currentId.value}`, form.value);
    } else {
      await api.post('/posts', form.value);
    }
    await fetchOffices();
    closeModal();
  } catch (error) {
    console.error('Failed to save office:', error);
    alert('Failed to save office');
  } finally {
    saving.value = false;
  }
};

const deleteOffice = async (id) => {
  if (!confirm('Are you sure you want to delete this office?')) return;
  
  try {
    await api.delete(`/posts/${id}`);
    await fetchOffices();
  } catch (error) {
    console.error('Failed to delete office:', error);
  }
};

onMounted(() => {
  fetchOffices();
});
</script>
