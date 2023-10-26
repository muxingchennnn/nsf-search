<script>
  import { isLoading, searchResults, finalResults, 
  selectedProgram, selectedInstitution, selectedInvestigator, 
  programOrderInitialized, institutionOrderInitialized, investigatorOrderInitialized, investigatorOrder } from "./stores"
  import { nanoid } from 'nanoid'
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte"
  import VirtualList from '@sveltejs/svelte-virtual-list';

  function handleInitialization() {
    $programOrderInitialized = false
    $institutionOrderInitialized = false
  }

  // function handleLoading() {
  //   console.log("checkbox trigger loading")
  //   $isLoading = true
  // }

  // on:click={handleLoading}

  const countInvestigators = (results) => {
    return results.reduce((acc, result) => {
      const { investigator } = result;
      acc[investigator] = (acc[investigator] || 0) + 1;
      return acc;
    }, {});
  };


  $: if ($finalResults && $selectedProgram.length === 0 && $selectedInstitution.length === 0) {
      const investigatorCounts = countInvestigators($searchResults);

      $investigatorOrder = Object.keys(investigatorCounts)
        .map(investigator => ({
          investigator,
          count: investigatorCounts[investigator]
        }))
        .sort((a, b) => b.count - a.count)
        .map(({ investigator }) => investigator);

      $investigatorOrderInitialized = true;
    } else if ($finalResults && ($selectedProgram.length > 0 || $selectedInstitution.length > 0) && !$investigatorOrderInitialized) {
      const investigatorCounts = countInvestigators($finalResults);

      $investigatorOrder = Object.keys(investigatorCounts)
        .map(investigator => ({
          investigator,
          count: investigatorCounts[investigator]
        }))
        .sort((a, b) => b.count - a.count)
        .map(({ investigator }) => investigator);

      $investigatorOrderInitialized = true;
    }


  const calculateInvestigatorDistribution = (results) => {
    const investigatorCounts = countInvestigators(results);

    return $investigatorOrder.map(investigator => ({
      investigator,
      count: investigatorCounts[investigator] || 0
    }));
  };

  $: investigatorDistribution = calculateInvestigatorDistribution($finalResults);
  $: console.log(investigatorDistribution)

 
</script>


<div class='container'>
  <VirtualList items={investigatorDistribution} let:item>
    <label>
      <input 
          type="checkbox"
          name="investigator"
          value={item.investigator} 
          bind:group={$selectedInvestigator}
          on:click={handleInitialization}
          
      />
      &nbsp;{item.investigator}
      {#if item.count > 0}
        <span>({item.count})</span>
      {/if} 
  </label>
  </VirtualList>
</div>


<style>

.container {
		/* border-top: 1px solid #333; */
		/* border-bottom: 1px solid #333; */
		min-height: 200px;
		height: calc(100vh - 15em);
	}

span {
  font-family: 'Roboto Condense', sans-serif;
  font-size: .8rem;
  font-weight: 400;
  font-style: italic;
}

</style>