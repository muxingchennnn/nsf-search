<script>
    import Header from "./components/Header.svelte";
    import Result from "./components/Result.svelte";
    import Filters from "./components/Filters.svelte";
    import Tabs from "./components/Tabs.svelte";
    import * as d3 from 'd3';
    import moment from 'moment';
    import { paginate, LightPaginationNav } from 'svelte-paginate'
    import {onMount} from "svelte"
    import { removeStopwords } from 'stopword'


    // data loading and parsing    
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

    // search results
    let searchTerm = ""
    let searchResults
    // $: console.log({searchTerm})
    $: console.log({searchResults})

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

        // highlight keywords
        searchResults.map(result =>{
            result.title = highlightKeywords(result.title, searchTermProcessed)
            result.abstract = highlightKeywords(result.abstract, searchTermProcessed)
    
        })

    }

    // program filter
    let programFilter = []
    $: console.log(programFilter)
    // $: resultsFilteredByProgram = programFilter.reduce((acc, program)=>{
    //     const subset = searchResults.filter((result) =>
    //             result.program === program
    //     )
    //     return acc.concat(subset)
    // }, [])

    // institution filter
    let institutionFilter = []
    $: console.log(institutionFilter)
    // $: resultsFilteredByInstitution = institutionFilter.reduce((acc, institution)=>{
    //     const subset = searchResults.filter((result) =>
    //             result.institution === institution
    //     )
    //     return acc.concat(subset)
    // }, [])

    $: filteredResults = searchResults.filter(result => 
        (programFilter.length === 0 || programFilter.some(program => result.program.includes(program))) && 
        (institutionFilter.length === 0 || institutionFilter.includes(result.institution))
    );
    $: console.log(filteredResults)

    let sortingMethod = 'date - descending';
    $:console.log(sortingMethod)

    // convert dollar amount into number
    function convertAmount(str){ return parseFloat(str.replace(/[^0-9.-]+/g,""))}

    // sort results based on conditions
    function sortResults(results, sortingMethod){
        switch (sortingMethod) {
            case 'date - ascending':
                return results.toSorted((a, b) => new Date(a.date) - new Date(a.date));
            break
            case 'date - descending':
                return results.toSorted((a, b) => new Date(b.date) - new Date(a.date));
            break
            case 'amount - descending':
                return results.toSorted((a, b) => convertAmount(b.amount) - convertAmount(a.amount));
            break
        }
    };

    $: finalResults = sortResults(filteredResults, sortingMethod)

   

    // pagination
    $: items = finalResults
    $: console.log(items)
    let currentPage = 1
    let pageSize = 10
    $: paginatedItems = paginate({ items, pageSize, currentPage })
    $: console.log(paginatedItems)
    


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
    <section class="right-panel">
        <label class="sort-by">
            Sort by:
            <select bind:value={sortingMethod}>
                <option value="date - descending" >Date - Descending</option>
                <option value="date - ascending">Date - Ascending</option>
                <option value="amount - descending">Amount - Descending</option>
            </select>
        </label>
        <Filters {searchResults} bind:programFilter bind:institutionFilter/>
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

.sort-by{
    padding-bottom: 2rem;
    
}

.right-panel {
    display:flex;
    flex-direction: column;
    /* height:300px; */
    width:30%;
    min-width: 400px;
    /* background-color: lightblue; */
    /* border: 1px solid #000 */
    
}



</style>
