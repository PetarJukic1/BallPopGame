const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = innerHeight

let mouseX = -100;
let mouseY = -100;
let ballsPopped = 0;
let ballsGenerated = 0;

let popSoundEffect = new Audio("./bom.wav")
class Projectile {
    constructor(x, y, color, radius, velocity) {
        this.x = x
        this.y = y
        this.color = color
        this.radius = radius
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const friction = 0.97
class Particle {
    constructor(x, y, color, radius, velocity) {
        this.x = x
        this.y = y
        this.color = color
        this.radius = radius
        this.velocity = velocity
        this.alpha = 1
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }

    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

const projectiles = []
const particles = []

for (let i = 0; i < (Math.random() * 15) + 10; i++) {
    projectiles.push(new Projectile(
        generateRandomYCoordinate(),
        generateRandomXCoordinate(),
        `hsl(${Math.random() * 360}, 50%, 50%)`,
        30,
        {
            x: generateRandomVelocity(),
            y: generateRandomVelocity(),
        }
    ))
}

ballsGenerated = projectiles.length

function handleCollision(projectile) {
    if (projectile.x + projectile.velocity.x > canvas.width - 30 || projectile.x + projectile.velocity.x < 30) {
        projectile.velocity.x = projectile.velocity.x + (Math.round(Math.random()) * 2 - 1) * 0.5
        projectile.velocity.x = -projectile.velocity.x;
    }
    if (projectile.y + projectile.velocity.y > canvas.height - 30 || projectile.y + projectile.velocity.y < 30) {
        projectile.velocity.y = projectile.velocity.y + (Math.round(Math.random()) * 2 - 1) * 0.5
        projectile.velocity.y = -projectile.velocity.y;
    }
}

function drawText() {
    ctx.font = "20px Arial";
    ctx.fillStyle = 'red'
    ctx.fillText("Generated: " + ballsGenerated, canvas.width - 300, 30)
    ctx.font = "20px Arial";
    ctx.fillStyle = 'red'
    ctx.fillText("Popped: " + ballsPopped, canvas.width - 300, 60)

}

let animationId

function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawText()
    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1)
        } else {
            particle.update()
        }
    })
    projectiles.forEach((projectile, index) => {
            handleCollision(projectile);
            const dist = Math.hypot(projectile.x - mouseX, projectile.y - mouseY)
            if (dist - projectile.radius - 10 < 1) {
                if (popSoundEffect.paused) {
                    popSoundEffect.play();
                }else{
                    popSoundEffect.currentTime = 0
                }
                for (let i = 0; i < (Math.random() * 15) + 10; i++) {
                    particles.push(new Particle(
                            projectile.x,
                            projectile.y,
                            projectile.color,
                            Math.random() * 2,
                            {
                                x: generateRandomVelocity(),
                                y: generateRandomVelocity()
                            }
                        )
                    )
                }
                setTimeout(() => {
                    projectiles.splice(index, 1)
                    drawText()
                }, 0)

                ballsPopped = ballsPopped + 1
                if (ballsPopped === ballsGenerated) {

                    popSoundEffect.pause()

                    alert("Game over")
                    location.reload()
                }
            }

            projectile.update()
        }
    )
}

function generateRandomVelocity() {
    return (Math.round(Math.random()) * 2 - 1) * Math.floor((Math.random() * 3) + 1)
}

function generateRandomYCoordinate() {
    let res = Math.floor((Math.random() * (canvas.width)) + 1)
    if (res > canvas.width - 10) {
        res = res - 20
    }
    if (res < 10) {
        res = res + 20
    }

    return res
}

function generateRandomXCoordinate() {
    let res = Math.floor((Math.random() * (canvas.height)) + 1)
    if (res > canvas.height - 10) {
        res = res - 20
    }
    if (res < 10) {
        res = res + 20
    }

    return res
}

addEventListener('mousedown', (event) => {
    mouseX = event.clientX
    mouseY = event.clientY
})
addEventListener('mouseup', (event) => {
    mouseX = -1
    mouseY = -1
})
animate()