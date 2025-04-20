export default class Vector2 {

    public readonly x: number;
    public readonly y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public distanceTo(that: Vector2) {
        return Math.sqrt((this.x - that.x) ** 2 + (this.y - that.y) ** 2);
    }

}