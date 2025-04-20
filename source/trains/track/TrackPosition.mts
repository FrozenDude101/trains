import Component from "../../the-pixel-engine/Components/Component.mjs";
import Vector2 from "../../the-pixel-engine/Maths/Vector2.mjs";
import Sprite from "../../the-pixel-engine/Scripts/Sprite.mjs";
import Track from "./Track.mjs";
import TrackNode from "./TrackNode.mjs";

export default class TrackPosition extends Component {

    private track: Track;
    private node: TrackNode;
    private t: number;

    public constructor(track: Track, node: TrackNode, t: number) {
        super();
        this.track = track;
        this.node = node;
        this.t = t;
        this.addScript(TrackPositionSprite);
    }

    public travel(distance: number): void {
        var p = this.track.travel(this.node, this.t, distance);
        this.track = p.track;
        this.node = p.node;
        this.t = p.t;
    }

    public getPosition(): Vector2 {
        return this.track.getPosition(this.node, this.t);
    }

}

class TrackPositionSprite extends Sprite<TrackPosition> {

    public override draw(ctx: CanvasRenderingContext2D): void {
        let position = this.parent.getPosition();
        ctx.fillStyle = "#0088FF";
        ctx.beginPath();
        ctx.arc(position.x, position.y, 2, 0, 2*Math.PI);
        ctx.fill();
    }

}