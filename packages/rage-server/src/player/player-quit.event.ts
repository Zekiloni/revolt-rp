mp.events.add({
    playerQuit: playerQuitHandler
})

function playerQuitHandler (player: PlayerMp, exitType: string, reason: string) {
    console.log("Izasao je" + player.name)
}