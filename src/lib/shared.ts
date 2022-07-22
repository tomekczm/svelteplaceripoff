export function getCubePosition(x: number, y: number) {
    const xAmount = Math.floor(x / 10)
    const yAmount = Math.floor(y / 10)
    return {
        x: xAmount,
        y: yAmount
    }
}

export const colors = [
    "#FFFFFF",
    "#E4E4E4",
    "#888888",
    "#222222",
    "#FFA7D1",
    "#E50000",
    "#E59500",
    "#A06A42",
    "#E5D900",
    "#94E044",
    "#02BE01",
    "#00D3DD",
    "#0083C7",
    "#0000EA",
    "#CF6EE4",
    "#82008"
]