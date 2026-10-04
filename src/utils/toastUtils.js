import { useToast as usePrimeVueToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

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
