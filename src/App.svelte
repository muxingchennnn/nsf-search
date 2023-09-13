<script>
    import Header from "./components/Header.svelte";
    import Result from "./components/Result.svelte";
    import Filters from "./components/Filters.svelte";
    import * as d3 from 'd3';
    import moment from 'moment';
    import { paginate, LightPaginationNav } from 'svelte-paginate'
    import {onMount} from "svelte"
    import { removeStopwords } from 'stopword'
    import { fade } from 'svelte/transition'
    import { SyncLoader } from 'svelte-loading-spinners';

    let loadingTime;
    let isLoading = true;
    let searchResult = [];

    // data loading and parsing    
    let awardsData = []
    onMount(async()=>{
        awardsData = await dataLoading()
        isLoading = false;
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
            programs: d['Program(s)'].split(", ").filter( (program , i) => {
                return i === 0 ? true : program !== ''
            }),
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
    $: searchTermProcessed = removeStopwords(searchTerm.toLowerCase().split(' ').filter(term => term !== ""))
    let searchResults
    // $: console.log({searchTerm})
    $: console.log({searchResults})

    $: if (searchTerm === "") {
        searchResults = awardsData.sort((a, b) => new Date(b.date) - new Date(a.date))
    } 
    else {
        // First, split the searchTerm into tokens in an array when it is a long string
        // After that, use removeStopwords() to remove the stop words in that array
        // Lastly. loop through the token array to filter results that include the tokens in title or abstract
        
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

    // filter results

    // filters
    let programFilter = []
    let institutionFilter = []
    let investigatorFilter = []

    $: filteredResults = searchResults.filter(result => 
        (programFilter.length === 0 || programFilter.some(program => result.programs.includes(program))) && 
        (institutionFilter.length === 0 || institutionFilter.includes(result.institution))
    );
    $: console.log(filteredResults)


    // sort results
    let sortingMethod = 'relevance';
    $:console.log(sortingMethod)

    // convert dollar amount into number
    function convertAmount(str){ return parseFloat(str.replace(/[^0-9.-]+/g,""))}

    function getMatchingKeywordCount(str, keywords) {
        str = str.toLowerCase()
        return keywords.reduce((acc, keyword) => {
            return acc + (str.includes(keyword) ? 1 : 0);
        }, 0);
    }

    function getTotalMatchingKeywordCount(str, keywords) {
        str = str.toLowerCase()
        return keywords.reduce((acc, keyword) => {
            return acc + (str.split(keyword).length - 1);
        }, 0);
    }

    function getMatchingProgramCount(programs, programFilter) {
        return [...new Set(programs)].filter((program) => [...new Set(programFilter)].includes(program)).length;
    }

    
    // sort results based on conditions
    function sortResults(results, sortingMethod){
        
        console.time("sortResults");
        switch (sortingMethod) {
            case 'relevance':
                if(searchTerm != "" || programFilter.length > 0){
                    
                    return results.toSorted((a, b) => {
                            // first compare the total number of unique matching keywords in title and abstract plug the number of programs
                            const relevanceA =
                                getMatchingKeywordCount(a.title + a.abstract, searchTermProcessed) +
                                getMatchingProgramCount(a.programs, programFilter);
                            const relevanceB = 
                                getMatchingKeywordCount(b.title + b.abstract, searchTermProcessed) +
                                getMatchingProgramCount(b.programs, programFilter);

                            let results

                            // for results have the same above number, we compare the number of unique keywords in title
                            // if the number of unique keywords in title is also the same, we compare the total number of keywords in title and abstract
                            if(relevanceB - relevanceA === 0) {
                                const titleComparison = getMatchingKeywordCount(b.title, searchTermProcessed) -
                                                        getMatchingKeywordCount(a.title, searchTermProcessed);
                                results = titleComparison !== 0 ? titleComparison : 
                                        getTotalMatchingKeywordCount(b.title + b.abstract, searchTermProcessed) -
                                        getTotalMatchingKeywordCount(a.title + a.abstract, searchTermProcessed);
                            } else {
                                results = relevanceB - relevanceA;
                            }
                            return results

                            });
                    } else {
                    return results.toSorted((a, b) => new Date(b.date) - new Date(a.date));
                    }
             
            case 'date - ascending':
                return results.toSorted((a, b) => new Date(a.date) - new Date(b.date));
            break;
            case 'date - descending':
                return results.toSorted((a, b) => new Date(b.date) - new Date(a.date));
            break;
            case 'amount - descending':
                return results.toSorted((a, b) => convertAmount(b.amount) - convertAmount(a.amount));
            break;
            
        }
        console.timeEnd("sortResults");
        
    };
    
    $: finalResults = sortResults(filteredResults, sortingMethod)

   

    // pagination
    $: items = finalResults
    // $: console.log(items)
    let currentPage = 1
    let pageSize = 10
    $: paginatedItems = paginate({ items, pageSize, currentPage })
    $: console.log(paginatedItems)
    


</script>
<p>Data loading took: {loadingTime} milliseconds</p>
<Header bind:searchTerm bind:searchResults bind:finalResults/>

{#if isLoading}
    <div class="loader" transition:fade>
        <p>Loading...</p>
        <SyncLoader size="2" color="#2E90FA" unit="rem" duration="1s" />
    </div>

{:else}
    <main class="container">
        <section class="results">
            
            {#if paginatedItems.length}
                {#each paginatedItems as result}
                    <Result {...result} {programFilter}/>
                {/each}
            {:else}
                <p>No results about "{searchTerm}"</p>
            {/if}
        </section>
        <section class="right-panel">
            <label class="sort sort-by">
                Sort by:
                <select bind:value={sortingMethod} class="sort-by">
                    <option value="relevance" >Relevance</option>
                    <option value="date - descending" >Date - Descending</option>
                    <option value="date - ascending">Date - Ascending</option>
                    <option value="amount - descending">Amount - Descending</option>
                </select>
            </label>
            <Filters {searchResults} {finalResults} bind:programFilter bind:institutionFilter bind:investigatorFilter/>
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
{/if}

<style>

.loader {
    display: flex;
    flex-direction: column;
    align-items:center;
	justify-content: center;
	position: absolute;
    inset: 0;
    background: rgb(255 255 255 / .9);

    font-family: Inter;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
}

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

.sort {
    padding-bottom: 2rem;
}

.sort-by{
    color: #000;
    font-family: Inter;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
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
