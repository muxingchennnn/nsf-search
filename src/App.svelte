<script>
    import Header from "./components/Header.svelte";
    import Result from "./components/Result.svelte";
    import * as d3 from 'd3';
    import moment from 'moment';
    import { paginate, LightPaginationNav } from 'svelte-paginate'
    import {onMount} from "svelte"
    import { removeStopwords } from 'stopword'

    
    let awardsData = []
    onMount(async()=>{
        awardsData = await dataLoading()
    })

    async function dataLoading() {
        const data = await d3.csv('/dataset/IIS Awards.csv', parseData)
        return data
    }

    function parseData(d){
        return{
            abstract: d.Abstract,
            awardNumber: d.AwardNumber,
            investigator: d.PrincipalInvestigator,
            program: d['Program(s)'],
            date: moment(d.StartDate, "MM/DD/YY").format('ll'),
            title: d.Title,
            amount: d.AwardedAmountToDate,
            institution: d.Organization
        }
    }
    $: console.log({awardsData})

    // Function to highlight keywords in a text
    function highlightKeywords(text, keywords) {
        // Replace each keyword in the text with a highlighted version
        keywords.forEach((keyword) => {
        const regex = new RegExp(`(${keyword})`, "gi");
        text = text.replace(regex, '<span class="highlight" style="background-color: rgba(250, 197, 21, 0.2)">$1</span>');
        });
        return text;
    }

    // search/filter results
    let searchTerm = ""
    let searchResults
    let keywordHighlighted
    $: console.log({searchTerm})
    $: console.log({searchResults})
    $: console.log({keywordHighlighted})

    $: if (searchTerm === "") {
        searchResults = awardsData
    } 
    else {
        // First, split the searchTerm into tokens in an array when it is a long string
        // After that, use removeStopwords() to remove the stop words in that array
        // Lastly. loop through the token array to filter results that include the tokens in title or abstract
        const searchTermProcessed = removeStopwords(searchTerm.toLowerCase().split(' ').filter(term => term !== ""))
        const resultFiltered = searchTermProcessed.reduce((acc, term)=>{
            const subset = awardsData.filter((result) =>
                    // filter results with the search term in the title or abstract
                    result.title.toLowerCase().includes(term) || 
                    result.abstract.toLowerCase().includes(term) 
            )
            return acc.concat(subset)
        }, [])
        // remove duplicates
        searchResults = Array.from(new Set(resultFiltered))

        keywordHighlighted = searchResults.map(result =>{
            result.title = highlightKeywords(result.title, searchTermProcessed)
            result.abstract = highlightKeywords(result.abstract, searchTermProcessed)
    
        })

    }

    // pagination
    $: items = programFilter.length > 0 ? resultsFilteredByProgram : searchResults
    $: console.log(items)
    let currentPage = 1
    let pageSize = 10
    $: paginatedItems = paginate({ items, pageSize, currentPage })
    $: console.log(paginatedItems)

    // program list
    // Create an array of all programs (not unique)
    $: allPrograms = searchResults.map((result) => result.program.split(', ')).flat();

    // Create an object with the counts of each program
    $: programCounts = allPrograms.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});

    // Create an array of objects with the unique program values and their counts
    $: programDistribution = Object.keys(programCounts).map(program => ({
        program,
        count: programCounts[program],
    }));

    $: console.log(programDistribution)

    // program filter
    let programFilter = []
    $: console.log(programFilter)
    $: resultsFilteredByProgram = programFilter.reduce((acc, program)=>{
        const subset = searchResults.filter((result) =>
                result.program === program
        )
        return acc.concat(subset)
    }, [])

    


</script>

<Header bind:searchTerm bind:searchResults/>

<main class="container">
    <section class="results">
        {#if paginatedItems.length}
            {#each paginatedItems as result}
                <Result {...result}/>
            {/each}
        {:else}
            <p>No results about "{searchTerm}"</p>
        {/if}
    </section>
    <section class="charts">
        <h4>Programs</h4>
        <div class="program-list">
            {#each programDistribution.toSorted((a, b) => b.count - a.count) as program}
                <label>
                    <input 
                        type="checkbox"
                        name="programs"
                        value={program.program} 
                        bind:group={programFilter}
                    />
                    &nbsp;{program.program} ({program.count})
                </label>
            {/each}
        </div>
        <span>scroll to see more &darr;</span>
    </section>
</main>

{#if paginatedItems.length > 0}
    <LightPaginationNav
    totalItems="{items.length}"
    pageSize="{pageSize}"
    currentPage="{currentPage}"
    limit="{1}"
    showStepOptions="{true}"
    on:setPage="{(e) => currentPage = e.detail.page}"
    />
{/if}

<style>

.container {
    width:80%;
    margin: auto;
    display:flex;
    justify-content: space-between;
    gap: 4rem;
    margin-bottom: 2rem;
}
.results {
    /* position: relative; */
    /* width:100%; */
    display:flex;
    flex-direction: column;
    gap:1.5rem;
}

.charts {
    /* height:300px; */
    width:30%;
    min-width: 400px;
    /* background-color: lightblue; */
    /* border: 1px solid #000 */
    
}

.program-list {
    max-height: 75vh;
    margin-top: 1rem;
    display:flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow: scroll;
    gap:0.2rem;

    font-family: Inter;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
}

</style>
