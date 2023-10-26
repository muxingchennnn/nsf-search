<script>
  import { isLoading, searchResults, finalResults, selectedProgram, 
  selectedInstitution, selectedInvestigator, 
  programOrderInitialized, institutionOrderInitialized, investigatorOrderInitialized, institutionOrder } from "./stores"
  import { nanoid } from 'nanoid'
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte"
  import VirtualList from '@sveltejs/svelte-virtual-list';


  function handleInitialization(){
    $programOrderInitialized = false
    $investigatorOrderInitialized = false
  }

  $: console.log($programOrderInitialized)

  onMount(()=>{
    console.log($institutionOrder)
  })

  const countInstitutions = (results) => {
    return results.reduce((acc, result) => {
      const { institution } = result;
      acc[institution] = (acc[institution] || 0) + 1;
      return acc;
    }, {});
  };

  let institutionDistribution = []

  $: if ($finalResults.length > 0 && $selectedProgram.length === 0 && $selectedInvestigator.length === 0) {
      const institutionCounts = countInstitutions($searchResults);

      $institutionOrder = Object.keys(institutionCounts)
        .map(institution => ({
          institution,
          count: institutionCounts[institution]
        }))
        .sort((a, b) => b.count - a.count)
        .map(({ institution }) => institution);

      $institutionOrderInitialized = true;
    } else if ($finalResults.length > 0 && ($selectedProgram || $selectedInvestigator) && !$institutionOrderInitialized) {
      const institutionCounts = countInstitutions($finalResults);

      $institutionOrder = Object.keys(institutionCounts)
        .map(institution => ({
          institution,
          count: institutionCounts[institution]
        }))
        .sort((a, b) => b.count - a.count)
        .map(({ institution }) => institution);

      $institutionOrderInitialized = true;
    } 
    
  const calculateInstitutionDistribution = (results) => {
    const institutionCounts = countInstitutions(results);
    
    return $institutionOrder.map(institution => ({
      institution,
      count: institutionCounts[institution] || 0
    }));
  };


  $: if ($finalResults.length > 0) {
      institutionDistribution = calculateInstitutionDistribution($finalResults)}
  
  $: console.log($institutionOrder)
  
  
</script>

<div class='container'>
  <VirtualList items={institutionDistribution} let:item>
    <label>
      <input 
          type="checkbox"
          name="investigator"
          value={item.institution} 
          bind:group={$selectedInstitution}
          on:click={handleInitialization}
          
      />
      &nbsp;{item.institution}
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