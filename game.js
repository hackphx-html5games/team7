require(['frozen/GameCore', 'frozen/ResourceManager', 'dojo/keys', 'frozen/Sprite'], function(GameCore, ResourceManager, keys, Sprite){

  var imgx = 0;
  var imgy = 0;
  var serenityspeed = 3.5;

  var bulletSpeed = 4;
  var enemyx = 300;
  var enemyy = 0;

  var attackSpeed = 4;
  var attackx = 0;
  var attacky = 0;

  var bulletArray = [];
  var attackArray = [];
  var kaboomArray = [];
  var gamestart = false

  var startx = 0;
  var starty = 0;

  var scorex = 0;
  var scorey = 0;
  var scoreAmt = 0;


  function collides(a, b) {
    return a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y;
  }

  //setup a ResourceManager to use in the game
  var rm = new ResourceManager();
  var backImg = rm.loadImage('images/space2.jpg');
  var serenity = rm.loadImage('images/serenity.png');
  var bullet = rm.loadImage('images/bullet.png');
  var enemy = rm.loadImage('images/enemy.png');
  var attack = rm.loadImage('images/enemyAttack.png');
  var start = rm.loadImage('images/start.png');
  var kaboom = rm.loadImage('images/kaboom.png')
  var score = rm.loadImage('images/score.png')
  var serenityObj;
  var game = new GameCore({
    canvasId: 'canvas',
    resourceManager: rm,
    draw: function(context){
      if (gamestart===false){
        context.drawImage(start,startx,starty)
      }
      else{
        context.drawImage(backImg,imgx,imgy);
        context.drawImage(serenity, serenityObj.x, serenityObj.y);
        context.drawImage(enemy, enemyx, enemyy);
        context.drawImage(score, scorex, scorey);
        bulletArray.forEach (function(bulletObj){
          context.drawImage(bullet, bulletObj.x, bulletObj.y);
        });
        attackArray.forEach (function(attackObj){
          context.drawImage(attack, attackObj.x, attackObj.y);
        });
        kaboomArray.forEach(function(kaboomObj){
          context.drawImage(kaboom, kaboomObj.x, kaboomObj.y);
        });
        context.strokeStyle = "fdad3a";
        context.font = "48px herculean";
        context.fillText(scoreAmt, 150, 50);
      }
    },
    initInput: function(){
      //tells the input manager to listen for key events
      this.inputManager.addKeyAction(keys.LEFT_ARROW);
      this.inputManager.addKeyAction(keys.RIGHT_ARROW);
      this.inputManager.addKeyAction(keys.DOWN_ARROW);
      this.inputManager.addKeyAction(keys.UP_ARROW)
      this.inputManager.addKeyAction(keys.SPACE, true);
      this.inputManager.addKeyAction(keys.ENTER);
      serenityObj = new Sprite({x:300,y:500, w:serenity.width, h: serenity.height, dx:0, dy:0});
    },
    update: function(millis){
      //just an example showing how to check for presses, could be done more effeciently
      if(this.inputManager.keyActions[keys.ENTER].isPressed()){
        gamestart=true;
      }
      if(this.inputManager.keyActions[keys.LEFT_ARROW].isPressed() && serenityObj.x > 0){
        serenityObj.x-= serenityspeed;
      }
      if(this.inputManager.keyActions[keys.RIGHT_ARROW].isPressed() && serenityObj.x < (this.width-serenity.width)){
        serenityObj.x+= serenityspeed;
      }
      if(this.inputManager.keyActions[keys.UP_ARROW].isPressed() && serenityObj.y > 0){
        serenityObj.y-=serenityspeed;
      }
      if(this.inputManager.keyActions[keys.DOWN_ARROW].isPressed() && serenityObj.y < (this.height-serenity.height)){
        serenityObj.y+=serenityspeed;
      }
      if(this.inputManager.keyActions[keys.SPACE].getAmount()){
        bulletx = serenityObj.x+(serenity.width / 2);
        bullety = serenityObj.y+(serenity.height / 2);
        var bulletObj = new Sprite({x:bulletx,y:bullety, w:bullet.width, h: bullet.height, dx:0, dy: -bulletSpeed});
        bulletArray.push(bulletObj);
      }
      bulletArray.forEach (function(bulletObj){
        bulletObj.y = bulletObj.y - bulletSpeed;
        attackArray.forEach (function(attackObj){

          if (collides(bulletObj,attackObj)===true){
            var kaboomObj = new Sprite({x:bulletObj.x,y:bulletObj.y, w:kaboom.width, h: kaboom.height, dx:0, dy:0});
            kaboomArray.push(kaboomObj);
            kaboomObj.countdown=500;
            scoreAmt++;
            bulletObj.destroy = true;
            attackObj.destroy = true;
          }
        });
      });
      bulletArray = bulletArray.filter (function(bulletObj){
        if (bulletObj.y < 0 || bulletObj.destroy){
          return false;
        }
        else{
          return true;
        }
      });
      if (attackArray.length < 30){
        var attackObj = new Sprite({x:Math.random()*this.width,y:attacky,w:attack.width, h:attack.height, dx:0, dy:attackSpeed});
        attackArray.push(attackObj);
      }
      attackArray.forEach (function(attackObj){
        attackObj.y = attackObj.y + attackSpeed;

        if (collides(serenityObj, attackObj)===true){
          var kaboomObj = new Sprite({x:serenityObj.x,y:serenityObj.y, w:kaboom.width, h: kaboom.height, dx:0, dy:0});
          kaboomArray.push(kaboomObj);
          kaboomObj.countdown=500;
          scoreAmt= scoreAmt-1;
        }
      });
      attackArray = attackArray.filter (function(attackObj){
        if (attackObj.y > this.height || attackObj.destroy){
          return false;
        }
        else{
          return true;
        }
      },this);

      kaboomArray.forEach (function(kaboomObj){
        if (kaboomObj.countdown>0){
          kaboomObj.countdown-=millis;
        }
      });
      kaboomArray = kaboomArray.filter (function(kaboomObj){
        if (kaboomObj.countdown <= 0){
          return false;
        }
        else{
          return true;
        }
      });
    }
  });
  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});
