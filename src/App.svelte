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

    
    // loading state
    let isLoading = true;
    $:console.log(isLoading)
    let awardsData = []

    onMount(async()=>{
        awardsData = await dataLoading()
        isLoading = false;
        // isLoading.set(false);
    })

    async function dataLoading() {
        const data = await d3.csv('/dataset/IIS Awards.csv', parseData)
        return data
    }


    let searchTerm = ""
    let keywords =[]
    let exclusions =[]
    let searchResults = []
    let programFilter = []
    let institutionFilter = []
    let investigatorFilter = []
    let sortingMethod = 'relevance';
    let filteredResults =[]
    let finalResults = []

    $: keywords = removeStopwords(parseQuery(searchTerm).includes)
    $: exclusions = parseQuery(searchTerm).excludes
  
    $: searchResults = filteredByKW(keywords, exclusions, awardsData) 
        
    $: filteredResults = searchResults.filter(result => 
            (programFilter.length === 0 || programFilter.some(program => result.programs.includes(program))) && 
            (institutionFilter.length === 0 || institutionFilter.includes(result.institution)) &&
            (investigatorFilter.length === 0 || investigatorFilter.includes(result.investigator))
        )
        
    $: finalResults = sortResults(filteredResults, keywords, programFilter, sortingMethod)

   

    
   

    // pagination
    $: items = finalResults
    let currentPage = 1
    let pageSize = 10
    $: paginatedItems = paginate({ items, pageSize, currentPage })


    function parseData(d){
        return{
            abstract: d.Abstract.replace(/<\s*br\s*\/\s*>/gi, '').replace(/\s+([,.;!?])/g, '$1'), // remove all the <br/> string and whitespaces before the punctuations
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

    function parseQuery(query) {
        // include seperate terms and phrases within a {} sign
        // exclude terms or phrases with a - sign before
        // return an includes array and an excludes array
        const matches = query.match(/-?\{.+?\}|[^ ]+/g) || [];
        
        return matches.reduce((acc, match) => {
            if (match.startsWith('-{')) {
                acc.excludes.push(match.slice(2, -1).toLowerCase());
            } else if (match.startsWith('-')) {
                acc.excludes.push(match.slice(1).toLowerCase());
            } else if (match.startsWith('{')) {
                acc.includes.push(match.slice(1, -1).toLowerCase());
            } else {
                acc.includes.push(match.toLowerCase());
            }
            return acc;
        }, {
            includes: [],
            excludes: []
        });
        
    }

    // Function to highlight keywords in a text
    function highlightKeywords(text, keywords) {
        // Replace each keyword in the text with a highlighted version
        keywords.forEach((keyword) => {
        // const regex = new RegExp(`(${keyword})`, "gi");
        const regex = new RegExp(`\\b(${keyword})\\b`, "gi");
        text = text.replace(regex, '<span class="highlight" style="background-color: rgba(250, 197, 21, 0.2)">$1</span>');
        });
        return text;
    }
    
    function filteredByKW(keywords, exclusions, data){
        if (searchTerm === "") {
            return awardsData.sort((a, b) => new Date(b.date) - new Date(a.date))
        } 
        else if (searchTerm !== "") {
            const searchResults = awardsData.filter(award => {
                const content = `${award.title} ${award.abstract}`.toLowerCase()

                if (exclusions.some(term => content.includes(term))) {
                    return false;
                }

                if (keywords.some(term => content.includes(term))) {
                    return true;
                }
                return false
            })

            // highlight keywords
            searchResults.map(result =>{
                result.title = highlightKeywords(result.title, keywords)
                result.abstract = highlightKeywords(result.abstract, keywords)
            })
            return searchResults
            
        }
    }

    // convert dollar amount into number
    function convertAmount(str){ return parseFloat(str.replace(/[^0-9.-]+/g,""))}

    function getMatchingKeyword(str, keywords) {
        const lowerStr = str.toLowerCase()
        return keywords.reduce((acc, keyword) => {
            return acc + (lowerStr.includes(keyword) ? 1 : 0);
        }, 0);
    }

    function getTotalMatchingKeyword(str, keywords) {
        const lowerStr = str.toLowerCase()
        return keywords.reduce((acc, keyword) => {
            return acc + (lowerStr.split(keyword).length - 1);
        }, 0);
    }

    function getMatchingProgram(programs, programFilter) {
        return programs.filter((program) => programFilter.includes(program)).length;
    }

    // sort results based on conditions
    function sortResults(results, keywords, programFilter, sortingMethod){
        switch (sortingMethod) {
            case 'relevance':
                if(searchTerm != "" || programFilter.length > 0){
                    
                    return results.toSorted((a, b) => {
                            // first compare the total number of unique matching keywords in title and abstract plug the number of programs
                            const titleAndProgramComparison =
                                (getMatchingKeyword(b.title + b.abstract, keywords) + getMatchingProgram(b.programs, programFilter)) - 
                                (getMatchingKeyword(a.title + a.abstract, keywords) + getMatchingProgram(a.programs, programFilter))

                            if (titleAndProgramComparison !== 0) return titleAndProgramComparison
                            
                            // for results have the same above number, compare the number of unique keywords in title
                            const titleComparison = getMatchingKeyword(b.title, keywords) -
                                                    getMatchingKeyword(a.title, keywords)

                            if (titleComparison !== 0) return titleComparison

                            // if the number of unique keywords in title is also the same, compare the total number of keywords in title and abstract
                            const totalMatchComparison = getTotalMatchingKeyword(b.title + b.abstract, keywords) -
                                                         getTotalMatchingKeyword(a.title + a.abstract, keywords);
                            return totalMatchComparison
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
    };
   
    $:console.log(isLoading)
</script>
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
            <Filters {searchResults} {finalResults} bind:filteredResults bind:programFilter bind:institutionFilter bind:investigatorFilter/>
        </section>
    </main>

    {#if paginatedItems.length > 0}
        <footer>
            <LightPaginationNav
            totalItems="{items.length}"
            pageSize="{pageSize}"
            currentPage="{currentPage}"
            limit="{1}"
            showStepOptions="{true}"
            on:setPage="{(e) => currentPage = e.detail.page}"
            />
        </footer>
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
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 4rem;
    margin-bottom: 2rem;
}
.results {
    flex-basis: 70%;
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
    position: sticky;
    top: 8rem;
    /* flex-basis: 500px; */
    flex-basis: 30%;
    display: flex;
    flex-direction: column;
}

footer {
    width: 100vw;
    margin-bottom: 3rem;
    /* left: 0;   */
    margin-left: calc(50% - 50vw);  /* centers the separator and then pulls it to the left by half the viewport width */
    margin-right: calc(50% - 50vw); /* centers the separator and then pulls it to the right by half the viewport width */
}


</style>
