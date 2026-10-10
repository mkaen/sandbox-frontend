import { useToast as usePrimeVueToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { i18n as appI18n } from '@/config/i18n';

let appToast = null;

export function registerAppToast(toast) {
    appToast = toast ?? null;
}

function resolveApiErrorDetail(notificationCode) {
    if (typeof notificationCode === 'string' && notificationCode) {
        const key = `ERRORS.${notificationCode}`;
        if (appI18n.global.te(key)) {
            const message = appI18n.global.t(key);
            if (typeof message === 'string') {
                return message;
            }
        }
    }

    return appI18n.global.t('ERRORS.GENERAL');
}

export function showApiErrorToast(notificationCode) {
    if (!appToast) {
        return;
    }

    appToast.add({
        severity: 'error',
        summary: appI18n.global.t('ERROR'),
        detail: resolveApiErrorDetail(notificationCode),
        life: 5000,
        closable: false,
    });
}

export const useToast = (methods, i18n) => {
    const toast = methods ?? usePrimeVueToast();
    const { t } = i18n ?? useI18n();

    return {
        makeErrorToast: (title) => {
            toast.add({
                severity: 'error',
                summary: t('ERROR'),
                detail: title,
                life: 5000,
                closable: false,
            });
        },
        makeWarningToast: (title) => {
            toast.add({
                severity: 'warn',
                summary: t('WARNING'),
                detail: title,
                life: 5000,
                closable: false,
            })
        },
        makeSuccessToast: (title) => {
            toast.add({
                severity: 'success',
                summary: t('OPERATION_SUCCESSFUL'),
                detail: title,
                life: 5000,
                closable: false,
            })
        }
    };
};
