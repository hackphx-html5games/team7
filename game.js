// Code: Alisa
// Assets: Regi
// Sound code, git wrangling: Jay

require(['frozen/GameCore', 'frozen/ResourceManager', 'dojo/keys', 'frozen/Sprite'], function(GameCore, ResourceManager, keys, Sprite){

  var x = 0;
  var y = 0;
  var serenityx = 300;
  var serenityy = 300;
  var serenityspeed = 2.5;
  var bulletSpeed = 4;
  var enemyx = 300;
  var enemyy = 0;
  var attackSpeed = 4;
  var attackx = 0;
  var attacky = 0;
  var bulletArray = [];
  var attackArray = [];
  
  //setup a ResourceManager to use in the game
  var rm = new ResourceManager({
    soundsDir: 'sound/',
    imageDir: 'images/'
  });

  //Images.
  var backImg = rm.loadImage('space2.jpg');
  var serenity = rm.loadImage('serenity.png');
  var bullet = rm.loadImage('bullet.png');
  var enemy = rm.loadImage('enemy.png');
  var attack = rm.loadImage('enemyAttack.png');
  
  //Sounds.
  var music = rm.loadSound('music.mp3');
  var musicSource = null;
  var pew = rm.loadSound('pew.ogg');
  
  var gameStarted = false;
  var gameOver = false;
  
  //Time accumulators.
  var timeSinceAttack = 0;
  var timeSinceShot = 0;
  
  var game = new GameCore({
    canvasId: 'canvas',
    resourceManager: rm,
    draw: function(context){
      context.drawImage(backImg,x,y);
      context.drawImage(serenity, serenityx, serenityy);
      context.drawImage(enemy, enemyx, enemyy);
      bulletArray.forEach (function(bulletObj){
        context.drawImage(bullet, bulletObj.x, bulletObj.y);
      });
      attackArray.forEach (function(attackObj){
        context.drawImage(attack, attackObj.x, attackObj.y);
      });
    },
    initInput: function(){
      //tells the input manager to listen for key events
      this.inputManager.addKeyAction(keys.LEFT_ARROW);
      this.inputManager.addKeyAction(keys.RIGHT_ARROW);
      this.inputManager.addKeyAction(keys.DOWN_ARROW);
      this.inputManager.addKeyAction(keys.UP_ARROW)
      this.inputManager.addKeyAction(keys.SPACE, true);
    },
    update: function(millis){
      
      // --------------------------------------------------------
      // Game status.
      // --------------------------------------------------------
      
      if (!gameStarted) {
        // musicSource = rm.playSound(music, true); //Loop music.
        gameStarted = true;
      }
      if (gameOver) {
        musicSource.noteOff();
        gameOver = false;
      }
      
      // --------------------------------------------------------
      // Enemy attacks.
      // --------------------------------------------------------
      timeSinceAttack += millis;
      if (timeSinceAttack > 100) {
        if (attackArray.length < 30){
          var attackObj = new Sprite({x:Math.random()*this.width,y:attacky,w:attack.width, h:attack.height, dx:0, dy:attackSpeed});
          attackArray.push(attackObj);
        }
        timeSinceAttack = 0;
      }
      
      bulletArray.forEach (function(bulletObj){
        bulletObj.y = bulletObj.y - bulletSpeed;
      });
      
      bulletArray = bulletArray.filter (function(bulletObj){
        if (bulletObj.y < 0){
          return false;
        }
        else{
          return true;
        }
      });
      
      attackArray.forEach (function(attackObj){
        attackObj.y = attackObj.y + attackSpeed;
      });
      
      attackArray = attackArray.filter (function(attackObj){
        if (attackObj.y > this.height){
          return false;
        }
        else{
          return true;
        }
      }, this);
      
      // --------------------------------------------------------
      // Input.
      // --------------------------------------------------------
      
      //just an example showing how to check for presses, could be done more effeciently
      if(this.inputManager.keyActions[keys.LEFT_ARROW].isPressed() && serenityx > 0){
        serenityx-= serenityspeed; 
      }
      if(this.inputManager.keyActions[keys.RIGHT_ARROW].isPressed() && serenityx < (this.width-serenity.width)){
        serenityx+= serenityspeed;
      }
      if(this.inputManager.keyActions[keys.UP_ARROW].isPressed() && serenityy > 0){
        serenityy-=serenityspeed;
      }
      if(this.inputManager.keyActions[keys.DOWN_ARROW].isPressed() && serenityy < (this.height-serenity.height)){
        serenityy+=serenityspeed;
      }
      
      timeSinceShot += millis;
      if(this.inputManager.keyActions[keys.SPACE].getAmount()){
        if (timeSinceShot > 300) {
          bulletx = serenityx+(serenity.width / 2);
          bullety = serenityy+(serenity.height / 2);
          var bulletObj = new Sprite({x:bulletx,y:bullety, w:bullet.width, h: bullet.height, dx:0, dy: -bulletSpeed});
          bulletArray.push(bulletObj);
          rm.playSound(pew);
          timeSinceShot = 0;
        }
      }
      
      // --------------------------------------------------------
      // Collision.
      // --------------------------------------------------------
      
      var intersectSprite = function (bulletObj, attackObj) {
        var distance_squared = Math.pow((bulletObj.x + (bulletObj.width/2)) - (attackObj.x + (attackObj.width/2)),2) + Math.pow((bulletObj.y + (bulletObj.height/2)) - (attackObj.y + (attackObj.height/2)),2);
        var radii_squared = Math.pow(bulletObj.collisionRadius + attackObj.collisionRadius,2);
        return distance_squared < radii_squared;  // true if intersect  
      };

    }

  });

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});