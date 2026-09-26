<template>
    <div>
        <notification-modal
            ref="removeAccountModal"
            :show-cancel="true"
            :title="t('MODAL.REMOVE_ACCOUNT_TITLE')"
            :body="t('MODAL.REMOVE_ACCOUNT_BODY')"
            :confirm-button-label="t('REMOVE_ACCOUNT')"
            confirm-button-variant="danger"
            @confirm="removeAccount"
        />
        <base-card v-if="isLoaded" width="50rem" padding="1.5rem">
        <span><u><b>{{ t('MY_PROFILE_DATA') }}</b></u></span>
            <form @submit.prevent="handleSubmit">
                <div class="text-img-separator">
                    <div class="data mt-3">
                        <div class="field-group">
                            <div class="field">
                                <label for="first-name">{{ t('FIRST_NAME') }}:</label>
                                <input
                                    id="first-name"
                                    type="text"
                                    class="form-control"
                                    v-model.trim="firstName.value"
                                    :disabled="!canEditProfile"
                                    :class="{ 'is-invalid': !firstName.isValid }"
                                    @blur="clearValidity('firstName')"
                                >
                            </div>
                            <p v-if="!firstName.isValid" class="text-danger field-error">
                                {{ t('ERROR.FIRST_NAME_LENGTH', { min: FIRST_NAME_LENGTH_MIN, max: FIRST_NAME_LENGTH_MAX }) }}
                            </p>
                        </div>

                        <div class="field-group">
                            <div class="field">
                                <label for="last-name">{{ t('LAST_NAME') }}:</label>
                                <input
                                    id="last-name"
                                    type="text"
                                    class="form-control"
                                    v-model.trim="lastName.value"
                                    :disabled="!canEditProfile"
                                    :class="{ 'is-invalid': !lastName.isValid }"
                                    @blur="clearValidity('lastName')"
                                >
                            </div>
                            <p v-if="!lastName.isValid" class="text-danger field-error">
                                {{ t('ERROR.LAST_NAME_LENGTH', { min: LAST_NAME_LENGTH_MIN, max: LAST_NAME_LENGTH_MAX }) }}
                            </p>
                        </div>

                        <div class="field-group">
                            <div class="field">
                                <label for="email">{{ t('EMAIL') }}:</label>
                                <input
                                    id="email"
                                    type="email"
                                    class="form-control"
                                    v-model.trim="email.value"
                                    :disabled="!canEditProfile"
                                    :class="{ 'is-invalid': !email.isValid }"
                                    @blur="clearValidity('email')"
                                >
                            </div>
                            <p v-if="!email.isValid" class="text-danger field-error">
                                {{ t('ERROR.INVALID_EMAIL') }}
                            </p>
                        </div>

                        <div class="field-group">
                            <div class="field">
                                <label for="phone">{{ t('PHONE') }}:</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    class="form-control"
                                    v-model.trim="phone.value"
                                    :disabled="!canEditProfile"
                                    :class="{ 'is-invalid': !phone.isValid }"
                                    @blur="clearValidity('phone')"
                                >
                            </div>
                            <p v-if="!phone.isValid" class="text-danger field-error">
                                {{ t('ERROR.INVALID_PHONE', {min: PHONE_LENGTH_MIN, max: PHONE_LENGTH_MAX}) }}
                            </p>
                        </div>

                        <div v-if="userStore.isAdmin" class="field-group">
                            <div class="field">
                                <label for="role">{{ t('ROLE') }}:</label>
                                <select
                                    id="role"
                                    name="role"
                                    class="form-control"
                                    v-model="role.value"
                                    :disabled="!canEditRole"
                                >
                                    <option
                                        v-for="roleOption in Object.values(ROLES)"
                                        :key="roleOption"
                                        :value="roleOption"
                                    >
                                        {{ roleOption }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <hr>

                        <div v-if="canEditProfile" class="password-section">
                            <span><u><b>{{ t('PASSWORD.CHANGE') }}</b></u></span>
                            <div class="field-group">
                                <div class="field">
                                    <label for="old-password">{{ t('PASSWORD.OLD') }}:</label>
                                    <input
                                        id="old-password"
                                        type="password"
                                        class="form-control"
                                        v-model="oldPassword.value"
                                        :class="{ 'is-invalid': !oldPassword.isValid }"
                                        @blur="clearValidity('oldPassword')"
                                    >
                                </div>
                                <p v-if="!oldPassword.isValid" class="text-danger field-error">
                                    {{ t('ERROR.PASSWORD.OLD_REQUIRED') }}
                                </p>
                                <p v-if="!oldPassword.match" class="text-danger field-error">
                                    {{ t('ERROR.PASSWORD.OLD_DO_NOT_MATCH') }}
                                </p>
                            </div>
                            <div class="field-group">
                                <div class="field">
                                    <label for="new-password">{{ t('PASSWORD.NEW') }}:</label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        class="form-control"
                                        v-model="newPassword.value"
                                        :class="{ 'is-invalid': !newPassword.isValid }"
                                        @blur="clearValidity('newPassword')"
                                    >
                                </div>
                                <p v-if="!newPassword.isValid" class="text-danger field-error">
                                    {{ t('ERROR.PASSWORD.INVALID_LENGTH', {min: PASSWORD_LENGTH_MIN}) }}
                                </p>
                            </div>
                            <div class="field-group">
                                <div class="field">
                                    <label for="confirm-new-password">{{ t('PASSWORD.CONFIRM') }}:</label>
                                    <input
                                        id="confirm-new-password"
                                        type="password"
                                        class="form-control"
                                        v-model="passwordConfirm.value"
                                        :class="{ 'is-invalid': !passwordConfirm.isValid }"
                                        @blur="clearValidity('passwordConfirm')"
                                    >
                                </div>
                                <p v-if="!passwordConfirm.isValid" class="text-danger field-error">
                                    {{ t('ERROR.PASSWORD.NEW_DO_NOT_MATCH') }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="image-col">
                        <img
                            :src="displayImage"
                            class="profile-image"
                            alt="profile"
                            @error="imageFailed = true"
                        >
                        <div v-if="canEditProfile" class="upload-image">
                            <div class="file-picker" :class="{ 'is-invalid': !image.isValid }">
                                <input
                                    ref="imageInput"
                                    type="file"
                                    id="image"
                                    class="file-picker-input"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    :aria-invalid="!image.isValid"
                                    @change="updateImage"
                                >
                                <label for="image" class="file-picker-button">
                                    {{ t('BUTTON.UPLOAD_NEW_IMAGE') }}
                                </label>
                                <span class="file-picker-name" :class="{ 'has-file': image.value }">
                                    {{ selectedFileName }}
                                </span>
                            </div>
                            <p v-if="!image.isValid" class="text-danger">{{ image.error }}</p>
                            <div v-if="hasPendingImage" class="restore-btn">
                                <ConfirmationButton
                                    type="button"
                                    :label="`${t('BUTTON.RESTORE_IMAGE')}`"
                                    @click="restoreImage"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div v-if="canEditProfile || canEditRole" class="save-btn">
                    <ConfirmationButton
                    type="submit"
                    :label="`${t('BUTTON.SAVE')}`"
                    :disabled="!canSave"
                    />
                </div>
                <a
                    v-if="isSelf || isAdmin"
                    href="#"
                    @click.prevent="openRemoveAccountModal"
                >
                    {{ t('REMOVE_ACCOUNT') }}
                </a>
            </form>
        </base-card>
    </div>
</template>

<script setup>
import { useUserStore } from '@/features/users/userStore';
import { useAuthStore } from '@/features/auth/authStore';
import ConfirmationButton from '@/components/buttons/ConfirmationButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import {
    ROLES,
    PROFILE_IMAGE_CHANGE,
    FIRST_NAME_LENGTH_MIN,
    FIRST_NAME_LENGTH_MAX,
    LAST_NAME_LENGTH_MIN,
    LAST_NAME_LENGTH_MAX,
    PASSWORD_LENGTH_MIN,
    PHONE_LENGTH_MIN,
    PHONE_LENGTH_MAX,
} from '@/constants/constants'
import { EMAIL_VALIDATION_PATTERN } from '@/utils/validation'
import { validateProfileImageFile } from '@/utils/imageFile'
import defaultProfileImage from '@/assets/icons/user.png'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const removeAccountModal = ref(null);
const isLoaded = ref(false);
const imageFailed = ref(false);
const previewUrl = ref(null);
const imageInput = ref(null);
const profileMeta = reactive({
    id: '',
    image: null,
    hasImage: false,
});
const initialValues = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
});

const firstName = reactive({ value: '', isValid: true })
const lastName = reactive({ value: '', isValid: true })
const email = reactive({ value: '', isValid: true })
const phone = reactive({ value: '', isValid: true })
const role = reactive({ value: '' })
const oldPassword = reactive({ value: '', isValid: true, match: true })
const newPassword = reactive({ value: '', isValid: true })
const passwordConfirm = reactive({ value: '', isValid: true })
const image = reactive({ value: null, isValid: true, error: '' })

const fields = {
    firstName,
    lastName,
    email,
    phone,
    oldPassword,
    newPassword,
    passwordConfirm,
    image,
}

const accountId = route.params.id
const isSelf = computed(() => String(accountId) === String(userStore.id))
const canEditProfile = computed(() => isSelf.value)
const canEditRole = computed(() => userStore.isAdmin && !isSelf.value)
const hasPendingImage = computed(() => Boolean(image.value || previewUrl.value))
const selectedFileName = computed(() => image.value?.name || t('BUTTON.NO_FILE_CHOSEN'))
const isAdmin = computed(() => userStore.isAdmin)

const hasProfileChanges = computed(() => {
    if (!canEditProfile.value) {
        return false
    }
    return (
        firstName.value !== initialValues.firstName
        || lastName.value !== initialValues.lastName
        || email.value !== initialValues.email
        || phone.value !== initialValues.phone
        || isPasswordChangeRequested()
        || hasPendingImage.value
    )
})

const hasRoleChange = computed(() => {
    if (!canEditRole.value) {
        return false
    }
    return role.value !== initialValues.role
})

const canSave = computed(() => hasProfileChanges.value || hasRoleChange.value)

const profileImageUrl = computed(() => profileMeta.image)

const displayImage = computed(() => {
    if (previewUrl.value) {
        return previewUrl.value
    }
    if (imageFailed.value || !profileImageUrl.value) {
        return defaultProfileImage
    }
    return profileImageUrl.value
})

async function fillForm(userData) {
    firstName.value = userData.firstName || ''
    lastName.value = userData.lastName || ''
    email.value = userData.email || ''
    phone.value = userData.phone || ''
    role.value = userData.role || ''
    initialValues.firstName = firstName.value
    initialValues.lastName = lastName.value
    initialValues.email = email.value
    initialValues.phone = phone.value
    initialValues.role = role.value
    profileMeta.id = userData.id != null ? String(userData.id) : ''
    profileMeta.image = userData.image || null
    profileMeta.hasImage = Boolean(userData.image)

    if (!profileMeta.image && profileMeta.id) {
        const imageUrl = await userStore.getProfileImageById(profileMeta.id)
        if (imageUrl) {
            profileMeta.image = imageUrl
            profileMeta.hasImage = true
        }
    }

    isLoaded.value = true
}

function revokePreviewUrl() {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
        previewUrl.value = null
    }
}

function openRemoveAccountModal() {
    removeAccountModal.value?.openModal()
}

async function removeAccount() {
    const removed = await userStore.removeAccount(accountId)
    if (!removed) {
        return
    }
    if (isSelf.value) {
        await authStore.logout()
        return
    }
    await router.push('/')
}

function restoreImage() {
    image.value = null
    image.isValid = true
    image.error = ''
    revokePreviewUrl()
    imageFailed.value = false
    if (imageInput.value) {
        imageInput.value.value = ''
    }
}

function clearValidity(fieldName) {
    fields[fieldName].isValid = true
    if (fieldName === 'oldPassword') {
        oldPassword.match = true
    }
    if (fieldName === 'image') {
        fields[fieldName].error = ''
    }
}

const updateImage = async (event) => {
    const input = event.target
    const file = input.files?.[0]
    image.isValid = true
    image.error = ''

    if (!file) {
        image.value = null
        revokePreviewUrl()
        return
    }

    const result = await validateProfileImageFile(file)
    if (!result.ok) {
        image.isValid = false
        image.error = result.error
        image.value = null
        revokePreviewUrl()
        input.value = ''
        return
    }

    image.value = file
    revokePreviewUrl()
    previewUrl.value = URL.createObjectURL(file)
    imageFailed.value = false
}

function isPasswordChangeRequested() {
    return Boolean(
        oldPassword.value.trim()
        || newPassword.value.trim()
        || passwordConfirm.value.trim(),
    )
}

function validateProfileFields() {
    let formIsValid = true

    if (
        firstName.value.trim() === ''
        || firstName.value.length < FIRST_NAME_LENGTH_MIN
        || firstName.value.length > FIRST_NAME_LENGTH_MAX
    ) {
        firstName.isValid = false
        formIsValid = false
    }
    if (
        lastName.value.trim() === ''
        || lastName.value.length < LAST_NAME_LENGTH_MIN
        || lastName.value.length > LAST_NAME_LENGTH_MAX
    ) {
        lastName.isValid = false
        formIsValid = false
    }
    if (
        phone.value.trim() === ''
        || phone.value.length < PHONE_LENGTH_MIN
        || phone.value.length > PHONE_LENGTH_MAX
    ) {
        phone.isValid = false
        formIsValid = false
    }
    if (email.value === '' || !EMAIL_VALIDATION_PATTERN.test(email.value)) {
        email.isValid = false
        formIsValid = false
    }
    if (!image.isValid) {
        formIsValid = false
    }

    if (isPasswordChangeRequested()) {
        if (oldPassword.value.trim() === '') {
            oldPassword.isValid = false
            formIsValid = false
        }
        if (newPassword.value.trim() === '' || newPassword.value.length < PASSWORD_LENGTH_MIN) {
            newPassword.isValid = false
            formIsValid = false
        }
        if (
            passwordConfirm.value !== newPassword.value
            || passwordConfirm.value.trim() === ''
        ) {
            newPassword.isValid = false
            passwordConfirm.isValid = false
            formIsValid = false
        }
    }

    return formIsValid
}

/**
 * NONE — no new file selected
 * ADDED — new file, user had no profile image yet
 * CHANGED — new file replacing an existing profile image
 */
function resolveImageChange() {
    if (!canEditProfile.value || !image.value) {
        return PROFILE_IMAGE_CHANGE.NONE
    }
    return profileMeta.hasImage
        ? PROFILE_IMAGE_CHANGE.CHANGED
        : PROFILE_IMAGE_CHANGE.ADDED
}

const handleSubmit = async () => {
    let formIsValid = true

    if (canEditProfile.value) {
        formIsValid = validateProfileFields() && formIsValid
    }
    if (!formIsValid) {
        return
    }

    const imageChange = resolveImageChange()
    const imageFile = imageChange === PROFILE_IMAGE_CHANGE.NONE ? null : image.value

    const formData = {}
    if (canEditProfile.value) {
        formData.id = accountId
        formData.firstName = firstName.value
        formData.lastName = lastName.value
        formData.email = email.value
        formData.phone = phone.value
        if (isPasswordChangeRequested()) {
            formData.oldPassword = oldPassword.value
            formData.newPassword = newPassword.value
        }
    }
    if (canEditRole.value) {
        formData.role = role.value
    }

    const updatedUser = await userStore.updateUser(
        accountId,
        formData,
        { imageFile },
    )

    if (updatedUser?.error) {
        oldPassword.match = false
        return updatedUser
    }

    if (updatedUser && canEditProfile.value) {
        await fillForm({
            ...updatedUser,
            image: updatedUser.image || userStore.image,
        })
        restoreImage()
        oldPassword.value = ''
        newPassword.value = ''
        passwordConfirm.value = ''
        oldPassword.match = true
    }

    return updatedUser
}

onMounted(async () => {
    const id = String(accountId)
    if (!isSelf.value && !userStore.isAdmin) {
        return
    }
    if (isSelf.value) {
        await fillForm({
            id: userStore.id,
            firstName: userStore.firstName,
            lastName: userStore.lastName,
            email: userStore.email,
            phone: userStore.phone,
            role: userStore.role,
            image: userStore.image,
        })
        return
    }
    const userData = await userStore.fetchUserById(id)
    if (userData) {
        await fillForm(userData)
    }
})

watch(profileImageUrl, () => {
    imageFailed.value = false
})

onUnmounted(() => {
    revokePreviewUrl()
    userStore.clearProfileViewUser()
})
</script>

<style scoped>
.profile-image {
    width: 300px;
    height: 300px;
    object-fit: cover;
    border-radius: 12px;
    flex-shrink: 0;
}
.text-img-separator {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2.5rem;
}
.data {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
    padding-top: 0;
}
.password-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.field-group {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.field {
    display: grid;
    grid-template-columns: 6.5rem 1fr;
    align-items: center;
    gap: 0.5rem;
}
.field label {
    text-align: right;
    font-size: small;
}
.field-error {
    margin: 0 0 0 7rem;
    font-size: 0.8rem;
}
select,
input {
    border-radius: 0.3rem;
    width: 100%;
    box-sizing: border-box;
}
input:disabled,
select:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
}
.is-invalid {
    border-color: #dc3545;
}
.save-btn {
    display: flex;
    margin-top: 1.5rem;
    justify-content: space-evenly;
}
.image-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}
.upload-image {
    width: 300px;
}
.upload-heading {
    display: block;
    margin-bottom: 0.35rem;
}
.file-picker {
    position: relative;
    display: flex;
    align-items: stretch;
    width: 100%;
    border: 1px solid #ced4da;
    border-radius: 0.3rem;
    background-color: #fff;
    overflow: hidden;
}
.file-picker.is-invalid {
    border-color: #dc3545;
}
.file-picker-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
.file-picker-input:focus-visible + .file-picker-button {
    outline: 2px solid #2a74c2;
    outline-offset: -2px;
}
.file-picker-button {
    margin: 0;
    flex-shrink: 0;
    padding: 0.375rem 0.75rem;
    background-color: #e9ecef;
    border-right: 1px solid #ced4da;
    cursor: pointer;
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: nowrap;
}
.file-picker-name {
    flex: 1;
    min-width: 0;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #6c757d;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.file-picker-name.has-file {
    color: inherit;
}
.restore-btn {
    margin-top: 0.5rem;
    display: flex;
    justify-content: center;
}
a {
    color: #dc3545;
}
</style>
