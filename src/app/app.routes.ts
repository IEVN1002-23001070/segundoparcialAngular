import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "formularios",
    children: [
      {
        path: "usuarios",
        loadComponent: () =>
          import("./formularios/usuario/usuario").then((c) => c.Usuario),
      },

      {
        path: "zodiaco",
        loadComponent: () =>
          import("./formularios/zodiaco/zodiaco").then((c) => c.Zodiaco),
      },
    ],
  },

  {
    path: "escuela",
    children: [
      {
        path: "ListaAlumnos",
        loadComponent: () =>
          import("./escuela/lista-alumnos/lista-alumnos").then(
            (c) => c.ListaAlumnos,
          ),
      },
    ],
  },

  {
    path: "",
    redirectTo: "admin",
    pathMatch: "full",
  },

  {
    path: "**",
    redirectTo: "admin",
  },
];
