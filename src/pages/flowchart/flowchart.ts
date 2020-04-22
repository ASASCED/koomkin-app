import { Component, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController,
} from "ionic-angular";

import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { GraphProvider } from "../../providers/graph/graph";
import { DragulaService } from "ng2-dragula/ng2-dragula";
import { Platform } from "ionic-angular";
import * as mermaid from "mermaid";
import * as $ from "jquery";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-flowchart",
  templateUrl: "flowchart.html",
})
export class FlowchartPage {
  @ViewChild("mermaid") zoomGraph: ElementRef;
  @ViewChild("divZoom") divZoom: ElementRef;
  @ViewChild("video") video: ElementRef;
  @ViewChild("exampleContainer") exampleContainer: ElementRef;
  pregunta = document.getElementsByClassName("pregunta");

  zoom: number = 1;
  acum: number = 0;
  idElement: any;
  condition = true;
  showImage = false;

  idGeneral: number = 55020;

  graphJSON: any = {
    user_id: String(this.idGeneral),
    questions: {
      Q0000000000000: {},
    },
    ux_data: {
      Q0000000000000: {
        text: "Pregunta",
        type: "MULTIPLE",
      },
    },
    properties: {},
    classes: {},
    relationships: {},
  };

  @ViewChild("mermaid")
  public mermaidDiv;
  propiedades: string = `Q0000000000000(Pregunta):::pregunta`;
  uniones: string = `Q0000000000000`;
  clases: string = `classDef pregunta:first-child fill: #f1f1f1, stroke: #3590C4, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
  classDef pregunta fill: #f1f1f1, stroke: #f1f1f1, stroke-width: 4px, color: #3590C4, font-weight: bold, font-size: 10px
  classDef respuesta fill: #243e56, stroke: #f1f1f1, stroke-width: 0px, color: #ffffff, font-weight: bold, font-size: 10px
  classDef precio fill: #f2680a, stroke: #f2680a, stroke-width: 4px, color: #ffffff, font-weight: bold, font-size: 10px`;
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
    public toastCtrl: ToastController,
    private storage: Storage
  ) {
    if (this.platform.is("cordova")) {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );
    }

    this.graphService.getStatusBot(this.idGeneral).subscribe((data: any) => {
      console.log(data);
      if (JSON.parse(data._body).status === 0) {
        this.condition = true;
      } else {
        this.condition = false;
      }

      this.graphService
        .getGraph(this.idGeneral)
        .subscribe(async (data: any) => {
          console.log(JSON.parse(data["_body"]));
          if (Object.keys(JSON.parse(data["_body"])).length === 0) {
            this.condition = true;
            this.postStatusBot(0);
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
  }

  ionViewDidLoad() {
    this.storage.get("played").then((data: boolean) => {
      if (data === null) {
        setTimeout(() => {
          this.video.nativeElement.play();
        }, 500);

        setTimeout(() => {
          this.renderer.setStyle(this.video.nativeElement, "display", "none");
          this.storage.set("played", false);
        }, 47000);
      } else {
        this.renderer.setStyle(this.video.nativeElement, "display", "none");
      }
    });
  }

  mermaidStart() {
    mermaid.initialize({
      theme: "default",
      securityLevel: "loose",
      startOnLoad: true,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      },
    });

    const element: any = this.mermaidDiv.nativeElement;
    mermaid.render("graphDiv", this.graphDefinition, (svgCode: any) => {
      element.innerHTML = svgCode;
    });
  }

  deleteNode(target: string) {
    if (target.match(`C[0-9]*`)) {
      const questionsText: string[] = [];
      const removeRelationship: RegExp = new RegExp(
        `A[0-9]* --> ${target}`,
        "gm"
      );
      const removeProperty: RegExp = new RegExp(
        `${target}\\(.*\\):::precio`,
        "gm"
      );
      const removeQuotation: RegExp = new RegExp(` --> ${target}`);
      const getQuestion: RegExp = new RegExp(
        `Q[0-9]* --> ${this.uniones
          .match(removeRelationship)[0]
          .replace(removeQuotation, "")}`
      );

      const replaceAnswere: RegExp = new RegExp(` --> A[0-9]*`, "g");
      const question: string = this.uniones
        .match(getQuestion)[0]
        .replace(replaceAnswere, "");
      const length = Object.keys(this.graphJSON.questions[question]).length;

      delete this.graphJSON.ux_data[target];
      for (let i = 1; i <= length; i++) {
        if (this.graphJSON.questions[question][i] === target) {
          delete this.graphJSON.questions[question][i];
        } else {
          questionsText.push(this.graphJSON.questions[question][i]);
          delete this.graphJSON.questions[question][i];
        }
      }

      for (let i = 1; i <= questionsText.length; i++) {
        this.graphJSON.questions[question][i] = questionsText[i - 1];
      }

      this.uniones = this.uniones.replace(removeRelationship, "");
      this.propiedades = this.propiedades.replace(removeProperty, "");

      this.graphDefinition = `graph TD
      ${this.propiedades}
      ${this.uniones}
      ${this.clases}`;

      this.mermaidStart();
      this.setFunctionEdit();
      this.postJSON();
      this.validateGraph();

      console.log(this.graphJSON);
    } else if (target.match(`Q[0-9]*`)) {
      console.log(target);
      const removeRelationship: RegExp = new RegExp(
        `A[0-9]* --> ${target}`,
        "gm"
      );
      const removeProperty: RegExp = new RegExp(
        `${target}\\(.*\\):::pregunta`,
        "gm"
      );

      this.uniones = this.uniones.replace(removeRelationship, "");
      this.propiedades = this.propiedades.replace(removeProperty, "");

      delete this.graphJSON.questions[target];
      delete this.graphJSON.ux_data[target];
      const length = Object.keys(this.graphJSON.questions).length;

      for (let i = 1; i <= length; i++) {
        if (
          this.graphJSON.questions[
            Object.keys(this.graphJSON.questions)[i - 1]
          ][i] === target
        ) {
          delete this.graphJSON.questions[
            Object.keys(this.graphJSON.questions)[i - 1]
          ][i];
        }
      }

      this.graphDefinition = `graph TD
      ${this.propiedades}
      ${this.uniones}
      ${this.clases}`;

      this.mermaidStart();
      this.setFunctionEdit();
      this.postJSON();
      this.validateGraph();

      console.log(this.graphJSON);
    } else {
      let acum: number = 1;
      const replaceProperty: RegExp = new RegExp(
        `${target}\\(.*\\):::respuesta`
      );
      const getquestion: RegExp = new RegExp(`Q[0-9]* --> ${target}`, "gm");
      const replaceAnswere: RegExp = new RegExp(` --> ${target}`);
      const question: string = this.uniones
        .match(getquestion)[0]
        .replace(replaceAnswere, "");
      const getAnsweres: RegExp = new RegExp(`${question} --> A[0-9]*`, "gm");
      const replaceQuestion: RegExp = new RegExp(`${question} --> A`);
      const answeres: string[] = this.uniones.match(getAnsweres);
      const answeresText: string[] = [];

      for (let i = 1; i <= answeres.length; i++) {
        if (answeres[i - 1].replace(replaceQuestion, "") === target.substr(1)) {
          delete this.graphJSON.ux_data[question][acum];
        } else {
          answeresText.push(this.graphJSON.ux_data[question][acum]);
          delete this.graphJSON.ux_data[question][acum];
        }
        acum++;
      }

      for (let i = 1; i <= answeresText.length; i++) {
        this.graphJSON.ux_data[question][i] = answeresText[i - 1];
      }

      this.uniones = this.uniones.replace(getquestion, "");
      this.propiedades = this.propiedades.replace(replaceProperty, "");

      this.graphDefinition = `graph TD
      ${this.propiedades}
      ${this.uniones}
      ${this.clases}`;

      this.mermaidStart();
      this.setFunctionEdit();
      this.postJSON();
      this.validateGraph();

      console.log(this.graphJSON);
    }
  }

  setFunctionEdit() {
    $(".node").on("click", (target: any) => {
      const regExp: RegExp = new RegExp(
        `${target["currentTarget"]["id"]}\\(.*\\):::(pregunta|precio|respuesta)`,
        "gm"
      );
      const repOne: RegExp = new RegExp(
        `${target["currentTarget"]["id"]}\\(`,
        "gm"
      );
      const repTwo: RegExp = new RegExp(
        `\\):::(pregunta|precio|respuesta)`,
        "gm"
      );
      const matchRelation: RegExp = new RegExp(
        `${target["currentTarget"]["id"]} --> (Q|A|C)`,
        "gm"
      );

      const questionText: string[] = this.propiedades.match(regExp);
      const preQuestion = questionText[0].replace(repOne, "");
      const messageQuestion = preQuestion.replace(repTwo, "");

      if (
        !this.uniones.match(matchRelation) &&
        String(target["currentTarget"]["id"]).match(`(A|Q)[0-9]*`) &&
        String(target["currentTarget"]["id"]) !== "Q0000000000000"
      ) {
        this.promptDelete(messageQuestion, target);
      } else if (String(target["currentTarget"]["id"]).match(`C[0-9]*`)) {
        if (messageQuestion.includes("-")) {
          this.promptQuotationRange(messageQuestion, target);
        } else {
          this.promptQuotation(messageQuestion, target);
        }
      } else {
        this.promptNormal(messageQuestion, target);
      }
    });
  }

  promptDelete(messageQuestion: string, target: any) {
    const prompt = this.alertCtrl.create({
      title: "Editar",
      message: `Texto: ${messageQuestion}`,
      inputs: [
        {
          name: "Valor",
          placeholder: "valor",
          // type: "number",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          handler: () => {},
        },
        {
          text: "Eliminar",
          handler: () => {
            this.deleteNode(target["currentTarget"]["id"]);
          },
        },
        {
          text: "Confirmar",
          handler: (data) => {
            if (data.Valor.length > 0) {
              const value = data.Valor;
              this.editPrompt(value, target);
            }
          },
        },
      ],
    });
    prompt.present();
  }

  promptNormal(messageQuestion: string, target: any) {
    const prompt = this.alertCtrl.create({
      title: "Editar",
      message: `Texto: ${messageQuestion}`,
      inputs: [
        {
          name: "Valor",
          placeholder: "valor",
          // type: "number",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          handler: () => {},
        },
        {
          text: "Confirmar",
          handler: (data) => {
            if (data.Valor.length > 0) {
              const value = data.Valor;
              this.editPrompt(value, target);
            }
          },
        },
      ],
    });
    prompt.present();
  }

  promptQuotation(messageQuestion: string, target: any) {
    const prompt = this.alertCtrl.create({
      title: "Editar",
      message: `Texto: ${messageQuestion}`,
      inputs: [
        {
          name: "Valor",
          placeholder: "valor",
          type: "number",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          handler: () => {},
        },
        {
          text: "Eliminar",
          handler: () => {
            this.deleteNode(target["currentTarget"]["id"]);
          },
        },
        {
          text: "Confirmar",
          handler: (data) => {
            if (data.Valor.length > 0) {
              const value = `$${data.Valor}`;
              this.editPrompt(value, target);
            }
          },
        },
      ],
    });
    prompt.present();
  }

  async promptQuotationRange(messageQuestion: string, target: any) {
    console.log(this.propiedades);
    const prompt = this.alertCtrl.create({
      title: "Editar",
      message: `Texto: ${messageQuestion}`,
      inputs: [
        {
          name: "ValorInicio",
          placeholder: "De:",
          type: "number",
        },
        {
          name: "ValorFinal",
          placeholder: "A:",
          type: "number",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          handler: () => {
            console.log("Cancel clicked");
            this.acum = 0;
          },
        },
        {
          text: "Eliminar",
          handler: () => {
            this.deleteNode(target["currentTarget"]["id"]);
          },
        },
        {
          text: "Confirmar",
          handler: (data) => {
            if (data.ValorInicio.length > 0 && data.ValorFinal.length > 0) {
              const value = `$${data.ValorInicio} - $${data.ValorFinal}`;
              this.editPrompt(value, target);
            }
          },
        },
      ],
    });
    await prompt.present();
  }

  editPrompt(data: any, target: any) {
    let types: string;
    const regExp: RegExp = new RegExp(
      `${target["currentTarget"]["id"]}\\(.*\\):::(pregunta|respuesta|precio)`,
      "gm"
    );

    if (/(Q[0-9]*)/.test(`${target["currentTarget"]["id"]}`)) {
      types = "pregunta";
    } else if (/(A[0-9]*)/.test(`${target["currentTarget"]["id"]}`)) {
      types = "respuesta";
    } else {
      types = "precio";
    }

    this.propiedades = this.propiedades.replace(
      regExp,
      `\n${target["currentTarget"]["id"]}("${data}"):::${types}`
    );

    this.editJSON(target["currentTarget"]["id"], data);

    this.graphDefinition = `graph TD
      ${this.propiedades}
      ${this.uniones}
      ${this.clases}`;
    this.mermaidStart();
    this.setFunctionEdit();
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
          this.presentConfirm(this.idElement, "C", "precio");
          // this.alertOptions(this.idElement, "C", "precio");
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
          placeholder: "valor",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          handler: () => {
            console.log("Cancel clicked");
            this.acum = 0;
          },
        },
        {
          text: "Confirmar",
          handler: (data) => {
            if (data.Valor.length > 0) {
              this.addElement(entrada, addElement, data.Valor, type);
              this.acum = 0;
            }
          },
        },
      ],
    });
    await prompt.present();
  }

  async quotationUnique(entrada: string, addElement: string, type: string) {
    const prompt = this.alertCtrl.create({
      title: `Añadir ${type}`,
      message: `Agrega el texto correspondiente a tu ${type}`,
      inputs: [
        {
          name: "Valor",
          placeholder: "valor",
          type: "number",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          handler: () => {
            console.log("Cancel clicked");
            this.acum = 0;
          },
        },
        {
          text: "Confirmar",
          handler: (data) => {
            if (data.Valor.length > 0) {
              const value = `$${data.Valor}`;
              this.addElement(entrada, addElement, value, type);
              this.acum = 0;
            }
          },
        },
      ],
    });
    await prompt.present();
  }

  async quotationRange(entrada: string, addElement: string, type: string) {
    const prompt = this.alertCtrl.create({
      title: `Añadir ${type}`,
      message: `Agrega el texto correspondiente a tu ${type}`,
      inputs: [
        {
          name: "ValorInicio",
          placeholder: "De:",
          type: "number",
        },
        {
          name: "ValorFinal",
          placeholder: "A:",
          type: "number",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          handler: () => {
            console.log("Cancel clicked");
            this.acum = 0;
          },
        },
        {
          text: "Confirmar",
          handler: (data) => {
            if (data.ValorInicio.length > 0 && data.ValorFinal.length > 0) {
              const value = `$${data.ValorInicio} - $${data.ValorFinal}`;
              this.addElement(entrada, addElement, value, type);
              this.acum = 0;
            }
          },
        },
      ],
    });
    await prompt.present();
  }

  presentConfirm(entrada: string, addElement: string, type: string) {
    let alert = this.alertCtrl.create({
      title: "Tipo de precio",
      message: "¿Que tipo de precio desea ingresar?",
      buttons: [
        {
          text: "Unico",
          handler: () => {
            this.quotationUnique(entrada, addElement, type);
          },
        },
        {
          text: "Rango",
          handler: () => {
            this.quotationRange(entrada, addElement, type);
          },
        },
      ],
    });
    alert.present();
  }

  addElement = (
    entrada: string,
    addElement: string,
    message: string,
    type: string
  ) => {
    let id = Date.now();

    this.uniones += `\n${entrada} --> ${addElement}${id}`;
    this.propiedades += `\n${addElement}${id}("${message}"):::${type}`;
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
          type: "MULTIPLE",
        };
      }

      len = Object.keys(this.graphJSON.ux_data[this.idElement]).length - 1;

      this.graphJSON.ux_data[this.idElement][len] = message;
    }

    if (addElement === "Q") {
      if (!this.graphJSON.ux_data[addElement + id]) {
        this.graphJSON.ux_data[addElement + id] = {
          text: message,
          type: "MULTIPLE",
        };
      }
      this.addQuestionsAns(this.idElement);
    }

    if (addElement === "C") {
      if (!this.graphJSON.ux_data[addElement + id]) {
        this.graphJSON.ux_data[addElement + id] = {
          text: message,
          type: "QUOTATION",
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
    this.postJSON();
    this.condition = false;
    this.postStatusBot(0);
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
    const findQuestion: RegExp = new RegExp(`Q[0-9]* --> ${id}`, "gm");
    const replaceQuestion: RegExp = new RegExp(` --> ${id}`, "gm");
    const question: string = this.uniones
      .match(findQuestion)[0]
      .replace(replaceQuestion, "");

    console.log(this.graphJSON);

    if (!this.graphJSON.questions[question]) {
      this.graphJSON.questions[question] = {};
    }

    len = Object.keys(this.graphJSON.questions[question]).length + 1;
    this.graphJSON.questions[question][len] = element;
  }

  zoomIn() {
    this.zoom += 0.3;
    this.renderer.setStyle(
      this.zoomGraph.nativeElement,
      "transform",
      `scale(${this.zoom})`
    );
  }

  zoomOut() {
    this.zoom -= 0.3;
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
      .postGraph(this.idGeneral, this.graphJSON)
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
        duration: 2000,
      });
      toast.present();
    }
  }

  validateGraph() {
    let graph: boolean;
    const questions: RegExp = new RegExp(
      "(A|Q)[0-9]*\\(.*\\):::(respuesta|pregunta)",
      "gm"
    );
    const questionsMatch: string[] = this.propiedades.match(questions);

    const replaceQst: RegExp = new RegExp(
      "\\(.*\\):::(respuesta|pregunta)",
      "gm"
    );

    for (const question of questionsMatch) {
      const validator: RegExp = new RegExp(
        `${question.replace(replaceQst, "")} --> (A|Q|C)[0-9]*`,
        "gm"
      );

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
    this.graphService
      .postStatusBot(this.idGeneral, status)
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  showExample() {
    this.showImage = !this.showImage;

    if (!this.showImage) {
      this.renderer.setStyle(
        this.exampleContainer.nativeElement,
        "display",
        "none"
      );

      const toast = this.toastCtrl.create({
        message: "Construir Bot...",
        duration: 2000,
      });
      toast.present();
    } else {
      this.renderer.setStyle(
        this.exampleContainer.nativeElement,
        "display",
        "initial"
      );

      const toast = this.toastCtrl.create({
        message: "Ejemplo Bot...",
        duration: 2000,
      });
      toast.present();
    }
  }

  sendTest() {
    this.graphService.postTriggerQuotationBot(this.idGeneral).subscribe(
      (data: any) => {
        console.log(data);
        const toast = this.toastCtrl.create({
          message: "Prueba enviada...",
          duration: 2000,
        });
        toast.present();
      },
      (err: any) => {
        const toast = this.toastCtrl.create({
          message: "Fallo al enviar la prueba...",
          duration: 2000,
        });
        toast.present();
      }
    );
  }
}
