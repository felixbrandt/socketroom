module.exports = function Player(x, y, size, r, g, b) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.r = r;
    this.g = g;
    this.b = b;
    this.keys = {
        "up": false,
        "down": false,
        "right": false,
        "left": false
    }
}