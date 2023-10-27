class Game{
    constructor(){
        this.lastTimeMeasure = performance.now()
        this.deltaTime = 1
        this.animationRequest = null
        this.ball = null
    }
    setDelta(){
        const time = performance.now()
        this.deltaTime = time - this.lastTimeMeasure
        this.lastTimeMeasure = time
    }
    tick(){
        this.setDelta()
        canvas.clear()
        canvas.drawBall()
        this.animationRequest = requestAnimationFrame(() => this.tick())
    }
}
class Canvas{
    constructor(){
        this.c = document.querySelector('canvas')
        this.ctx = this.c.getContext('2d')
        this.fill = '#333333'
        window.addEventListener('resize', () => this.resize())
        this.resize()
    }
    resize(){
        this.width = document.body.offsetWidth
        this.height = document.body.offsetHeight
        this.c.width = this.width 
        this.c.height = this.height
    }
    clear(){
        this.ctx.fillStyle = this.fill
        this.ctx.fillRect(0,0,this.width,this.height)
    }
    drawBall(){
        this.ctx.setTransform(1,0,0,1,0,0)
        this.ctx.beginPath()
        
        game.ball.path = new Path2D() 
        game.ball.path.arc(game.ball.pos.x,game.ball.pos.y,game.ball.r,0,Math.PI*2)

        if(game.ball.fill){
            this.ctx.fillStyle = game.ball.fill
            this.ctx.fill(game.ball.path)
        }
        if(game.ball.stroke){
            this.ctx.strokeStyle = game.ball.stroke
            this.ctx.stroke(game.ball.path)
        }
        this.ctx.resetTransform()
    }
}
class Input{
    constructor(){
        this.x = 0
        this.y = 0

        window.addEventListener('pointerdown',(e) => {
            this.x = e.clientX
            this.y = e.clientY
            if(canvas.ctx.isPointInPath(game.ball.path,this.x,this.y)){
                game.ball.holded = true
            }
        })
        window.addEventListener('pointermove',(e) => {
            this.x = e.clientX
            this.y = e.clientY
            if(game.ball.holded){
                game.ball.pos.x = this.x
                game.ball.pos.y = this.y
            }
        })
        window.addEventListener('pointerup',(e) => {
            this.x = e.clientX
            this.y = e.clientY
            game.ball.holded = false
        })
    }
}
class EulerObject{
    constructor(){
        this.pos = new Vector2d() 
        this.vel = new Vector2d()
        this.acc = new Vector2d()
    }
    solvePosition(){

    }
}
class Ball extends EulerObject{
    constructor(){super()
        this.path = null
        this.r = 20
        this.fill = '#f00'
        this.stroke = '#fff'
        this.holded = false
    }
}
class Vector2d{
    constructor(x,y){
        this.x = x ? x : 0
        this.y = y ? y : 0
    }
}
const game = new Game
const input = new Input
const canvas = new Canvas
game.ball = new Ball
this.animationRequest = game.tick()