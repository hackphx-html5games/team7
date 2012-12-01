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
      context.drawImage(backImg, backgroundx, backgroundy); // WB 0, 0, this.width, this.height);
      context.drawImage(rachelalucard, x, y);
      if (fireballActive === true){
        context.drawImage(fireball, fireballx, firebally);
      }
    },
    initInput: function(){
      //tells the input manager to listen for key events
      this.inputManager.addKeyAction(keys.LEFT_ARROW);
      this.inputManager.addKeyAction(keys.RIGHT_ARROW);
      this.inputManager.addKeyAction(keys.SPACE);
      this.inputManager.addKeyAction(keys.UP_ARROW)
    },
    update: function(millis){
      //just an example showing how to check for presses, could be done more effeciently
      if (y<(this.height-rachelalucard.height-4)){
        y=y+2;
      }
      if(this.inputManager.keyActions[keys.LEFT_ARROW].isPressed() && backgroundx<=0){
        backgroundx+= speed; // WB
      }
      if(this.inputManager.keyActions[keys.RIGHT_ARROW].isPressed() && (x>=this.width-rachelalucard.width)){
        backgroundx-= speed; // WB
      }
      if(this.inputManager.keyActions[keys.UP_ARROW].isPressed() && y>0){
        y=y-3;
      }
      if(this.inputManager.keyActions[keys.SPACE].isPressed()){
        fireballActive = true;
        fireballx = x+(rachelalucard.width / 2);
        firebally = y+(rachelalucard.height / 2);
      }
      if (fireballActive === true){
        fireballx+= fireballSpeed;
      }
    }
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});