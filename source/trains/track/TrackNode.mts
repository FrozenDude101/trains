import Component from "../../the-pixel-engine/Components/Component.mjs";
import Vector2 from "../../the-pixel-engine/Maths/Vector2.mjs";
import Sprite from "../../the-pixel-engine/Scripts/Sprite.mjs";
import Track from "./Track.mjs";

export default class TrackNode extends Component {

    public readonly name: string;
    public readonly position: Vector2;
    private readonly connections: Map<Track, Track> = new Map<Track, Track>();

    public constructor(name: string, position: Vector2) {
        super();
        this.name = name;
        this.position = position;
        this.addScript(TrackNodeSprite);
    }

    public addConnection(from: Track, to: Track): void {
        this.connections.set(from, to);
        this.connections.set(to, from);
    }

    public getConnectingTrack(from: Track): Track {
        if (!this.connections.has(from)) {
            throw new Error(`TrackNode ${this.name} does not have a connection for Track ${from.name}.`);
        }
        return this.connections.get(from)!;
    }

}

class TrackNodeSprite extends Sprite<TrackNode> {

    public override draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#FF8800";
        ctx.beginPath();
        ctx.arc(this.parent.position.x, this.parent.position.y, 2, 0, 2*Math.PI);
        ctx.fill();
    }

}