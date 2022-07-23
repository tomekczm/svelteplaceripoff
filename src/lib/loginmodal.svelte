<script lang="ts">
    import { browser } from "$app/env";
    import Cookies from 'js-cookie'
    import { loggedIn } from "./writeables";

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    let password: string

    let showError = false
    let errorMessage: string
    let currentTimeout: NodeJS.Timeout

    async function handleSubmit() {
        if(!browser)
            return

        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: password
            })
        })
        const json = await response.json()
        if(json.authenticated) {
            Cookies.set('code', password)
            loggedIn.set(true)
        } else {
            console.log(json)
            errorMessage = json.error
            showError = true
            
            window.clearTimeout(currentTimeout)

            currentTimeout = setTimeout(() => {
                showError = false
            }, 6000)
        }
    }
</script>

<div class="Loginmodal">
    <div class="Loginmodal-content Center">
        <form on:submit|preventDefault={handleSubmit}>
            <label>Enter your code:
                <input
                    type="password"
                    bind:value={password}
                />
            </label>
            <input type="submit"/>
            <p>too lazy to design this part</p>
        </form>
        {#if showError}
            <p class="Red">{errorMessage}</p>
        {/if}
    </div>
</div>