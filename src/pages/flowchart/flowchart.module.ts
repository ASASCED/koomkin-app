import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { FlowchartPage } from "./flowchart";
import { DragulaModule } from "ng2-dragula";

@NgModule({
  declarations: [FlowchartPage],
  imports: [IonicPageModule.forChild(FlowchartPage), DragulaModule],
})
export class FlowchartPageModule {}
