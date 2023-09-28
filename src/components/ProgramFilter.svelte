<script>
    import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte"
    import { isLoading, searchResults, finalResults, 
    selectedProgram, selectedInstitution, selectedInvestigator, 
    programOrderInitialized, institutionOrderInitialized, investigatorOrderInitialized, 
    programOrder} from "./stores"
    import { nanoid } from 'nanoid'

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
    let programDistribution =[];
    
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

    const calculateProgramDistribution = (results) => {
      const programCounts = countPrograms(results);

      return $programOrder.map(program => ({
        program,
        count: programCounts[program] || 0
      }));
    };

    $: if ($finalResults.length > 0) {
      programDistribution = calculateProgramDistribution($finalResults);
    }

    
</script>

{#each programDistribution as program (nanoid())}
    <label>
        <input 
            type="checkbox"
            name="program"
            value={program.program} 
            bind:group={$selectedProgram}
            on:click={handleInitialization}
    
        />
        &nbsp;{program.program} <span>({program.count})</span>
    </label>
{/each}

<style>

span {
  font-family: 'Roboto Condense', sans-serif;
  font-size: .8rem;
  font-weight: 400;
  font-style: italic;
}

</style>