import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";
import { CreatePropertyDTO } from "../dtos/create_property_dto";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }

  async createProperty(dto: CreatePropertyDTO): Promise<void> {
    const property = new Property(
      dto.id,
      dto.name,
      dto.description,
      dto.maxGuests,
      dto.basePricePerNight
    );
    await this.propertyRepository.save(property);
  }
}
