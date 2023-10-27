$('.gamemodeOption').on('pointerdown',initiateGame)
window.addEventListener('load',fillModel)

function initiateGame(){
	sessionStorage.setItem('x',$(this).data('x'))
	sessionStorage.setItem('y',$(this).data('y'))
	sessionStorage.setItem('m',$(this).data('m'))
	window.location = '../game/game.html'
}
function fillModel(){
	$('.gamemodeOption').each(function(){
		const total = $(this).data('x')*$(this).data('y')
		for(let i = 0; i < total;i++){
			const cell = document.createElement('div')
			cell.classList.add('cell')
			$(this).children('.optionModel').append(cell)
		}
		$(this).children('.optionModel').css('grid-template-columns',`repeat(${$(this).data('y')},1fr)`) 
	})
}

$('.personalizeLink').on('pointerdown',()=>{window.location = '../personalizeMenu/personalize.html'})
function randomNum(min,max){
	return Math.floor(Math.random()*(max-min))+min
}