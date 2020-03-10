import { Component, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";

import * as mermaid from "mermaid";
import { DragulaService } from "ng2-dragula/ng2-dragula";
import * as $ from "jquery";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { Platform } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-flowchart",
  templateUrl: "flowchart.html"
})
export class FlowchartPage {
  @ViewChild("mermaid") zoomGraph: ElementRef;
  // zoomGraph = document.getElementsByClassName("graph")[0] as HTMLElement;
  zoom: number = 1;

  idGeneral: number;

  @ViewChild("mermaid")
  public mermaidDiv;
  propiedades: string;
  clases: string;
  uniones: string;
  graphDefinition: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public dragulaService: DragulaService,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private renderer: Renderer2
  ) {
    if (this.platform.is("android")) {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );
    }

    this.propiedades = `
    P0:::pregunta
    `;

    this.clases = `
    classDef pregunta:first-child fill: #f1f1f1, stroke: #3590C4, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
    classDef pregunta fill: #f1f1f1, stroke: #f1f1f1, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
    classDef pregunta:hover fill: #f8f8f8, stroke: #f1f1f1, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
    classDef respuesta fill: #f1f1f1, stroke: #f1f1f1, stroke-width: 0px, color: #243E56, font-weight: bold, font-size: 10px
    classDef respuesta:hover fill: #288AC1, stroke: #288AC1, stroke-width: 0px, color: #ffffff, font-weight: bold, font-size: 10px, cursor: pointer
    classDef cotizacion fill: #f2680a, stroke: #f2680a, stroke-width: 4px, color: #ffffff, font-weight: bold, font-size: 10px
    classDef cotizacion:hover fill: #f2420a, stroke: #f2420a, stroke-width: 4px, color: #ffffff, font-weight: bold, font-size: 10px, cursor: pointer
    `;

    this.uniones = `
    P0(Pregunta)
    `;

    this.graphDefinition = `
    graph TD
    ${this.propiedades}
    ${this.uniones}
    ${this.clases}
    `;

    this.dragulaService.drop.subscribe((value: any) => {
      let alert = this.alertCtrl.create({
        title: "Item moved",
        subTitle: "So much fun!",
        buttons: ["OK"]
      });
      alert.present();
    });
  }

  ionViewDidLoad() {
    this.mermaidStart();
  }

  mermaidStart() {
    mermaid.initialize({
      theme: "default",
      securityLevel: "loose",
      startOnLoad: true,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true
      }
    });

    const element: any = this.mermaidDiv.nativeElement;
    mermaid.render("graphDiv", this.graphDefinition, svgCode => {
      element.innerHTML = svgCode;
    });
  }

  getElementHover = (selector: string, id: string) => {
    // Mouseup para desktop
    $(selector).mouseenter((elemento: any) => {
      if (id === "P") {
        this.alertOptions(elemento.currentTarget.id, "P", "pregunta");
        id = "";
      } else if (id === "R") {
        this.alertOptions(elemento.currentTarget.id, "R", "respuesta");
        id = "";
      } else if (id === "C") {
        this.alertOptions(elemento.currentTarget.id, "C", "cotizacion");
        id = "";
      } else {
        console.log("La operacion no es valida");
      }
    });
  };

  async alertOptions(entrada: string, addElement: string, type: string) {
    const prompt = this.alertCtrl.create({
      title: "Login",
      message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: "title",
          placeholder: "Title"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Save",
          handler: data => {
            this.addElement(entrada, addElement, data.title, type);
          }
        }
      ]
    });
    await prompt.present();
  }

  addElement = (
    entrada: string,
    addElement: string,
    message: string,
    type: string
  ) => {
    let id = Date.now();

    this.uniones += `\n${entrada} --> ${addElement}${id}(${message})`;
    this.propiedades += `\n${addElement}${id}:::${type}`;
    this.propiedades = this.propiedades.replace(/^\s*$(?:\r\n?|\n)/gm, "");

    this.graphDefinition = `
    graph TD
    ${this.propiedades}
    ${this.uniones}
    ${this.clases}
    `;

    this.mermaidStart();
  };

  zoomIn() {
    this.zoom += 0.1;
    this.renderer.setStyle(
      this.zoomGraph.nativeElement,
      "transform",
      `scale(${this.zoom})`
    );
  }

  zoomOut() {
    this.zoom -= 0.1;
    this.renderer.setStyle(
      this.zoomGraph.nativeElement,
      "transform",
      `scale(${this.zoom})`
    );
  }
}
