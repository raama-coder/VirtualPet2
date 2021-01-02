var dog, happyDog, dogImg, happyDogImg
var dataBase
var foodS, foodStock
var feedDogButton=false;
var addFoodButton=false;
var add
var feed
var fedTime
var lastFed
var milk

function preload(){
  dogImg = loadImage("images/dog.png")
  happyDogImg = loadImage("images/happyDog.png")
}

function setup() {
    createCanvas(1000, 600);
    dog = createSprite(750,380,150,50);
    dog.addImage(dogImg);
    dog.scale = 0.23;
    
    milk = new Milk()

    dataBase=firebase.database();
    foodStock = dataBase.ref("Food");
    foodStock.on("value", getFoodStock);
    
    
    
    console.log(milk.foodStock);
    
    feed= createButton("FEED DOG");
    feed.position(853, 150);
    feed.mousePressed(feedDog);

    add = createButton("ADD FOOD");
    add.position(550, 150);
    add.mousePressed(addFood);
}

function draw() {
  background(62, 149, 101)

  drawSprites();

  textSize(36)
  strokeWeight(2);
  fill("white")
  text("Feed Drago Milk Please!!!", 40,50);

  showTime()

console.log(fedTime)

  milk.display()
}

function getFoodStock(data){
  foodS=data.val();
  milk.foodStock=foodS;
}

function addFood(){
  milk.foodStock+=1
  milk.updateFood();

}

function deductFood(){
  milk.foodStock-=1
  milk.updateFood();
}

function feedDog(){
  lastFed = dataBase.ref("LastFed");
  lastFed.on("value",function(data){
    fedTime=data.val()
  })
  var currHour=new Date().getHours();
  if (currHour-fedTime>=1){
    deductFood();
    dataBase.ref('/').update({
      LastFed: currHour
    })
  }
  dog.addImage(happyDogImg);
}

function showTime(){
lastFed = dataBase.ref("LastFed");
lastFed.on("value",function(data){
  fedTime=data.val()
})

  fill("blue")
  textSize(25)
  if(lastFed>=12){
    text("Last Fed Time: "+ fedTime%12 + " PM", 600, 60)
  }else if(lastFed==0){
    text("Last Fed Time: 12 AM", 600, 60)
  }else{
    text("Last Fed Time: "+ fedTime + " AM", 600, 60)
  }
}