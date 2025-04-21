import Component from "../../the-pixel-engine/Components/Component.mjs";
import Vector2 from "../../the-pixel-engine/Maths/Vector2.mjs";
import Sprite from "../../the-pixel-engine/Scripts/Sprite.mjs";
import TrackNode from "./TrackNode.mjs";
import TrackPosition from "./TrackPosition.mjs";

export default class Track extends Component {

    public readonly name: string;
    public readonly node1: TrackNode;
    public readonly node2: TrackNode;

    public constructor(name: string, node1: TrackNode, node2: TrackNode) {
        super();
        this.name = name;
        this.node1 = node1;
        this.node2 = node2;
        this.addScript(TrackSprite);
    }

    public travel(from: TrackNode, startingAt: number, distance: number): TrackPosition {
        let totalDistance = this.node1.position.distanceTo(this.node2.position)
        let remainingDistance = totalDistance - startingAt;

        if (distance >= remainingDistance) {
            return this.getOppositeNode(from).getConnectingTrack(this).travel(this.getOppositeNode(from), 0, distance - remainingDistance);
        }

        if (-1 * distance > startingAt) {
            let prevTrack = from.getConnectingTrack(this);
            let otherNode = prevTrack.getOppositeNode(from);
            return prevTrack.travel(otherNode, from.position.distanceTo(otherNode.position), distance + startingAt);
        }

        return new TrackPosition(this, from, startingAt + distance);
    }

    private getOppositeNode(from: TrackNode): TrackNode {
        if (from === this.node1) return this.node2;
        if (from === this.node2) return this.node1;
        throw new Error(`Track ${this.name} does not have an opposite node for TrackNode ${from.name}.`)
    }

    public getPosition(from: TrackNode, distance: number): Vector2 {
        let to = this.getOppositeNode(from);
        let delta = new Vector2(to.position.x - from.position.x, to.position.y - from.position.y);
        let t = distance / delta.distanceTo(new Vector2(0, 0));
        return new Vector2(from.position.x + delta.x * t, from.position.y + delta.y * t);
    }

}

class TrackSprite extends Sprite<Track> {

    public override draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(this.parent.node1.position.x, this.parent.node1.position.y);
        ctx.lineTo(this.parent.node2.position.x, this.parent.node2.position.y);
        ctx.stroke();
    }

}