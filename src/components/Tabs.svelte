<script>
    let activeTab = 'program'; // Default active tab
    let programFilters = [
        { label: 'Program A', checked: false },
        { label: 'Program B', checked: false },
        { label: 'Program C', checked: false },
    ];
    let institutionFilters = [
        { label: 'Institution A', checked: false },
        { label: 'Institution B', checked: false },
        { label: 'Institution C', checked: false },
    ];

    function toggleFilter(list, index) {
        list[index].checked = !list[index].checked;
    }
</script>

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
</style>

<div>
    <!-- Tab Headers -->
    <div class="tabs">
        <div class="tab {activeTab === 'program' ? 'active' : ''}" on:click={() => activeTab = 'program'}>Program</div>
        <div class="tab {activeTab === 'institution' ? 'active' : ''}" on:click={() => activeTab = 'institution'}>Institution</div>
    </div>

    <!-- Tab Content -->
    {#if activeTab === 'program'}
        {#each programFilters as filter, index}
            <label>
                <input type="checkbox" bind:checked={filter.checked} on:change={() => toggleFilter(programFilters, index)} />
                {filter.label}
            </label>
            <br>
        {/each}
    {:else}
        {#each institutionFilters as filter, index}
            <label>
                <input type="checkbox" bind:checked={filter.checked} on:change={() => toggleFilter(institutionFilters, index)} />
                {filter.label}
            </label>
            <br>
        {/each}
    {/if}
</div>
