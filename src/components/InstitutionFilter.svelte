<script>
  export let finalResults
  export let filteredResults
  import { searchResults, selectedInstitution } from "./stores"


  let start = Date.now();
  // Generate program filter list
  const uniqueInstitution = [...new Set(finalResults.map((result) => result.institution))];
  // $: console.log({uniqueInstitution})
 
  // Create an object with the counts of each institution
  $: institutionCounts = finalResults
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
            bind:group={$selectedInstitution}
        />
        &nbsp;{institution.institution} ({institution.count})
    </label>
{/each}