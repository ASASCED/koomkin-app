import { NgModule } from '@angular/core';
import { ProveedorComponent } from './proveedor/proveedor';
import { ServicioComponent } from './servicio/servicio';
import { MedicoComponent } from './medico/medico';
import { ProfesionistaComponent } from './profesionista/profesionista';
import { PuntoventaComponent } from './puntoventa/puntoventa';
import { RestauranteComponent } from './restaurante/restaurante';
import { HotelComponent } from './hotel/hotel';
import { InmobiliariaComponent } from './inmobiliaria/inmobiliaria';

@NgModule({
	declarations: [ProveedorComponent,
    ServicioComponent,
    MedicoComponent,
    ProfesionistaComponent,
    PuntoventaComponent,
    RestauranteComponent,
    HotelComponent,
    InmobiliariaComponent],
	imports: [],
	exports: [ProveedorComponent,
    ServicioComponent,
    MedicoComponent,
    ProfesionistaComponent,
    PuntoventaComponent,
    RestauranteComponent,
    HotelComponent,
    InmobiliariaComponent]
})
export class ComponentsModule {}
