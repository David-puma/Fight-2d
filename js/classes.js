class Sprite {
    constructor({
        position, 
        imageSrc, 
        scale = 1, 
        framesMax = 1, 
        offset = { x: 0, y: 0 }
        

    }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 7
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image, 
            this.frameCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
             if(this.frameCurrent < this.framesMax - 1) {
                this.frameCurrent++
            } else {
                this.frameCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()

    }
}

class Fighter extends Sprite {
    constructor({
        position, 
        velocity, 
        color = 'red', 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset = { x: 0, y: 0 },
        Sprites,
        attackBox = { offset: {}, width: undefined, health: undefined},
        attackCooldown = 0
    }) {
        super({
            position,
            imageSrc, 
            scale,
            framesMax,
            offset
            
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 7
        this.Sprites = Sprites
        this.dead = false
        this.isGrounded = false
        this.lastAttackTime = 0;  // Track last attack time
        this.attackCooldown = attackCooldown; // Cooldown time (in ms)


        for ( const Sprite in this.Sprites){
            Sprites[Sprite].image = new Image()
            Sprites[Sprite].image.src = Sprites[Sprite].imageSrc
        }
        console.log(this.Sprites);
    }

    update() {
        this.draw()
        if (!this.dead) 
        this.animateFrames()
     
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
   
        //attack box
       /*c.fillRect(
            this.attackBox.position.x, 
            this.attackBox.position.y, 
            this.attackBox.width, 
            this.attackBox.height
        )*/

        this.position.x += this.velocity.x
        if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvas.width) {
            this.position.x = canvas.width - this.width;
        }

        this.position.y += this.velocity.y

        //gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            //this.position.y = 330
            //chat
            this.position.y = canvas.height - 96 - this.height
            this.isGrounded = true
        } else  {
            this.velocity.y += gravity
            this.isGrounded = false
        }
    }

    // Check if cooldown has passed
canAttack() {
    const currentTime = Date.now();
    return currentTime - this.lastAttackTime >= this.attackCooldown;
}


    attack() {
        if (this.canAttack()) {
            this.switchSprite('attack1');
            this.isAttacking = true;
            this.framesHold = 4;
            this.lastAttackTime = Date.now();
        }
    }

    takeHit() {
        this.health -= 12

        if (this.health <= 0) {
            this.switchSprite('death')
        } else this.switchSprite('takeHit')
    }

    switchSprite(Sprite) {
        if (this.image === this.Sprites.death.image) {
            if (this.frameCurrent === this.Sprites.death.framesMax - 1) this.dead = true
            return}
//overriding all other animation with the attack animation
        if(this.image === this.Sprites.attack1.image && 
        this.frameCurrent < this.Sprites.attack1.framesMax - 1
        ) 
        return
// override when fighter gets hit
        if (this.image === this.Sprites.takeHit.image && 
            this.frameCurrent < this.Sprites.takeHit.framesMax - 1
        )
        return

        switch (Sprite) {
            case 'idle':
                if (this.image !== this.Sprites.idle.image){
                    this.image = this.Sprites.idle.image
                    this.framesMax = this.Sprites.idle.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'run':
                if (this.image !== this.Sprites.run.image) {
                    this.image = this.Sprites.run.image
                    this.framesMax = this.Sprites.run.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.Sprites.jump.image) {
                this.image = this.Sprites.jump.image
                this.framesMax = this.Sprites.jump.framesMax
                this.frameCurrent = 0
                }
                break 

            case 'fall':
                if (this.image !== this.Sprites.fall.image) {
                this.image = this.Sprites.fall.image
                this.framesMax = this.Sprites.fall.framesMax
                this.frameCurrent = 0
                }
                break 
            case 'attack1':
                if (this.image !== this.Sprites.attack1.image) {
                this.image = this.Sprites.attack1.image
                this.framesMax = this.Sprites.attack1.framesMax
                this.frameCurrent = 0
                this.framesHold = 3
                }
                break 

            case 'takeHit':
                if (this.image !== this.Sprites.takeHit.image) {
                this.image = this.Sprites.takeHit.image
                this.framesMax = this.Sprites.takeHit.framesMax
                this.frameCurrent = 0
                }
                 break 

            case 'death':
                if (this.image !== this.Sprites.death.image) {
                this.image = this.Sprites.death.image
                this.framesMax = this.Sprites.death.framesMax
                this.frameCurrent = 0
                }
                 break 
        }
    }
}

