import { defineStore } from 'pinia'
import { ROLES } from '@/constants/constants'

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
        setUser(userData) {
            this.id = userData.id
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
    },
    getters: {
        isAuthenticated: (state) => Boolean(state.id),
        isAdmin: (state) => state.role && state.role === ROLES.ADMIN,
    },
})
