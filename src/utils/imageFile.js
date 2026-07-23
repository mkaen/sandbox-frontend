const ALLOWED_IMAGE_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
])

const HEIC_BRANDS = new Set([
    'heic',
    'heix',
    'hevc',
    'hevx',
    'heim',
    'heis',
    'hevm',
    'hevs',
    'mif1',
    'msf1',
])

function bytesToAscii(bytes, start, length) {
    return String.fromCodePoint(...bytes.slice(start, start + length))
}

function looksLikeHeic(bytes) {
    if (bytes.length < 12) {
        return false
    }
    // ISO BMFF: [size][ftyp][brand]
    if (bytesToAscii(bytes, 4, 4) !== 'ftyp') {
        return false
    }
    const brand = bytesToAscii(bytes, 8, 4).toLowerCase()
    return HEIC_BRANDS.has(brand)
}

function matchesDeclaredType(bytes, mimeType) {
    if (mimeType === 'image/jpeg') {
        return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    }
    if (mimeType === 'image/png') {
        return (
            bytes[0] === 0x89
            && bytes[1] === 0x50
            && bytes[2] === 0x4e
            && bytes[3] === 0x47
        )
    }
    if (mimeType === 'image/gif') {
        const header = bytesToAscii(bytes, 0, 4)
        return header === 'GIF8'
    }
    if (mimeType === 'image/webp') {
        return (
            bytesToAscii(bytes, 0, 4) === 'RIFF'
            && bytesToAscii(bytes, 8, 4) === 'WEBP'
        )
    }
    return false
}

export function isHeicByNameOrType(file) {
    const type = (file?.type || '').toLowerCase()
    const name = (file?.name || '').toLowerCase()
    return (
        type === 'image/heic'
        || type === 'image/heif'
        || name.endsWith('.heic')
        || name.endsWith('.heif')
    )
}

/**
 * Validate browser-displayable image. Rejects HEIC even if renamed to .jpg.
 * @returns {Promise<{ ok: true } | { ok: false, error: string }>}
 */
export async function validateProfileImageFile(file) {
    if (!file) {
        return { ok: false, error: 'No image selected' }
    }

    if (isHeicByNameOrType(file)) {
        return {
            ok: false,
            error: 'HEIC/HEIF images are not supported. Please use JPEG, PNG, WebP, or GIF',
        }
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return {
            ok: false,
            error: 'File type must be JPEG, PNG, WebP, or GIF',
        }
    }

    if (file.size > 1024 * 1024 * 5) {
        return { ok: false, error: 'Image must be less than 5MB' }
    }

    const header = new Uint8Array(await file.slice(0, 16).arrayBuffer())

    if (looksLikeHeic(header)) {
        return {
            ok: false,
            error: 'HEIC/HEIF images are not supported. Please use JPEG, PNG, WebP, or GIF',
        }
    }

    if (!matchesDeclaredType(header, file.type)) {
        return {
            ok: false,
            error: 'File content does not match a supported image type (JPEG, PNG, WebP, or GIF)',
        }
    }

    return { ok: true }
}
