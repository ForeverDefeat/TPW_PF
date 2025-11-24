import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portal de Turismo API",
      version: "1.0.0",
      description: "Documentación del backend del portal de turismo",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
    components: {
      schemas: {

        //===================== CATEGORY ====================//

        Category: {
          type: "object",
          description: "Representa una categoría del portal de turismo.",
          properties: {
            id: { type: "integer", example: 12 },
            name: { type: "string", example: "Montañas" },
            description: {
              type: "string",
              example: "Espacios naturales para escalada, trekking y observación."
            },
            imageUrl: {
              type: "string",
              example: "assets/mountain1.png"
            }
          }
        },

        CategoryInput: {
          type: "object",
          required: ["name"],
          description: "Datos necesarios para crear una nueva categoría.",
          properties: {
            name: { type: "string", example: "Playas" },
            description: {
              type: "string",
              example: "Categoría dedicada a destinos costeros."
            },
            imageUrl: { type: "string", example: "assets/playa5.png" }
          }
        },

        CategoryUpdate: {
          type: "object",
          description: "Datos opcionales para actualizar una categoría existente.",
          properties: {
            name: { type: "string", example: "Cultura y Tradiciones" },
            description: {
              type: "string",
              example: "Nuevas actividades y eventos culturales disponibles."
            },
            imageUrl: { type: "string", example: "assets/cultura7.png" }
          }
        },

        //===================== USER ====================//

        User: {
          type: "object",
          description: "Representa un usuario del sistema.",
          properties: {
            id: { type: "integer", example: 1 },
            fullName: { type: "string", example: "Juan Pérez" },
            password: { type: "string", example: "123456" },
            email: { type: "string", example: "juan@example.com" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
          },
        },

        UserInput: {
          type: "object",
          description: "Datos necesarios para crear un nuevo usuario.",
          required: ["fullName", "email", "password"],
          properties: {
            fullName: {
              type: "string",
              example: "Carlos López"
            },
            email: {
              type: "string",
              example: "carlos.lopez@example.com"
            },
            password: {
              type: "string",
              example: "mypassword"
            },
            role: {
              type: "string",
              enum: ["admin", "user"],
              nullable: true,
              example: "user"
            }
          }
        },

        UserUpdate: {
          type: "object",
          description: "Datos opcionales para actualizar un usuario existente.",
          properties: {
            fullName: {
              type: "string",
              example: "Carlos Alberto López"
            },
            email: {
              type: "string",
              example: "nuevo.email@example.com"
            },
            password: {
              type: "string",
              example: "newpassword123"
            },
            role: {
              type: "string",
              enum: ["admin", "user"],
              example: "admin"
            }
          }
        },

        RegisterRequest: {
          type: "object",
          description: "Datos necesarios para crear un nuevo usuario.",
          required: ["fullName", "email", "password"],
          properties: {
            fullName: { type: "string", example: "Juan Pérez" },
            email: { type: "string", example: "juan@example.com" },
            password: { type: "string", example: "1234" },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@turismo.com" },
            password: { type: "string", example: "1234" },
          },
        },

        //===================== DESTINATION ====================//

        Destination: {
          type: "object",
          description: "Representa un destino turístico del portal.",
          properties: {
            id: {
              type: "integer",
              example: 5,
            },
            category_id: {
              type: "integer",
              description: "ID de la categoría a la que pertenece el destino.",
              example: 2,
            },
            name: {
              type: "string",
              example: "Montaña Azul",
            },
            description: {
              type: "string",
              example: "Laguna cristalina en la cima, ideal para trekking y fotografía.",
            },
            image_url: {
              type: "string",
              example: "assets/mountain4.png",
            },
          },
        },

        DestinationInput: {
          type: "object",
          required: ["name", "category_id", "description"],
          description: "Objeto necesario para crear un nuevo destino turístico.",
          properties: {
            category_id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Playa Dorada",
            },
            description: {
              type: "string",
              example: "Playas amplias con arena fina, ideales para tomar el sol.",
            },
            image_url: {
              type: "string",
              example: "assets/playa6.png",
            },
          },
        },

        DestinationUpdate: {
          type: "object",
          description: "Objeto para actualizar parcialmente un destino.",
          properties: {
            name: {
              type: "string",
              example: "Montaña Celeste",
            },
            category_id: {
              type: "integer",
              example: 3,
            },
            description: {
              type: "string",
              example: "Nuevas rutas de trekking y miradores mejorados.",
            },
            image_url: {
              type: "string",
              example: "assets/mountain7.png",
            },
          },
        },

        //===================== SERVICE ====================//

        Service: {
          type: "object",
          description: "Representa un servicio turístico disponible en el portal.",
          properties: {
            id: {
              type: "integer",
              example: 42
            },
            service_type_id: {
              type: "integer",
              description: "Tipo de servicio (hotel, restaurante, tour, etc.)",
              example: 3
            },
            name: {
              type: "string",
              example: "Hotel Costa Azul"
            },
            location: {
              type: "string",
              example: "Paracas"
            },
            description: {
              type: "string",
              example: "Hotel frente al mar con vista panorámica y piscina privada."
            },
            price_range: {
              type: "string",
              example: "S/ 120 - S/ 250"
            },
            image_url: {
              type: "string",
              example: "assets/hotel1.png"
            }
          }
        },

        ServiceInput: {
          type: "object",
          required: ["service_type_id", "name"],
          description: "Datos necesarios para registrar un nuevo servicio turístico.",
          properties: {
            service_type_id: {
              type: "integer",
              example: 1
            },
            name: {
              type: "string",
              example: "Restaurante El Pez Dorado"
            },
            location: {
              type: "string",
              example: "Paracas - Ave. Costanera"
            },
            description: {
              type: "string",
              example: "Especializado en comida marina con ingredientes frescos."
            },
            price_range: {
              type: "string",
              example: "S/ 30 - S/ 70"
            },
            image_url: {
              type: "string",
              example: "assets/rest1.png"
            }
          }
        },

        ServiceUpdate: {
          type: "object",
          description: "Campos opcionales para actualizar la información de un servicio turístico.",
          properties: {
            service_type_id: {
              type: "integer",
              example: 4
            },
            name: {
              type: "string",
              example: "Tour Ballestas Premium"
            },
            location: {
              type: "string",
              example: "Muelle principal de Paracas"
            },
            description: {
              type: "string",
              example: "Incluye visita guiada a las Islas Ballestas + transporte."
            },
            price_range: {
              type: "string",
              example: "S/ 80 - S/ 150"
            },
            image_url: {
              type: "string",
              example: "assets/tour2.png"
            }
          }
        },

        //===================== SERVICE TYPE ====================//

        ServiceType: {
          type: "object",
          description: "Representa un tipo de servicio turístico (Hotel, Restaurante, Tour, etc.)",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            name: {
              type: "string",
              example: "Hotel"
            },
            icon_url: {
              type: "string",
              nullable: true,
              example: "assets/icons/hotel.png"
            }
          }
        },

        ServiceTypeInput: {
          type: "object",
          required: ["name"],
          description: "Datos necesarios para crear un nuevo tipo de servicio turístico.",
          properties: {
            name: {
              type: "string",
              example: "Restaurante"
            },
            icon_url: {
              type: "string",
              nullable: true,
              example: "assets/icons/restaurant.png"
            }
          }
        },

        ServiceTypeUpdate: {
          type: "object",
          description: "Datos opcionales para actualizar un tipo de servicio turístico existente.",
          properties: {
            name: {
              type: "string",
              example: "Tour"
            },
            icon_url: {
              type: "string",
              nullable: true,
              example: "assets/icons/tour.png"
            }
          }
        },

        //===================== DESTINATION SERVICE ====================//

        DestinationService: {
          type: "object",
          description: "Representa la relación entre un destino y un servicio turístico.",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            destination_id: {
              type: "integer",
              example: 5
            },
            service_id: {
              type: "integer",
              example: 42
            }
          }
        },

        DestinationServiceInput: {
          type: "object",
          required: ["destination_id", "service_id"],
          description: "Datos necesarios para crear una relación destino-servicio.",
          properties: {
            destination_id: {
              type: "integer",
              example: 3
            },
            service_id: {
              type: "integer",
              example: 15
            }
          }
        },

        //===================== EVENT ====================//

        Event: {
          type: "object",
          description: "Representa un evento turístico asociado a un destino.",
          properties: {
            id: {
              type: "integer",
              example: 12
            },
            destination_id: {
              type: "integer",
              example: 3
            },
            title: {
              type: "string",
              example: "Festival de la Vendimia"
            },
            description: {
              type: "string",
              nullable: true,
              example: "Celebración tradicional con música, bailes y degustaciones."
            },
            date: {
              type: "string",
              format: "date",
              example: "2025-03-12"
            },
            location: {
              type: "string",
              nullable: true,
              example: "Plaza principal de Ica"
            },
            image_url: {
              type: "string",
              nullable: true,
              example: "https://cdn.turismo.com/eventos/vendimia.jpg"
            }
          }
        },

        EventInput: {
          type: "object",
          required: ["destination_id", "title", "date"],
          description: "Datos necesarios para crear un nuevo evento turístico.",
          properties: {
            destination_id: {
              type: "integer",
              example: 2
            },
            title: {
              type: "string",
              example: "Fiesta del Sol - Inti Raymi"
            },
            description: {
              type: "string",
              nullable: true,
              example: "Ceremonia incaica en honor al dios Inti."
            },
            date: {
              type: "string",
              format: "date",
              example: "2025-06-24"
            },
            location: {
              type: "string",
              nullable: true,
              example: "Complejo arqueológico de Sacsayhuamán"
            },
            image_url: {
              type: "string",
              nullable: true,
              example: "https://cdn.turismo.com/eventos/intiraymi.jpg"
            }
          }
        },

        EventUpdate: {
          type: "object",
          description: "Datos opcionales para actualizar un evento turístico existente.",
          properties: {
            title: {
              type: "string",
              example: "Festival Gastronómico Internacional"
            },
            description: {
              type: "string",
              nullable: true,
              example: "Evento culinario con chefs invitados de todo el mundo."
            },
            date: {
              type: "string",
              format: "date",
              example: "2025-07-15"
            },
            location: {
              type: "string",
              nullable: true,
              example: "Parque de la Exposición - Lima"
            },
            image_url: {
              type: "string",
              nullable: true,
              example: "https://cdn.turismo.com/eventos/gastrofest.jpg"
            }
          }
        },


        //===================== FAVORITE ====================//

        Favorite: {
          type: "object",
          description: "Representa un destino marcado como favorito por un usuario.",
          properties: {
            id: {
              type: "integer",
              example: 15
            },
            user_id: {
              type: "integer",
              example: 4
            },
            destination_id: {
              type: "integer",
              example: 10
            }
          }
        },

        FavoriteInput: {
          type: "object",
          required: ["user_id", "destination_id"],
          description: "Datos necesarios para marcar un destino como favorito.",
          properties: {
            user_id: {
              type: "integer",
              example: 4
            },
            destination_id: {
              type: "integer",
              example: 10
            }
          }
        },

        FavoriteDelete: {
          type: "object",
          description: "Identificador del registro favorites a eliminar.",
          properties: {
            id: {
              type: "integer",
              example: 15
            }
          }
        },

        //===================== EVENTS FOLLOWED ====================//

        EventFollow: {
          type: "object",
          description: "Representa un evento que un usuario está siguiendo.",
          properties: {
            id: {
              type: "integer",
              example: 18
            },
            user_id: {
              type: "integer",
              example: 4
            },
            event_id: {
              type: "integer",
              example: 7
            }
          }
        },

        EventFollowInput: {
          type: "object",
          required: ["user_id", "event_id"],
          description: "Datos necesarios para que un usuario siga un evento.",
          properties: {
            user_id: {
              type: "integer",
              example: 4
            },
            event_id: {
              type: "integer",
              example: 7
            }
          }
        },

        EventFollowDelete: {
          type: "object",
          description: "Identificador necesario para dejar de seguir un evento.",
          properties: {
            id: {
              type: "integer",
              example: 18
            }
          }
        },

        //===================== DASHBOARDS ====================//

        DashboardStats: {
          type: "object",
          description: "Conjunto de métricas generales del panel administrativo.",
          properties: {
            categories: {
              type: "integer",
              example: 5,
              description: "Total de categorías registradas."
            },
            destinations: {
              type: "integer",
              example: 18,
              description: "Total de destinos turísticos registrados."
            },
            services: {
              type: "integer",
              example: 40,
              description: "Total de servicios turísticos disponibles."
            },
            events: {
              type: "integer",
              example: 6,
              description: "Total de eventos registrados."
            },
            users: {
              type: "integer",
              example: 120,
              description: "Total de usuarios registrados en el sistema."
            },

            destinationsPerCategory: {
              type: "array",
              description: "Lista de categorías con su cantidad total de destinos.",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: "Cultura"
                  },
                  total: {
                    type: "integer",
                    example: 5
                  }
                }
              }
            },

            recentActivity: {
              type: "array",
              description: "Actividad reciente del sistema agrupada por día.",
              items: {
                type: "object",
                properties: {
                  date: {
                    type: "string",
                    example: "2025-02-10"
                  },
                  count: {
                    type: "integer",
                    example: 3
                  }
                }
              }
            }
          }
        },

      }
    }
  },
  apis: ["./routes/*.js", "./controllers/*.js"], // ← Aquí leerá tus JSDoc
};

export const swaggerSpec = swaggerJSDoc(options);

export function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger listo en: http://localhost:4000/api-docs");
}
