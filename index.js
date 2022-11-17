const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = innerHeight

class Obstacles{
    constructor(x, y, radius, color ) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

const obstacle = new Obstacles(100, 100, 30, 'blue')
obstacle.draw()

console.log(obstacle)