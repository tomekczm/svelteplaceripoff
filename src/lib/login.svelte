<script lang="ts">
    import Loginmodal from "./loginmodal.svelte";
    import { loggedIn } from './writeables'

    let openModal = false;
</script>

<button class="Loginbutton" on:click={() => {
    openModal = true
}}>Log in</button>

{#if openModal && !$loggedIn }
    <Loginmodal/>
{/if}