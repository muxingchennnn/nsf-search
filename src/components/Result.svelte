<script>
    export let awardNumber
    export let programs
    export let investigator
    export let title
    export let abstract
    export let date
    export let amount
    import { selectedProgram } from "./stores"
    import { nanoid } from 'nanoid'

    $: programList = programs
    
</script>



<div class="result">
    <a class="title" href={`https://www.nsf.gov/awardsearch/showAward?AWD_ID=${awardNumber}&HistoricalAwards=false`} target="_blank" rel="noopener noreferrer">{@html title}</a>
    <!-- <p class="title">{@html title}</p> -->
    <div class="subline">
        <span>{date}</span>
        <span>·</span>
        <span>{investigator}</span>
        <span>·</span>
        {#if !programList.includes('')}
            {#each programList as program (nanoid())}
                {#if $selectedProgram.includes(program)}
                    <span class="program program-selected">{program}</span>
                    <span>·</span>
                {:else}
                    <span class="program">{program}</span>
                    <span>·</span>
                {/if}
            {/each}
        {/if}
        <span>{amount}</span>
    </div>
    <div class="abstract">
        <span class="abstract-content">{@html abstract}</span>
        <input class="expand-btn" type="checkbox">
    </div>
</div>

<style>
.result {
    max-width: 800px;
    min-width: 400px;
    /* border: 1px solid #000; */
}

.title {
    color: var(--blue-700, #175CD3);
    font-family: 'Merriweather', serif;;
    font-size: 1rem;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */

    margin-bottom: 0.2rem;
    display: block;
    text-decoration: none;
}

.subline {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;

    color: var(--grey-500, #70707B);
    font-family: 'Roboto', sans-serif;
    font-size: 0.8rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 18px */

    margin-bottom: 0.4rem;
}

.abstract {
    display: flex;
    /* flex-direction: column; */
    align-items: baseline;
    gap: 1rem;
}

.abstract-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3; /* limits the content to 3 lines */
    overflow: hidden;

    color: #424242;
    font-family: 'Roboto', sans-serif;;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 24px */
}

.expand-btn {
    appearance: none;
    /* border: 1px solid #70707B; */
    /* padding: 0.2rem; */
    /* border-radius: 0.2rem; */
    cursor: pointer;
    font-family: Inter;
    font-size: 0.7rem;
    font-style: normal;
    font-weight: 400;
    /* color: var(--blue-700, #175CD3); */
    color: var(--grey-500, #70707B);
    line-height: 1.2rem;
    align-self: flex-end;
}

.expand-btn:hover {
    background-color: var(--grey-200, #E4E4E7);
}

.expand-btn::before {
    content: "Expand"
}

.expand-btn:checked::before {
    content: "Collapse"
}

.abstract-content:has(+ .expand-btn:checked){
    /* set the line height limit to a extreme large number */
    -webkit-line-clamp: 9999;
}

.program {
    padding: 0.1rem 0.4rem;
    background-color: #F4F4F5;
    border-radius: 0.2rem;
}

.program-selected {
    background-color: rgba(250, 197, 21, 0.2)
}
</style>
