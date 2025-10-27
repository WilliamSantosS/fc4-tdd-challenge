import { Request, Response } from "express";
import { CreatePropertyDTO } from "../../application/dtos/create_property_dto";
import { PropertyService } from "../../application/services/property_service";

export class PropertyController {
  constructor(private propertyService: PropertyService) {
    this.propertyService = propertyService;
  }

  async createProperty(req: Request, res: Response): Promise<Response> {
    try {
      const dto: CreatePropertyDTO = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        maxGuests: req.body.maxGuests,
        basePricePerNight: req.body.basePricePerNight,
      };

      if (!req.body.name) {
        return res
          .status(422)
          .json({ message: "O nome da propriedade é obrigatório." });
      }

      if (req.body.maxGuests <= 0) {
        return res.status(400).json({
          message: "O número máximo de hóspedes deve ser maior que zero",
        });
      }

      if (!req.body.basePricePerNight) {
        return res
          .status(422)
          .json({ message: "O preço base por noite é obrigatório." });
      }

      await this.propertyService.createProperty(dto);
      return res
        .status(201)
        .json({ message: "Propriedade criada com sucesso." });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar propriedade." });
    }
  }
}
