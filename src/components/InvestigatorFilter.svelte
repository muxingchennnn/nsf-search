<script>
  export let searchResults
  export let finalResults
  export let filteredResults
  export let investigatorFilter

  let start = Date.now();
  // Generate program filter list
  const uniqueInvestigator = [...new Set(searchResults.map((result) => result.investigator))];
  console.log(uniqueInvestigator.length)
  
  // Create an array of all institutions
  // $: allInstitution = finalResults.map((result) => result.institution);
  // $: console.log({allInstitution})
  // Create an object with the counts of each institution
  $: investigatorCounts = filteredResults
      .map((result) => result.investigator)
      .reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});

  // Create an array of objects with the unique institutions and their counts
  $: investigatorDistribution = uniqueInvestigator
      .map(key => ({
        investigator: key,
        count: investigatorCounts[key] || 0
      }))
      .sort((a, b) => b.count - a.count);
  
 let end = Date.now();
 $: console.log(`investigator time taken: ${end - start} milliseconds`);
  
</script>

{#each investigatorDistribution as investigator}
    <label>
        <input 
            type="checkbox"
            name="investigator"
            value={investigator.investigator} 
            bind:group={investigatorFilter}
        />
        &nbsp;{investigator.investigator} ({investigator.count})
    </label>
{/each}