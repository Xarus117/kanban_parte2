import { Component } from '@angular/core';
import { Tarea } from './models/tarea-model';
import { Input } from '@angular/core';
import { Usuario } from './models/usuario-model';

const k_PENDIENTES_LISTA: string = "Pendientes";
const k_PROGRESO_LISTA: string = "Progreso";
const k_FINALIZADAS_LISTA: string = "Finalizadas";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: "Kanban"
  Xcambiar = true; // Xcambiar permite ir cambiando entre tablero y formulario
  listas: string[] = []; // Aquí se almacenan los tres tipos de listas PENDIENTES | PROGRESO | FINALIZADAS
  lista: string;
  tareas: Tarea[]; // Aquí se almacenan todas las tareas que se nuestrab en el tablero
  tareaCache: Tarea // Caché usado para guardar la tarea que se encuentra en edición
  tareaReinicio: Tarea; // Tarea en blanco, esta se ocupa de limpiar el caché
  editando = false; // Boolean usado para especificar si una tarea se está editando

  constructor() {
    const tareasJSON: string = `{
      "tareas": [
      { "id": 0, "lista": "${k_FINALIZADAS_LISTA}", "img":
      "https://picsum.photos/300/200", "titulo": "Tarea 1: Diseño UI",
      "usuarios": [{"email": "lponts@ilerna.com", "img":
      "https://picsum.photos/300/300", "nick": "Juan", "alt":
      "Usuario"}], "fechaFin": "2019-01-16" },
      
          {"id": 1, "lista": "${k_PROGRESO_LISTA}", "img": "https://picsum.photos/300/200",
        "titulo":"Tarea 2: Diseño de todo el Backend", "usuarios": null, "fechaFin": "2022-11-09"},
      
      
      { "id": 2, "lista": "${k_PENDIENTES_LISTA}", "img": null,
      "titulo": "Tarea 3: Diseño de la base de datos", "usuarios":
      [{"email": "jdominguez@ilerna.com", "img":
      "https://picsum.photos/200/200", "nick": "Jose", "alt": "Usuario"},
      { "email": "lponts@ilerna.com", "img":
      "https://picsum.photos/100/100", "nick": "Laura", "alt":
      "Usuario"}], "fechaFin": "2022-11-16" },
      
      { "id": 3, "lista": "${k_PENDIENTES_LISTA}", "img": null,
      "titulo": "Tarea 4: Implementar todo el Front-End", "usuarios": [],
      "fechaFin": null }
      ]
      }`;

    const tareasDict: any = JSON.parse(tareasJSON);
    this.title = "Kanban";
    this.tareas = tareasDict['tareas'];
    this.listas.push(k_PENDIENTES_LISTA);
    this.listas.push(k_PROGRESO_LISTA);
    this.listas.push(k_FINALIZADAS_LISTA);
    this.lista = "";
    this.tareaReinicio = { "id": 0, "lista": "", "img": "", "titulo": "", "usuarios": [{ "email": "", "img": "", "nick": "", "alt": "" }], "fechaFin": new Date() }
    this.tareaCache = { "id": 0, "lista": "", "img": "", "titulo": "", "usuarios": [{ "email": "", "img": "", "nick": "", "alt": "" }], "fechaFin": new Date() }
  }


  cambiar(cambiar: any, lista?: string, editar?: boolean,) { // Cambiar de formulario a tablero o a la inversa
    this.Xcambiar = cambiar;
    if (editar != null) {
      this.editando = editar;
    }
    if (lista != null) {
      this.lista = lista;
    }
  }


  crearNuevaTarea(tarea: Tarea) { // Al recibir un objeto tarea incluye la nueva tarea en el tablero
    if (tarea.usuarios.length > 2) {
      tarea.usuarios.shift()
    }
    tarea.usuarios.shift()
    this.tareas.push(tarea);
    console.log(this.tareas)
    this.Xcambiar = true;
  }


  editarTarea(tarea: Tarea) { // Función usada para guardar la tarea en edición
    this.editando = true;
    this.tareaCache = tarea
    this.cambiar(false)
  }

  eliminarOriginal(editado: boolean) { // Una vez se haya confirmado una edición se eliminar la tarea original y se añade su nueva versión
    if (editado) {
      for (let i = 0; i < this.tareas.length; i++) {
        if (this.tareas[i] == this.tareaCache) {
          this.tareas.splice(i, 1)
        }
      }
    }
    this.tareaCache = this.tareaReinicio; // Se establecen los valores por defecto al caché
  }
}

