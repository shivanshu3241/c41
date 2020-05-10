class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage("car1",car1i);

    car2 = createSprite(300,200);
    car2.addImage("car2",car2i);

    car3 = createSprite(500,200);
    car3.addImage("car3",car3i);

    car4 = createSprite(700,200);
    car4.addImage("car4",car4i);

    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();
    player.getCarsAtEnd();

    Player.getPlayerInfo();
    
    if(allPlayers !== undefined){
      background(198,135,103);

      image(track,0,-displayHeight*4,displayWidth,displayHeight*5)
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 230;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 300;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;

        if (index === player.index){
          stroke(10);
          fill("green");
          ellipse(x,y,60,60);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }
    }

    if(keyIsDown(UP_ARROW) && player.index !== null && player.distance<=5130){
      player.distance +=10
      player.update();
      console.log(player.distance);
    }

    if(player.distance >= 5130){
      gameState = 2;
      player.rank = player.rank+1;
      Player.updateCarsAtEnd(player.rank);
      game.update(2);
    }

    drawSprites();
  }
  end(){
    console.log("game ended");
    console.log(player.rank);
    var i = 0;
    textSize(30);
    fill("white");
    text("Game Over ", displayWidth/2, -displayHeight*4 - 200);
    for(var plr in allPlayers ){
     i = i+1 
     if(i == player.index){
       textSize(30);
       fill("white");
       text(player.rank, cars[i-1].x, cars[i-1].y-100);
     }
    }
  }
}
