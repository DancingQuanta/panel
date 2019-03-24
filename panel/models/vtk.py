# coding: utf-8
"""
Defines custom VTKPlot bokeh model to render VTK objects.
"""
import os

from bokeh.core.properties import String, Bool, Dict, Any
from bokeh.models import HTMLBox

from ..compiler import CUSTOM_MODELS

vtk_cdn = "https://unpkg.com/vtk.js@8.3.15/dist/vtk.js"


class VTKPlot2(HTMLBox):
    """
    A Bokeh model that wraps around a vtk-js library and renders it inside
    a Bokeh plot.
    """

    __javascript__ = [vtk_cdn]

    __js_require__ = {"paths": {"vtk": vtk_cdn[:-3]},
                      "shim": {"vtk": {"exports": "vtk"}}}

    __implementation__ = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'vtk2.ts')

    state = Dict(String, Any)

    data = Dict(String, Any)


class VTKPlot(HTMLBox):
    """
    A Bokeh model that wraps around a vtk-js library and renders it inside
    a Bokeh plot.
    """

    __javascript__ = [vtk_cdn]

    __js_require__ = {"paths": {"vtk": vtk_cdn[:-3]},
                      "shim": {"vtk": {"exports": "vtk"}}}

    __implementation__ = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'vtk.ts')

    vtkjs = String

    append = Bool(default=False)


CUSTOM_MODELS['panel.models.plots.VTKPlot'] = VTKPlot
CUSTOM_MODELS['panel.models.plots.VTKPlot2'] = VTKPlot2
