<script lang="ts">
import { browser } from '$app/env';

import { currentColor } from '$lib/writeables';

    import { colors } from './shared'
    
</script>

<div class="palette">
    {#each colors as color, i}
        <div class="color" style="background-color: {color}" on:click={() => {
            if(!browser)
                return
            currentColor.set(i)
        }}>
        </div>
    {/each}
</div>