import { Component, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";

import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { GraphProvider } from "../../providers/graph/graph";
import { DragulaService } from "ng2-dragula/ng2-dragula";
import { Platform } from "ionic-angular";
import * as mermaid from "mermaid";
import * as $ from "jquery";

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
  condition = true;

  idGeneral: number;

  graphJSON: any = {
    user_id: "10553",
    questions: {
      Q1585262720121: {}
    },
    ux_data: {
      Q1585262720121: {
        text: "Pregunta",
        type: "MULTIPLE",
        starting_q: "QXXXXX"
      }
    },
    properties: {},
    classes: {},
    relationships: {}
  };

  @ViewChild("mermaid")
  public mermaidDiv;
  propiedades: string = `Q1585262720121(Pregunta):::pregunta`;
  uniones: string = `Q1585262720121`;
  clases: string = `classDef pregunta:first-child fill: #f1f1f1, stroke: #3590C4, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
  classDef pregunta fill: #f1f1f1, stroke: #f1f1f1, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
  classDef pregunta:hover fill: #f8f8f8, stroke: #f1f1f1, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
  classDef respuesta fill: #f1f1f1, stroke: #f1f1f1, stroke-width: 0px, color: #243E56, font-weight: bold, font-size: 10px
  classDef respuesta:hover fill: #288AC1, stroke: #288AC1, stroke-width: 0px, color: #ffffff, font-weight: bold, font-size: 10px, cursor: pointer
  classDef cotizacion fill: #f2680a, stroke: #f2680a, stroke-width: 4px, color: #ffffff, font-weight: bold, font-size: 10px
  classDef cotizacion:hover fill: #f2420a, stroke: #f2420a, stroke-width: 4px, color: #ffffff, font-weight: bold, font-size: 10px, cursor: pointer`;
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
    if (this.platform.is("cordova")) {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );
    }

    this.graphService.getGraph(10553).subscribe((data: any) => {
      if (Object.keys(JSON.parse(data["_body"])).length === 0) {
        this.postJSON();
        return;
      }

      this.graphJSON = JSON.parse(data["_body"]);
      this.uniones = this.graphJSON["relationships"];
      this.propiedades = this.graphJSON["properties"];

      this.graphDefinition = `graph TD
      ${this.propiedades}
      ${this.uniones}
      ${this.clases}`;

      this.mermaidStart();
      this.setFunctionEdit();

      console.log(JSON.parse(data["_body"]));
    });
  }

  ionViewDidLoad() {}

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
    mermaid.render("graphDiv", this.graphDefinition, (svgCode: any) => {
      element.innerHTML = svgCode;
    });
  }

  setFunctionEdit() {
    $(".node").on("click", (target: any) => {
      const prompt = this.alertCtrl.create({
        title: "Editar/Eliminar",
        message: `Valor actual: #${target["currentTarget"]["id"]}`,
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
              console.log("Cancel click!");
            }
          },
          {
            text: "Save",
            handler: data => {
              if (data.title.length > 0) {
                let types: string;
                const regExp: RegExp = new RegExp(
                  `(${target["currentTarget"]["id"]}\(.*\):::(pregunta|respuesta|cotizacion))`,
                  "gm"
                );

                if (/(Q[0-9]*)/.test(`${target["currentTarget"]["id"]}`)) {
                  types = "pregunta";
                } else if (
                  /(A[0-9]*)/.test(`${target["currentTarget"]["id"]}`)
                ) {
                  types = "respuesta";
                } else {
                  types = "cotizacion";
                }

                this.propiedades = this.propiedades.replace(
                  regExp,
                  `\n${target["currentTarget"]["id"]}(${data["title"]}):::${types}`
                );

                this.editJSON(target["currentTarget"]["id"], data["title"]);

                this.graphDefinition = `graph TD
                ${this.propiedades}
                ${this.uniones}
                ${this.clases}`;
                this.mermaidStart();
                this.setFunctionEdit();
              }
            }
          }
        ]
      });
      prompt.present();
    });
  }

  editJSON(id: string, message: string) {
    if (id.charAt(0) === "Q") {
      this.graphJSON.ux_data[id].text = message;
    } else {
      let inc: number = 1;

      const regExp: RegExp = new RegExp(`Q[0-9]* --> ${id}`, "gm");
      const regExpReplace: RegExp = new RegExp(` --> ${id}`, "g");
      const ans: string[] = this.uniones.match(regExp);
      const questionId: string = ans[0].replace(regExpReplace, "");

      const regExpQuestion: RegExp = new RegExp(
        `${questionId} --> (A|C)[0-9]*`,
        "gm"
      );
      const ansReplace: RegExp = new RegExp(`${questionId} --> `, "g");
      const arrRelationQuestion: string[] = this.uniones.match(regExpQuestion);
      const arrAns: string[] = [];

      for (let item of arrRelationQuestion) {
        item = item.replace(ansReplace, "");
        arrAns.push(item);
      }

      for (let i = 0; i < arrAns.length; i++) {
        if (Number(id.substr(1)) > Number(arrAns[i].substr(1))) {
          inc++;
        } else {
          this.graphJSON["ux_data"][questionId][inc] = message;
        }
      }
    }
    console.log(this.graphJSON);
    this.postJSON();
  }

  getElementHover = () => {
    this.getPositionElement();

    // Mouseup desktop - Mouseenter mobile
    $("#Q, #A, #C").on("touchend", (data: any) => {
      let id = data["currentTarget"]["id"];
      let regExpPR: RegExp = new RegExp(
        `${this.idElement} --> (C[0-9]*)`,
        "gm"
      );
      let regExpC: RegExp = new RegExp(
        `${this.idElement} --> (Q|C[0-9]*)`,
        "gm"
      );
      let uniqueQuestion: RegExp = new RegExp(
        `${this.idElement} --> (Q[0-9]*)`,
        "gm"
      );

      if (!regExpPR.test(this.uniones)) {
        if (
          id === "Q" &&
          /(A[0-9]*)/.test(this.idElement) &&
          this.acum === 0 &&
          !this.uniones.match(uniqueQuestion)
        ) {
          this.alertOptions(this.idElement, "Q", "pregunta");
          this.acum++;
        } else if (
          id === "A" &&
          /(Q[0-9]*)/.test(this.idElement) &&
          this.acum === 0
        ) {
          this.alertOptions(this.idElement, "A", "respuesta");
          this.acum++;
        } else {
          console.log("La operacion no es valida");
        }
      }

      if (!regExpC.test(this.uniones)) {
        if (id === "C" && /(Q[0-9]*)/.test(this.idElement) && this.acum === 0) {
          this.alertOptions(this.idElement, "C", "cotizacion");
          this.acum++;
        }
      }
    });
  };

  getPositionElement() {
    $(document).on("touchmove", "#body", (e: any) => {
      try {
        var xPos = e.originalEvent.touches[0].pageX;
        var yPos = e.originalEvent.touches[0].pageY;

        var el = document.elementFromPoint(xPos, yPos);

        if (el.parentElement.getAttribute("id") !== null) {
          this.idElement = el.parentElement.getAttribute("id");
        }

        if (el.parentElement.getAttribute("id") === null) {
          if (el.parentNode.parentNode.parentNode.parentNode["id"] !== null) {
            this.idElement =
              el.parentNode.parentNode.parentNode.parentNode["id"];
          }
        }

        let elementMirror = Array.from(
          document.getElementsByClassName("gu-mirror") as HTMLCollectionOf<
            HTMLElement
          >
        )[0];

        if (/(Q|A|C[0-9]*)/.test(this.idElement)) {
          elementMirror.style.backgroundColor = "#37c5bb";
        } else {
          elementMirror.style.backgroundColor = "#288ac1";
        }
      } catch (error) {
        console.log("Elemento no reconocido", error);
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

    if (addElement === "A" || addElement === "C") {
      let len: number;
      const regExp: RegExp = new RegExp(
        `${this.idElement}\\(.*\\):::pregunta`,
        "gm"
      );
      const repOne: RegExp = new RegExp(`${this.idElement}\\(`, "gm");
      const repTwo: RegExp = new RegExp(`\\):::pregunta`, "gm");
      const questionText: string[] = this.propiedades.match(regExp);
      const preQuestion = questionText[0].replace(repOne, "");
      const messageQuestion = preQuestion.replace(repTwo, "");

      if (!this.graphJSON.ux_data[this.idElement]) {
        this.graphJSON.ux_data[this.idElement] = {
          text: messageQuestion,
          type: "MULTIPLE"
        };
      }

      if (this.idElement === "Q1585262720121") {
        len = Object.keys(this.graphJSON.ux_data[this.idElement]).length - 2;
      } else {
        len = Object.keys(this.graphJSON.ux_data[this.idElement]).length - 1;
      }

      this.graphJSON.ux_data[this.idElement][len] = message;
    }

    if (addElement === "Q") {
      if (!this.graphJSON.ux_data[addElement + id]) {
        this.graphJSON.ux_data[addElement + id] = {
          text: message,
          type: "MULTIPLE"
        };
      }
      this.addQuestionsAns(this.idElement);
    }

    this.graphDefinition = `graph TD
      ${this.propiedades}
      ${this.uniones}
      ${this.clases}`;

    this.mermaidStart();
    this.setFunctionEdit();
    this.idElement = "";

    console.log(this.graphJSON);
    this.postJSON();
  };

  addQuestionsAns(id: string) {
    let aux: number = 0;
    let len: number;

    const regExpId: RegExp = new RegExp(`Q[0-9]* --> ${id}`, "gm");
    const replace: RegExp = new RegExp(` --> ${id}`, "gm");
    const matchId: string[] = this.uniones.match(regExpId);
    const localId: string = matchId[0].replace(replace, "");

    const regExp: RegExp = new RegExp(`${localId} --> A[0-9]*`, "gm");
    let ans: string[] = this.uniones.match(regExp);
    ans = [...new Set(ans)];
    let answeres: string[] = [];

    for (const item of ans) {
      answeres.push(item.substr(item.length - 14));
    }

    for (const an of answeres) {
      const regAns: RegExp = new RegExp(`${an} --> Q[0-9]*`, "gm");
      let setAnsweres: string[] = this.uniones.match(regAns);
      setAnsweres = [...new Set(setAnsweres)];
      let finalQuestions: string[] = [];

      for (const item of setAnsweres) {
        finalQuestions.push(item.substr(item.length - 14));
      }

      if (finalQuestions.length > 0) {
        if (aux === 0) {
          this.graphJSON.questions[localId] = {};
        }

        len = Object.keys(this.graphJSON.questions[localId]).length + 1;
        this.graphJSON.questions[localId][len] = finalQuestions[0];

        aux++;
      }
    }
  }

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
    this.graphJSON.properties = this.propiedades;
    this.graphJSON.classes = this.clases;
    this.graphJSON.relationships = this.uniones;

    console.log(this.graphJSON);

    this.graphService
      .postGraph(10553, this.graphJSON)
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  changeBotStatus(value: boolean) {
    this.condition = value;

    this.validateGraph();
  }

  validateGraph() {
    const questions: RegExp = new RegExp("Q[0-9]*\\(.*\\):::pregunta", "gm");
    const questionsMatch: string[] = this.propiedades.match(questions);

    const replaceQst: RegExp = new RegExp("\\(.*\\):::pregunta", "gm");
    let questionsReplaced: string[];

    for (const question of questionsMatch) {
      console.log(question);
      questionsReplaced.push(question.replace(replaceQst, ""));
    }

    console.log(questionsReplaced);
  }
}
