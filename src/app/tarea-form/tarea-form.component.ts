import { Component, OnInit } from '@angular/core';;
import { Input, Output, EventEmitter } from '@angular/core';
import { Usuario } from '../models/usuario-model';
import { FormBuilder, FormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Tarea } from '../models/tarea-model';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-tarea-form',
  templateUrl: './tarea-form.component.html',
  styleUrls: ['./tarea-form.component.css']
})

export class TareaFormComponent implements OnInit {

  // INPUTS / OUTPUTS

  @Output() cancelarTarea = new EventEmitter<boolean>(); // Se emite si se quiere cancelar la tarea (FALSE)
  @Output() guardarTarea = new EventEmitter<Tarea>(); // Output para guardar la tarea emitiendo el objeto TAREA
  @Input() tarea: Tarea; // Tarea a editar
  @Input() editando: boolean; // Para saber si estamos editando
  @Input() lista: string; // Lista preestablecida en la que estamos creando la tarea
  @Output() editGuardado = new EventEmitter<boolean>();

  nuevaTarea: FormGroup; // Grupo para almacenar el contenido del formulario de creación / edición de tareas
  objetoTarea: Tarea; // Objeto usado para almacenar la información recolectada vía el formulario en forma de objeto Tarea

  arrayUsuarios: Usuario[]; // Array que almacena los usuarios
  arrayUsuariosDef: Usuario[];
  arrayVisibilidad: boolean[]; // Array que se ocupa de mostrar los usuarios

  usuariosPasados: boolean;


  constructor(fb: FormBuilder) { // CONSTRUCTOR

    this.tarea = { "id": 0, "lista": "", "img": "", "titulo": "", "usuarios": [{ "email": "", "img": "", "nick": "", "alt": "" }], "fechaFin": new Date() }

    this.nuevaTarea = fb.group({ // FORM GROUP (Elementos que incluye el formulario)
      id: fb.control('initial value'),
      lista: fb.control('initial value'),
      img: fb.control('initial value'),
      titulo: fb.control('initial value'),
      usuarios: fb.control('initial value'),
      fechaFin: fb.control('initial value')
    });


    this.objetoTarea = {
      "id": 0, "lista": "", "img":
        "", "titulo": "",
      "usuarios": [{
        "email": "", "img":
          "", "nick": "", "alt":
          ""
      }], "fechaFin": new Date()
    }

    this.arrayUsuarios = [{ "email": "ejemplo1@gmail.com", "img": "https://picsum.photos/200", "nick": "Ejemplo1", "alt": "Ejemplo1" }, { "email": "ejemplo2@gmail.com", "img": "https://picsum.photos/200", "nick": "Ejemplo2", "alt": "Ejemplo2" }]
    this.arrayUsuariosDef = [{ "email": "ejemplo1@gmail.com", "img": "https://picsum.photos/200", "nick": "Ejemplo1", "alt": "Ejemplo1" }, { "email": "ejemplo2@gmail.com", "img": "https://picsum.photos/200", "nick": "Ejemplo2", "alt": "Ejemplo2" }]

    this.arrayVisibilidad = [false, false]

    this.editando = false;

    this.lista = "";

    this.usuariosPasados = false;
  }

  ngOnInit(): void { // Al iniciarse se establecen los valores del formulario (FormGroup)

    this.nuevaTarea = new FormGroup({
      id: new FormControl(3),

      lista: new FormControl('', Validators.required),

      img: new FormControl(''),

      titulo: new FormControl('', Validators.required),

      usuarios: new FormControl(''),

      fechaFin: new FormControl('')

    });

    if (this.editando == true) { // En el caso de que se esté editando se introducen los valores de la tarjeta que deseamos editar
      console.log("setvalue")
      console.log(this.tarea)

      this.nuevaTarea.setValue({
        id: this.tarea.id,
        lista: this.tarea.lista,
        img: this.tarea.img,
        titulo: this.tarea.titulo,
        usuarios: this.tarea.usuarios,
        fechaFin: this.tarea.fechaFin

      })

      for (let i = 0; i < this.tarea.usuarios.length; i++) {
        this.arrayVisibilidad[i] = true;
      }

    }
    else { // Para establecer una LISTA ya predefinida
      this.nuevaTarea.setValue({
        id: 3,
        lista: this.lista,
        img: "",
        titulo: "",
        usuarios: [],
        fechaFin: ""

      })
    }
  }


  cancelarTareaEstado() { // Al cancelar
    this.cancelarTarea.emit(true)
  }

  mostrarUsuario() { // Esta array se ocupa de mostrar solo los usuarios añadidos


    if (this.arrayVisibilidad[0] == true) {
      this.arrayVisibilidad[1] = true;
    }
    else if (this.arrayVisibilidad[1] == true && this.arrayVisibilidad[0] == false) {
      this.arrayVisibilidad[0] = true;
    }
    else if (this.arrayVisibilidad[0] == false && this.arrayVisibilidad[1] == false) {
      this.arrayVisibilidad[0] = true;
    }

    console.log(this.arrayVisibilidad)

  }

  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }


  onClickSubmit(data: any) { // Submit de la información del formulario

    if (this.editando == true) { // Se está editando?
      this.editGuardado.emit(true);
    }
    else {
      this.editGuardado.emit(false);
    }


    // Se rellena el objeto con la información del formulario
    this.objetoTarea.id = data.id;
    this.objetoTarea.lista = data.lista;
    this.objetoTarea.img = data.img;
    this.objetoTarea.titulo = data.titulo;
    this.objetoTarea.fechaFin = data.fechaFin;

    for (let i = 0; i < this.arrayVisibilidad.length; i++) {
      console.log(this.arrayVisibilidad)
      if (this.arrayVisibilidad[i] == true) {
        this.arrayUsuariosDef.push(this.arrayUsuarios[i])
      }
      else if (this.arrayVisibilidad[i] == false) {
        this.arrayUsuariosDef.splice(i, 1)
      }

    }
    console.log(this.arrayUsuariosDef)
    this.objetoTarea.usuarios = this.arrayUsuariosDef

    this.guardarTarea.emit(this.objetoTarea); // Se emite el objeto

  }

  borrarUsuario(data: Usuario) { // Función para eliminar los usuarios añadidos
    console.log(data)
    for (let i = 0; i < this.arrayUsuarios.length; i++) {
      if (this.arrayUsuarios[i] == data) {
        this.arrayVisibilidad[i] = false;
      }
    }
    console.log(this.arrayVisibilidad)
  }
}


