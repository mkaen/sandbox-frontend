<template>
    <base-card class="base-card" width="100%">
      <div class="user-data">
        <h5>
          {{ fullName }}
          <basic-badge v-if="props.isArchived" :label="t('ARCHIVED')" variant="warning"></basic-badge>
        </h5>
        <h5>{{ email }}</h5>
        <h5>{{ t(roleTranslationKey) }}</h5>
      </div>
    </base-card>
</template>


<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { ROLES } from '@/constants/constants';

const { t } = useI18n();

const props = defineProps({
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    isArchived: null,
    role: { 
      type: String,
      required: true, 
      validator: (value) => Object.values(ROLES).includes(value) }
});

const fullName = computed(() => {
    return props.firstName + ' ' + props.lastName;
    }
);

const roleTranslationKey = computed(() => {
    return 'ROLE.' + props.role;
})

</script>


<style scoped>
.user-data {
  display: flex;
  direction: row;
  justify-content: space-between;
}
</style>