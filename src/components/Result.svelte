<script>
    export let program
    export let investigator
    export let title
    export let abstract
    export let date
</script>

<div class="result">
    <p class="title">{@html title}</p>
    <div class="subline">
        <span>{date}</span>
        <span>·</span>
        <span>{investigator}</span>
        <span>·</span>
        <span class="program">{program}</span>
    </div>
    <p class="abstract">{@html abstract}</p>
</div>

<style>
.result {
    max-width: 800px;
    min-width: 400px;
    /* border: 1px solid #000; */
}

.title {
    color: var(--blue-700, #175CD3);
    font-family: Inter;
    font-size: 1rem;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */

    margin-bottom: 0.2rem;
}

.subline {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;

    color: var(--grey-500, #70707B);
    font-family: Inter;
    font-size: 0.8rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 18px */

    margin-bottom: 0.4rem;
}



p.abstract {
    display: -webkit-box;
    -webkit-line-clamp: 3; /* limits the content to 3 lines */
    -webkit-box-orient: vertical;
    overflow: hidden;

    color: #000;
    font-family: Inter;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 24px */
}

.program{
    padding: 0.1rem 0.4rem;
    background-color: #F4F4F5;
    border-radius: 0.2rem;
}
</style>
