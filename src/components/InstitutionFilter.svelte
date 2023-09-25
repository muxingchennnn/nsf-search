<script>
  import { isLoading, searchResults, finalResults, selectedInstitution } from "./stores"
  import { nanoid } from 'nanoid'
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte"


  const countInstitutions = (results) => {
    return results.reduce((acc, result) => {
      const { institution } = result;
      acc[institution] = (acc[institution] || 0) + 1;
      return acc;
    }, {});
  };

  let institutionOrder = null;

  $: if ($searchResults) {
    const institutionCounts = countInstitutions($searchResults);

    institutionOrder = Object.keys(institutionCounts)
      .map(institution => ({
        institution,
        count: institutionCounts[institution]
      }))
      .sort((a, b) => b.count - a.count)
      .map(({ institution }) => institution);
  }


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

  $: institutionDistribution = calculateInstitutionDistribution($finalResults);
  $: console.log({ institutionDistribution });
  $: console.log($selectedInstitution)
  
  
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