<script lang="ts">
    import "./index.css";
    import { io as initializeConnection, Socket } from "socket.io-client";
    import { onMount } from "svelte";
    import { colors as colorLookup } from '../lib/shared'
    import { browser } from "$app/env";
    import Pointer from "$lib/pointer.svelte";
    import { getCubePosition } from "$lib/shared";
    import Picker from "$lib/palette.svelte";
    import color from '$lib/palette.svelte'
    import { colorMap, currentColor } from '$lib/writeables'
    import Login from "$lib/login.svelte";
    import { loggedIn } from "$lib/writeables";
    import { parse } from 'cookie'
    import { session } from '$app/stores';
    import Logout from "$lib/logout.svelte";

    let socket: Socket
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D; 

    function onClick(event: MouseEvent) {

        if(!browser)
            return

        if(!$loggedIn)
            return

        const box = canvas.getBoundingClientRect();
        const preX = event.clientX - box.left
        const preY = event.clientY - box.top

        const { x, y } = getCubePosition(preX, preY);

        const cookie = parse(document.cookie)
        
        if(!cookie)
            return

        const code = cookie.code

        if(!code)
            return

        socket.emit('place_pixel', { x, y, color: $currentColor, code: code })


        //context.fillRect(x * 10, y * 10, 10, 10)
    }

    function draw(pixels: Array<Array<number>>) {
        const context = canvas.getContext("2d");

        if(!context)
            return

        for (let y = 0; y < pixels.length; y++) {
            for (let x = 0; x < pixels[y].length; x++) {
                const pixel = pixels[y][x];
                context.fillStyle = colorLookup[pixel];
                context.fillRect(x * 10, y * 10, 10, 10);
            }
        }
    }

    if(browser) {
        if($session.user) {
            loggedIn.set(true)
        }
        if(document.cookie == "")
            loggedIn.set(false)
    }

    onMount(() => {
        socket = initializeConnection();

        context = canvas.getContext("2d") as CanvasRenderingContext2D;

        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        socket.on('init_packet', (data) => {
            colorMap.set(data.pixels)
            draw(data.pixels)
        });

        socket.on('place_pixel', ({ x, y, color }) => {
            if(!canvas)
                return

            const context = canvas.getContext("2d");

            try {
                colorMap.update(n => {
                    n[x][y] = color
                    return n
                })
            }catch(e) {
                console.error(e)
            }

            if(!context)
                return

            context.fillStyle = colorLookup[color];
            context.fillRect(x * 10, y * 10, 10, 10);
        })

        /*
        dosen't work but i think its my browser's fault
        */
        document.addEventListener('resize', () => {
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
        }, true);
    });

</script>

<head>
    <title>Helpppp im stuck in the title!!</title>
</head>

<canvas bind:this={canvas} on:click={onClick}/>
<Pointer/>

{#if !$loggedIn}
    <Login/>
{:else}
    <Picker/>
    <Logout/>
{/if}