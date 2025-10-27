import { Request, Response } from "express";
import { CreateUserDTO } from "../../application/dtos/create_user_dto";
import { UserService } from "../../application/services/user_service";

export class UserController {
  constructor(private userService: UserService) {
    this.userService = userService;
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const dto: CreateUserDTO = {
        id: req.body.id,
        name: req.body.name,
      };

      if (!dto.name) {
        return res.status(422).json({ message: "O campo nome é obrigatório." });
      }

      await this.userService.createUser(dto);
      return res.status(201).json({ message: "Usuário criado com sucesso." });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar usuário." });
    }
  }
}
