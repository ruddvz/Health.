import { writable } from 'svelte/store';
import type { Plan } from '$lib/types/plan';

export const plan = writable<Plan | null>(null);
