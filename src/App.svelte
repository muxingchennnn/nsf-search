<script>
    import Header from "./components/Header.svelte";
    import Result from "./components/Result.svelte";
    import * as d3 from 'd3';
    import moment from 'moment';
    import { paginate, LightPaginationNav } from 'svelte-paginate'
    // import {onMount} from "svelte"
    import { removeStopwords } from 'stopword'

    
    // let awardsData = []
    // onMount(async()=>{
    //     awardsData = await dataLoading()
    // })

    //  async function dataLoading() {
    //     const awardsData = await d3.csv("src/dataset/sample data.csv", parseData)
    //     return awardsData
    // }

    // parse data
    let awardsData = []
	d3.csv("src/dataset/IIS awards.csv", parseData)
		.then(res => awardsData = res)

    function parseData(d){
        return{
            abstract: d.Abstract,
            awardNumber: d.AwardNumber,
            investigator: d.PrincipalInvestigator,
            program: d['Program(s)'],
            date: moment(d.StartDate, "MM/DD/YY").format('ll'),
            title: d.Title
        }
    }
    $: console.log({awardsData})

    // search/filter results
    let searchTerm = ""
    let searchedResults
    $: console.log({searchTerm})
    $: console.log(searchTerm.toLowerCase().split(' '))

    
    $: if (searchTerm === "") {
        searchedResults = awardsData
    } 
    else {
        // First, split the searchTerm into tokens in an array when it is a long string
        // After that, use removeStopwords() to remove the stop words in that array
        // Lastly. loop through the token array to filter results that include the tokens in title or abstract
        const searchTermProcessed = removeStopwords(searchTerm.toLowerCase().split(' '))
        const resultFiltered = searchTermProcessed.reduce((acc, term)=>{
            const subset = awardsData.filter((result) =>
                    // filter results with the search term in the title or abstract
                    result.title.toLowerCase().includes(term) || 
                    result.abstract.toLowerCase().includes(term) 
            )
            return acc.concat(subset)
        }, [])
        // remove duplicates
        searchedResults = Array.from(new Set(resultFiltered))
    }
    

    // add pagination
    $: items = searchedResults
    $: console.log(items)
    let currentPage = 1
    let pageSize = 10
    $: paginatedItems = paginate({ items, pageSize, currentPage })
    $: console.log(paginatedItems)


</script>

<Header bind:searchTerm/>

<main class="container">
    <div class="results">
        {#if paginatedItems.length}
            {#each paginatedItems as result}
                <Result {...result}/>
            {/each}
        {:else}
            <p>No results about "{searchTerm}"</p>
        {/if}
    </div>
    <div class="charts">
    </div>
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

</style>