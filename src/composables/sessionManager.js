import { SESSION_CONFIG } from '@/constants/constants';
import { ref } from 'vue';
import { formatMinutesToMilliseconds } from '@/utils/formatter';
import { setCorrelationId, clearCorrelationId } from '@/config/api';

const timeout = formatMinutesToMilliseconds(SESSION_CONFIG.sessionLengthMinutes);
const reminderTimerLength = timeout - formatMinutesToMilliseconds(SESSION_CONFIG.sessionReminderBeforeEndMinutes);

let timer = null;
let reminderTimer = null;
let isRunning = false;

export const inactive = ref(false);
export const activateReminder = ref(false);

function clearTimers() {
    clearTimeout(timer);
    clearTimeout(reminderTimer);
    timer = null;
    reminderTimer = null;
}

function addListeners() {
    window.addEventListener('keydown', resetSession);
    window.addEventListener('click', resetSession);
    window.addEventListener('scroll', resetSession);
}

function removeListeners() {
    window.removeEventListener('keydown', resetSession);
    window.removeEventListener('click', resetSession);
    window.removeEventListener('scroll', resetSession);
}

function resetTimers() {
    clearTimers();
    timer = setTimeout(() => {
        inactive.value = true;
        activateReminder.value = false;
        isRunning = false;
        clearTimers();
        removeListeners();
    }, timeout);
    reminderTimer = setTimeout(() => {
        activateReminder.value = true;
        removeListeners();
    }, reminderTimerLength);
}

export function resetSession() {
    if (!isRunning) return;
    inactive.value = false;
    activateReminder.value = false;
    removeListeners();
    addListeners();
    resetTimers();
}

export function startSession() {
    if (isRunning) {
        resetSession();
        return;
    }
    isRunning = true;
    inactive.value = false;
    activateReminder.value = false;
    addListeners();
    resetTimers();
    setCorrelationId();
}

export function dismissReminder() {
    activateReminder.value = false;
    removeListeners();
    clearTimeout(reminderTimer);
    reminderTimer = null;
}

export function stopSession() {
    isRunning = false;
    removeListeners();
    clearTimers();
    activateReminder.value = false;
    inactive.value = false;
    clearCorrelationId();
}
