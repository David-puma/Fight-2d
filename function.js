
function animate() {
    window.requestAnimationFrame(animate)

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -7
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey == 'd'){
        player.velocity.x = 7
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    //jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //enemy movements
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -7
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 7
        enemy.switchSprite('run')
    }else {
        enemy.switchSprite('idle')
   }

    //jumping enemy
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }
    //detect collision
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2 : enemy
        }) &&
        player.isAttacking && player.frameCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false
        //document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    //if player misses
    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false
    }

    if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2 : player
        }) &&
        enemy.isAttacking && 
        enemy.frameCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
       // document.querySelector('#playerHealth').style.width = player.health + '%'
       gsap.to('#playerHealth', {
        width: player.health + '%'
    })
    }

    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false
    }
    //end game based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if ( !player.dead) {
    switch(event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            if (player.isGrounded) {
            player.velocity.y = -17
            player.isGrounded = false
            }
            break
        case 's':
            player.attack();
        break;
    }
}
    if(!enemy.dead) {
    switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
        break

        case 'ArrowUp':
            if (enemy.isGrounded) {
            enemy.velocity.y = -17
            enemy.isGrounded = false
            }
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        }
    //enemy keys
    switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
       
    }
})
