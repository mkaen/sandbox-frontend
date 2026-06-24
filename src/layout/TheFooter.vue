<template>
  <footer class="py-3 mt-auto border-top">
    <div class="container">
      <div class="d-flex flex-wrap justify-content-between align-items-center">
        <div class="col-md-4 d-flex align-items-center">
          <img
            :src="vibecodeLogo"
            alt="VibeCode Logo"
            width="60"
            height="48"
            class="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
            aria-label="MK Vibecode Logo"
          >
          <span class="mb-3 mb-md-0 text-body-secondary">© 2026 MK Vibecode</span>
        </div>
        <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li class="ms-3">
            <a
              class="text-body-secondary"
              :href="`mailto:${variables.personalEmail}`"
              aria-label="E-mail"
            >
              <img :src="emailIcon" alt="E-mail Icon" width="40" height="40">
            </a>
          </li>
          <li class="ms-3">
            <a
              class="text-body-secondary"
              :href="variables.links.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Linkedin"
            >
              <img :src="linkedInIcon" alt="Linkedin Icon" width="40" height="40">
            </a>
          </li>
          <li class="ms-3">
            <a
              class="text-body-secondary"
              :href="variables.links.github"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <img :src="gitHubIcon" alt="GitHub Icon" width="40" height="40">
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup>
import vibecodeLogo from '@/assets/mk-vibecode-logo.svg'
import emailIcon from '@/assets/email-icon.png'
import linkedInIcon from '@/assets/linkedin-icon.png'
import gitHubIcon from '@/assets/github-icon.png'
import variables from '@/config/variables.json'
</script>
