class gameClass extends fabric.Canvas{
	constructor(width,height,maxX,maxY,mines){
		super(document.querySelector('canvas'),{
			width:width,
			height:height,
			backgroundColor: '#000',
			selection: false,
			fireRightClick: true,
			stopContextMenu: true
		})
		this.maxX = maxX
		this.maxY = maxY
		this.tileSize = maxX > maxY ? width/maxX : height/maxY
		this.tileset = []
		this.started = false
		this.numberOfMines = mines
		this.mines = []
		this.tilesMarked = 0

		this.emptyTileColor = '#777'
		this.standardNumberColor = '#0000ff'
		
		this.timeElapsed = 0
		this.timer = null
	}
	buildTileset(){
		for(let x = 0; x < this.maxX;x++){
			this.tileset.push([])
			for(let y = 0; y < this.maxY;y++){
				const tile = new tileClass(x,y)
				this.tileset[x].push(tile)
				this.add(tile)
				tile.on('mousedown',(e) =>{
					if(e.button === 1) e.target.leftClick()
					if(e.button === 3) e.target.rightClick()
				})
			}
		}
	}
	addMines(howMany){
		if(typeof howMany === 'undefined') howMany = 1
		for(let i = 0; i < howMany;i++){
			const randX = [randomNum(0,this.maxX)]
			const randY = [randomNum(0,this.maxY)]
			const tile = this.tileset[randX][randY]
			if(tile.value !== -1){
				tile.value = -1
				this.mines.push(this.tileset[randX][randY])
			}
			else i--
		}
	}
	setValues(){
		for(let i = 0; i < this.maxX;i++){
			for(let j = 0; j < this.maxY;j++){
				const tile = this.tileset[i][j]
				tile.getSurroundingTiles()
				if(tile.value === -1){ 
					continue
				}
				tile.value = 0
				for(let k = 0; k < tile.surroundingTiles.length;k++){
					if(tile.surroundingTiles[k].value === -1) tile.value++
				}
			}
		}
	}
	checkForUndefinedTile(x,y){
		if(x < this.maxX && x >= 0
		&& y < this.maxY && y >= 0){
			return true
		}
		return false
	}
	gameOver(){
		this.started = false
		this.tileset = []
		setTimeout(()=>{location.reload()},250)
	}
	checkVictory(){
		for(let i = 0; i < this.tileset.length;i++){
			for(let j = 0; j < this.tileset[i].length;j++){
				const tile = this.tileset[i][j]
				if(tile.value === -1 && !tile.marked) return
				if(!tile.open && tile.value !== -1)   return
			}
		}
		game.started = false
		setTimeout(()=>{window.history.back()},1000)
	}
	safeFirstClick(clickedTile){
		let needUpdate = false
		if(clickedTile.value === -1){ 
			clickedTile.value = 0
			this.addMines()
			needUpdate = true
		}
		clickedTile.getSurroundingTiles()
		for(let i = 0; i < clickedTile.surroundingTiles.length;i++){
			const tile = clickedTile.surroundingTiles[i]
			if(tile.value === -1){
				tile.value = 0
				this.addMines()
				needUpdate = true
			}
			tile.getSurroundingTiles()		
			for(let j = 0; j < tile.surroundingTiles.length;j++){
				const tileAroundTile = tile.surroundingTiles[j]
				if(tileAroundTile.value === -1){
					tileAroundTile.value = 0
					this.addMines()
					needUpdate = true
				}
			}
		}
		if(needUpdate) this.safeFirstClick(clickedTile)
	}
	manageTime(){
		if(this.started){
			this.timeElapsed++
		}
		else{
			clearInterval(this.timer)
		}
		updateTimer()
	}
}
class tileClass extends fabric.Group{
	constructor(x,y){
		const tile = new fabric.Rect({
			width: game.tileSize,
			height: game.tileSize,
			fill: '#ccc',
			originX: 'center',
			originY: 'center'
		})
		const text = new fabric.Text(``,{
			fontSize: 20,
			fill: '#ff0000',
			originX: 'center',
			originY: 'center'
		})
		super([tile,text],{
			left: game.tileSize*x, 
			top: game.tileSize*y,
			selectable: false,
			hasControls: false,
			hoverCursor: 'pointer'
		})
		this.x = x
		this.y = y
		this.value = 0
		this.open = false
		this.marked = false
		this.setCoords()
	}
	leftClick(){
		if(!game.started && !this.open){
			game.addMines(game.numberOfMines)
			game.safeFirstClick(this)
			game.setValues()
			game.timer = setInterval(()=>{game.manageTime()},1000)
			game.started = true
		}
		else if(this.open){
			this.revealSurroundTiles()
		}
		this.revealAdjacentTiles()
		this.revealValue()
		if(this.value === -1) game.gameOver()
		game.checkVictory()
	}
	rightClick(){
		if(!game.started){
			return
		}
		if(!this.marked && !this.open){
			this._objects[1].set('text',`🚩`)
			this.marked = true
			game.tilesMarked++
		}
		else if(this.marked && !this.open){
			this._objects[1].set('text','')
			this.marked = false
			game.tilesMarked--
		}
		updateMineText()
		game.renderAll()
		game.checkVictory()
	}
	revealValue(){
		if(this.marked) return
		if(this.value === -1) 
			this._objects[1].set('text',`💣`)
		else if(this.value === 0){
			this._objects[0].set('fill',game.emptyTileColor)
			this._objects[1].set('text','')
		}
		else{
			this._objects[1].set('fill',game.standardNumberColor)
			this._objects[1].set('text',`${this.value}`)
		}
		this.open = true
	}
	revealAdjacentTiles(){
		if(this.value === 0){
			for(let i = 0; i < this.surroundingTiles.length;i++){
				const tile = this.surroundingTiles[i]
				if(tile.value !== -1 && !tile.marked && !tile.open){
					tile.revealValue()
					tile.revealAdjacentTiles()
				}
			}
		}
	}
	revealSurroundTiles(){
		let markedCount = this.value
		for(let i = 0; i < this.surroundingTiles.length;i++){
			const tile = this.surroundingTiles[i]
			if(tile.value === -1 && tile.marked) markedCount--
		}
		if(markedCount === 0){
			for(let i = 0; i < this.surroundingTiles.length;i++){
				const tile = this.surroundingTiles[i]
				tile.revealValue()
				if(tile.value === 0) tile.revealAdjacentTiles()
			}
		}
	}
	getSurroundingTiles(){
		this.surroundingTiles = []
		if(game.checkForUndefinedTile(this.x-1,this.y)) //left 
			this.surroundingTiles.push(game.tileset[this.x-1][this.y])
		if(game.checkForUndefinedTile(this.x+1,this.y)) //right
			this.surroundingTiles.push(game.tileset[this.x+1][this.y])
		if(game.checkForUndefinedTile(this.x,this.y-1)) //top
			this.surroundingTiles.push(game.tileset[this.x][this.y-1])
		if(game.checkForUndefinedTile(this.x,this.y+1)) //bottom
			this.surroundingTiles.push(game.tileset[this.x][this.y+1])
		if(game.checkForUndefinedTile(this.x-1,this.y-1))//top-left
			this.surroundingTiles.push(game.tileset[this.x-1][this.y-1])
		if(game.checkForUndefinedTile(this.x+1,this.y-1))//top-right
			this.surroundingTiles.push(game.tileset[this.x+1][this.y-1])
		if(game.checkForUndefinedTile(this.x-1,this.y+1))//bottom-left
			this.surroundingTiles.push(game.tileset[this.x-1][this.y+1])
		if(game.checkForUndefinedTile(this.x+1,this.y+1))//bottom-right
			this.surroundingTiles.push(game.tileset[this.x+1][this.y+1])
	}
}

let game
startGame()
function startGame(){
	const x = sessionStorage.getItem('x')
	const y = sessionStorage.getItem('y')
	const m = sessionStorage.getItem('m')
	game = new gameClass(500,500,x,y,m)
	game.buildTileset()
}

function randomNum(min,max){
	return Math.floor(Math.random()*(max-min))+min
}