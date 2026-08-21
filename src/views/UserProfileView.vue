<template>
    <div>
        <notification-modal
            ref="removeAccountModal"
            :show-cancel="true"
            title="Account Remove Confirmation"
            body="Please confirm to remove account permanently."
            confirm-button-label="Remove Account"
            confirm-button-variant="danger"
            @confirm="removeAccount"
        />
        <base-card v-if="isLoaded" width="50rem" padding="1.5rem">
        <span><u><b>User profile data</b></u></span>
            <form @submit.prevent="handleSubmit">
                <div class="text-img-separator">
                    <div class="data mt-3">
                        <div class="field-group">
                            <div class="field">
                                <label for="first-name">First Name:</label>
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
                                First name must be between {{ FIRST_NAME_LENGTH_MIN }} and {{ FIRST_NAME_LENGTH_MAX }} characters
                            </p>
                        </div>

                        <div class="field-group">
                            <div class="field">
                                <label for="last-name">Last Name:</label>
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
                                Last name must be between {{ LAST_NAME_LENGTH_MIN }} and {{ LAST_NAME_LENGTH_MAX }} characters
                            </p>
                        </div>

                        <div class="field-group">
                            <div class="field">
                                <label for="email">E-mail:</label>
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
                                Invalid e-mail address
                            </p>
                        </div>

                        <div class="field-group">
                            <div class="field">
                                <label for="phone">Phone:</label>
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
                                Phone must be a valid phone number
                            </p>
                        </div>

                        <div v-if="userStore.isAdmin" class="field-group">
                            <div class="field">
                                <label for="role">Role:</label>
                                <select
                                    id="role"
                                    name="role"
                                    class="form-control"
                                    v-model="role.value"
                                    :disabled="!canEditRole"
                                    :class="{ 'is-invalid': !role.isValid }"
                                    @change="clearValidity('role')"
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
                            <p v-if="!role.isValid" class="text-danger field-error">
                                Role is required
                            </p>
                        </div>

                        <hr>

                        <div v-if="canEditProfile" class="password-section">
                            <span><u><b>Change password</b></u></span>
                            <div class="field-group">
                                <div class="field">
                                    <label for="old-password">Old password:</label>
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
                                    Old password is required
                                </p>
                                <p v-if="!oldPassword.match" class="text-danger field-error">
                                    Old password do not match. Please try again!
                                </p>
                            </div>
                            <div class="field-group">
                                <div class="field">
                                    <label for="new-password">New password:</label>
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
                                    Password must be at least {{ PASSWORD_LENGTH_MIN }} characters long
                                </p>
                            </div>
                            <div class="field-group">
                                <div class="field">
                                    <label for="confirm-new-password">Confirm New password:</label>
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
                                    Passwords do not match
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
                            <label for="image">Upload new image</label>
                            <input
                                ref="imageInput"
                                type="file"
                                class="form-control"
                                id="image"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                :class="{ 'is-invalid': !image.isValid }"
                                @change="updateImage"
                            >
                            <p v-if="!image.isValid" class="text-danger">{{ image.error }}</p>
                            <div v-if="hasPendingImage" class="restore-btn">
                                <ConfirmationButton
                                    type="button"
                                    label="Restore Image"
                                    @click="restoreImage"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div v-if="canEditProfile || canEditRole" class="save-btn">
                    <ConfirmationButton
                    type="submit"
                    label="Save changes"
                    :disabled="!canSave"
                    />
                </div>
                <a
                    v-if="isSelf || isAdmin"
                    href="#"
                    @click.prevent="openRemoveAccountModal"
                >
                    Remove account
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
import { getProfileImageUrl } from '@/config/r2'
import { EMAIL_VALIDATION_PATTERN } from '@/utils/validation'
import { validateProfileImageFile } from '@/utils/imageFile'
import defaultProfileImage from '@/assets/icons/user.png'

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
    imageReference: '',
    image: null,
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
const role = reactive({ value: '', isValid: true })
const oldPassword = reactive({ value: '', isValid: true, match: true })
const newPassword = reactive({ value: '', isValid: true })
const passwordConfirm = reactive({ value: '', isValid: true })
const image = reactive({ value: null, isValid: true, error: '' })

const fields = {
    firstName,
    lastName,
    email,
    phone,
    role,
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

const profileImageUrl = computed(() => {
    if (profileMeta.image) {
        return profileMeta.image
    }
    return getProfileImageUrl(profileMeta.imageReference || profileMeta.id)
})

const displayImage = computed(() => {
    if (previewUrl.value) {
        return previewUrl.value
    }
    if (imageFailed.value || !profileImageUrl.value) {
        return defaultProfileImage
    }
    return profileImageUrl.value
})

function fillForm(userData) {
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
    profileMeta.imageReference = userData.imageReference || ''
    profileMeta.image = userData.image || getProfileImageUrl(userData.imageReference || userData.id)
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
    const removed = await userStore.removeAccount(accountId, profileMeta.imageReference)
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

function validateRoleField() {
    if (!role.value || !Object.values(ROLES).includes(role.value)) {
        role.isValid = false
        return false
    }
    return true
}

/**
 * NONE — no new file selected
 * ADDED — new file, user had no imageReference yet
 * CHANGED — new file replacing an existing imageReference
 */
function resolveImageChange() {
    if (!canEditProfile.value || !image.value) {
        return PROFILE_IMAGE_CHANGE.NONE
    }
    return profileMeta.imageReference
        ? PROFILE_IMAGE_CHANGE.CHANGED
        : PROFILE_IMAGE_CHANGE.ADDED
}

const handleSubmit = async () => {
    let formIsValid = true

    if (canEditProfile.value) {
        formIsValid = validateProfileFields() && formIsValid
    }
    if (canEditRole.value) {
        formIsValid = validateRoleField() && formIsValid
    }
    if (!formIsValid) {
        return
    }

    const imageChange = resolveImageChange()
    const imageFile = imageChange === PROFILE_IMAGE_CHANGE.NONE ? null : image.value
    const previousImageReference = profileMeta.imageReference || null

    const formData = {}
    if (canEditProfile.value) {
        formData.id = accountId
        formData.firstName = firstName.value
        formData.lastName = lastName.value
        formData.email = email.value
        formData.phone = phone.value
        formData.imageUpdated = imageChange !== PROFILE_IMAGE_CHANGE.NONE
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
        {
            imageFile,
            imageChange,
            previousImageReference,
        },
    )

    if (updatedUser?.error) {
        oldPassword.match = false
        return updatedUser
    }

    if (updatedUser && canEditProfile.value) {
        fillForm({
            ...updatedUser,
            image: updatedUser.image
                || getProfileImageUrl(updatedUser.imageReference || updatedUser.id),
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
        fillForm({
            id: userStore.id,
            firstName: userStore.firstName,
            lastName: userStore.lastName,
            email: userStore.email,
            phone: userStore.phone,
            role: userStore.role,
            imageReference: userStore.imageReference,
            image: userStore.image || getProfileImageUrl(userStore.imageReference || userStore.id),
        })
        return
    }
    const userData = await userStore.fetchUserById(id)
    if (userData) {
        fillForm({
            ...userData,
            image: userData.image || getProfileImageUrl(userData.imageReference || userData.id),
        })
    }
})

watch(profileImageUrl, () => {
    imageFailed.value = false
})

onUnmounted(() => {
    revokePreviewUrl()
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
.restore-btn {
    margin-top: 0.5rem;
    display: flex;
    justify-content: center;
}
a {
    color: #dc3545;
}
</style>
