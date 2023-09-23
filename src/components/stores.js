import { writable } from 'svelte/store';

export let isLoading = writable(true);
export let selectedProgram = writable([]);
export let selectedInstitution = writable([]);
export let selectedInvestigator = writable([]);
export let searchResults = writable([]);
