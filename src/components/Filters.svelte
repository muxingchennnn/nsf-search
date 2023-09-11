<script>
    import ProgramFilter from "./ProgramFilter.svelte";
    import InstitutionFilter from "./InstitutionFilter.svelte";
    export let searchResults
    export let programFilter
    export let institutionFilter

    let activeTab = 'program';
    $: console.log(activeTab)

    
</script>

<!-- Tab Headers -->
<div class="tabs">
    <div class="tab {activeTab === 'program' ? 'active' : ''}" on:click={() => activeTab = 'program'}>Program</div>
    <div class="tab {activeTab === 'institution' ? 'active' : ''}" on:click={() => activeTab = 'institution'}>Institution</div>
</div>

<!-- Tab Content -->
<div class="filter-list">
{#if activeTab === 'program'}
    <ProgramFilter bind:programFilter {searchResults}/>
{:else if activeTab === 'institution'}
    <InstitutionFilter bind:institutionFilter {searchResults}/>
{/if}
</div>
<span class="reminder">scroll to see more &darr;</span>


<style>

.tabs {
    display: flex;
    cursor: pointer;
    margin-bottom: 20px;
}

.tab {
    padding: 10px 20px;
    border: 1px solid #ccc;
    transition: background-color 0.2s;
}

.tab.active {
    background-color: #ddd;
}

.filter-list {
    max-height: 50vh;
    margin-top: 1rem;
    display:flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow: scroll;
    gap:0.2rem;

    font-family: Inter;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
}

</style>