<script>
    export let searchTerm
    import { finalResults } from "./stores"
    import { IconSearch, IconX } from '@tabler/icons-svelte';

    import { popup } from '@skeletonlabs/skeleton';
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
    
    let textInput=""

    // Function to remove highlight keywords in a text
    function removeHighlight(text) {
        return text.replace(/<span class="highlight" style="background-color: rgba\(250, 197, 21, 0.2\)">([^<]*)<\/span>/gi, '$1');
    }

    function updateSearchTerm() {
        searchTerm = textInput;
        
        $finalResults.map(result => {
            result.title = removeHighlight(result.title);
            result.abstract = removeHighlight(result.abstract);
        });
    }

    function clickSearch() {
        console.log("Click!")
        updateSearchTerm();
    }

    function pressEnter(event) {
		// Check if the 'return' key was pressed
		if (event.key === 'Enter' || event.keyCode === 13) {
			this.blur();
			console.log('Press!');
			updateSearchTerm();
		}
	}
    

    function clearSearch() {
		textInput = '';
		updateSearchTerm();
	}

    const popupFocusBlur = {
		event: 'focus-blur',
		target: 'popupFocusBlur',
		placement: 'bottom'
	};
</script>

<header>
    <span class="logo whitespace-nowrap">NSF CISE AWARDS</span>
    <div class="search-bar">
        <div class="input-group input-group-divider grid-cols-[1fr_auto_auto] border border-gray-300 border-solid rounded-sm ">
            <input
				type="text"
				class="input"
				placeholder="e.g. 'data visualization'"
				bind:value={textInput}
				on:keydown={pressEnter}
				use:popup={popupFocusBlur}
			/>
			<button on:click={clearSearch}>
				<IconX />
			</button>
			<button class="bg-yellow-400" on:click={clickSearch}>
				<IconSearch />
			</button>
        </div>
        <div class="card p-4 bg-gray-300 border-none" data-popup="popupFocusBlur">
            <p class="block">Enclose keywords in double quotes ("") to find exact keyword collocation.</p>
            <p class="block">Precede a keyword with a minus (-) to exclude it from results. For example, -[keyword].</p>
            <div class="arrow bg-gray-300" />
        </div>
        
    </div>
    <!-- <div class="btn-group">
        <button class="btn--log-in">Log In</button>
        <button class="btn--sign-up">Sign Up</button>
    </div> -->
</header>
<div class="separator"></div>


<style>

    header {
        max-width: 56rem;
        padding: 1rem 2rem;
        display: flex;
        gap:4rem;
        align-items:center;
        justify-content: space-between;
        

        height: 5rem;
        /* border-bottom: 1px solid #E4E4E7; */
        /* margin-bottom: 3rem; */
        position: sticky;
        top: 0;
        z-index: 1000; 
        background-color: white;


    }

    input::selection {
        background-color: #b3d4fc;
    }

    .separator {
        content: "";
        display: block;
        height: 1px;  
        background-color: #E4E4E7; 
        position: sticky;
        top: 5rem;
        width: 100vw;  
        left: 0;  
        margin-left: calc(50% - 50vw);  /* centers the separator and then pulls it to the left by half the viewport width */
        margin-right: calc(50% - 50vw); /* centers the separator and then pulls it to the right by half the viewport width */
        margin-bottom: 2rem;
   

    }

    .logo {
        min-width: 160px;

        color: #000;
        font-family: 'Sohne', sans-serif;
        font-size: 1.2rem;
        font-style: normal;
        font-weight: 700;
        line-height: 120%; /* 1.8rem */
        letter-spacing: 0.15rem;
    }

    .search-bar {
        display: flex;
        gap: 1rem;
        flex-grow:1;
    }

    #searchBar {
        max-width: 28rem;
        padding: 0.625rem 0.875rem;
        flex-grow:1;
        
        border-radius: 0.5rem;
        border: 1px solid var(--gray-300, #D0D5DD);
        background: var(--base-white, #FFF);

        color: #1E1E1E;

        /* Text md/Regular */
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5rem;
    }


    .btn--search {
        padding: 0.625rem 1.125rem;
        border-radius: 0.5rem;
        border: 1px solid var(--yellow-400, #FAC515);
        background: var(--yellow-400, #FAC515);

        color: #1E1E1E;

        /* Text md/Semibold */
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5rem; /* 150% */
    }

    .btn-group{
        display: flex;
        flex-shrink:0;
        gap: 1rem;

    }

    .btn--sign-up {
        padding: 0.625rem 1.125rem;
        border-radius: 0.5rem;
        border: 1px solid var(--blue-500, #2E90FA);
        background: var(--blue-500, #2E90FA);
   

        color: var(--base-white, #FFF);
        /* Text md/Semibold */
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5rem; /* 150% */
    }

    .btn--log-in {
        padding: 0.625rem 1.125rem;
        border-radius: 0.5rem;
        border: 1px solid var(--blue-500, #2E90FA);
        background: #FFF;

        color: #424242;
        /* Text md/Semibold */
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5rem; /* 150% */
    }


</style>