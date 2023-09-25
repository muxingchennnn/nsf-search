<script>
  export let finalResults
  export let filteredResults
  import { searchResults, selectedInstitution } from "./stores"
  import { nanoid } from 'nanoid'


  let institutionOrder = null;

  const countInstitutions = (results) => {
    return results.reduce((acc, result) => {
      const { institution } = result;
      acc[institution] = (acc[institution] || 0) + 1;
      return acc;
    }, {});
  };

  const calculateInstitutionDistribution = (results) => {
    const institutionCounts = countInstitutions(results);

    if (!institutionOrder) {
      institutionOrder = Object.keys(institutionCounts)
        .map(institution => ({
          institution,
          count: institutionCounts[institution]
        }))
        .sort((a, b) => b.count - a.count)
        .map(({ institution }) => institution);
    }
    
    return institutionOrder.map(institution => ({
      institution,
      count: institutionCounts[institution] || 0
    }));
  };

  $: institutionDistribution = calculateInstitutionDistribution(finalResults);
  $: console.log({ institutionDistribution });
  
</script>

{#each institutionDistribution as institution (nanoid())}
    <label>
        <input 
            type="checkbox"
            name="institution"
            value={institution.institution} 
            bind:group={$selectedInstitution}
            
        />
        &nbsp;{institution.institution}
        {#if institution.count > 0}
          ({institution.count })
        {/if}
    </label>
{/each}