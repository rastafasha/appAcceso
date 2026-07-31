import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, 
  IonItem, IonLabel, IonInput, IonButton, IonIcon, IonList, IonItemSliding, 
  IonItemOptions, IonItemOption, IonBadge 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, carOutline, trashOutline, addCircleOutline, personOutline, mailOutline, phonePortraitOutline } from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, IonContent, IonHeader, IonToolbar, 
    IonTitle, IonCard, IonCardContent, IonItem, IonLabel, IonInput, 
    IonButton, IonIcon, IonList, IonItemSliding, IonItemOptions, IonItemOption, IonBadge
  ]
})
export class PerfilComponent implements OnInit {
  propiedadForm!: FormGroup;
  vehiculoForm!: FormGroup;
  propietarioId = '';
  datosUsuario: any = {};
  propiedad: any = null; // Guardará el objeto Property real de MongoDB Atlas
  isLoadingPropiedad = false;
  isLoadingVehiculo = false;
  esEdicion = false; // Bandera para alternar entre guardar nuevo o actualizar existente
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private propertyService: PropertyService,
  ) {
    addIcons({ homeOutline, carOutline, trashOutline, addCircleOutline, personOutline, mailOutline, phonePortraitOutline });
  }

  ngOnInit() {
    // 1. Obtener la data real del usuario autenticado
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      this.datosUsuario = JSON.parse(usuarioJSON);
      this.propietarioId = this.datosUsuario.uid;
      
      // 1. Inicializar el formulario de propiedad antes de rellenarlo
      this.inicializarFormularioPropiedad();
      
      // 2. Buscar si el propietario ya tiene casa asignada en Atlas
      this.cargarDatosPropiedad();
    }

    // 2. Formulario reactivo para registrar un nuevo vehículo (Arreglo)
    this.vehiculoForm = this.fb.group({
      placa: ['', [Validators.required, Validators.minLength(4)]],
      marca: ['', Validators.required],
      modelo: [''],
      color: ['']
    });
  }

  inicializarFormularioPropiedad() {
    this.propiedadForm = this.fb.group({
      numeroCasa: ['', [Validators.required, Validators.minLength(2)]],
      calleOBloque: ['', Validators.required]
    });
  }

  cargarDatosPropiedad() {
    this.propertyService.getPropertyUser(this.propietarioId)
      .subscribe({
        next: (resp: any) => {
          if (resp.ok && resp.property) {
            this.propiedad = resp.property;
            this.esEdicion = true;
            
            // Seteamos los valores en los campos reactivos del formulario
            this.propiedadForm.patchValue({
              numeroCasa: this.propiedad.numeroCasa,
              calleOBloque: this.propiedad.calleOBloque
            });
          } else {
            this.esEdicion = false; // No hay propiedad, se creará de cero
          }
        },
        error: (err) => console.error('Error al cargar propiedad:', err)
      });
  }

  // 🌟 GUARDAR O ACTUALIZAR PROPIEDAD
  guardarPropiedad() {
    if (this.propiedadForm.invalid) {
      this.propiedadForm.markAllAsTouched();
      return;
    }

    this.isLoadingPropiedad = true;

    if (this.esEdicion) {
      // Caso A: Actualizar propiedad existente (Usa tu función 'actualizarProperty')
      // Enviamos el ID de la propiedad por URL y el cuerpo con la data
      const payloadActualizar = {
        ...this.propiedadForm.value,
        propietarioId: this.propietarioId,
        _id: this.propiedad._id
      };

      this.propertyService.updateProperty(payloadActualizar).subscribe({
        next: (resp: any) => {
          this.isLoadingPropiedad = false;
          if (resp.ok) {
            this.propiedad = resp.property;
            console.log('Propiedad actualizada en Atlas:', this.propiedad);
          }
        },
        error: (err) => {
          this.isLoadingPropiedad = false;
          console.error('Error al actualizar propiedad:', err);
        }
      });

    } else {
      // Caso B: Crear propiedad de cero (Usa tu función 'crearProperty')
      const payloadCrear = {
        ...this.propiedadForm.value,
        propietarioId: this.propietarioId // Vinculamos al dueño actual
      };

      this.propertyService.createProperty(payloadCrear).subscribe({
        next: (resp: any) => {
          this.isLoadingPropiedad = false;
          if (resp.ok) {
            this.propiedad = resp.property;
            this.esEdicion = true; // El próximo clic será edición
            console.log('Nueva propiedad guardada en Atlas:', this.propiedad);
          }
        },
        error: (err) => {
          this.isLoadingPropiedad = false;
          console.error('Error al crear propiedad:', err);
        }
      });
    }
  }
  

  agregarVehiculo() {
    if (this.vehiculoForm.invalid || !this.propiedad) return;

    this.isLoading = true;
     const payload = {
        ...this.vehiculoForm.value,
        propietarioId: this.propietarioId,
        _id: this.propiedad._id
      };
    this.propertyService.addVehiculo(payload).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        if (resp.ok) {
          // Sincronizamos el arreglo local con el devuelto por MongoDB Atlas ya actualizado
          this.propiedad.vehiculosPropietario = resp.property.vehiculosPropietario;
          this.vehiculoForm.reset(); // Limpiar el formulario para un próximo registro
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al añadir vehículo:', err);
      }
    });
  }

  eliminarVehiculo(vehiculoId: string) {
    if (!this.propiedad) return;

    // Llamamos al método DELETE especializado pasándole el ID de la casa y el _id del carro

    this.propertyService.deleteVehiculo(this.propiedad._id,vehiculoId).subscribe({
      next: (resp: any) => {
        if (resp.ok) {
          // Filtramos localmente el carro eliminado para removerlo de la vista sin recargar la página
          this.propiedad.vehiculosPropietario = this.propiedad.vehiculosPropietario.filter(
            (v: any) => v._id !== vehiculoId
          );
        }
      },
      error: (err) => console.error('Error al remover el vehículo:', err)
    });
  }
}
