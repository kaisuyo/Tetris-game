const WIDTH = 290;
const HEIGHT = WIDTH * 2;

const BRICK_SIZE = WIDTH / 10;

const FPS = 80;
const SMALL_NUM = BRICK_SIZE/3;

const HEAD = "./image/";
const TAIL = ".png";

const COLOR = [
    "yellow", 
    "cyan",
    "blue",
    "orange",
    "green",
    "red",
    "purple"
];

var SCR = [];
for (let i = 0; i < 10; i++) {
    SCR[i] = [];
    for (let j = 0 ; j < 24; j++) {
        SCR[i][j] = {
            full: false,
            image: null
        }
    }
}