$(window).on('load',updateMapText)
function updateMapText(){
	$('.map').text(`Mapa: ${sessionStorage.getItem('x')}/${sessionStorage.getItem('y')}`)		
}

$(window).on('load',updateMineText)
function updateMineText(){
	$('.mines').text(`Minas: ${game.tilesMarked}/${sessionStorage.getItem('m')}`)	
}

$('.exitButton').on('pointerdown',()=>{
	window.history.back()
})

$('.reloadButton').on('pointerdown',()=>{
	window.location.reload()
})

function updateTimer(){
	$('.timer').text(`Tempo: ${game.timeElapsed}s`)
}