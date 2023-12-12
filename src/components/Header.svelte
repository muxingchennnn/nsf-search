<script>
    export let searchTerm
    import { finalResults } from "./stores"
    import { IconSearch, IconX, IconInfoCircle } from '@tabler/icons-svelte';

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

    const InfoPopup = {
	// Represents the type of event that opens/closed the popup
	event: 'click',
	// Matches the data-popup value on your popup element
	target: 'popupFeatured',
	// Defines which side of your trigger the popup will appear
	placement: 'bottom-end',
};
</script>

<header>
    <span class="logo whitespace-nowrap">NSF CISE AWARDS</span>
    <div class="search-bar">
        <div class="input-group input-group-divider grid-cols-[1fr_auto_auto] border border-gray-300 border-solid rounded-md ">
            <input
				type="text"
				class="input"
				placeholder='e.g. "data visualization"'
				bind:value={textInput}
				on:keydown={pressEnter}
				use:popup={popupFocusBlur}
			/>
			<button on:click={clearSearch}>
				<IconX />
			</button>
			<button class=" bg-yellow-400" on:click={clickSearch}>
				<IconSearch />
			</button>
            
        </div>
        
        <!-- <div class="card p-4 bg-gray-300 border-none" data-popup="popupFocusBlur">
            <p class="block">Enclose keywords in double quotes ("") to find exact keyword collocation.</p>
            <p class="block">Precede a keyword with a minus (-) to exclude it from results. For example, -[keyword].</p>
            <div class="arrow bg-gray-300" />
        </div> -->
        
    </div>
    <button class="info-icon" use:popup={InfoPopup}>
        <IconInfoCircle class="stroke-gray-500"/>
    </button>
    <div class="card p-4 w-96 bg-gray-200 border-none rounded-md drop-shadow-sm select-text" data-popup="popupFeatured">
        <div>
            <p>Welcome to the NSF CISE Awards Search Interface v1!</p><br>
            <p>We developed this interface to offer a streamlined and delightful search experience within the NSF CISE awards dataset. It is still in its early stages, and we plan to improve it over time.</p><br>
            <p>
                If you have any questions or suggestions, please feel free to contact us:<br>
                Muxing Chen｜chen.muxin@northeastern.edu<br>
                Jethro Lee ｜ lee.jet@northeastern.edu<br>
                Shani Spivak ｜ spivak.s@northeastern.edu<br>
                Enrico Bertini ｜ e.bertini@northeastern.edu</p>

        </div>
        <!-- <div class="arrow bg-gray-300" /> -->
    </div>
    <!-- <div class="btn-group">
        <button class="btn--log-in">Log In</button>
        <button class="btn--sign-up">Sign Up</button>
    </div> -->
</header>
<div class="separator"></div>


<style>

    header {
        max-width: 1440px;
        padding: 1rem 2rem;
        display: flex;
        /* gap:4rem; */
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
        margin-right: 4rem;

        color: #000;
        font-family: 'Sohne', sans-serif;
        font-size: 1.2rem;
        font-style: normal;
        font-weight: 700;
        line-height: 120%; /* 1.8rem */
        letter-spacing: 0.15rem;
    }

    .search-bar {
        max-width: 36rem;
        flex-grow:1;
        margin-right: auto;
        display: flex;
        gap: 1rem;
        
    }

    .info-icon{
        margin-left: auto;
    }

</style>