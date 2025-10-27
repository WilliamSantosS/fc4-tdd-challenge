import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";

describe("Property Mapper", () => {
  describe("toDomain", () => {
    it("deve converter PropertyEntity em Property corretamente", () => {
      const propertyEntity: PropertyEntity = {
        id: "1",
        name: "Casa na floresta",
        description: "uma casa na arvore",
        maxGuests: 4,
        basePricePerNight: 100,
        bookings: [],
      };

      const property = PropertyMapper.toDomain(propertyEntity);

      expect(property).toBeInstanceOf(Property);
      expect(property.getId()).toBe(propertyEntity.id);
      expect(property.getName()).toBe(propertyEntity.name);
      expect(property.getDescription()).toBe(propertyEntity.description);
      expect(property.getMaxGuests()).toBe(propertyEntity.maxGuests);
      expect(property.getBasePricePerNight()).toBe(
        propertyEntity.basePricePerNight
      );
    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
      const propertyEntity: Partial<PropertyEntity> = {
        id: "1",
        description: "uma casa na arvore",
        maxGuests: 4,
        basePricePerNight: 100,
        bookings: [],
      };

      expect(() =>
        PropertyMapper.toDomain(propertyEntity as PropertyEntity)
      ).toThrow("O nome é obrigatório");
    });
  });

  describe("toPersistence", () => {
    it("deve converter Property em PropertyEntity corretamente", () => {
      const property = new Property(
        "1",
        "Casa TEC",
        "uma casa totalmente tecnologica",
        4,
        100
      );

      const propertyEntity = PropertyMapper.toPersistence(property);

      expect(propertyEntity).toBeInstanceOf(PropertyEntity);
      expect(propertyEntity.id).toBe(property.getId());
      expect(propertyEntity.name).toBe(property.getName());
      expect(propertyEntity.description).toBe(property.getDescription());
      expect(propertyEntity.maxGuests).toBe(property.getMaxGuests());
      expect(propertyEntity.basePricePerNight).toBe(
        property.getBasePricePerNight()
      );
    });
  });
});
