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
import { GraphProvider } from "../../providers/graph/graph";

@IonicPage()
@Component({
  selector: "page-flowchart",
  templateUrl: "flowchart.html"
})
export class FlowchartPage {
  @ViewChild("mermaid") zoomGraph: ElementRef;
  @ViewChild("divZoom") divZoom: ElementRef;
  pregunta = document.getElementsByClassName("pregunta");

  zoom: number = 1;
  acum: number = 0;
  idElement: any;

  idGeneral: number;

  graphJSON: any = {
    user_id: 8285,
    questions: {},
    ux_data: {},
    properties: {},
    classes: {},
    relationships: {}
  };

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
    private renderer: Renderer2,
    private graphService: GraphProvider
  ) {
    this.graphService.getGraph(8285).subscribe((data: any) => {
      console.log(data["_body"]);
    });
    this.dragulaService = dragulaService;

    if (this.platform.is("cordova")) {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );
    }

    this.propiedades = `P0(Pregunta):::pregunta`;

    this.clases = `classDef pregunta:first-child fill: #f1f1f1, stroke: #3590C4, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
    classDef pregunta fill: #f1f1f1, stroke: #f1f1f1, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
    classDef pregunta:hover fill: #f8f8f8, stroke: #f1f1f1, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
    classDef respuesta fill: #f1f1f1, stroke: #f1f1f1, stroke-width: 0px, color: #243E56, font-weight: bold, font-size: 10px
    classDef respuesta:hover fill: #288AC1, stroke: #288AC1, stroke-width: 0px, color: #ffffff, font-weight: bold, font-size: 10px, cursor: pointer
    classDef cotizacion fill: #f2680a, stroke: #f2680a, stroke-width: 4px, color: #ffffff, font-weight: bold, font-size: 10px
    classDef cotizacion:hover fill: #f2420a, stroke: #f2420a, stroke-width: 4px, color: #ffffff, font-weight: bold, font-size: 10px, cursor: pointer`;

    this.uniones = `P0`;

    this.graphDefinition = `graph TD
    ${this.propiedades}
    ${this.uniones}
    ${this.clases}`;
  }

  ionViewDidLoad() {
    this.mermaidStart();

    $(".node").on("click", () => {
      const prompt = this.alertCtrl.create({
        title: "Editar/Eliminar",
        message: `Valor actual: ${$(".node").attr("id")}`,
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
              console.log(data);
            }
          },
          {
            text: "Save",
            handler: data => {
              console.log(data);

              this.propiedades = this.propiedades.replace();
            }
          }
        ]
      });

      prompt.present();
    });
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

  getElementHover = (id: string) => {
    this.getPositionElement();

    // Mouseup desktop - Mouseenter mobile
    $("#R, #C, #P").on("touchend", () => {
      let regExpPR: RegExp = new RegExp(
        `${this.idElement} --> (C[0-9]*)`,
        "gm"
      );
      let regExpC: RegExp = new RegExp(
        `${this.idElement} --> (P|C[0-9]*)`,
        "gm"
      );

      if (!regExpPR.test(this.uniones)) {
        if (id === "P" && /(R[0-9]*)/.test(this.idElement) && this.acum === 0) {
          this.alertOptions(this.idElement, "P", "pregunta");
          id = "";
          this.acum++;
        } else if (
          id === "R" &&
          /(P[0-9]*)/.test(this.idElement) &&
          this.acum === 0
        ) {
          this.alertOptions(this.idElement, "R", "respuesta");
          id = "";
          this.acum++;
        } else {
          console.log("La operacion no es valida");
        }
      }

      if (!regExpC.test(this.uniones)) {
        if (id === "C" && /(R[0-9]*)/.test(this.idElement) && this.acum === 0) {
          this.alertOptions(this.idElement, "C", "cotizacion");
          id = "";
          this.acum++;
        }
      }
    });

    this.idElement = "";
  };

  getPositionElement() {
    $(document).on("touchmove", "#body", e => {
      var xPos = e.originalEvent.touches[0].pageX;
      var yPos = e.originalEvent.touches[0].pageY;

      var el = document.elementFromPoint(xPos, yPos);

      if (el.parentElement.getAttribute("id") !== null) {
        this.idElement = el.parentElement.getAttribute("id");
      }

      if (el.parentElement.getAttribute("id") === null) {
        if (el.parentNode.parentNode.parentNode.parentNode["id"] !== null) {
          this.idElement = el.parentNode.parentNode.parentNode.parentNode["id"];
        }
      }

      let elementMirror = Array.from(
        document.getElementsByClassName("gu-mirror") as HTMLCollectionOf<
          HTMLElement
        >
      )[0];

      if (/(P|R|C[0-9]*)/.test(this.idElement)) {
        elementMirror.style.backgroundColor = "#37c5bb";
      } else {
        elementMirror.style.backgroundColor = "#288ac1";
      }
    });
  }

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
            this.acum = 0;
          }
        },
        {
          text: "Save",
          handler: data => {
            this.addElement(entrada, addElement, data.title, type);
            this.acum = 0;
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

    this.uniones += `\n${entrada} --> ${addElement}${id}`;
    this.propiedades += `\n${addElement}${id}(${message}):::${type}`;
    this.propiedades = this.propiedades.replace(/^\s*$(?:\r\n?|\n)/gm, "");

    if (addElement === "R") {
      this.graphJSON.ux_data[this.idElement] = { text: message, type: "mult" };

      const len: string = String(
        Object.keys(this.graphJSON.ux_data[this.idElement]).length - 1
      );

      this.graphJSON.ux_data[this.idElement][len] += message;
    }

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

  zoomDefault() {
    this.zoom = 1;
    this.renderer.setStyle(
      this.zoomGraph.nativeElement,
      "transform",
      `scale(${this.zoom})`
    );
  }

  postJSON() {
    this.graphService.upGraph(8285, this.graphJSON);
  }

  getJSON() {
    this.graphService.getGraph(8285);
  }
}
