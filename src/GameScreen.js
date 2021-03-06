import { Scene, Display } from "phaser";
import { game } from "./index";
import Phaser from "phaser";
class GameScene extends Scene {
  constructor(sceneConfigGame) {
    super(sceneConfigGame);
  }
  create() {
    /**Matter Physics */
    this.bgSound = this.sound.add("bg");
    this.matter.world.update60Hz();
    this.matter.world.setBounds(
      0,
      0,
      game.config.width + 100000,
      game.config.height - 10,
      100,
      true,
      false,
      true,
      true
    );
    this.matter.world.setGravity(0, 3.4);
    /**Camera color to be decided */
    /**Increase quality of sprites rendered */  
    this.cameras.main.roundPixels = true; 
    //this.cameras.main.setBackgroundColor(100, 159, 149);
    /**Ball asset intialized */
    this.ball = this.matter.add.image(271, 468, "ball", null, {
      //shape: "circle",
      shape: { type: "circle", width: 125, height: 125 },
      label: "ball",
    });
    this.ball.setBounce(0.6);
    this.ball.setDepth(999);
    this.ball.setScale(0.62)
    this.ball.setFrictionStatic(1);
    /**Add key events */
    this.keys = this.input.keyboard.addKeys({
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right'
    });
    /**Adding sounds */
    this.upSound = this.sound.add("up");
    this.outSound = this.sound.add("out");
    this.scoreSound = this.sound.add("score");
    this.bounce = this.sound.add("collision");
    this.passBy = this.sound.add('wave');
    /**Adding the score --- */
    this.life = 3;
    this.lifeText = this.add
      .text(10, 100, `Life : ${this.life}`, {
        fontSize: "39px",
        fontFamily: "serif",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 10,
        shadow: {
          offsetX: 3.7,
          offsetY: 3.2,
          color: "#000000",
          blur: 40,
          stroke: true,
          fill: true,
        },
      })
      .setScrollFactor(0, 0)
      .setDepth(1000);
    this.score = 0;
    this.scoreText = this.add
      .text(10, 40, `Score : ${this.score}`, {
        fontSize: "39px",
        fontFamily: "serif",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 10,
        shadow: {
          offsetX: 3.7,
          offsetY: 3.2,
          color: "#000000",
          blur: 40,
          stroke: true,
          fill: true,
        },
      })
      .setScrollFactor(0, 0)
      .setDepth(1000);
    /** Adding the tile maps */
    this.map = this.make.tilemap({ key: "map" });

    /**Decalaring tiles */
    this.worldTiles = this.map.addTilesetImage("tiles");

    this.coinTiles = this.map.addTilesetImage("coin");
    this.cloudTile =  this.map.addTilesetImage("clouds");
    /**Creating the blue BG */
       this.blueTiles = this.map.addTilesetImage("blue");
       this.skyLayer = this.map.createDynamicLayer("BG", this.blueTiles, 0, -70);
    /** Creating a ground Layer */
    this.groundLayer = this.map.createDynamicLayer(
      "Ground",
      this.worldTiles,
      0,
      0
    );
     /**Creating a world Layer */
     this.worldLayer = this.map.createDynamicLayer(
       "World",
       [this.worldTiles, this.coinTiles],
       0,
       0
     );
    /**Adding a ground rectangle */
    this.groundRectangle = this.matter.add.rectangle(0, game.config.height - 160/2  , 10000, 160, { shape: "rectangle", isStatic: true, label: "ground" }); 
     /**Creating the cloud layer */
     this.cloudlayer = this.map.createDynamicLayer(
       "Clouds",
       this.cloudTile,
       0,
       0
     );    
    /** Setting the layer !! */
    this.worldLayer.setCollisionByProperty({ collides: true });
    /**Creating a new layer, for traps */
    this.trapLayer = this.map.createBlankDynamicLayer(
      "trap",
      this.worldTiles,
      0,
      70
    );
      
    /**Dynamically adding the no-zone - to reduce life */
    this.indexOfWarnTile = 7;
    this.trapLayer.fill(this.indexOfWarnTile, 24, 9, 1, 2); //1 rows and 2 columns
    this.trapLayer.setCollision(this.indexOfWarnTile);

    /**Adding the coins from the tileset */
    this.coinLayer = this.map.createBlankDynamicLayer(
      "coinLayer",
      this.coinTiles,
      0,
      0
    );
    
    /**Dynamically adding the coins !! */
    /**Getting the first index */
    this.firstIndex = this.worldLayer.tileset[1].firstgid;
    this.indexOfCoinTile = this.firstIndex;

    /**Random Coins on ground*/
    for (let i = 0; i < 2; i++) {
      let coinsX = Phaser.Math.Between(5, 17);
      this.coinLayer.fill(this.indexOfCoinTile, coinsX, 11, 1, 1);
      this.coinLayer.setCollision(this.indexOfCoinTile);
    }
    let coinsX = Phaser.Math.Between(20, 30);
    this.coinLayer.fill(this.indexOfCoinTile, coinsX, 11, 1, 1);
    this.coinLayer.setCollision(this.indexOfCoinTile); 

    /** Random Coins up */
    for (let i = 0; i < 2; i++) {
      let coinsX = Phaser.Math.Between(6, 13);
      this.coinLayer.fill(this.indexOfCoinTile, coinsX, 4, 1, 1);
      this.coinLayer.setCollision(this.indexOfCoinTile);
    }
    this.coinsX = Phaser.Math.Between(18, 20);
    this.coinLayer.fill(this.indexOfCoinTile, this.coinsX, 1, 1, 1);
    this.coinLayer.setCollision(this.indexOfCoinTile);

    /** Random Coins up */
    this.coinsX = Phaser.Math.Between(27, 30);
    this.coinLayer.fill(this.indexOfCoinTile, this.coinsX, 4, 1, 1);
    this.coinLayer.setCollision(this.indexOfCoinTile);

    /**Add the tile map to the world */
    this.matter.world.convertTilemapLayer(this.worldLayer, {
      label: "world",
      // isStatic: false
    });
    this.matter.world.convertTilemapLayer(this.trapLayer, { label: "trap" });
    this.matter.world.convertTilemapLayer(this.coinLayer, {
      label: "coin",
      isSensor: true,
    });
    /**Animation Fire */
    this.fire =  this.add.sprite(
      38*70,
      7*70,
      "fire",
    ).setScale(2).setOrigin(0.5,0);

    this.fire1 =  this.add.sprite(
      42*70,
      7*70,
      "fire"
    ).setScale(2).setOrigin(0.5,0);

    this.anims.create({
      key: 'fire',
      frames: this.anims.generateFrameNumbers('fire', {
        start: 0,
        end: 4,
      }),
      frameRate: 24,
      repeat: -1
    });
    this.fire.anims.play('fire');
    this.fire1.anims.play('fire');
    this.fireArray = [this.fire, this.fire1];
    this.matter.add.gameObject(this.fire, {label: "fire",isSensor:true , gravityScale: {x:0,y:0}})
    
    this.matter.add.gameObject(this.fire1,{label:'fire', isSensor:true, gravityScale: {x:0,y:0}}); 
    /**Adding the life */
    this.lifeImage = this.add.image(40*70, 10*70,'love').setScale(2).setOrigin(0.5, 0);
    this.matter.add.gameObject(this.lifeImage, {label:'life', isSensor:true, gravityScale: {x:0,y:0}}); 
    /**Adding the gamePad */
    this.gamePad = this.add
      .image(220, game.config.height - 220, "gamePad")
      .setScrollFactor(0, 0)
      .setDepth(1000);

    /**Add Buttons */
    this.leftButton = this.add
      .image(
        this.gamePad.x - this.gamePad.width / 2 + 55,
        this.gamePad.y,
        "leftArrow"
      )
      .setInteractive()
      .setScrollFactor(0, 0)
      .setDepth(1000);
    this.rightButton = this.add
      .image(
        this.gamePad.x + this.gamePad.width / 2 - 55,
        this.gamePad.y,
        "rightArrow"
      )
      .setInteractive()
      .setScrollFactor(0, 0)
      .setDepth(1000);
    this.downButton = this.add
      .image(
        this.gamePad.x,
        this.gamePad.y + this.gamePad.height / 2 - 55,
        "downArrow"
      )
      .setInteractive()
      .setScrollFactor(0, 0)
      .setDepth(1000);
    this.upButton = this.add
      .image(
        this.gamePad.x,
        this.gamePad.y - this.gamePad.height / 2 + 55,
        "upperArrow"
      )
      .setInteractive()
      .setScrollFactor(0, 0)
      .setDepth(1000);

    /** Defining the game controlls of the game object */
    
    this.leftButton.on("pointerdown", () => {
      this.left();
    });
    this.rightButton.on("pointerdown", () => {
      this.right();
    });
    this.downButton.on("pointerdown", () => {
    this.down();
    });
    this.upButton.on("pointerdown", () => {
      this.up();
    });

    /** Setting the bounds of the camera */
    this.cameras.main.setBounds(
      0,
      0,
      this.worldLayer.width,
      game.config.height
    );
    /**Camera follwing the ball */
    this.cameras.main.startFollow(
      this.ball,
      null,
      1,
      1,
      game.config.width / 2 - this.ball.width //Offset
    );
    this.pauseBg = this.add.image(0, 0, "pauseBg").setOrigin(0);
    this.pauseBg.setVisible(false);
    /**The time */
    /**Decalring the rotate text */
    this.rotateText = this.add
      .text(game.config.width / 2, game.config.height / 2, "", {
        fontSize: "100px",
        fontFamily: "serif",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 10,
        shadow: {
          offsetX: 3.7,
          offsetY: 3.2,
          color: "#000000",
          blur: 40,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0, 0)
      .setDepth(1000);

    /**Listening to the matter lib, events*/
    this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      if (bodyA.label === "world" || bodyB.label === "world") {
        // this.bounce.play();
      }
      if (bodyA.label === "ground" || bodyB.label === "ground") {
         this.bounce.play();
      }
      if (bodyA.label === "coin" || bodyB.label === "coin") {
        if (bodyA.label === "coin") {
          this.scoreUpdate(bodyA);
        } else {
          this.scoreUpdate(bodyB);
        }
      }
      if (bodyA.label === "trap" || bodyB.label === "trap" ) {
        this.cameras.main.shake(120);
        this.lifeUpdate();
      }
      if (bodyA.label === "fire" || bodyB.label === "fire" ) {
        this.lifeUpdate();
      }
      if (bodyA.label === "life" || bodyB.label === "life" ) {
        if (bodyA.label === "life") {
          this.lifeUp(bodyA);
        } else {
          this.lifeUp(bodyB);
        }
      }

    });
    // console.log(this.worldLayer)
    // this.cameras.main.pan(
    //   2200, 
    //   this.ball.y - 1000,
    //   3000,
    //   "Expo.easeInOut"
    // );
    // this.cameras.main.zoomTo(2,3000,'Expo');
    
    // this.cameras.main.centerOn(this.ball.x,this.ball.y);

    /**Listening to orientation changed */
    // this.scale.on("orientationchange", (orientation) => {
    //   if (orientation === Phaser.Scale.PORTRAIT) {
    //     this.rotateText.setText("Please rotate the screen to landscape !!");
    //     this.pauseBg.setVisible(true);
    //     this.scene.pause();
    //   } else if (orientation === Phaser.Scale.LANDSCAPE) {
    //     this.scene.resume();
    //     this.rotateText.setText("");
    //     this.pauseBg.setVisible(false);
    //   }
    // });
  


  }
  update() {
    console.log('Hi');
    console.log(game.loop.actualFps)
    if(!this.bgSound.isPlaying){
      this.bgSound.play();
    }   
    if(this.keys.up.isDown){
      this.up();
      }
    if(this.keys.down.isDown){
    this.down();
    }
    if(this.keys.left.isDown){
    this.left();
    }
    if(this.keys.right.isDown){
    this.right();
    }
    /** Updating the text */
    this.scoreText.setText(`Score : ${this.score}`);
    this.lifeText.setText(`Life : ${this.life}`);
    if (this.life === 0) {
      this.sound.stopAll();
      this.scene.restart();
    }

    // if(this.ball.x > 300){
    //   console.log(1);
    // }

    // if (this.scale.orientation === Phaser.Scale.PORTRAIT) {
    //   this.rotateText.setText("Please rotate the screen to landscape!!");
    //   this.pauseBg.setVisible(true);
    //   this.sound.stopAll();
    //   this.scene.pause();
    // }
  }
  scoreUpdate(body) {
    this.score = this.score + 1;

    let positionX = body.position.x;
    let positionY = body.position.y;
    this.coinLayer.removeTileAtWorldXY(positionX, positionY);
    this.matter.world.remove(body);
    this.scoreSound.play();
  }
  lifeUp(body) {
    this.life = this.life + 1;
    console.log(body);
    this.lifeImage.destroy();
    this.scoreSound.play();
  }
  lifeUpdate(){
    this.life = this.life - 1;
    this.ball.x =  271;
    this.ball.y = 468;
    this.outSound.play();
  }
  
  up() {
    this.upSound.play();
    this.ball.setVelocityY(-29);
  }
  down(){
    this.ball.setVelocityY(29);
  }
  left(){
    this.ball.setVelocityX(-20);

    if (!this.passBy.isPlaying) {
      this.passBy.play();
    }
    
  }
  right(){
    this.ball.setVelocityX(20);
    if(!this.passBy.isPlaying)
    { 
      this.passBy.play();
    }
  }

}

export default GameScene;
