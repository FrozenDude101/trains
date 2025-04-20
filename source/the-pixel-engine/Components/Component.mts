import Script, { ScriptParameters, ScriptEvent, ScriptReturn } from "../Scripts/Script.mjs";

export default class Component {

    private _enabled: boolean = true;
    public get enabled() { return this._enabled; }

    private children: Array<Component> = [];
    private scripts: Array<Script> = [];

    public enable(): void {
        if (this._enabled) return;
        this._enabled = true;
        this.handleEvent("onEnable");
    }
    public disable(): void {
        if (!this._enabled) return;
        this.handleEvent("onDisable");
        this._enabled = false;
    }

    public addChild<TChild extends Component>(child: TChild): TChild {
        this.children.push(child);
        return child;
    }

    public addScript<TScript extends Script>(ScriptCons: new (parent: this) => TScript): TScript {
        let script = new ScriptCons(this);
        this.scripts.push(script);
        return script;
    }

    public handleEvent<TEvent extends ScriptEvent>(event: TEvent, ...args: ScriptParameters<TEvent>): Array<ScriptReturn<TEvent>> {
        var returnValues: ScriptReturn<TEvent>[] = [];

        for (let script of this.scripts) {
            if (!script.enabled) continue;
            if (!script.hasEvent(event)) continue;
            returnValues.push(script.handleEvent(event, ...args));
        }

        for (let child of this.children) {
            if (!child.enabled) continue;
            returnValues.push(...child.handleEvent(event, ...args));
        }

        return returnValues;
    }
}