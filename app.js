// Define canvas and context variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 1200;
canvas.height = 800;

// Define character variables
var character = {
  x: 50,
  y: 500,
  width: 50,
  height: 50,
  speed: 5,
  jumpHeight: 150,
  jumpCount: 0,
  gravity: 0.7,
  jumpVelocity: -9, // New variable for initial jump velocity
  velX: 0,
  velY: 0,
};

    // Define movablePlatform properties
    var movablePlatform = {
        x: 700, // Add "x" property to define horizontal position
        y: 400,
        width: 100,
        height: 25
      };
      
      let x = 700; // Set initial x position of movablePlatform
      let direction = 'left'; // Set initial direction to left


// Define floor variables
var floor = {
  x: 0,
  y: canvas.height - 50,
  width: canvas.width,
  height: 50
};

// Define platform variables
var platforms = [
  {x: 300, y: 700, width: 200, height: 25},
  {x: 400, y: 600, width: 200, height: 25},
  {x: 350, y: 350, width: 200, height: 25},
  {x: 100, y: 500, width: 150, height: 25},
  {x: 450, y: 450, width: 100, height: 25},
  {x: 700, y: 650, width: 200, height: 25},
  {x: 800, y: 550, width: 200, height: 25},
  {x: 900, y: 450, width: 200, height: 25},
  {x: 1000, y: 350, width: 150, height: 25},
  {x: 1100, y: 250, width: 100, height: 25},
  movablePlatform // Add movablePlatform to the array
];
 

// Define key listener
document.body.addEventListener('keydown', function(e) {
  switch(e.key) {
    case 'ArrowLeft':
    case 'a':
      character.velX = -character.speed;
      break;
    case 'ArrowRight':
    case 'd':
      character.velX = character.speed;
      break;
    case 'ArrowUp':
    case 'w':
      if (character.jumpCount < 2) {
        character.velY = character.jumpVelocity; // Use jumpVelocity as initial velocity
        character.jumpCount++;
      }
      break;
  }
});

// Define key release listener
document.body.addEventListener('keyup', function(e) {
  switch(e.key) {
    case 'ArrowLeft':
    case 'a':
      character.velX = 0;
      break;
    case 'ArrowRight':
    case 'd':
      character.velX = 0;
      break;
  }
});

function collides(rect1, rect2) {
    // Calculate the sides of the rectangle
    var left1 = rect1.x;
    var right1 = rect1.x + rect1.width;
    var top1 = rect1.y;
    var bottom1 = rect1.y + rect1.height;
    var left2 = rect2.x;
    var right2 = rect2.x + rect2.width;
    var top2 = rect2.y;
    var bottom2 = rect2.y + rect2.height;
  
    // Check for collision
    return left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2;
  }
  

function update() {
  // Update character position
  character.velY += character.gravity;
  character.x += character.velX;
  character.y += character.velY;

  // Check for collisions with floor
  if (character.y + character.height > floor.y) {
    character.y = floor.y - character.height;
    character.jumpCount = 0;
    character.velY = 0;
  }

  // Update movablePlatform position
  if (direction === 'left') {
    x -= 2; // Move 2 pixels to the left
    if (x < 600) { // If movablePlatform has moved 100px to the left
      direction = 'right'; // Change direction to right
    }
  } else {
    x += 2; // Move 2 pixels to the right
    if (x > 700) { // If movablePlatform has moved 100px to the right
      direction = 'left'; // Change direction to left
    }
  }

  // Update movablePlatform sprite position based on x value
  movablePlatform.x = x;
  
// Check for collisions with platforms
platforms.forEach(function(platform) {
    if (collides(character, platform)) {
        if (character.velY > 0 && character.y + character.height <= platform.y) {
            character.y = platform.y - character.height;
            character.jumpCount = 0;
            character.velY = 0;
        } else if (character.velX > 0 && character.x + character.width <= platform.x) {
            character.x = platform.x - character.width;
            character.velX = 0;
        } else if (character.velX < 0 && character.x >= platform.x + platform.width) {
            character.x = platform.x + platform.width;
            character.velX = 0;
        } else if (character.velY < 0 && character.y >= platform.y + platform.height) {
            character.y = platform.y + platform.height;
            character.velY = 0;
        } else if (character.velY > 0 && character.y < platform.y && character.y + character.height > platform.y && character.x + character.width > platform.x && character.x < platform.x + platform.width) {
            character.y = platform.y - character.height;
            character.jumpCount = 0;
            character.velY = 0;
        }
    }
    // Check for collisions with movablePlatform
    if (collides(character, movablePlatform)) {
        if (character.velY > 0 && character.y + character.height <= movablePlatform.y) {
        character.y = movablePlatform.y - character.height;
        character.jumpCount = 0;
        character.velY = 0;
        } else if (character.velX > 0 && character.x + character.width <= movablePlatform.x) {
        character.x = movablePlatform.x - character.width;
        character.velX = 0;
        } else if (character.velX < 0 && character.x >= movablePlatform.x + movablePlatform.width) {
        character.x = movablePlatform.x + movablePlatform.width;
        character.velX = 0;
        }
    }
});

 
// Draw character, movablePlatform, and floor
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#FF0000';
ctx.fillRect(character.x, character.y, character.width, character.height);
ctx.fillStyle = '#00FF00';
ctx.fillRect(floor.x, floor.y, floor.width, floor.height);
ctx.fillStyle = '#0000FF';
platforms.forEach(function(platform) {
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
});
ctx.fillStyle = '#FF00FF';
ctx.fillRect(movablePlatform.x, movablePlatform.y, movablePlatform.width, movablePlatform.height);

  
  
    // Request next frame
    requestAnimationFrame(update);
  }
  
  
  // Start update loop
  update();
  