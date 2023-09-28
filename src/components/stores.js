import { writable } from 'svelte/store';

export let isLoading = writable(true);
export let activeTab = writable('program');
export let selectedProgram = writable([]);
export let selectedInstitution = writable([]);
export let selectedInvestigator = writable([]);
export let searchResults = writable([]);
export let finalResults = writable([]);
export let programOrderInitialized = writable(false);
export let institutionOrderInitialized = writable(false);
export let investigatorOrderInitialized = writable(false);
export let programOrder = writable([]);
export let institutionOrder = writable([]);
export let investigatorOrder = writable([]);
