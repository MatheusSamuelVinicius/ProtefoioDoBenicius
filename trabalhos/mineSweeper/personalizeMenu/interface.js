$('.playButton').on('click',initiateGame)
function initiateGame(){
	sessionStorage.setItem('x',$('#numberOfTilesX').prop('valueAsNumber'))
	sessionStorage.setItem('y',$('#numberOfTilesY').prop('valueAsNumber'))
	sessionStorage.setItem('m',$('#mineInput').prop('valueAsNumber'))
	window.location = '../game/game.html'
}

window.addEventListener('load',fillModel)
$('input').on('change',fillModel)
function fillModel(){
	const x = $('#numberOfTilesX').prop('valueAsNumber')
	const y = $('#numberOfTilesY').prop('valueAsNumber')
	const m = $('#mineInput').prop('valueAsNumber')

	$('.mapModel').empty()
	for(let i = 0; i < x*y;i++){
		const cell = document.createElement('div')
		cell.classList.add('mapModelCell',`cell${i}`)
		$('.mapModel').append(cell)
	}
	$('.mapModel').css('grid-template-columns',`repeat(${x},1fr)`)
	$('.tileTotal').text(`Total: ${x*y}`)
}
$('.returnButton').on('pointerdown',()=>{window.location = '../startMenu/index.html'})
function randomNum(min,max){
	return Math.floor(Math.random()*(max-min))+min
}