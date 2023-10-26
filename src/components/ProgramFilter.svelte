<script>
    import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte"
    import { isLoading, searchResults, finalResults, 
    selectedProgram, selectedInstitution, selectedInvestigator, 
    programOrderInitialized, institutionOrderInitialized, investigatorOrderInitialized, 
    programOrder} from "./stores"
    import { nanoid } from 'nanoid'
    import VirtualList from '@sveltejs/svelte-virtual-list';
    
    function handleInitialization() {
      $institutionOrderInitialized = false
      $investigatorOrderInitialized = false
    }

    const countPrograms = (results) => {
      const allPrograms = results.map((result) => result.programs).flat();
      // console.log(allPrograms.length);

      return allPrograms.reduce((acc, program) => {
        acc[program] = (acc[program] || 0) + 1;
        return acc;
      }, {});
    };

    // let programOrder = [];
    // let programDistribution =[];

    $: console.log($searchResults)
    
    $: if ($finalResults.length > 0 && $selectedInstitution.length === 0 && $selectedInvestigator.length === 0) {
      const programCounts = countPrograms($searchResults);

      $programOrder = Object.keys(programCounts)
        .map(program => ({
          program,
          count: programCounts[program]
        }))
        .sort((a, b) => b.count - a.count)
        .map(({ program }) => program);

      $programOrderInitialized = true;
    } else if ($finalResults.length > 0 && ($selectedInstitution.length > 0 || $selectedInvestigator.length > 0) && !$programOrderInitialized) {
      const programCounts = countPrograms($finalResults);

      $programOrder = Object.keys(programCounts)
        .map(program => ({
          program,
          count: programCounts[program]
        }))
        .sort((a, b) => b.count - a.count)
        .map(({ program }) => program);

      $programOrderInitialized = true;
    }

    $: console.log($programOrder)
    const calculateProgramDistribution = (results) => {
      const programCounts = countPrograms(results);
      
      return $programOrder.map(program => ({
        program,
        count: programCounts[program] || 0
      }));
    };

    $: console.log($finalResults)
    $: programDistribution = calculateProgramDistribution($finalResults);
    $: console.log(programDistribution)

    
</script>

<div class='container'>
  <VirtualList items={programDistribution} let:item>
    <label>
      <input 
          type="checkbox"
          name="investigator"
          value={item.program} 
          bind:group={$selectedProgram}
          on:click={handleInitialization}
          
      />
      &nbsp;{item.program}
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