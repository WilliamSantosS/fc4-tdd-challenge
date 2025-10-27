import express from "express";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import { DataSource } from "typeorm";
import { UserService } from "../../application/services/user_service";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { UserController } from "./user_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let userRepository: TypeORMUserRepository;
let userService: UserService;
let userController: UserController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  userRepository = new TypeORMUserRepository(
    dataSource.getRepository(UserEntity)
  );

  userService = new UserService(userRepository);

  userController = new UserController(userService);
});

afterAll(async () => {
  await dataSource.destroy();
});

app.post("/users", async (req, res, next) => {
  await userController.createUser(req, res).catch((err) => next(err));
});

describe("UserController", () => {
  beforeAll(async () => {
    const userRepo = dataSource.getRepository(UserEntity);
    await userRepo.clear();
  });

  it("Deve criar um usuário com sucesso", async () => {
    const response = await request(app).post("/users").send({
      id: uuidv4(),
      name: "Hornet",
    });

    expect(response.status).toBe(201);
  });

  it("deve retornar erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post("/users").send({
      id: uuidv4(),
    });

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("O campo nome é obrigatório.");
  });
});
