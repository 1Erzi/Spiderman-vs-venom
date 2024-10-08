const canvas=document.querySelector('canvas');
const c=canvas.getContext('2d');

canvas.width=1024
canvas.height=576
document.body.style.zoom = "215%";
c.fillRect(0,0,canvas.width,canvas.height)

const gravity=1.0

const background=new Sprite({
    position:{
    x:0,
    y:0
    },
    imageSrc:'./images/background.png'
})

const shop=new Sprite({
    position:{
    x:600,
    y:128
    },
    imageSrc:'./images/shop.png',
    scale:2.75,
    framemax:6

})

const player=new Fighter({
    position:{
    x:0,
    y:0
    },
    velocity:{
        x:0,
        y:0
    },
    offset:{
        x:0,
        y:0
    },
    imageSrc:'./images/spiderman/idle.png',
    framemax:4,
    scale:2.5,

    offset:{
        x:-100,
        y:100
    },
    sprites:{
        idle:{
            imageSrc:'./images/spiderman/Idle.png',
            framemax:4
        },
        run:{
            imageSrc:'./images/spiderman/Run.png',
            framemax:4,
            image:new Image()
        },
        jump:{
            imageSrc:'./images/spiderman/Jump.png',
            framemax:2,
            image:new Image()
        },
        fall:{
            imageSrc:'./images/spiderman/Fall.png',
            framemax:2

        },
        attack1:{
            imageSrc:'./images/spiderman/Attack1.png',
            framemax:6
        },
        takeHit:{
            imageSrc:'./images/spiderman/Take Hit.png',
            framemax:4

        },
        death:{
            imageSrc:'./images/spiderman/Death.png',
            framemax:6

        }
    },
    attackbox:{
        offset:{
            x:200,
            y:50

        },
        height:50,
        width:170
    }
})

player.draw()


const enemy=new Fighter({
    position:{
        x:400,
        y:100
        },
    velocity:{
        x:0,
        y:0
        },

    color:'blue',
    offset:{
        x:0,
        y:0
    },
    imageSrc:'./images/venom/idle.png',
    framemax:4,
    scale:2.5,

    offset:{
        x:-100,
        y:167
    },
    sprites:{
        idle:{
            imageSrc:'./images/venom/Idle.png',
            framemax:4
        },
        run:{
            imageSrc:'./images/venom/Run.png',
            framemax:4,
            image:new Image()
        },
        jump:{
            imageSrc:'./images/venom/Jump.png',
            framemax:2,
            image:new Image()
        },
        fall:{
            imageSrc:'./images/venom/Fall.png',
            framemax:2

        },
        attack1:{
            imageSrc:'./images/venom/Attack1.png',
            framemax:4
        },
        takeHit:{
            imageSrc:'./images/venom/Take hit.png',
            framemax:3

        },
        death:{
            imageSrc:'./images/venom/Death.png',
            framemax:7

        }
    },
    attackbox:{
        offset:{
            x:-170,
            y:50

        },
        height:50,
        width:170
    }

})


enemy.draw()


console.log(player)

const keys={
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    }
}


decreaseTimer()

function animate(){

    window.requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0,0,canvas.width,canvas.height)

    background.update()
    shop.update()
    c.fillStyle='rgba(255,255,255,0.15)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()

    player.velocity.x=0
    enemy.velocity.x=0

    // player movement
    if(keys.a.pressed && player.lastkey ==='a'){
        player.velocity.x = -5
        player.switchSprites('run')
    }
    else if(keys.d.pressed && player.lastkey ==='d'){
        player.velocity.x = 5
        player.switchSprites('run')
    }
    else{
        player.switchSprites('idle')
    }

    // jumping player

    if(player.velocity.y<0){
        player.switchSprites('jump')

    }
    else if(player.velocity.y>0){
        player.switchSprites('fall')
    }

    // enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastkey ==='ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprites('run')

    }
    else if(keys.ArrowRight.pressed && enemy.lastkey ==='ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprites('run')

    }
    else{
        enemy.switchSprites('idle')
    }

    // jumping enemy

    if(enemy.velocity.y<0){
        enemy.switchSprites('jump')

    }
    else if(enemy.velocity.y>0){
        enemy.switchSprites('fall')
    }



    // detect for collision & enemy gets hit
    if (
        rectangularCollision({
            rectangle1:player,
            rectangle2:enemy
        })
         &&
        player.isAttacking &&
        player.currentframe === 4
        )
     {
        enemy.takeHit()
        player.isAttacking= false
        // enemy.health-=20

        

        // document.querySelector("#enemyhealth").style.width=enemy.health+'%'
        gsap.to('#enemyhealth',{
            width:enemy.health+'%'
        })

        // console.log("player is attacking");
    }

    // if player misses
    if(player.isAttacking && player.currentframe===4){
        player.isAttacking=false
    }

    //  when enemy hits player

    if (
        rectangularCollision({
            rectangle1:enemy,
            rectangle2:player
        })
         &&
        enemy.isAttacking && enemy.currentframe===2
    ) {
        player.takeHit()

        enemy.isAttacking= false
        // player.health-=15

        // document.querySelector("#playerhealth").style.width=player.health+'%'
        gsap.to('#playerhealth',{
            width:player.health+'%'
        })

        // console.log("enemy is attacking");
    }

    // if enemy misses 
    if(enemy.isAttacking && enemy.currentframe===2){
        enemy.isAttacking=false
    }

    // end game on basis of health
    if(enemy.health<=0 || player.health<=0){
        determineWinner({player,enemy,timerid})

    }

}

animate()

// window reloading function to restart the game 
function reloadme(){
    window.location.reload()
    }




window.addEventListener('keydown',(event) =>{
    if(!player.dead){
    switch (event.key){
        case 'd':
            keys.d.pressed=true
            player.lastkey ='d'
            break

        case 'a':
            keys.a.pressed=true
            player.lastkey ='a'
            break

        case 'w':
            player.velocity.y=-20
            
            break

        case ' ':
            player.attack()
            break
    }
}
    if(!enemy.dead){

        switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed=true
            enemy.lastkey ='ArrowRight'
            break
    
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=true
            enemy.lastkey ='ArrowLeft'
            break
    
        case 'ArrowUp':
            enemy.velocity.y=-20
                
            break

        case 'ArrowDown':
            enemy.attack()
            break
    }
}
    // console.log(event.key);

})

window.addEventListener('keyup',(event) =>{
    switch (event.key){
        case 'd':
            keys.d.pressed=false
            break
        case 'a':
            keys.a.pressed=false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed=false
        
            break
        
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=false
        
            break

    }
    // console.log(event.key);

})

