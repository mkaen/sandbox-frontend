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
        role: null,
        isAuthenticated: false
    }),
    actions: {
        setUser(userData) {
            this.id = userData.id
            this.firstName = userData.firstName
            this.lastName = userData.lastName
            this.email = userData.email
            this.phone = userData.phone
            this.imageReference = userData.imageReference
            if (userData.role && Object.values(ROLES).includes(userData.role)) {
                this.role = userData.role
            } else {
                this.role = null
            }
            this.isAuthenticated = true
        },
        setImage(image) {
            this.image = image
        },
        logout() {
            this.id = ''
            this.firstName = ''
            this.lastName = ''
            this.email = ''
            this.phone = ''
            this.imageReference = ''
            this.image = null
            this.role = null
            this.isAuthenticated = false
        },
    },
    getters: {
        isAdmin: (state) => state.role === ROLES.ADMIN,
    }
})