import { defineStore } from 'pinia'
import { ROLES } from '@/constants/constants'
import { userApi } from '@/config/api'

let managedProfileImageUrl = null

function revokeManagedProfileImageUrl() {
    if (managedProfileImageUrl) {
        URL.revokeObjectURL(managedProfileImageUrl)
        managedProfileImageUrl = null
    }
}

export const useUserStore = defineStore('user', {
    state: () => ({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        image: null,
        role: null,
    }),
    actions: {
        async uploadProfileImage(image, userId) {
            if (!image || !userId) {
                throw new Error('Missing image or user ID. Upload failed')
            }

            const response = await userApi.post(`/upload-profile-image/${userId}`, image, {
                headers: { 'Content-Type': image.type || 'application/octet-stream' },
            })
            if (response.status !== 204) {
                throw new Error(`Profile image upload failed with status ${response.status}`)
            }

            const imageUrl = await this.getProfileImageById(userId)
            if (String(this.id) === String(userId) && imageUrl) {
                this.setImage(imageUrl)
            }
            return imageUrl
        },
        async getProfileImageById(userId) {
            if (!userId) {
                return null
            }

            try {
                const response = await userApi.get(`/image/${userId}`, { responseType: 'blob' })
                if (response.status !== 200 || !response.data?.size) {
                    return null
                }

                revokeManagedProfileImageUrl()
                managedProfileImageUrl = URL.createObjectURL(response.data)
                return managedProfileImageUrl
            } catch (error) {
                if (error.response?.status === 404) {
                    return null
                }
                console.error('Profile image fetch failed', error)
                return null
            }
        },
        async loadProfileImage(userId) {
            const imageUrl = await this.getProfileImageById(userId)
            if (String(this.id) === String(userId)) {
                this.setImage(imageUrl)
            }
            return imageUrl
        },
        async removeAccount(userId) {
            try {
                const response = await userApi.delete(`/remove/${userId}`)
                return response.status === 200
            } catch (error) {
                console.error('Error while removing account', error)
                return false
            }
        },
        async updateUser(userId, userData, imageOptions = {}) {
            try {
                const response = await userApi.put(`/update/${userId}`, userData)
                if (response.status !== 200) {
                    return
                }

                const updatedUser = response.data
                const { imageFile = null } = imageOptions
                let imageUrl = null

                if (imageFile) {
                    imageUrl = await this.uploadProfileImage(imageFile, userId)
                }

                if (String(this.id) === String(userId)) {
                    this.setUser(updatedUser)
                    if (imageUrl) {
                        this.setImage(imageUrl)
                    }
                }

                return { ...updatedUser, image: imageUrl || (String(this.id) === String(userId) ? this.image : null) }
            } catch (error) {
                if (error.response?.status === 400) {
                    return {
                        error: true,
                        details: 'Password do not match',
                    }
                }
                console.log('Error while updating user', error)
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
                    const userData = response.data
                    userData.image = await this.getProfileImageById(userData.id)
                    return userData
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
            this.image = null
            this.role = null
            revokeManagedProfileImageUrl()
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
})
