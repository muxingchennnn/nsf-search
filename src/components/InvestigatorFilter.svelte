<script>
  export let searchResults
  export let finalResults
  export let investigatorFilter

  // Generate program filter list
  const uniqueInvestigator = [...new Set(searchResults.map((result) => result.investigator))];
  
  // Create an array of all institutions
  // $: allInstitution = finalResults.map((result) => result.institution);
  // $: console.log({allInstitution})
  // Create an object with the counts of each institution
  $: investigatorCounts = searchResults
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