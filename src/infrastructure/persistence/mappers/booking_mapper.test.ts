import { v4 as uuidv4 } from "uuid";
import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { BookingMapper } from "./booking_mapper";

describe("Booking Mapper", () => {
  const mockProperty = new Property(
    uuidv4(),
    "Casa no sitio",
    "Uma casa no sitio",
    4,
    100
  );

  const guest = new User(uuidv4(), "Andrew Stuart Tanenbaum");

  const mockDateRange = new DateRange(
    new Date("2026-01-01"),
    new Date("2026-01-03")
  );

  describe("toDomain", () => {
    it("deve converter BookingEntity em Booking corretamente", () => {
      const bookingEntity: BookingEntity = {
        id: uuidv4(),
        startDate: new Date("2025-10-10"),
        endDate: new Date("2025-10-23"),
        guestCount: 2,
        totalPrice: 200,
        status: "CONFIRMED",
        property: {
          id: "1",
          name: "Casa no sitio",
          description: "Uma casa no sitio",
          maxGuests: 4,
          basePricePerNight: 100,
        } as any,
        guest: {
          id: "1",
          name: "Andrew Stuart Tanenbaum",
        },
      };

      const booking = BookingMapper.toDomain(bookingEntity);

      expect(booking).toBeInstanceOf(Booking);
      expect(booking.getId()).toBe(bookingEntity.id);
      expect(booking.getGuestCount()).toBe(2);
      expect(booking.getTotalPrice()).toBe(200);
      expect(booking.getStatus()).toBe("CONFIRMED");
    });

    it("Deve ser capaz de mapear um booking para toDomain quando uma property é passada como parâmetro", () => {
      const bookingEntity: BookingEntity = {
        id: uuidv4(),
        startDate: new Date("2025-10-25"),
        endDate: new Date("2025-10-28"),
        guestCount: 2,
        totalPrice: 200,
        status: "CONFIRMED",
        property: {} as any,
        guest: {
          id: "1",
          name: "Linux Torvalds",
        },
      };

      const customProperty = new Property(
        uuidv4(),
        "Apartamento",
        "Apartamento na cidade",
        4,
        100
      );

      const booking = BookingMapper.toDomain(bookingEntity, customProperty);

      expect(booking.getProperty()).toBe(customProperty);
      expect(booking.getProperty().getId()).toBe(customProperty.getId());
    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
      const bookingEntity: Partial<BookingEntity> = {
        id: uuidv4(),
        startDate: new Date("2025-11-01"),
        endDate: new Date("2025-11-03"),
        totalPrice: 200,
        status: "CONFIRMED",
        guestCount: 2,
        guest: {} as any,
      };

      expect(() =>
        BookingMapper.toDomain(bookingEntity as BookingEntity)
      ).toThrow("O nome é obrigatório");
    });

    it("Deve lançar uma exceção quando o número de hóspedes menor ou igual a zero", () => {
      const bookingEntity = {
        id: uuidv4(),
        startDate: new Date("2025-11-05"),
        endDate: new Date("2025-11-07"),
        totalPrice: 200,
        guestCount: 0,
        status: "CONFIRMED",
        property: {
          id: "1",
          name: "Casa de teste",
          description: "Uma casa para teste",
          maxGuests: 4,
          basePricePerNight: 100,
        },
        guest: {
          id: "1",
          name: "Hospede 1",
        },
      } as BookingEntity;

      expect(() => BookingMapper.toDomain(bookingEntity)).toThrow(
        "O número de hóspedes deve ser maior que zero."
      );
    });
  });

  describe("toPersistence", () => {
    it("deve converter Booking para BookingEntity corretamente", () => {
      const booking = new Booking(
        uuidv4(),
        mockProperty,
        guest,
        mockDateRange,
        2
      );

      booking["totalPrice"] = 200;
      booking["status"] = "CONFIRMED";

      const bookingEntity = BookingMapper.toPersistence(booking);

      expect(bookingEntity).toBeInstanceOf(BookingEntity);
      expect(bookingEntity.id).toBe(booking.getId());
      expect(bookingEntity.guestCount).toBe(2);
      expect(bookingEntity.totalPrice).toBe(200);
    });
  });
});
