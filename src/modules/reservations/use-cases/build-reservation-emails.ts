/**
 * Monta o texto dos e-mails de confirmacao de uma reserva.
 *
 * Envio e sempre MANUAL (decisao do usuario): a aplicacao apenas gera o
 * conteudo; quem dispara e a pessoa, a partir do proprio cliente de
 * e-mail. Nada e enviado automaticamente.
 *
 * Regra de confidencialidade: a margem NUNCA aparece em nenhum dos dois
 * e-mails. O cliente ve apenas o valor de venda; o fornecedor ve apenas
 * o valor de compra.
 */

export interface ReservationEmailData {
  voucherNumber: number;
  customerName: string;
  customerEmail: string | null;
  supplierName: string;
  supplierEmail: string | null;
  itemName: string;
  itemCapacity: number | null;
  departureAt: Date;
  returnAt: Date;
  destinationCity: string;
  destinationState: string;
  tourStops: string | null;
  purchaseAmountCents: number;
  saleAmountCents: number;
  responsibleName: string;
  responsiblePhone: string | null;
  customerNotes: string | null;
  supplierNotes: string | null;
  passengers: { fullName: string }[];
}

export interface ReservationEmail {
  to: string | null;
  subject: string;
  body: string;
}

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function buildCustomerEmail(data: ReservationEmailData): ReservationEmail {
  const lines = [
    `Ola, ${data.customerName}!`,
    "",
    `Segue a confirmacao da sua viagem - Voucher #${data.voucherNumber}.`,
    "",
    `Servico: ${data.itemName}`,
    `Destino: ${data.destinationCity}/${data.destinationState}`,
    `Saida: ${formatDateTime(data.departureAt)}`,
    `Retorno: ${formatDateTime(data.returnAt)}`,
  ];

  if (data.tourStops) {
    lines.push(`Pontos a visitar: ${data.tourStops}`);
  }

  lines.push(
    `Responsavel na viagem: ${data.responsibleName}${
      data.responsiblePhone ? ` - ${data.responsiblePhone}` : ""
    }`,
    `Valor: ${formatCents(data.saleAmountCents)}`,
  );

  if (data.passengers.length > 0) {
    lines.push("", `Passageiros (${data.passengers.length}):`);
    data.passengers.forEach((passenger, index) => {
      lines.push(`${index + 1}. ${passenger.fullName}`);
    });
  }

  if (data.customerNotes) {
    lines.push("", `Observacoes: ${data.customerNotes}`);
  }

  lines.push("", "Qualquer duvida, estamos a disposicao.", "Equipe Toptur");

  return {
    to: data.customerEmail,
    subject: `Voucher #${data.voucherNumber} - ${data.destinationCity}/${data.destinationState} em ${formatDateTime(data.departureAt)}`,
    body: lines.join("\n"),
  };
}

export function buildSupplierEmail(data: ReservationEmailData): ReservationEmail {
  const lines = [
    `Ola, ${data.supplierName}!`,
    "",
    `Confirmacao do servico contratado - Voucher #${data.voucherNumber}.`,
    "",
    `Servico: ${data.itemName}${data.itemCapacity ? ` (${data.itemCapacity} lugares)` : ""}`,
    `Cliente: ${data.customerName}`,
    `Destino: ${data.destinationCity}/${data.destinationState}`,
    `Saida: ${formatDateTime(data.departureAt)}`,
    `Retorno: ${formatDateTime(data.returnAt)}`,
  ];

  if (data.tourStops) {
    lines.push(`Pontos a visitar: ${data.tourStops}`);
  }

  lines.push(
    `Responsavel na viagem: ${data.responsibleName}${
      data.responsiblePhone ? ` - ${data.responsiblePhone}` : ""
    }`,
    `Valor contratado: ${formatCents(data.purchaseAmountCents)}`,
  );

  if (data.passengers.length > 0) {
    lines.push("", `Lista de passageiros (${data.passengers.length}):`);
    data.passengers.forEach((passenger, index) => {
      lines.push(`${index + 1}. ${passenger.fullName}`);
    });
  }

  if (data.supplierNotes) {
    lines.push("", `Observacoes: ${data.supplierNotes}`);
  }

  lines.push("", "Obrigado!", "Equipe Toptur");

  return {
    to: data.supplierEmail,
    subject: `Ordem de servico - Voucher #${data.voucherNumber} - ${formatDateTime(data.departureAt)}`,
    body: lines.join("\n"),
  };
}

/** Monta um link mailto: pronto, com copia oculta para a Toptur. */
export function buildMailtoLink(email: ReservationEmail, bccAddress?: string) {
  const params = new URLSearchParams();
  params.set("subject", email.subject);
  params.set("body", email.body);
  if (bccAddress) {
    params.set("bcc", bccAddress);
  }
  return `mailto:${email.to ?? ""}?${params.toString()}`;
}
