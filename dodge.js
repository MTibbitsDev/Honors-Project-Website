// Made with help from https://www.w3schools.com/graphics/game_intro.asp
var player;
var enemies = [];
var interval = $("#interval").val();
var speed = $("#speed").val();
var size = $("#size").val();
var score = 0;

function start() {
  gameFrame.start();
  player = new component(30, 30, "red", 10, 120, "player");
  $("#start").hide();
  document.getElementById("restart").style.display = "none";
  interval = $("#interval").val();
  speed = $("#speed").val();
  size = $("#size").val();
  score = 0;
  $("#text").text("");
}

var gameFrame = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    this.canvas.style.border = "1px solid";
    this.canvas.style.background = "lightblue";
    $("#game").append(this.canvas);
    this.interval = setInterval(update, 20);
    this.frameCount = 0;
    $(document).on("keydown", function(e) {
      gameFrame.key = e.which;
      return false;
    })
    $(document).on("keyup", function(e) {
      gameFrame.key = false;
    })
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    clearInterval(this.interval);
  }
}

function component(height, width, color, x, y, shape) {
  this.height = height;
  this.width = width;
  this.x = x
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.update = function() {
    ctx = gameFrame.context;
    ctx.fillStyle = color;
    if (shape == "enemy") {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.width, this.y);
      ctx.lineTo(this.x, this.y + this.height)
      ctx.fill();
    } else {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  this.move = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.hitSide();
  }
  this.hitEnemy = function(enemy) {
    if ((this.y + this.height < enemy.y) ||
      (this.y > enemy.y + enemy.height) ||
      (this.x + this.width < enemy.x) ||
      (this.x > enemy.x + enemy.width)) {
      return false;
    }
    return true;
  }
  this.hitSide = function() {
    if (this.y > gameFrame.canvas.height - this.height) {
      this.y = gameFrame.canvas.height - this.height;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.x > gameFrame.canvas.width - this.width) {
      this.x = gameFrame.canvas.width - this.width;
    }
    if (this.x < 0) {
      this.x = 0;
    }
  }
}

function update() {
  for (const enemy of enemies) {
    if (player.hitEnemy(enemy)) {
      gameFrame.stop();
      document.getElementsByTagName("canvas")[0].style.background = "black";
      $("#text").text("Game Over! Score: " + score);
      $("#restart").show();
    }
  }
  gameFrame.clear();
  gameFrame.frameCount += 1;
  score += 1;
  if (gameFrame.frameCount == 1 || (gameFrame.frameCount / parseInt(interval)) % 1 == 0) {
    enemies.push(new component(parseInt(size), parseInt(size), getColor(), getInt(10, gameFrame.canvas.width), 0, "enemy"));
  }
  for (const enemy of enemies) {
    enemy.y += parseInt(speed);
    enemy.update();
  }
  player.speedX = 0;
  player.speedY = 0;
  if (gameFrame.key) {
    switch (gameFrame.key) {
      case 37: // left
        player.speedX = -5;
        break;
      case 38: // up
        player.speedY = -5;
        break;
      case 39: // right
        player.speedX = 5;
        break;
      case 40: // down
        player.speedY = 5;
        break;
    }
  }
  player.move();
  player.update();
}

function restart() {
  gameFrame.stop();
  gameFrame.clear();
  player = {};
  enemies = [];
  start();
}

function getInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getColor() {
  return "rgb(" + getInt(0, 255) + "," + getInt(0, 255) + "," + getInt(0, 255) + ")";
}

$("#start").on("click", function() {
  start();
})

$("#restart").on("click", function() {
  restart();
})
