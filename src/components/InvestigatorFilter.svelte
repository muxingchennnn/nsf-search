<script>
  export let finalResults
  export let filteredResults
  import { searchResults, selectedInvestigator } from "./stores"
  import { nanoid } from 'nanoid'

  let investigatorOrder = null;

  const countInvestigators = (results) => {
    return results.reduce((acc, result) => {
      const { investigator } = result;
      acc[investigator] = (acc[investigator] || 0) + 1;
      return acc;
    }, {});
  };

  const calculateInvestigatorDistribution = (results) => {
    const investigatorCounts = countInvestigators(results);

    if (!investigatorOrder) {
      investigatorOrder = Object.keys(investigatorCounts)
        .map(investigator => ({
          investigator,
          count: investigatorCounts[investigator]
        }))
        .sort((a, b) => b.count - a.count)
        .map(({ investigator }) => investigator);
    }

    return investigatorOrder.map(investigator => ({
      investigator,
      count: investigatorCounts[investigator] || 0
    }));
  };

  $: investigatorDistribution = calculateInvestigatorDistribution(finalResults);

  
</script>

{#each investigatorDistribution as investigator (nanoid())}
    <label>
        <input 
            type="checkbox"
            name="investigator"
            value={investigator.investigator} 
            bind:group={$selectedInvestigator}
        />
        &nbsp;{investigator.investigator}
        {#if investigator.count > 0}
          ({investigator.count})
        {/if} 
    </label>
{/each}