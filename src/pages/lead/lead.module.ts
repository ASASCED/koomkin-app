import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadPage } from './lead';
import { HotelComponent } from '../../components/hotel/hotel';
import { RestauranteComponent } from '../../components/restaurante/restaurante';
import { InmobiliariaComponent } from '../../components/inmobiliaria/inmobiliaria';
import { ProfesionistaComponent } from '../../components/profesionista/profesionista';
import { MedicoComponent } from '../../components/medico/medico';
import { PuntoventaComponent } from '../../components/puntoventa/puntoventa';
import { ProveedorComponent } from '../../components/proveedor/proveedor';
import { ServicioComponent } from '../../components/servicio/servicio';

@NgModule({
  declarations: [
    LeadPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadPage),
    HotelComponent,
    PuntoventaComponent,
    MedicoComponent,
    InmobiliariaComponent,
    ServicioComponent,
    ProfesionistaComponent,
    RestauranteComponent,
    ProveedorComponent
  ],
})
export class LeadPageModule {}
