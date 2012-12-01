//load the AMD modules we need
require(['frozen/GameCore', 'frozen/ResourceManager', 'dojo/keys'], function(GameCore, ResourceManager, keys){

  var x = 50;
  var y = 0;
  var speed = 8;
  var backImgx = 0;
  var fireballSpeed = 7;
  var fireballx = 145;
  var firebally = 0;
  var fireballActive = false;
  var backgroundx = 0;  // WB
  var backgroundy = 0;  // WB

  //setup a ResourceManager to use in the game
  var rm = new ResourceManager();
  var backImg = rm.loadImage('images/gardenbackground.png');
  var rachelalucard = rm.loadImage('images/rachelalucard.png');
  var fireball = rm.loadImage('images/FireBall.png')

  //setup a GameCore instance

  var game = new GameCore({
    canvasId: 'canvas',
    resourceManager: rm,
    draw: function(context){
      context.drawImage(backImg,x,y);
      context.drawImage(serenity, serenityx, serenityy);
      bulletArray.forEach (function(bulletObj){
        context.drawImage(bullet, bulletObj.x, bulletObj.y);
      });
      // enemyArray.forEach (function(enemyObj){
      //   context.drawImage(enemy, enemyObj.x, enemyObj.y);
      // });
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
      //just an example showing how to check for presses, could be done more effeciently
      if(this.inputManager.keyActions[keys.LEFT_ARROW].isPressed()){
        serenityx-= serenityspeed; 
      }
      if(this.inputManager.keyActions[keys.RIGHT_ARROW].isPressed()){
        serenityx+= serenityspeed;
      }
      if(this.inputManager.keyActions[keys.UP_ARROW].isPressed()){
        serenityy-=serenityspeed;
      }
      if(this.inputManager.keyActions[keys.DOWN_ARROW].isPressed()){
        serenityy+=serenityspeed;
      }
      if(this.inputManager.keyActions[keys.SPACE].getAmount()){
        bulletx = serenityx+(serenity.width / 2);
        bullety = serenityy+(serenity.height / 2);
        var bulletObj = new Sprite({x:bulletx,y:bullety, w:bullet.width, h: bullet.height, dx:0, dy: -bulletSpeed});
        bulletArray.push(bulletObj);
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
      var enemyObj = new Sprite({x:enemyx,y:enemyy,w:enemy.width, h:enemy.height, dx:Math.random(enemySpeed), dy:Math.random(enemySpeed)});
      // enemyArray.forEach (function(enemyArray){
      //   enemyObj.y = Math.random(enemyObj.y) + enemySpeed;
      // });
   }
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});
