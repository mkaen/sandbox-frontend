import { defineStore } from 'pinia'
import { PROFILE_IMAGE_CHANGE, ROLES } from '@/constants/constants'
import { userApi } from '@/config/api';
import { getProfileImageUrl, removeProfileImage, uploadProfileImage } from '@/config/r2';


export const useUserStore = defineStore('user', {
    state: () => ({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        imageReference: '',
        image: null,
        role: null
    }),
    actions: {
        async updateUser(userId, userData, imageOptions = {}) {
            try {
                const response = await userApi.put(`/update/${userId}`, userData);
                if (response.status !== 200) {
                    return
                }

                const updatedUser = response.data
                await syncProfileImage(updatedUser, imageOptions)

                if (String(this.id) === String(userId)) {
                    this.setUser(updatedUser)
                    if (updatedUser.image) {
                        this.setImage(updatedUser.image)
                    }
                }

                return updatedUser
            } catch (error) {
                if (error.response?.status === 400) {
                    return {
                        error: true,
                        details: 'Password do not match',
                    }
                }
                console.log(`Error while updating user`, error)
            }
        },
        async fetchUserById(id) {
            const userId = String(id)
            const isSelf = this.id === userId
            if (!isSelf && this.role !== ROLES.ADMIN) {
                return
            }
            try {
                const response = await userApi.get(`/${userId}`)
                if (response.status === 200) {
                    const userData = response.data;
                    if (userData.imageReference) {
                        userData.image = getProfileImageUrl(userData.imageReference);
                    }
                    return userData;
                }
            } catch (error) {
                console.log(`Error while fetching user by id ${userId}`, error)
            }
        },
        setUser(userData) {
            this.id = userData.id != null ? String(userData.id) : ''
            this.firstName = userData.firstName
            this.lastName = userData.lastName
            this.email = userData.email
            this.phone = userData.phone
            this.imageReference = userData.imageReference || null
            if (userData.role && Object.values(ROLES).includes(userData.role)) {
                this.role = userData.role
            } else {
                this.role = null
            }
        },
        setImage(image) {
            this.image = image
        },
        resetUserData() {
            this.id = ''
            this.firstName = ''
            this.lastName = ''
            this.email = ''
            this.phone = ''
            this.imageReference = ''
            this.image = null
            this.role = null
        },
        updateRole(newRole) {
            if (newRole && Object.values(ROLES).includes(newRole) && this.role !== newRole) {
                this.role = newRole
            }
        },
    },
    getters: {
        isAuthenticated: (state) => Boolean(state.id),
        isAdmin: (state) => state.role && state.role === ROLES.ADMIN,
    },
});

async function replacePreviousProfileImage(imageChange, previousImageReference) {
    if (imageChange !== PROFILE_IMAGE_CHANGE.CHANGED || !previousImageReference) {
        return
    }
    try {
        await removeProfileImage(previousImageReference)
    } catch (deleteError) {
        console.error('Profile image delete failed', deleteError)
    }
}

async function syncProfileImage(updatedUser, imageOptions) {
    const {
        imageFile = null,
        imageChange = PROFILE_IMAGE_CHANGE.NONE,
        previousImageReference = null,
    } = imageOptions
    const newImageReference = updatedUser.imageReference

    if (!imageFile || imageChange === PROFILE_IMAGE_CHANGE.NONE || !newImageReference) {
        return
    }

    await replacePreviousProfileImage(imageChange, previousImageReference)

    try {
        updatedUser.image = await uploadProfileImage(newImageReference, imageFile)
    } catch (uploadError) {
        console.error('Profile image upload failed', uploadError)
    }
}
