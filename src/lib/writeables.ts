import { writable } from "svelte/store";

export const currentColor = writable(0)
export const loggedIn = writable(false)
export const colorMap = writable<Array<Array<number>>>([[]])