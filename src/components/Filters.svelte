<script>
    import ProgramFilter from "./ProgramFilter.svelte";
    import InstitutionFilter from "./InstitutionFilter.svelte";
    import InvestigatorFilter from "./InvestigatorFilter.svelte";
    import { searchResults, activeTab, isLoading } from "./stores"
    import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte"

    // function handleClick(){
    //     $activeTab = 'investigator'
    //     console.log("Filters trigger loading")
    //     $isLoading = true
        
    // }

    
</script>

<!-- Tab Headers -->
<div class="tabs">
    <div class="tab {$activeTab === 'program' ? 'active' : ''}" on:click={() => $activeTab = 'program'}>Program</div>
    <div class="tab {$activeTab === 'institution' ? 'active' : ''}" on:click={() => $activeTab = 'institution'}>Institution</div>
    <div class="tab {$activeTab === 'investigator' ? 'active' : ''}" on:click={() => $activeTab = 'investigator'}>Investigator</div>
</div>

<!-- Tab Content -->
<div class="filter-list">
{#if $activeTab === 'program'}
    <ProgramFilter />
{:else if $activeTab === 'institution'}
    <InstitutionFilter />
{:else if $activeTab === 'investigator'}
    <InvestigatorFilter />
{/if}
</div>
<span class="reminder">scroll to see more &darr;</span>


<style>

.tabs {
    display: flex;
    cursor: pointer;
    /* margin-bottom: 1rem; */
    /* border-bottom: 1px solid #E4E4E7 */
    color: #424242;
}

.tab {
    padding: 10px 20px;
    border: 1px solid #D1D1D6;
    transition: background-color 0.2s;
    font-family: 'Sohne', sans-serif;
    font-size: .8rem;
}

.tab.active {
    background-color: #D1E9FF;
}

.filter-list {
    max-height: 50vh;
    margin-top: 1rem;
    display:flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow: scroll;
    gap:0.2rem;

    font-family: 'Sohne', sans-serif;
    color: #424242;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
}

.reminder{
    padding-top: 0.5rem;
    /* border-top: 1px solid #E4E4E7 */
}

</style>