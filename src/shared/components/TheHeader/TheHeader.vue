<template>
  <header class="p-3 mb-3 border-bottom">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <RouterLink
          to="/"
          class="d-flex align-items-center mb-2 mb-lg-0 me-lg-3 link-body-emphasis text-decoration-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="32"
            class="bi me-2"
            viewBox="0 0 118 94"
            role="img"
            aria-label="Vibe"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M24.509 0c-6.733 0-11.715 5.893-11.492 12.284.214 6.14-.064 14.092-2.066 20.577C8.943 39.365 5.547 43.485 0 44.637v6.26c5.547 1.152 8.943 5.222 10.951 11.685 2.002 6.485 2.28 14.437 2.066 20.577C12.794 88.106 17.776 94 24.51 94H99.483c6.733 0 11.714-5.893 11.491-12.284-.214-6.14.063-14.092 2.066-20.577 2.009-6.463 5.403-10.533 10.951-11.685V44.637c-5.547-1.152-8.942-5.222-10.951-11.685-2.002-6.484-2.28-14.437-2.066-20.577C111.516 5.893 106.534 0 99.802 0H24.508zM8.915 64.5l1.036 5.203c7.718 1.304 9.525 3.1 9.981 9.753 4.44 0 9.05-1.38 13.86-4.09l2.055 3.95a23.89 23.89 0 0 1-8.021 3.15c-2.582.805-5.367 1.1-8.355 1.1-2.071 0-4.276-.119-6.616-.366v6.347c0 1.194.031 2.399.093 3.614a165.052 165.052 0 0 0 4.504 17.474 14.902 14.902 0 0 1 6.257 1.01c1.6.466 3.017.496 4.25.15 1.234-.343 2.29-.966 3.166-1.87.877-.904 1.532-2.095 1.963-3.573.432-1.479.648-3.295.648-5.45V64.5h-9.981zm19.933 0V48.25l-2.75.75v15.5h2.75zm-25.002 0V48.25l-1.33.75v15.5h1.33zm6.553 5.928c.322.033.65.048.984.048 1.165 0 2.09-.232 2.775-.696.686-.465 1.165-1.168 1.437-2.11.272-.942.408-2.076.408-3.402 0-1.03-.21-1.94-.63-2.73-.419-.79-1.004-1.404-1.754-1.844-.75-.44-1.63-.66-2.64-.66-.394 0-.777.04-1.149.119a4.99 4.99 0 0 0-1.102.31l-2.75.75v5.645h6.235z"
            />
          </svg>
          <span class="fs-4">Vibe</span>
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

        <div class="dropdown text-end">
          <a
            href="#"
            class="d-block link-body-emphasis text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            @click.prevent
          >
            <img
              src="https://github.com/mdo.png"
              alt="mdo"
              width="32"
              height="32"
              class="rounded-circle"
            >
          </a>
          <ul class="dropdown-menu text-small">
            <li><a class="dropdown-item" href="#">New project...</a></li>
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Sign out</a></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
