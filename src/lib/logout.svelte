<script lang="ts">
    import { loggedIn } from './writeables'

    async function logout() {
        loggedIn.set(false) 
        await fetch("/api/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
</script>

<button class="Loginbutton" on:click|preventDefault={logout}>Log out</button>
