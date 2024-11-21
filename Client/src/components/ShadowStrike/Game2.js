import { useEffect } from 'react';
import './SS.css';
import ImportantContent from './imported_html';
import './imported_html.css';

function Game2() {
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');

    // function drawImage(){

    const resizeCanvas = () => {
      canvas.width = 1690
      canvas.height = 960
      c.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();

    const gravity = 0.85;

    class Sprite {
      constructor({
        position,
        imageSrc,
        width, 
        height,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 }
      }) {
        this.position = position
        this.width = width
        this.height = height
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 14
        this.offset = offset
      }
    
      draw() {
        c.drawImage(
          this.image,
          this.framesCurrent * (this.image.width / this.framesMax),
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
          if (this.framesCurrent < this.framesMax - 1) {
            this.framesCurrent++
          } else {
            this.framesCurrent = 0
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
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined },
        attackBox_i = { offset: {}, width: undefined, height: undefined },
        framesHold = 5
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
        this.lastKey = 0
        this.attackBox = {
          position: {
            x: this.position.x,
            y: this.position.y
          },
          offset: attackBox.offset,
          width: attackBox.width,
          height: attackBox.height
        }
        this.attackBox_i = {
          position: {
            x: this.position.x,
            y: this.position.y
          },
          offset: attackBox_i.offset,
          width: attackBox_i.width,
          height: attackBox_i.height
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = framesHold
        this.sprites = sprites
        this.dead = false
        this.win = false
    
        for (const sprite in this.sprites) {
          sprites[sprite].image = new Image()
          sprites[sprite].image.src = sprites[sprite].imageSrc
        }
      }
    
      update() {
        this.draw()
        if (!this.dead) this.animateFrames()
    
        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.attackBox_i.position.x = this.position.x + this.attackBox_i.offset.x
        this.attackBox_i.position.y = this.position.y + this.attackBox_i.offset.y
    
        // draw the attack box
        // c.fillRect(
        //   this.attackBox.position.x,
        //   this.attackBox.position.y,
        //   this.attackBox.width,
        //   this.attackBox.height
        // )
        // c.fillStyle = 'black';
        // c.resetTransform();

        // c.fillRect(
        //   this.attackBox_i.position.x,
        //   this.attackBox_i.position.y,
        //   this.attackBox_i.width,
        //   this.attackBox_i.height
        // )
        // c.fillStyle = 'black';
        // c.resetTransform();

    
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    
        // gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 458) {
          this.velocity.y = 0
        } else this.velocity.y += gravity
      }
    
      attack() {
        if(this.lastKey === 'a' || this.lastKey === 'ArrowRight'){
          this.switchSprite('attack1_i')
        } 
        else{
        this.switchSprite('attack1')
        }
        this.isAttacking = true
      }
    
      takeHit(dmg) {
        this.health -= dmg
        const rn_framesHold = this.framesHold
        this.framesHold = 12
        if (this.health <= 0) {
            this.switchSprite('death')
        } else{
            this.switchSprite('takeHit')
          }
        setTimeout(() => {
            this.framesHold = rn_framesHold
        }, 1000)
    }
    
      switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
          if (this.framesCurrent === this.sprites.death.framesMax - 1)
            this.dead = true
          return
        }
    
        // overriding all other animations with the attack animation
        if (
          this.image === this.sprites.attack1.image &&
          this.framesCurrent < this.sprites.attack1.framesMax - 1
        )
          return
          if (
            this.image === this.sprites.attack1_i.image &&
            this.framesCurrent < this.sprites.attack1_i.framesMax - 1
          )
            return
    
        // override when fighter gets hit
        if (
          this.image === this.sprites.takeHit.image &&
          this.framesCurrent < this.sprites.takeHit.framesMax - 1
        )
          return
    
        switch (sprite) {
          case 'idle':
            if (this.image !== this.sprites.idle.image) {
              this.image = this.sprites.idle.image
              this.framesMax = this.sprites.idle.framesMax
              this.framesCurrent = 0
            }
            break
          case 'run':
            if (this.image !== this.sprites.run.image) {
              this.image = this.sprites.run.image
              this.framesMax = this.sprites.run.framesMax
              this.framesCurrent = 0
            }
            break
          case 'jump':
            if (this.image !== this.sprites.jump.image) {
              this.image = this.sprites.jump.image
              this.framesMax = this.sprites.jump.framesMax
              this.framesCurrent = 0
            }
            break
    
          case 'fall':
            if (this.image !== this.sprites.fall.image) {
              this.image = this.sprites.fall.image
              this.framesMax = this.sprites.fall.framesMax
              this.framesCurrent = 0
            }
            break
    
          case 'attack1':
            if (this.image !== this.sprites.attack1.image) {
              this.image = this.sprites.attack1.image
              this.framesMax = this.sprites.attack1.framesMax
              this.framesCurrent = 0
            }
            break
    
          case 'takeHit':
            if (this.image !== this.sprites.takeHit.image) {
              this.image = this.sprites.takeHit.image
              this.framesMax = this.sprites.takeHit.framesMax
              this.framesCurrent = 0
            }
            break
    
          case 'death':
            if (this.image !== this.sprites.death.image) {
              this.image = this.sprites.death.image
              this.framesMax = this.sprites.death.framesMax
              this.framesCurrent = 0
            }
            break

          case 'idle_i':
            if (this.image !== this.sprites.idle_i.image) {
              this.image = this.sprites.idle_i.image
              this.framesMax = this.sprites.idle_i.framesMax
              this.framesCurrent = 0
            }
            break
          case 'run_i':
            if (this.image !== this.sprites.run_i.image) {
              this.image = this.sprites.run_i.image
              this.framesMax = this.sprites.run_i.framesMax
              this.framesCurrent = 0
            }
              break

              case 'jump_i':
                if (this.image !== this.sprites.jump_i.image) {
                  this.image = this.sprites.jump_i.image
                  this.framesMax = this.sprites.jump_i.framesMax
                  this.framesCurrent = 0
                }
                break
                case 'fall_i':
                  if (this.image !== this.sprites.fall_i.image) {
                    this.image = this.sprites.fall_i.image
                    this.framesMax = this.sprites.fall_i.framesMax
                    this.framesCurrent = 0
                  }
                  break
                  case 'attack1_i':
                    if (this.image !== this.sprites.attack1_i.image) {
                      this.image = this.sprites.attack1_i.image
                      this.framesMax = this.sprites.attack1_i.framesMax
                      this.framesCurrent = 0
                    }
                    break
                    case 'takeHit_i':
                      if (this.image !== this.sprites.takeHit_i.image) {
                        this.image = this.sprites.takeHit_i.image
                        this.framesMax = this.sprites.takeHit_i.framesMax
                        this.framesCurrent = 0
                      }
                      break
              
                    case 'death_i':
                      if (this.image !== this.sprites.death_i.image) {
                        this.image = this.sprites.death_i.image
                        this.framesMax = this.sprites.death_i.framesMax
                        this.framesCurrent = 0
                      }
                      break
          default:
        }
      }
    }
    

    const background = new Sprite({
      position: {
        x: 0,
        y: 0
      },
      imageSrc: './shadowstrikeimages/bg.jpg',
      width: 1690,
      height: 960,
      scale: 1,
    })

    // const shop = new Sprite({
    //   position: {
    //     x: 1400,
    //     y: 255
    //   },
    //   imageSrc: './shadowstrikeimages/shop.png',
    //   width: 1000,
    //   height: 200,
    //   scale: 4.5,
    //   framesMax: 6,
    // })

    //const space = (window.innerWidth - 200) / 2

    const player = new Fighter({
      position: { x: 500, y: 0 },
      velocity: { x: 0, y: 0 },
      // offset: { x: 0, y: 0},
      imageSrc: "./shadowstrikeimages/player1/Idle.png",
      framesMax: 8,
      scale: 5,
      offset: {
        x: 400,
        y: 140
      },
      sprites: {
        idle: {
          imageSrc: './shadowstrikeimages/player1/Idle.png',
          framesMax: 8
        },
        run: {
          imageSrc: './shadowstrikeimages/player1/Run.png',
          framesMax: 8
        },
        jump: {
          imageSrc: './shadowstrikeimages/player1/Jump.png',
          framesMax: 2
        },
        fall: {
          imageSrc: './shadowstrikeimages/player1/Fall.png',
          framesMax: 2
        },
        attack1: {
          imageSrc: './shadowstrikeimages/player1/Attack1.png',
          framesMax: 6
        },
        takeHit: {
          imageSrc: './shadowstrikeimages/player1/Take Hit - white silhouette.png',
          framesMax: 4
        },
        death: {
          imageSrc: './shadowstrikeimages/player1/Death.png',
          framesMax: 6
        },

        idle_i: {
          imageSrc: './shadowstrikeimages/player1_inverted/Idle.png',
          framesMax: 8
        },
        run_i: {
          imageSrc: './shadowstrikeimages/player1_inverted/Run.png',
          framesMax: 8
        },
        jump_i: {
          imageSrc: './shadowstrikeimages/player1_inverted/Jump.png',
          framesMax: 2
        },
        fall_i: {
          imageSrc: './shadowstrikeimages/player1_inverted/Fall.png',
          framesMax: 2
        },
        attack1_i: {
          imageSrc: './shadowstrikeimages/player1_inverted/Attack1.png',
          framesMax: 6
        },
        takeHit_i: {
          imageSrc: './shadowstrikeimages/player1_inverted/Take Hit - white silhouette.png',
          framesMax: 4
        },
        death_i: {
          imageSrc: './shadowstrikeimages/player1_inverted/Death.png',
          framesMax: 6
        }
      },
        attackBox: {
          offset: {
            x: 100,
            y: 50
          },
          width: 340,
          height: 100
        },
        attackBox_i: {
          offset: {
            x: -340,
            y: 50
          },
          width: 340,
          height: 100
        },
        framesHold: 4
    });

    const enemy = new Fighter({
      position: {
        x: 1000,
        y: 0
      },
      velocity: {
        x: 0,
        y: 0
      },
      // offset: { x: -50, y: 0},
      imageSrc: './shadowstrikeimages/player2/Idle.png',
      framesMax: 4,
      scale: 5,
      offset: {
        x: 400,
        y: 170,
      },
      sprites: {
        idle: {
          imageSrc: './shadowstrikeimages/player2/Idle.png',
          framesMax: 4
        },
        run: {
          imageSrc: './shadowstrikeimages/player2/Run.png',
          framesMax: 8
        },
        jump: {
          imageSrc: './shadowstrikeimages/player2/Jump.png',
          framesMax: 2
        },
        fall: {
          imageSrc: './shadowstrikeimages/player2/Fall.png',
          framesMax: 2
        },
        attack1: {
          imageSrc: './shadowstrikeimages/player2/Attack1.png',
          framesMax: 4
        },
        takeHit: {
          imageSrc: './shadowstrikeimages/player2/Take_hit.png',
          framesMax: 4
        },
        death: {
          imageSrc: './shadowstrikeimages/player2/Death.png',
          framesMax: 7
        },
        idle_i: {
          imageSrc: './shadowstrikeimages/player2_inverted/Idle.png',
          framesMax: 4
        },
        run_i: {
          imageSrc: './shadowstrikeimages/player2_inverted/Run.png',
          framesMax: 8
        },
        jump_i: {
          imageSrc: './shadowstrikeimages/player2_inverted/Jump.png',
          framesMax: 2
        },
        fall_i: {
          imageSrc: './shadowstrikeimages/player2_inverted/Fall.png',
          framesMax: 2
        },
        attack1_i: {
          imageSrc: './shadowstrikeimages/player2_inverted/Attack1.png',
          framesMax: 4
        },
        takeHit_i: {
          imageSrc: './shadowstrikeimages/player2_inverted/Take_Hit.png',
          framesMax: 4
        },
        death_i: {
          imageSrc: './shadowstrikeimages/player2_inverted/Death.png',
          framesMax: 6
        }
      },
        attackBox: {
          offset: {
            x: -330,
            y: 110
        },
        width: 330,
        height: 110
        },
        attackBox_i: {
          offset: {
            x: 100,
            y: 110
          },
          width: 330,
          height: 110
        },
        framesHold: 4
    })
    
  
    function rectangularCollision({ rect1, rect2 }) {
      // which attack box to use
      const attackBox = (rect1.lastKey === 'a' || rect1.lastKey === 'ArrowRight')
        ? rect1.attackBox_i
        : rect1.attackBox;
    
      return (
        attackBox.position.x + attackBox.width >= rect2.position.x &&
        attackBox.position.x <= rect2.position.x + rect2.width &&
        attackBox.position.y + attackBox.height >= rect2.position.y &&
        attackBox.position.y <= rect2.position.y + rect2.height
      );
    }

    function determineWinner({player,enemy,timerId}){
      clearTimeout(timerId)
      if(!document.querySelector(".result")) return;
      document.querySelector(".result").style.display = "flex"
      document.querySelector(".replay").style.display = "flex"
      if(player.health === enemy.health){
        document.querySelector(".result").innerHTML = "Tie"
        document.querySelector(".result").style.right = 1000
        document.querySelector(".result").style.left = 1000
        player.switchSprite('death')
        enemy.switchSprite('death')
      }
      else if(player.health > enemy.health){
        document.querySelector(".result").innerHTML = "Player 1 Wins"
        enemy.switchSprite('death')
        player.win = true
      }
      else if(player.health < enemy.health){
        document.querySelector(".result").innerHTML = "Player 2 Wins"
        player.switchSprite('death')
        enemy.win = true
      }
    }

    let timer = 101
    let timerId
    function decreaseTimer(){
      if(!document.querySelector(".timer"))
          return;
        if(timer >= 0){
          timer--
          timerId = setTimeout(decreaseTimer, 1000)
          document.querySelector(".timer").innerHTML = timer
        }

        if(timer === 0){ 
          document.querySelector(".timer").innerHTML = 0
          determineWinner({player,enemy,timerId})
      }
    }

    const keys = {
      a: {
        pressed: false
      },
      d: {
        pressed: false
      },
      ArrowRight: {
        pressed: false
      },
      ArrowLeft: {
        pressed: false
      }
    }

    decreaseTimer()

    function animate() {
      window.requestAnimationFrame(animate);
      c.fillStyle = 'black';
      c.fillRect(0, 0, canvas.width, canvas.height);
      background.update();
      //shop.update();
      c.fillStyle = 'rgba(255, 255, 255, 0.15)'
      c.fillRect(0, 0, canvas.width, canvas.height)
      player.update();
      enemy.update();

      //player1 movement
      if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -18
        player.switchSprite('run_i')
      }
      else if(!keys.a.pressed && player.lastKey === 'a'){
        player.switchSprite('idle_i')
      }
      else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 18
        player.switchSprite('run')
      } else {
         player.switchSprite('idle')
       }
    
      // jumping for player1
      if (player.velocity.y < 0) {
        player.switchSprite('jump')
      } 
      else if(player.velocity.y < 0 && keys.a.pressed && player.lastKey === 'a'){
        player.switchSprite('jump_i')
      }
      else if (player.velocity.y > 0 && keys.a.pressed && player.lastKey === 'a') {
        player.switchSprite('fall_i')
      }
      else if (player.velocity.y > 0) {
        player.switchSprite('fall')
      }

      // player2 movement
      if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 18
        enemy.switchSprite('run_i')
      } else if(!keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.switchSprite('idle_i')
      } 
      else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -18
        enemy.switchSprite('run')
      } else {
        enemy.switchSprite('idle')
      }
    
      // jumping for player2
      if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
      } 
      else if(enemy.velocity.y < 0 && keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.switchSprite('jump_i')
      }
      else if (enemy.velocity.y > 0 && keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.switchSprite('fall_i')
      }
      else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
      }

      //the detection for collision for player1
      if (
        rectangularCollision({
          rect1: player,
          rect2: enemy
        }) 
        && player.isAttacking
        && player.framesCurrent === 4
      ) {
        player.isAttacking = false
        console.log("wao")
        enemy.takeHit(10)
        document.querySelector(".enemyHP").style.transition = "width 0.2s" 
        document.querySelector(".enemyHP").style.width = enemy.health + '%'
    
      }

    
    // if player1 misses
    if (player.isAttacking && player.framesCurrent === 4) {
      player.isAttacking = false
    }

      //the detection for collision for player2
      if(rectangularCollision({
        rect1: enemy,
        rect2: player
      })
        && enemy.isAttacking
        &&  enemy.framesCurrent === 2
    ){
      enemy.isAttacking = false
      console.log("dem")
      player.takeHit(5)
      document.querySelector(".playerHP").style.transition = "width 0.2s"
      document.querySelector(".playerHP").style.width = player.health + '%'
    }

    // if player2 misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
      enemy.isAttacking = false
    }

    // if one of the player dies
    if(enemy.health <= 0 || player.health <= 0){
      determineWinner({player, enemy, timerId})
    }
  }
    animate();


    // window.addEventListener('resize', resizeCanvas);

    //MOVING THE PLAYER USING EVENT LISTENER

    window.addEventListener('keydown', (event) => {
      if (!player.dead) {
        if(event.repeat) return;
      switch (event.key) {
          case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
          case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
          case 'w':
            player.velocity.y = -20
            break
          case ' ':
            player.attack()
            break
          default:
      }
    }
      if (!enemy.dead) {
        if(event.repeat) return;

        switch (event.key) {
            case 'ArrowRight':
              keys.ArrowRight.pressed = true
              enemy.lastKey = 'ArrowRight'
              break
            case 'ArrowLeft':
              keys.ArrowLeft.pressed = true
              enemy.lastKey = 'ArrowLeft'
              break
            case 'ArrowUp':
              enemy.velocity.y = -20
              break
            case 'ArrowDown':
              enemy.attack()
              break
        default:
      }
    }}
  );

    window.addEventListener('keyup', (event) => {
      switch (event.key) {
        case 'd':
            keys.d.pressed = false
            player.velocity.x = 0;
            player.switchSprite('idle')
            break
        case 'a':
            keys.a.pressed = false
            player.velocity.x = 0;
            player.switchSprite('idle_i')
            break
        case 'w':
          player.velocity.y = 0;
          break;

              case 'ArrowRight':
              keys.ArrowRight.pressed = false
              enemy.velocity.x = 0;
              break
            case 'ArrowLeft':
              keys.ArrowLeft.pressed = false
              enemy.velocity.x = 0;
              break
        
        case 'ArrowUp':
          enemy.velocity.y = 0;
          break;
        default:
      }
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', () => {});
      window.removeEventListener('keyup', () => {});
    };
  // }
  //   const handleResize = () => {
  //     canvas.width = window.innerWidth;
  //     canvas.height = window.innerHeight;
  //     drawImage();
  //   };
  //   handleResize();
  //   window.addEventListener('resize', handleResize);
   }, []);

   return (
    <div>
      <ImportantContent />
    </div>
  );
}

export default Game2;