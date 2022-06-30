$(window).scroll(function() {
    var yScroll = $(this).scrollTop();
    var yFixed = (yScroll / 100);

    $("#logger").append(yScroll + " | ");

    //HTML5 Start
    var opacity1 = Math.round((1 - yFixed) * 100) / 100;
    var topOff1 = 0 - yScroll;
    if (opacity1 <= 0) {
      opacity1 = 0;
      topOff1 = -35;
    }
    $(".head-block").css({
      "opacity": opacity1,
      "margin-top": topOff1 + "px"
    });

    //CSS3 Start
    var opacity2 = yFixed;
    var topOff2 = 70 - yFixed;
    if (yScroll < 120) {
      opacity2 = 0;
      topOff2 = 70;
    }
    if (opacity2 >= 1) {
      opacity2 = 1;
      topOff2 = 70 - topOff2;
    }
    $(".main-content-block").css({
      "opacity": opacity2,
      "margin-top": topOff2 + "px"
    });

  });

var canvas = document.getElementById('nokey'),
   can_w = parseInt(canvas.getAttribute('width')),
   can_h = parseInt(canvas.getAttribute('height')),
   ctx = canvas.getContext('2d');

// console.log(typeof can_w);
var BALL_NUM = 20

var ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      alpha: 1,
      phase: 0
   },
   ball_color = {
       // r: 26,
       // g: 26,
       // b: 225
       r: 225,
       g: 225,
       b: 225
   };
   // setInterval(function(){ 
   //  return ball_color['r'] = Math.floor(Math.random() * 225)
   // }, 1000);
   //    setInterval(function(){ 
   //  return ball_color['g'] = Math.floor(Math.random() * 225)
   // }, 1000);
   //    setInterval(function(){ 
   //  return ball_color['b'] = Math.floor(Math.random() * 225)
   // }, 1000);

   R = 4.5,
   balls = [],
   alpha_f = 0.03,
   alpha_phase = 0,
    
// Line
   link_line_width = 1.3,
   dis_limit = 400,
   add_mouse_point = true,
   mouse_in = false,
   mouse_ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      type: 'mouse'
   };

// Random speed
function getRandomSpeed(pos){
    var  min = -1,
       max = 1;
    switch(pos){
        case 'top':
            return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
            break;
        case 'right':
            return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
            break;
        case 'bottom':
            return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
            break;
        case 'left':
            return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
            break;
        default:
            return;
            break;
    }
}
function randomArrayItem(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomNumFrom(min, max){
    return Math.random()*(max - min) + min;
}
console.log(randomNumFrom(0, 10));
// Random Ball
function getRandomBall(){
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch(pos){
        case 'top':
            return {
                x: randomSidePos(can_w),
                y: -R,
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'right':
            return {
                x: can_w + R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'bottom':
            return {
                x: randomSidePos(can_w),
                y: can_h + R,
                vx: getRandomSpeed('bottom')[0],
                vy: getRandomSpeed('bottom')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'left':
            return {
                x: -R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('left')[0],
                vy: getRandomSpeed('left')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
    }
}
function randomSidePos(length){
    return Math.ceil(Math.random() * length);
}

// Draw Ball
function renderBalls(){
    Array.prototype.forEach.call(balls, function(b){
       if(!b.hasOwnProperty('type')){
           ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
           ctx.beginPath();
           ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
           ctx.closePath();
           ctx.fill();
       }
    });
}

// Update balls
function updateBalls(){
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        b.x += b.vx;
        b.y += b.vy;
        
        if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
           new_balls.push(b);
        }
        
        // alpha change
        b.phase += alpha_f;
        b.alpha = Math.abs(Math.cos(b.phase));
        // console.log(b.alpha);
    });
    
    balls = new_balls.slice(0);
}

// loop alpha
function loopAlphaInf(){
    
}

// Draw lines
function renderLines(){
    var fraction, alpha;
    for (var i = 0; i < balls.length; i++) {
        for (var j = i + 1; j < balls.length; j++) {
           
           fraction = getDisOf(balls[i], balls[j]) / dis_limit;
            
           if(fraction < 1){
               alpha = (1 - fraction).toString();

               // ctx.strokeStyle = 'rgba(128 ,128,225,'+alpha+')';
               ctx.strokeStyle = 'rgba(225,225,225,'+alpha+')';
               ctx.lineWidth = link_line_width;
               
               ctx.beginPath();
               ctx.moveTo(balls[i].x, balls[i].y);
               ctx.lineTo(balls[j].x, balls[j].y);
               ctx.stroke();
               ctx.closePath();
           }
        }
    }
}

// calculate distance between two points
function getDisOf(b1, b2){
    var  delta_x = Math.abs(b1.x - b2.x),
       delta_y = Math.abs(b1.y - b2.y);
    
    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}

// add balls if there a little balls
function addBallIfy(){
    if(balls.length < BALL_NUM){
        balls.push(getRandomBall());
    }
}

// Render
function render(){
    ctx.clearRect(0, 0, can_w, can_h);
    
    renderBalls();
    
    renderLines();
    
    updateBalls();
    
    addBallIfy();
    
    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num){
    for(var i = 1; i <= num; i++){
        balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        });
    }
}
// Init Canvas
function initCanvas(){
    canvas.setAttribute('width', document.body.scrollWidth);
    canvas.setAttribute('height', document.body.scrollHeight);
    
    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));
    console.log(can_w);
    console.log(can_h)
}
window.addEventListener('resize', function(e){
    console.log('Window Resize...');
    initCanvas();
});

window.addEventListener('scroll', function(e) {
    console.log('Window Resize...22');
});

function goMovie(){
    initCanvas();
    initBalls(BALL_NUM);
    window.requestAnimationFrame(render);
}
goMovie();

// Mouse effect
canvas.addEventListener('mouseenter', function(){
    console.log('mouseenter');
    mouse_in = true;
    balls.push(mouse_ball);
});
canvas.addEventListener('mouseleave', function(){
    console.log('mouseleave');
    mouse_in = false;
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        if(!b.hasOwnProperty('type')){
            new_balls.push(b);
        }
    });
    balls = new_balls.slice(0);
});
canvas.addEventListener('mousemove', function(e){
    var e = e || window.event;
    mouse_ball.x = e.pageX;
    mouse_ball.y = window.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
});

document.body.style.background = "url(" + canvas.toDataURL() + ")";

// Typing Effect

const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["Data Science Enthusiast", "Data Analyst", "Python Software Developer", ];

const typingDelay = 180;
const erasingDelay = 150;
const newTextDelay = 800; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if(textArrayIndex>=textArray.length) textArrayIndex=0;
    setTimeout(type, typingDelay + 1100);
  }
}

document.addEventListener("DOMContentLoaded", function() { // On DOM Load initiate the effect
  if(textArray.length) setTimeout(type, newTextDelay + 250);
});

// End of Typing Functionality



/* check if the item is clamped or not */
function showReadMoreButton(element) {
    if (
      element.offsetHeight < element.scrollHeight ||
      element.offsetWidth < element.scrollWidth
    ) {
      element.classList.add("clamped");
    }
  }
  
  var clampText = document.querySelectorAll(".clamp-text");
  Array.prototype.forEach.call(clampText, function (el, i) {
    showReadMoreButton(el);
  });
  
  /* let the button do it's magic when clamped */
  const clampActions = document.querySelectorAll(".clamp-text-action");
  Array.prototype.forEach.call(clampActions, function (el, i) {
    let isOpen = false;
    el.addEventListener("click", () => {
      const clampedEl = el.previousElementSibling;
      isOpen = !isOpen;
  
      if (isOpen) {
        clampedEl.classList.add("open")
        el.classList.add("open")
      } else {
        clampedEl.classList.remove("open");
        el.classList.remove("open");
      }
    });
  });


// Onscroll Effect

  function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("mousewheel", reveal);

// Recent Work Hover Effect

// $("#project-container").on("mouseover", function() {
//   // $(this).addClass("hover-class");
//   $("#project-title").addClass("project-title");
//   // $("#project-title").removeClass("col-md-10");
//   // $("#project-title").addClass("col-12");
//   // $("#project-image").removeClass("col-md-2");
//   // $("#project-image").addClass("project-image-hover");
//   // $("#project-image").removeClass("project-image");
// }).on("mouseout", function() {
//   // $(this).removeClass("hover-class");
//   $("#project-title").removeClass("project-title");
//   // $("#project-title").addClass("col-md-10");
//   // $("#project-image").addClass("col-md-2");
//   // $("#project-image").removeClass("project-image-hover");
//   // $("#project-image").addClass("project-image");
// });

// $(".recentwork-section").hover(function(){
//   $( ".recentwork-section" ).each(function() {
//       // $(this).children(".mask").toggleClass('maskHover');
//       $(this).children("#project-title").addClass("project-title");
//       $(this).children("#project-title").removeClass("col-md-10");
//       $(this).children("#project-title").addClass("col-12");
//       $(this).children("#project-image").removeClass("col-md-2");
//       $(this).children("#project-image").addClass("project-image-hover");

//   });
//   $(this).children("#project-title").removeClass("project-title");
//   $(this).children("#project-title").addClass("col-md-10");
//   $(this).children("#project-title").removeClass("col-12");
//   $(this).children("#project-image").addClass("col-md-2");
//   $(this).children("#project-image").removeClass("project-image-hover");
// });


