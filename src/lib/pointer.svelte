<script lang="ts">
    import { browser } from "$app/env";
    import { onMount } from "svelte";
    import { getCubePosition } from "./shared";

    let canvas: HTMLCanvasElement;

    function redraw(event: MouseEvent) {
        const context = canvas.getContext("2d");

        if (!context) {
            return;
        }

        const box = canvas.getBoundingClientRect();
        const preX = event.clientX - box.left
        const preY = event.clientY - box.top

        const { x, y } = getCubePosition(preX, preY);

        context.fillStyle = '#000000'
        context.shadowColor = '#42445a';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 9;

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillRect(x * 10, y * 10, 10, 10);
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