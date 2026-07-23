<template>
  <header class="p-3 mb-3 border-bottom">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <RouterLink
          to="/"
          class="d-flex align-items-center mb-2 mb-lg-0 me-lg-3 link-body-emphasis text-decoration-none"
        >
        <img :src=mkSandboxLogo alt="MK Sandbox Logo" width="80" height="65">
        </RouterLink>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="#" class="nav-link px-2 link-secondary">Overview</a></li>
          <li><a href="#" class="nav-link px-2 link-body-emphasis">Inventory</a></li>
          <li><a href="#" class="nav-link px-2 link-body-emphasis">Customers</a></li>
          <li><a href="#" class="nav-link px-2 link-body-emphasis">Products</a></li>
        </ul>

        <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search" @submit.prevent>
          <input
            type="search"
            class="form-control"
            placeholder="Search..."
            aria-label="Search"            
          >
        </form>

        <div v-if="isAuthenticated" class="dropdown text-end">
          <a
            href="#"
            class="d-block link-body-emphasis text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            @click.prevent
          >
            <img
              :src="displayImage"
              alt="Profile"
              style="object-fit: cover"
              width="40"
              height="40"
              class="rounded-circle"
              @error="imageFailed = true"
            >
          </a>
          <ul class="dropdown-menu text-small">
            <li><a class="dropdown-item" href="#">New project...</a></li>
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" @click.prevent="handleLogout">Sign out</a></li>
          </ul>
        </div>
        <div v-else>
          <RouterLink to="/login">
            <HeaderLoginButton text="Login" />
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import mkSandboxLogo from '@/assets/mk-sandbox-icon.svg'
import { useUserStore } from '@/features/users/userStore';
import { useAuthStore } from '@/features/auth/authStore';
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import HeaderLoginButton from '@/components/buttons/HeaderLoginButton.vue';
import defaultProfileImage from '@/assets/icons/user.png';

const userStore = useUserStore();
const authStore = useAuthStore();

const isAuthenticated = computed(() => userStore.isAuthenticated);

const handleLogout = async () => {
  await authStore.logout();
}

const { image: profileImage } = storeToRefs(userStore);
const imageFailed = ref(false);

const displayImage = computed(() => {
  if (imageFailed.value || !profileImage.value) {
    return defaultProfileImage;
  }
  return profileImage.value;
});

watch(profileImage, () => {
    imageFailed.value = false;
});

</script>


<style scoped>
.dropdown-menu {
  color: #000000;
  border: solid .1px #000000;
  border-radius: .375rem;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>