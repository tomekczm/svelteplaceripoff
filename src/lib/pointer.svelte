<script lang="ts">
    import { browser } from "$app/env";
    import { onMount } from "svelte";
    import { getCubePosition } from "./shared";
    import { currentColor, loggedIn, colorMap } from "./writeables";
    import { colors } from './shared'

    let canvas: HTMLCanvasElement;

    function redraw(event: MouseEvent) {
        
        if (!browser || !canvas)
            return;

        const context = canvas.getContext("2d");

        if (!context) {
            return;
        }

        const box = canvas.getBoundingClientRect();
        const preX = event.clientX - box.left
        const preY = event.clientY - box.top

        const { x, y } = getCubePosition(preX, preY);


        if($loggedIn) {
            const color = colors[$currentColor];
            context.fillStyle = color
        } else if($colorMap && $colorMap[x]) {
            const colorId = $colorMap[x][y]
            const color = colors[colorId]
            context.fillStyle = color
        }
        context.shadowColor = '#42445a';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 9;

        context.clearRect(0, 0, canvas.width, canvas.height);
        
        if(x < 100) {
            context.fillRect(x * 10, y * 10, 10, 10);
        }
    }

    onMount(() => {
        document.addEventListener('mousemove', (event) => {
            redraw(event)
        })

        document.addEventListener('resize', () => {
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
        }, true);

        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    })
</script>

<canvas bind:this={canvas} class="ignorepointer"/>