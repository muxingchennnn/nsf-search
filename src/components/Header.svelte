<script>
    export let searchTerm
    let textInput=""

    function clickSearch() {
        searchTerm = textInput
    }

    function pressEnter(event) {
    // Check if the 'return' key was pressed
    if (event.key === "Enter") {
      searchTerm = textInput
    }
  }
</script>

<header>
    <span class="logo">NSF AWARDS</span>
    <div class="search-bar">
        <!-- <input type="text" id="searchBar" placeholder="Human-Centered Computing" bind:value = {searchTerm}> -->
        <input type="text" id="searchBar" placeholder="Human-Centered Computing" bind:value = {textInput} on:keydown={pressEnter}>
        <button class="btn--search" on:click={clickSearch}>Search</button>
    </div>
    <div class="btn-group">
        <button class="btn--log-in">Log In</button>
        <button class="btn--sign-up">Sign Up</button>
    </div>
</header>

<style>

    header {
        display: flex;
        padding: 1rem;
        gap:4rem;
        align-items:center;
        justify-content: space-between;
        

        height: 80px;
        border-bottom: 1px solid #E4E4E7;
        margin-bottom: 3rem;
    }

    .logo {
        min-width: 160px;

        color: #000;
        font-family: Inter;
        font-size: 1.2rem;
        font-style: normal;
        font-weight: 700;
        line-height: 120%; /* 1.8rem */
    }

    .search-bar {
        display: flex;
        gap: 1rem;
        flex-grow:1;
    }

    #searchBar {
        display: flex;
        /* min-width: 40rem; */
        padding: 0.625rem 0.875rem;
        align-items: center;
        gap: 0.5rem;
        flex-grow:1;
        flex-shrink:1;
        
        border-radius: 0.5rem;
        border: 1px solid var(--gray-300, #D0D5DD);
        background: var(--base-white, #FFF);

        color: #1E1E1E;

        /* Text md/Regular */
        font-family: Inter;
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5rem;
    }


    .btn--search {
        display: flex;
        padding: 0.625rem 1.125rem;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;

        border-radius: 0.5rem;
        border: 1px solid var(--yellow-400, #FAC515);
        background: var(--yellow-400, #FAC515);


        color: #1E1E1E;

        /* Text md/Semibold */
        font-family: Inter;
        font-size: 1rem;
        font-style: normal;
        font-weight: 600;
        line-height: 1.5rem; /* 150% */
    }

    .btn-group{
        display: flex;
        flex-shrink:0;
        gap: 1rem;

    }

    .btn--sign-up {
        display: flex;
        padding: 0.625rem 1.125rem;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;

        

        border-radius: 0.5rem;
        border: 1px solid var(--blue-500, #2E90FA);
        background: var(--blue-500, #2E90FA);
   

        color: var(--base-white, #FFF);
        /* Text md/Semibold */
        font-family: Inter;
        font-size: 1rem;
        font-style: normal;
        font-weight: 600;
        line-height: 1.5rem; /* 150% */
    }

    .btn--log-in {
        display: flex;
        padding: 0.625rem 1.125rem;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;

        border-radius: 0.5rem;
        border: 1px solid var(--blue-500, #2E90FA);
        background: #FFF;

        color: #000;
        /* Text md/Semibold */
        font-family: Inter;
        font-size: 1rem;
        font-style: normal;
        font-weight: 600;
        line-height: 1.5rem; /* 150% */
    }


</style>