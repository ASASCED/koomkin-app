import { Component, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController
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
      Q0000000000000: {}
    },
    ux_data: {
      Q0000000000000: {
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
  propiedades: string = `Q0000000000000(Pregunta):::pregunta`;
  uniones: string = `Q0000000000000`;
  clases: string = `classDef pregunta:first-child fill: #f1f1f1, stroke: #3590C4, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
  classDef pregunta fill: #f1f1f1, stroke: #f1f1f1, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
  classDef respuesta fill: #f1f1f1, stroke: #f1f1f1, stroke-width: 0px, color: #243E56, font-weight: bold, font-size: 10px
  classDef cotizacion fill: #f2680a, stroke: #f2680a, stroke-width: 4px, color: #ffffff, font-weight: bold, font-size: 10px`;
  graphDefinition: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public dragulaService: DragulaService,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private renderer: Renderer2,
    private graphService: GraphProvider,
    public toastCtrl: ToastController
  ) {
    if (this.platform.is("cordova")) {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );
    }

    this.graphService.getStatusBot(10553).subscribe((data: any) => {
      console.log(JSON.parse(data._body).status);
      if (Number(JSON.parse(data._body).status) === 0) {
        this.condition = false;
      } else {
        this.condition = true;
      }

      console.log(this.condition);

      this.graphService.getGraph(10553).subscribe(async (data: any) => {
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
      });
    });

    console.log(this.graphJSON);
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
      const regExp: RegExp = new RegExp(
        `${target["currentTarget"]["id"]}\\(.*\\):::(pregunta|cotizacion|respuesta)`,
        "gm"
      );
      const repOne: RegExp = new RegExp(
        `${target["currentTarget"]["id"]}\\(`,
        "gm"
      );
      const repTwo: RegExp = new RegExp(
        `\\):::(pregunta|cotizacion|respuesta)`,
        "gm"
      );

      const questionText: string[] = this.propiedades.match(regExp);
      const preQuestion = questionText[0].replace(repOne, "");
      const messageQuestion = preQuestion.replace(repTwo, "");

      const prompt = this.alertCtrl.create({
        title: "Editar",
        message: `Texto: ${messageQuestion}`,
        inputs: [
          {
            name: "Valor",
            placeholder: "valor"
          }
        ],
        buttons: [
          {
            text: "Cancelar",
            handler: data => {}
          },
          {
            text: "Confirmar",
            handler: data => {
              if (data.Valor.length > 0) {
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
                  `\n${target["currentTarget"]["id"]}(${data["Valor"]}):::${types}`
                );

                this.editJSON(target["currentTarget"]["id"], data["Valor"]);

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
    if (id.charAt(0) === "Q" || id.charAt(0) === "C") {
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
        if (id === "C" && /(A[0-9]*)/.test(this.idElement) && this.acum === 0) {
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
      title: `Añadir ${type}`,
      message: `Agrega el texto correspondiente a tu ${type}`,
      inputs: [
        {
          name: "Valor",
          placeholder: "valor"
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          handler: data => {
            console.log("Cancel clicked");
            this.acum = 0;
          }
        },
        {
          text: "Confirmar",
          handler: data => {
            if (data.Valor.length > 0) {
              this.addElement(entrada, addElement, data.Valor, type);
              this.acum = 0;
            }
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

    if (addElement === "A") {
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

      if (this.idElement === "Q0000000000000") {
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

    if (addElement === "C") {
      if (!this.graphJSON.ux_data[addElement + id]) {
        this.graphJSON.ux_data[addElement + id] = {
          text: message,
          type: "QUOTATION"
        };
      }
      this.addQuotation(this.idElement, addElement + id);
    }

    this.graphDefinition = `graph TD
      ${this.propiedades}
      ${this.uniones}
      ${this.clases}`;

    this.mermaidStart();
    this.setFunctionEdit();
    this.idElement = "";

    console.log(this.graphJSON);
    console.log(JSON.stringify(this.graphJSON));
    this.postJSON();
    this.condition = false;
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

  addQuotation(id: string, element: string) {
    let len: number;
    // const findAnswere: RegExp = new RegExp(`${id} --> ${element}`, "gm");
    // const replaceAnswere: RegExp = new RegExp(`--> ${element}`, "gm");
    const findQuestion: RegExp = new RegExp(`Q[0-9]* --> ${id}`, "gm");
    const replaceQuestion: RegExp = new RegExp(` --> ${id}`, "gm");
    // const answere: string = this.uniones
    //   .match(findAnswere)[0]
    //   .replace(replaceAnswere, "");
    const question: string = this.uniones
      .match(findQuestion)[0]
      .replace(replaceQuestion, "");

    console.log(question);
    console.log(this.graphJSON);

    if (!this.graphJSON.questions[question]) {
      this.graphJSON.questions[question] = {};
    }

    console.log(this.graphJSON.questions[question]);
    len = Object.keys(this.graphJSON.questions[question]).length + 1;

    console.log(len);

    this.graphJSON.questions[question][len] = element;
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
    if (value === true && this.validateGraph()) {
      this.condition = true;
      this.postStatusBot(1);
    } else if (value === false) {
      this.condition = false;
      this.postStatusBot(1);
    } else {
      const toast = this.toastCtrl.create({
        message: "Tienes que completar el arbol para poder activar el bot",
        duration: 2000
      });
      toast.present();
    }
  }

  validateGraph() {
    let graph: boolean;
    const questions: RegExp = new RegExp(
      "(A|Q)[0-9]*\\(.*\\):::respuesta",
      "gm"
    );
    const questionsMatch: string[] = this.propiedades.match(questions);

    const replaceQst: RegExp = new RegExp(
      "\\(.*\\):::(respuesta|pregunta)",
      "gm"
    );

    for (const question of questionsMatch) {
      const validator: RegExp = new RegExp(
        `${question.replace(replaceQst, "")} --> (C|A)[0-9]*`,
        "gm"
      );

      console.log(this.uniones.match(validator));

      if (this.uniones.match(validator) !== null) {
        graph = true;
      } else {
        graph = false;
        break;
      }
    }

    return graph;
  }

  postStatusBot(status: number) {
    this.graphService.postStatusBot(10553, status).subscribe((data: any) => {
      console.log(data);
    });
  }
}
