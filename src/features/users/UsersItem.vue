<template>
    <base-card class="base-card" width="100%">
      <div class="user-data">
        <h5>
          {{ fullName }}
          <basic-badge v-if="props.isArchived" :label="t('ARCHIVED')" variant="warning"></basic-badge>
        </h5>
        <h5 class="user-email">{{ email }}</h5>
        <div class="user-actions">
          <h5 class="user-role">{{ t(roleTranslationKey) }}</h5>
          <RouterLink class="user-profile-link" :to="{ name: 'user-profile', params: { id } }" :title="t('VIEW_PROFILE')">
              <img :src="profileIcon" :alt="t('VIEW_PROFILE')" height="15"/>
          </RouterLink>
        </div>
      </div>
    </base-card>
</template>


<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { ROLES } from '@/constants/constants';
import profileIcon from '@/assets/icons/profile_eye_icon.svg'

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
  display: grid;
  grid-template-columns: var(--users-grid-columns);
  align-items: center;
  column-gap: var(--users-grid-gap);
}

.user-data h5 {
  margin: 0;
  overflow-wrap: anywhere;
}

.user-email {
  text-align: center;
}

.user-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--users-actions-gap);
}

.user-profile-link {
  display: flex;
  justify-content: flex-end;
  width: var(--users-profile-link-width);
}

.user-role {
  text-align: right;
}
</style>