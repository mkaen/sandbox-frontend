export const ROLES = {
    ADMIN: 'admin',
    USER: 'user'
}

export const FIRST_NAME_LENGTH_MIN = 2
export const FIRST_NAME_LENGTH_MAX = 25

export const LAST_NAME_LENGTH_MIN = 2
export const LAST_NAME_LENGTH_MAX = 25

export const PASSWORD_LENGTH_MIN = 6

export const PHONE_LENGTH_MIN = 7
export const PHONE_LENGTH_MAX = 15

export const SESSION_CONFIG = {
    sessionLengthMinutes: Number(import.meta.env.VITE_SESSION_LENGTH_MIN) || 15,
    sessionReminderBeforeEndMinutes: Number(import.meta.env.VITE_SESSION_LENGTH_REMINDER_BEFORE_END_MIN) || 1
}

export const R2_FOLDER_LOCATION = {
    PROFILE_IMAGES: 'profile_images',
}