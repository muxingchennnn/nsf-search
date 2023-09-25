<script>
    import {onMount} from "svelte"
    export let finalResults
    export let filteredResults  
    import { searchResults, selectedProgram } from "./stores"
    import { nanoid } from 'nanoid'

    let programOrder = null;

    const countPrograms = (results) => {
      const allPrograms = results.map((result) => result.programs).flat();
      console.log(allPrograms.length);

      return allPrograms.reduce((acc, program) => {
        acc[program] = (acc[program] || 0) + 1;
        return acc;
      }, {});
    };

    const calculateProgramDistribution = (results) => {
      const programCounts = countPrograms(results);

      if (!programOrder) {
        programOrder = Object.keys(programCounts)
          .map(program => ({
            program,
            count: programCounts[program]
          }))
          .sort((a, b) => b.count - a.count)
          .map(({ program }) => program);
      }

      console.log(programOrder.length)

      return programOrder.map(program => ({
        program,
        count: programCounts[program] || 0
      }));
    };

    $: programDistribution = calculateProgramDistribution(finalResults);


</script>

{#each programDistribution as program (nanoid())}
    <label>
        <input 
            type="checkbox"
            name="program"
            value={program.program} 
            bind:group={$selectedProgram}
    
        />
        &nbsp;{program.program} ({program.count})
    </label>
{/each}