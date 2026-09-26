import { useUserStore } from '@/features/users/userStore'

export async function validateUserProfileId(to) {
    const userStore = useUserStore()
    const id = String(to.params.id)
    if (userStore.id === id) {
        return true
    }
    const result = await userStore.fetchUserById(id)
    if (result?.notFound) {
        return {
            name: 'not-found',
            params: { notFound: to.fullPath.replace(/^\//, '') },
        }
    }
    return true
}