<script>
    import {onMount} from "svelte"
    export let searchResults
    export let finalResults
    export let filteredResults  
    export let programFilter

    // Generate program filter list
    // Create an array of all programs (not unique)
    $: allPrograms = filteredResults.map((result) => result.programs).flat();
    // Create an object with the counts of each program
    $: console.log(allPrograms.length)
    $: programCounts = allPrograms.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});
    $: console.log(programCounts)
    // Create an array of objects with the unique program values and their counts
    $: programDistribution = Object.keys(programCounts).map(program => ({
        program,
        count: programCounts[program],
    }));

    //   $: console.log(programDistribution)

    $: programOrdering = programDistribution.sort((a, b) => b.count - a.count)

    // function updateProgram(){
    // console.log("updates!")
    // filteredResults = finalResults.filter(result => 
    //     (programFilter.length === 0 || programFilter.some(program => result.programs.includes(program)))
    // );
    // }

    // console.log(list.length)


</script>

{#each programOrdering as program}
    <label>
        <input 
            type="checkbox"
            name="program"
            value={program.program} 
            bind:group={programFilter}
    
        />
        &nbsp;{program.program} ({program.count})
    </label>
{/each}