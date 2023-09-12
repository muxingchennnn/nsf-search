<script>
  export let searchResults
  export let finalResults
  export let institutionFilter

  // Generate program filter list
  const uniqueInstitution = [...new Set(searchResults.map((result) => result.institution))];
  $: console.log({uniqueInstitution})
  // Create an array of all institutions
  // $: allInstitution = finalResults.map((result) => result.institution);
  // $: console.log({allInstitution})
  // Create an object with the counts of each institution
  $: institutionCounts = finalResults
      .map((result) => result.institution)
      .reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});
  $: console.log({institutionCounts})
  // Create an array of objects with the unique institutions and their counts
  // $: institutionDistribution = Object.keys(institutionCounts).map(institution => ({
  //     institution,
  //     count: institutionCounts[institution],
  // }));

  // $: console.log(institutionDistribution)

  let preState
  // $: if (institutionDistribution !== preState){
  //   preState = 
  // }
  $: institutionDistribution = uniqueInstitution
      .map(key => ({
        institution: key,
        count: institutionCounts[key] || 0
      }))
      .sort((a, b) => b.count - a.count);
  
 
  
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