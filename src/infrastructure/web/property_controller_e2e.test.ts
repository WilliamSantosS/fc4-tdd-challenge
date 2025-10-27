import { v4 as uuidv4 } from "uuid";

import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { PropertyService } from "../../application/services/property_service";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyController } from "./property_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

describe("PropertyController", () => {
  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [PropertyEntity, BookingEntity, UserEntity],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
    propertyRepository = new TypeORMPropertyRepository(
      dataSource.getRepository(PropertyEntity)
    );
    propertyService = new PropertyService(propertyRepository);
    propertyController = new PropertyController(propertyService);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  app.post("/properties", (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
  });

  it("deve criar uma propriedade com sucesso", async () => {
    const response = await request(app).post("/properties").send({
      id: uuidv4(),
      name: "Apartamento",
      description: "Um apartamento no centro",
      maxGuests: 1000,
      basePricePerNight: 200,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Propriedade criada com sucesso.");
  });

  it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post("/properties").send({
      id: uuidv4(),
      description: "Uma casa na floresta",
      maxGuests: 1000,
      basePricePerNight: 200,
    });

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("O nome da propriedade é obrigatório.");
  });

  it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
    const response = await request(app).post("/properties").send({
      id: uuidv4(),
      name: "Hotel",
      description: "Um hotel no centro",
      maxGuests: 0,
      basePricePerNight: 200,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "O número máximo de hóspedes deve ser maior que zero"
    );
  });

  it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
    const response = await request(app).post("/properties").send({
      id: uuidv4(),
      name: "Mansão",
      description: "Uma grande mansão",
      maxGuests: 1000,
    });

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("O preço base por noite é obrigatório.");
  });
});
