import { R2_UPLOAD_KEY, R2_WORKER_URL } from '@/config/env'
import { R2_FOLDER_LOCATION } from '@/constants/constants'
import { validateProfileImageFile } from '@/utils/imageFile'

function buildObjectKey(folder, imageReference) {
    return `${folder}/${imageReference}`
}

function getObjectUrl(key) {
    if (!key || !R2_WORKER_URL) {
        return null
    }
    return `${R2_WORKER_URL}/${key}`
}

export function getProfileImageUrl(imageReference) {
    if (!imageReference) {
        return null
    }
    return getObjectUrl(
        buildObjectKey(R2_FOLDER_LOCATION.PROFILE_IMAGES, imageReference),
    )
}

export async function uploadProfileImage(imageReference, file) {
    if (!R2_WORKER_URL) {
        throw new Error('VITE_R2_WORKER_URL is not configured')
    }
    if (!R2_UPLOAD_KEY) {
        throw new Error('VITE_R2_UPLOAD_KEY is not configured')
    }
    if (!imageReference || !file) {
        throw new Error('imageReference and file are required')
    }

    const validation = await validateProfileImageFile(file)
    if (!validation.ok) {
        throw new Error(validation.error)
    }

    const key = buildObjectKey(R2_FOLDER_LOCATION.PROFILE_IMAGES, imageReference)
    const response = await fetch(`${R2_WORKER_URL}/${key}`, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type || 'application/octet-stream',
            'X-Upload-Key': R2_UPLOAD_KEY,
        },
        body: file,
    })

    if (!response.ok) {
        const detail = await response.text().catch(() => '')
        throw new Error(`R2 upload failed (${response.status}): ${detail}`)
    }

    return getProfileImageUrl(imageReference)
}
