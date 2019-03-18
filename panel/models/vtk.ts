import * as p from "core/properties"
import {HTMLBox, HTMLBoxView} from "models/layouts/html_box";

export class VTKPlotView extends HTMLBoxView {
  model: VTKPlot
  protected _vtk: any
  protected _rendererEl: any

  initialize(): void {
    super.initialize()
    this._vtk = (window as any).vtk

  }

  after_layout() {
    super.after_layout()
    debugger
    const width = this.model.width ? this.model.width : "300px"
    const height = this.model.height ? this.model.width : "300px"

    this._rendererEl = this._vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance({
      rootContainer: this.el,
      containerStyle : {
        width,
        height
      }
    });
    this._plot()
  }

  connect_signals(): void{
    this.connect(this.model.properties.vtkjs.change, this._plot)
  }

  _plot(): void{
    if (!this.model.append) {
      this._delete_all_actors()
    }
    if (this.model.vtkjs == null) {
      this._rendererEl.getRenderWindow().render()
      return
    }
    const dataAccessHelper = this._vtk.IO.Core.DataAccessHelper.get('zip', {
      zipContent: atob(this.model.vtkjs),
      callback: (_zip: any) => {
        const sceneImporter = this._vtk.IO.Core.vtkHttpSceneLoader.newInstance({
          renderer: this._rendererEl.getRenderer(),
          dataAccessHelper,
        })
        sceneImporter.setUrl('index.json');
        sceneImporter.onReady(() => {
          this._rendererEl.getRenderWindow().render()
        })
      }
    })
  }

  _delete_all_actors(): void{
    const renderer = this._rendererEl.getRenderer()
    renderer.getActors().map((actor: unknown) => renderer.removeActor(actor))
  }

}


export namespace VTKPlot {
  export type Attrs = p.AttrsOf<Props>
  export type Props = HTMLBox.Props & {
    vtkjs: p.Property<string>
    append: p.Property<boolean>
  }
}

export interface VTKPlot extends VTKPlot.Attrs {}

export class VTKPlot extends HTMLBox {
  properties: VTKPlot.Props

  constructor(attrs?: Partial<VTKPlot.Attrs>) {
    super(attrs)
  }

  static initClass(): void {
    this.prototype.type = "VTKPlot"
    this.prototype.default_view = VTKPlotView

    this.define<VTKPlot.Props>({
      vtkjs:         [p.String        ],
      append:        [p.Boolean, false],
    })
  }
}
VTKPlot.initClass()
