<script>
  export let searchResults
  export let institutionFilter

  // Generate program filter list
  // Create an array of all institutions
  $: allInstitution = searchResults.map((result) => result.institution);
  $: console.log(allInstitution)
  // Create an object with the counts of each institution
  $: institutionCounts = allInstitution.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
  }, {});
  // Create an array of objects with the unique institutions and their counts
  $: institutionDistribution = Object.keys(institutionCounts).map(institution => ({
      institution,
      count: institutionCounts[institution],
  }));
  $: console.log(institutionDistribution)
  
</script>

{#each institutionDistribution.toSorted((a, b) => b.count - a.count) as institution}
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