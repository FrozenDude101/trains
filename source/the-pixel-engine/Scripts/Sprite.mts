import Component from "../Components/Component.mjs";
import Script from "./Script.mjs";

export default abstract class Sprite<TParent extends Component = Component> extends Script<TParent> {

    public abstract draw(ctx: CanvasRenderingContext2D): void;

    public override getSprites = () => this;

}