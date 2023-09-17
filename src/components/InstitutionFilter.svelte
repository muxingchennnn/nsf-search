<script>
  export let searchResults
  export let finalResults
  export let filteredResults
  export let institutionFilter


  let start = Date.now();
  // Generate program filter list
  const uniqueInstitution = [...new Set(searchResults.map((result) => result.institution))];
  // $: console.log({uniqueInstitution})
 
  // Create an object with the counts of each institution
  $: institutionCounts = filteredResults
      .map((result) => result.institution)
      .reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});
  // $: console.log({institutionCounts})

  $: institutionDistribution = uniqueInstitution
      .map(key => ({
        institution: key,
        count: institutionCounts[key] || 0
      }))
      .sort((a, b) => b.count - a.count);
  
  let end = Date.now();
  $: console.log(`institution time taken: ${end - start} milliseconds`);
 
  
</script>

{#each institutionDistribution as institution}
    <label>
        <input 
            type="checkbox"
            name="institution"
            value={institution.institution} 
            bind:group={institutionFilter}
        />
        &nbsp;{institution.institution} ({institution.count})
    </label>
{/each}