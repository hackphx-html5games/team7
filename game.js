require(['frozen/GameCore', 'frozen/ResourceManager', 'dojo/keys', 'frozen/Sprite'], function(GameCore, ResourceManager, keys, Sprite){

  var x = 0;
  var y = 0;
  var serenityx = 300;
  var serenityy = 300;
  var serenityspeed = 2.5;
  var bulletx = 300;
  var bullety = 300;
  var bulletSpeed = 4;
  var enemyx = 0;
  var enemyy = 0;
  var enemySpeed = 0;
  var bulletArray = [];
  var enemyArray = [];


  //setup a ResourceManager to use in the game
  var rm = new ResourceManager();
  var backImg = rm.loadImage('images/space2.jpg');
  var serenity = rm.loadImage('images/serenity.png');
  var bullet = rm.loadImage('images/bullet.png')
  var enemy = rm.loadImage('images/bullet.png')
  
  var game = new GameCore({
    canvasId: 'canvas',
    resourceManager: rm,
    draw: function(context){
      context.drawImage(backImg,x,y);
      context.drawImage(serenity, serenityx, serenityy);
      bulletArray.forEach (function(bulletObj){
        context.drawImage(bullet, bulletObj.x, bulletObj.y);
      });
      enemyArray.forEach (function(enemyObj){
        context.drawImage(enemy, enemyObj.x, enemyObj.y);
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
      enemyArray.forEach (function(enemyArray){
        enemyObj.y = Math.random(enemyObj.y) + enemySpeed;
      });
   }
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});