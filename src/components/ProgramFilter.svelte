<script>
  export let searchResults
  export let finalResults
  export let filteredResults  
  export let programFilter

  let start = Date.now();
  // Generate program filter list
  // Create an array of all programs (not unique)
  $: allPrograms = filteredResults.map((result) => result.programs).flat();
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

//   $: console.log(programDistribution)

  let end = Date.now();
  $: console.log(`program time taken: ${end - start} milliseconds`);
  
</script>

{#each programDistribution.toSorted((a, b) => b.count - a.count) as program}
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