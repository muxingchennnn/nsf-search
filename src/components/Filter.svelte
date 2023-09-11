<script>
    export let searchResults
    export let programFilter

    // Create an array of all programs (not unique)
    $: allPrograms = searchResults.map((result) => result.program.split(', ')).flat();

    // Create an object with the counts of each program
    $: programCounts = allPrograms.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});

    // Create an array of objects with the unique program values and their counts
    $: programDistribution = Object.keys(programCounts).map(program => ({
        program,
        count: programCounts[program],
    }));

    $: console.log(programDistribution)
</script>

<h4>Programs</h4>
<div class="program-list">
    {#each programDistribution.toSorted((a, b) => b.count - a.count) as program}
        <label>
            <input 
                type="checkbox"
                name="programs"
                value={program.program} 
                bind:group={programFilter}
            />
            &nbsp;{program.program} ({program.count})
        </label>
    {/each}
</div>
<span>scroll to see more &darr;</span>


<style>

.program-list {
    max-height: 75vh;
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