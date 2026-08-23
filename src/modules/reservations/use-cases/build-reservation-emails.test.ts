import { describe, expect, it } from "vitest";
import {
  buildCustomerEmail,
  buildSupplierEmail,
  buildMailtoLink,
  type ReservationEmailData,
} from "./build-reservation-emails";

const data: ReservationEmailData = {
  voucherNumber: 42,
  customerName: "Escola ABC",
  customerEmail: "contato@escola.local",
  supplierName: "Viacao Serra Verde",
  supplierEmail: "contato@serraverde.local",
  itemName: "Onibus Executivo",
  itemCapacity: 46,
  departureAt: new Date("2026-09-04T11:00:00.000Z"),
  returnAt: new Date("2026-09-05T05:00:00.000Z"),
  destinationCity: "Rio de Janeiro",
  destinationState: "RJ",
  tourStops: "Cidade do Rock",
  purchaseAmountCents: 350000,
  saleAmountCents: 520000,
  responsibleName: "Maria Souza",
  responsiblePhone: "(24) 98888-7777",
  customerNotes: "Levar lanche",
  supplierNotes: "Embarque no portao 2",
  passengers: [{ fullName: "Joao da Silva" }, { fullName: "Ana Lima" }],
};

describe("buildCustomerEmail", () => {
  it("inclui voucher, destino, horarios e valor de venda", () => {
    const email = buildCustomerEmail(data);

    expect(email.to).toBe("contato@escola.local");
    expect(email.subject).toContain("Voucher #42");
    expect(email.body).toContain("Onibus Executivo");
    expect(email.body).toContain("Rio de Janeiro/RJ");
    expect(email.body).toContain("5.200,00");
    expect(email.body).toContain("Maria Souza");
    expect(email.body).toContain("Joao da Silva");
    expect(email.body).toContain("Levar lanche");
  });

  it("nunca expoe margem nem valor de compra ao cliente", () => {
    const email = buildCustomerEmail(data);

    expect(email.body).not.toContain("3.500,00");
    expect(email.body).not.toContain("1.700,00");
    expect(email.body.toLowerCase()).not.toContain("margem");
    expect(email.body).not.toContain("Embarque no portao 2");
  });
});

describe("buildSupplierEmail", () => {
  it("inclui valor de compra, capacidade e lista de passageiros", () => {
    const email = buildSupplierEmail(data);

    expect(email.to).toBe("contato@serraverde.local");
    expect(email.subject).toContain("Voucher #42");
    expect(email.body).toContain("46 lugares");
    expect(email.body).toContain("3.500,00");
    expect(email.body).toContain("Ana Lima");
    expect(email.body).toContain("Embarque no portao 2");
  });

  it("nunca expoe margem nem valor de venda ao fornecedor", () => {
    const email = buildSupplierEmail(data);

    expect(email.body).not.toContain("5.200,00");
    expect(email.body).not.toContain("1.700,00");
    expect(email.body.toLowerCase()).not.toContain("margem");
    expect(email.body).not.toContain("Levar lanche");
  });
});

describe("buildMailtoLink", () => {
  it("monta o link com destinatario, assunto e copia oculta", () => {
    const link = buildMailtoLink(buildCustomerEmail(data), "contato@topturvr.com.br");

    expect(link.startsWith("mailto:contato@escola.local?")).toBe(true);
    expect(link).toContain("bcc=contato%40topturvr.com.br");
    expect(link).toContain("subject=");
  });

  it("nao quebra quando o destinatario nao tem e-mail cadastrado", () => {
    const link = buildMailtoLink(buildCustomerEmail({ ...data, customerEmail: null }));

    expect(link.startsWith("mailto:?")).toBe(true);
  });
});
