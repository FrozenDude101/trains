import Component from "../../the-pixel-engine/Components/Component.mjs";
import Script from "../../the-pixel-engine/Scripts/Script.mjs";
import Sprite from "../../the-pixel-engine/Scripts/Sprite.mjs";
import Track from "../track/Track.mjs";
import TrackNode from "../track/TrackNode.mjs";
import TrackPosition from "../track/TrackPosition.mjs";

export default class Stock extends Component {

    private readonly length: number = 20;

    public readonly bogey1: TrackPosition;
    public readonly bogey2: TrackPosition;

    public constructor(track: Track, from: TrackNode) {
        super();
        this.bogey1 = this.addChild(new TrackPosition(track, from, this.length));
        this.bogey2 = this.addChild(new TrackPosition(track, from, 0));
        this.addScript(StockSprite);
        this.addScript(StockUpdate);
    }

    public travel(distance: number) {
        this.bogey1.travel(distance);

        while (this.bogey1.getPosition().distanceTo(this.bogey2.getPosition()) > this.length) {
            this.bogey2.travel(0.1);
        }
    }

}

class StockUpdate extends Script<Stock> {

    public override onUpdate = (ms: number) => {
        this.parent.travel(ms/1000 * 25);
    }

}

class StockSprite extends Sprite<Stock> {

    public override draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.parent.bogey1.getPosition().x, this.parent.bogey1.getPosition().y);
        ctx.lineTo(this.parent.bogey2.getPosition().x, this.parent.bogey2.getPosition().y);
        ctx.stroke();
    }

}