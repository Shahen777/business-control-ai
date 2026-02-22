/**
 * In-memory хранилище договоров и юридических документов
 * CRUD операции для юридического модуля
 */

import {
  Contract,
  ContractFile,
  ContractExtract,
  ContractStatus,
  LegalDocument,
  LegalDocType,
  CreateContractParams,
  CreateLegalDocParams,
} from "@/types/legal";
import { logActivity } from "./mockActivity";

const CONTRACTS_STORAGE_KEY = "business_control_contracts";
const DOCS_STORAGE_KEY = "business_control_legal_docs";

// Генераторы ID
let contractIdCounter = 100;
let docIdCounter = 1000;
let fileIdCounter = 5000;

function generateContractId(): string {
  return `contract_${++contractIdCounter}`;
}

function generateDocId(): string {
  return `legaldoc_${++docIdCounter}`;
}

function generateFileId(): string {
  return `file_${++fileIdCounter}`;
}

// Текущая дата ISO
function nowISO(): string {
  return new Date().toISOString();
}

// ============================================
// НАЧАЛЬНЫЕ МОКОВЫЕ ДАННЫЕ - ДОГОВОРЫ
// ============================================

const initialContracts: Contract[] = [
  {
    id: "contract_1",
    title: "Договор подряда на земляные работы",
    number: "ДП-2025/001",
    date: "2025-01-10",
    counterparty: "ООО «СтройМир»",
    counterpartyINN: "7701234567",
    projectName: "ЖК Солнечный",
    status: "active",
    startDate: "2025-01-15",
    endDate: "2025-06-30",
    amountRub: 4500000,
    advanceRub: 900000,
    files: [
      {
        id: "file_1",
        filename: "Договор_ДП-2025-001.pdf",
        mimeType: "application/pdf",
        size: 245000,
        uploadedAt: "2025-01-10T09:00:00Z",
      },
    ],
    extracted: {
      parties: {
        customer: "ООО «СтройМир»",
        contractor: "ООО «Наша Компания»",
      },
      subject: "Земляные работы на объекте ЖК Солнечный",
      amountRub: 4500000,
      advanceRub: 900000,
      paymentTerms: "Аванс 20%, остаток по актам выполненных работ",
      workStartDate: "2025-01-15",
      workEndDate: "2025-06-30",
      milestones: [
        { name: "Котлован секция А", date: "2025-02-28", status: "completed" },
        { name: "Котлован секция Б", date: "2025-04-15", status: "pending" },
        { name: "Обратная засыпка", date: "2025-06-15", status: "pending" },
      ],
      penalties: [
        { trigger: "Просрочка выполнения этапа", rate: "0.1% в день", cap: "10%" },
      ],
      closingDocs: ["Акт КС-2", "Справка КС-3", "Исполнительная документация"],
      obligations: [
        { side: "we", text: "Выполнить земляные работы согласно проекту", dueDate: "2025-06-30", status: "pending" },
        { side: "counterparty", text: "Передать строительную площадку", dueDate: "2025-01-15", status: "fulfilled" },
        { side: "counterparty", text: "Оплатить аванс 900 000 ₽", dueDate: "2025-01-20", status: "fulfilled" },
      ],
      riskyClauses: [
        {
          title: "Односторонний отказ заказчика",
          why: "Заказчик может расторгнуть договор без объяснения причин с уведомлением за 5 дней",
          severity: "high",
          clauseNumber: "п. 8.2",
        },
      ],
      summary: "Договор на земляные работы. Сумма 4.5 млн ₽, аванс 900 тыс. ₽. Срок до 30.06.2025. Риск: возможность одностороннего отказа заказчика.",
      extractedAt: "2025-01-10T10:00:00Z",
    },
    relatedTaskIds: ["task_2"],
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "contract_2",
    title: "Договор аренды экскаватора",
    number: "АР-2025/003",
    date: "2025-01-05",
    counterparty: "ИП Михайлов А.С.",
    counterpartyINN: "771234567890",
    projectName: "Склад Логистик",
    status: "active",
    startDate: "2025-01-10",
    endDate: "2025-03-31",
    amountRub: 720000,
    files: [
      {
        id: "file_2",
        filename: "Договор_аренды_АР-2025-003.pdf",
        mimeType: "application/pdf",
        size: 180000,
        uploadedAt: "2025-01-05T14:00:00Z",
      },
    ],
    extracted: {
      parties: {
        customer: "ООО «Наша Компания»",
        contractor: "ИП Михайлов А.С.",
      },
      subject: "Аренда экскаватора Caterpillar 320D с оператором",
      amountRub: 720000,
      paymentTerms: "Ежемесячная оплата до 5 числа следующего месяца",
      workStartDate: "2025-01-10",
      workEndDate: "2025-03-31",
      penalties: [
        { trigger: "Просрочка оплаты", rate: "0.05% в день" },
      ],
      obligations: [
        { side: "counterparty", text: "Предоставить исправную технику", status: "fulfilled" },
        { side: "we", text: "Обеспечить ГСМ", status: "pending" },
      ],
      summary: "Аренда экскаватора на 3 месяца. 240 тыс. ₽/мес. Мы обеспечиваем ГСМ.",
      extractedAt: "2025-01-05T15:00:00Z",
    },
    relatedTaskIds: [],
    createdAt: "2025-01-05T14:00:00Z",
  },
  {
    id: "contract_3",
    title: "Договор на вывоз грунта",
    number: "ВГ-2024/089",
    date: "2024-11-20",
    counterparty: "ООО «ЭкоТранс»",
    projectName: "ЖК Солнечный",
    status: "closed",
    startDate: "2024-11-25",
    endDate: "2024-12-31",
    amountRub: 850000,
    files: [],
    createdAt: "2024-11-20T10:00:00Z",
    updatedAt: "2025-01-05T12:00:00Z",
  },
  {
    id: "contract_4",
    title: "Договор подряда на благоустройство",
    number: "ДП-2025/007",
    counterparty: "ООО «ГорСтрой»",
    status: "draft",
    amountRub: 2100000,
    files: [],
    createdAt: "2025-01-08T11:00:00Z",
  },
];

// ============================================
// НАЧАЛЬНЫЕ МОКОВЫЕ ДАННЫЕ - ДОКУМЕНТЫ
// ============================================

const initialLegalDocs: LegalDocument[] = [
  {
    id: "legaldoc_1",
    type: "act",
    title: "Акт выполненных работ КС-2 по договору ДП-2025/001",
    relatedContractId: "contract_1",
    content: `АКТ О ПРИЁМКЕ ВЫПОЛНЕННЫХ РАБОТ (КС-2)

Договор: ДП-2025/001 от 10.01.2025
Объект: ЖК Солнечный
Период: январь 2025

Наименование работ: Разработка котлована секция А
Единица: м³
Количество: 2500
Цена: 450 ₽
Сумма: 1 125 000 ₽

ИТОГО: 1 125 000 ₽
НДС 20%: 225 000 ₽
ВСЕГО: 1 350 000 ₽

Сдал: _______________
Принял: _______________`,
    variables: {
      contractNumber: "ДП-2025/001",
      period: "январь 2025",
      amount: "1350000",
    },
    createdAt: "2025-01-31T16:00:00Z",
  },
  {
    id: "legaldoc_2",
    type: "letter",
    title: "Гарантийное письмо об оплате",
    content: `ГАРАНТИЙНОЕ ПИСЬМО

Настоящим ООО «Наша Компания» гарантирует оплату задолженности
в размере 450 000 (четыреста пятьдесят тысяч) рублей
в срок до 20.01.2025.

Генеральный директор: _______________
М.П.`,
    createdAt: "2025-01-08T10:00:00Z",
  },
];

// ============================================
// РАБОТА С LOCALSTORAGE
// ============================================

function loadContracts(): Contract[] {
  if (typeof window === "undefined") return [...initialContracts];
  try {
    const saved = localStorage.getItem(CONTRACTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading contracts:", e);
  }
  return [...initialContracts];
}

function saveContracts(contracts: Contract[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(contracts));
  } catch (e) {
    console.error("Error saving contracts:", e);
  }
}

function loadLegalDocs(): LegalDocument[] {
  if (typeof window === "undefined") return [...initialLegalDocs];
  try {
    const saved = localStorage.getItem(DOCS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading legal docs:", e);
  }
  return [...initialLegalDocs];
}

function saveLegalDocs(docs: LegalDocument[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error("Error saving legal docs:", e);
  }
}

// In-memory кэш
let contractsCache: Contract[] | null = null;
let legalDocsCache: LegalDocument[] | null = null;

function getContractsStore(): Contract[] {
  if (!contractsCache) {
    contractsCache = loadContracts();
  }
  return contractsCache;
}

function getLegalDocsStore(): LegalDocument[] {
  if (!legalDocsCache) {
    legalDocsCache = loadLegalDocs();
  }
  return legalDocsCache;
}

// ============================================
// CRUD ОПЕРАЦИИ - ДОГОВОРЫ
// ============================================

export function getAllContracts(): Contract[] {
  return [...getContractsStore()];
}

export function getContractById(id: string): Contract | undefined {
  return getContractsStore().find((c) => c.id === id);
}

export function getContractsByStatus(status: ContractStatus): Contract[] {
  return getContractsStore().filter((c) => c.status === status);
}

export function getContractsByCounterparty(counterparty: string): Contract[] {
  const lower = counterparty.toLowerCase();
  return getContractsStore().filter((c) =>
    c.counterparty.toLowerCase().includes(lower)
  );
}

export function createContract(params: CreateContractParams): Contract {
  const store = getContractsStore();
  const newContract: Contract = {
    id: generateContractId(),
    title: params.title,
    number: params.number,
    date: params.date,
    counterparty: params.counterparty,
    counterpartyINN: params.counterpartyINN,
    projectName: params.projectName,
    status: params.status || "draft",
    startDate: params.startDate,
    endDate: params.endDate,
    amountRub: params.amountRub,
    advanceRub: params.advanceRub,
    files: [],
    createdAt: nowISO(),
  };

  store.push(newContract);
  saveContracts(store);

  // Логируем активность
  logActivity({
    type: "contract_created",
    entityType: "contract",
    entityId: newContract.id,
    entityTitle: newContract.title,
    description: `Создан договор "${newContract.title}" с ${newContract.counterparty}`,
    metadata: { counterparty: newContract.counterparty, amountRub: newContract.amountRub },
  });

  return newContract;
}

export function updateContract(
  id: string,
  updates: Partial<Omit<Contract, "id" | "createdAt">>
): Contract | null {
  const store = getContractsStore();
  const index = store.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const oldContract = store[index];
  store[index] = {
    ...store[index],
    ...updates,
    updatedAt: nowISO(),
  };
  saveContracts(store);

  // Логируем изменение статуса
  if (updates.status && updates.status !== oldContract.status) {
    logActivity({
      type: "contract_status_changed",
      entityType: "contract",
      entityId: id,
      entityTitle: store[index].title,
      description: `Статус договора изменён: ${oldContract.status} → ${updates.status}`,
      metadata: { oldStatus: oldContract.status, newStatus: updates.status },
    });
  }

  return store[index];
}

export function deleteContract(id: string): boolean {
  const store = getContractsStore();
  const index = store.findIndex((c) => c.id === id);
  if (index === -1) return false;

  const contract = store[index];
  store.splice(index, 1);
  saveContracts(store);

  logActivity({
    type: "contract_deleted",
    entityType: "contract",
    entityId: id,
    entityTitle: contract.title,
    description: `Удалён договор "${contract.title}"`,
  });

  return true;
}

// Добавить файл к договору
export function addFileToContract(
  contractId: string,
  file: Omit<ContractFile, "id" | "uploadedAt">
): ContractFile | null {
  const store = getContractsStore();
  const contract = store.find((c) => c.id === contractId);
  if (!contract) return null;

  const newFile: ContractFile = {
    id: generateFileId(),
    ...file,
    uploadedAt: nowISO(),
  };

  contract.files.push(newFile);
  contract.updatedAt = nowISO();
  saveContracts(store);

  logActivity({
    type: "file_uploaded",
    entityType: "contract",
    entityId: contractId,
    entityTitle: contract.title,
    description: `Загружен файл "${file.filename}" к договору`,
    metadata: { filename: file.filename },
  });

  return newFile;
}

// Сохранить извлечённые условия договора
export function saveContractExtract(
  contractId: string,
  extract: ContractExtract
): Contract | null {
  const store = getContractsStore();
  const contract = store.find((c) => c.id === contractId);
  if (!contract) return null;

  contract.extracted = {
    ...extract,
    extractedAt: nowISO(),
  };
  contract.updatedAt = nowISO();

  // Обновляем данные договора из извлечённых, если они есть
  if (extract.amountRub) contract.amountRub = extract.amountRub;
  if (extract.advanceRub) contract.advanceRub = extract.advanceRub;
  if (extract.workStartDate) contract.startDate = extract.workStartDate;
  if (extract.workEndDate) contract.endDate = extract.workEndDate;

  saveContracts(store);

  logActivity({
    type: "contract_analyzed",
    entityType: "contract",
    entityId: contractId,
    entityTitle: contract.title,
    description: `ИИ проанализировал договор и извлёк ${extract.milestones?.length || 0} этапов, ${extract.riskyClauses?.length || 0} рисков`,
    metadata: {
      milestonesCount: extract.milestones?.length || 0,
      risksCount: extract.riskyClauses?.length || 0,
    },
  });

  return contract;
}

// Связать задачу с договором
export function linkTaskToContract(contractId: string, taskId: string): boolean {
  const store = getContractsStore();
  const contract = store.find((c) => c.id === contractId);
  if (!contract) return false;

  if (!contract.relatedTaskIds) {
    contract.relatedTaskIds = [];
  }
  if (!contract.relatedTaskIds.includes(taskId)) {
    contract.relatedTaskIds.push(taskId);
    contract.updatedAt = nowISO();
    saveContracts(store);
  }
  return true;
}

// ============================================
// CRUD ОПЕРАЦИИ - ДОКУМЕНТЫ
// ============================================

export function getAllLegalDocs(): LegalDocument[] {
  return [...getLegalDocsStore()];
}

export function getLegalDocById(id: string): LegalDocument | undefined {
  return getLegalDocsStore().find((d) => d.id === id);
}

export function getLegalDocsByContract(contractId: string): LegalDocument[] {
  return getLegalDocsStore().filter((d) => d.relatedContractId === contractId);
}

export function getLegalDocsByType(type: LegalDocType): LegalDocument[] {
  return getLegalDocsStore().filter((d) => d.type === type);
}

export function createLegalDoc(params: CreateLegalDocParams): LegalDocument {
  const store = getLegalDocsStore();

  // Генерируем контент на основе шаблона и переменных
  const content = generateDocContent(params.type, params.variables);

  const newDoc: LegalDocument = {
    id: generateDocId(),
    type: params.type,
    title: params.title,
    relatedContractId: params.relatedContractId,
    content,
    variables: params.variables,
    createdAt: nowISO(),
  };

  store.push(newDoc);
  saveLegalDocs(store);

  logActivity({
    type: "document_generated",
    entityType: "document",
    entityId: newDoc.id,
    entityTitle: newDoc.title,
    description: `Сгенерирован документ "${newDoc.title}"`,
    metadata: { docType: params.type },
  });

  return newDoc;
}

export function deleteLegalDoc(id: string): boolean {
  const store = getLegalDocsStore();
  const index = store.findIndex((d) => d.id === id);
  if (index === -1) return false;

  const doc = store[index];
  store.splice(index, 1);
  saveLegalDocs(store);

  logActivity({
    type: "document_deleted",
    entityType: "document",
    entityId: id,
    entityTitle: doc.title,
    description: `Удалён документ "${doc.title}"`,
  });

  return true;
}

// ============================================
// ГЕНЕРАЦИЯ КОНТЕНТА ДОКУМЕНТОВ
// ============================================

function generateDocContent(
  type: LegalDocType,
  variables: Record<string, string>
): string {
  const templates: Record<LegalDocType, string> = {
    power_of_attorney: `ДОВЕРЕННОСТЬ

г. ${variables.city || "Москва"}                                         «${variables.day || "__"}» ${variables.month || "_______"} ${variables.year || "2025"} г.

${variables.companyName || "ООО «Наша Компания»"} в лице ${variables.position || "Генерального директора"} ${variables.directorName || "_____________"},
действующего на основании ${variables.basis || "Устава"}, настоящей доверенностью уполномочивает

${variables.trusteeName || "_____________"}, паспорт ${variables.trusteePassport || "_____________"},

совершать от имени ${variables.companyName || "ООО «Наша Компания»"} следующие действия:
${variables.powers || "представлять интересы во всех организациях и учреждениях"}

Доверенность выдана сроком на ${variables.term || "один год"} без права передоверия.

Подпись доверенного лица _______________ удостоверяю.

${variables.position || "Генеральный директор"} _______________ ${variables.directorName || ""}
М.П.`,

    invoice: `СЧЁТ НА ОПЛАТУ № ${variables.invoiceNumber || "___"}
от ${variables.invoiceDate || "__.__._____"}

Поставщик: ${variables.supplierName || "ООО «Наша Компания»"}
ИНН/КПП: ${variables.supplierINN || ""} / ${variables.supplierKPP || ""}
Расчётный счёт: ${variables.bankAccount || ""}
Банк: ${variables.bankName || ""}
БИК: ${variables.bik || ""}

Покупатель: ${variables.buyerName || ""}
ИНН/КПП: ${variables.buyerINN || ""} / ${variables.buyerKPP || ""}

№ | Наименование | Кол-во | Ед. | Цена | Сумма
1 | ${variables.itemName || ""} | ${variables.quantity || ""} | ${variables.unit || "шт"} | ${variables.price || ""} | ${variables.amount || ""}

ИТОГО: ${variables.totalAmount || ""} руб.
НДС (${variables.vatRate || "20"}%): ${variables.vatAmount || ""} руб.
ВСЕГО К ОПЛАТЕ: ${variables.grandTotal || ""} руб.

${variables.position || "Генеральный директор"} _______________ ${variables.directorName || ""}`,

    act: `АКТ № ${variables.actNumber || "___"}
приёма-передачи выполненных работ (оказанных услуг)

г. ${variables.city || "Москва"}                                         «${variables.day || "__"}» ${variables.month || "_______"} ${variables.year || "2025"} г.

Исполнитель: ${variables.executorName || "ООО «Наша Компания»"}
Заказчик: ${variables.customerName || ""}

Основание: Договор № ${variables.contractNumber || ""} от ${variables.contractDate || ""}

Исполнитель выполнил, а Заказчик принял следующие работы:

№ | Наименование | Ед. | Кол-во | Цена | Сумма
1 | ${variables.workName || ""} | ${variables.unit || ""} | ${variables.quantity || ""} | ${variables.price || ""} | ${variables.amount || ""}

ИТОГО: ${variables.totalAmount || ""} руб.
НДС (${variables.vatRate || "20"}%): ${variables.vatAmount || ""} руб.
ВСЕГО: ${variables.grandTotal || ""} руб.

Работы выполнены в полном объёме и в срок. Стороны претензий друг к другу не имеют.

ИСПОЛНИТЕЛЬ:                              ЗАКАЗЧИК:
_______________ ${variables.executorSigner || ""}      _______________ ${variables.customerSigner || ""}
М.П.                                      М.П.`,

    contract: `ДОГОВОР № ${variables.contractNumber || "___"}

г. ${variables.city || "Москва"}                                         «${variables.day || "__"}» ${variables.month || "_______"} ${variables.year || "2025"} г.

${variables.party1Name || "ООО «Наша Компания»"}, именуемое в дальнейшем "Сторона 1",
в лице ${variables.party1Position || ""} ${variables.party1Signer || ""}, действующего на основании ${variables.party1Basis || "Устава"},
и
${variables.party2Name || ""}, именуемое в дальнейшем "Сторона 2",
в лице ${variables.party2Position || ""} ${variables.party2Signer || ""}, действующего на основании ${variables.party2Basis || "Устава"},
заключили настоящий Договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА
1.1. ${variables.subject || ""}

2. СТОИМОСТЬ И ПОРЯДОК РАСЧЁТОВ
2.1. Стоимость работ составляет ${variables.amount || ""} (${variables.amountWords || ""}) рублей, в т.ч. НДС.
2.2. ${variables.paymentTerms || "Оплата производится в течение 5 рабочих дней после подписания акта выполненных работ."}

3. СРОКИ ВЫПОЛНЕНИЯ
3.1. Начало работ: ${variables.startDate || ""}
3.2. Окончание работ: ${variables.endDate || ""}

4. АДРЕСА И РЕКВИЗИТЫ СТОРОН

СТОРОНА 1:                                СТОРОНА 2:
${variables.party1Name || ""}              ${variables.party2Name || ""}

_______________ ${variables.party1Signer || ""}    _______________ ${variables.party2Signer || ""}
М.П.                                      М.П.`,

    letter: `${variables.recipientPosition || "Генеральному директору"}
${variables.recipientCompany || ""}
${variables.recipientName || ""}

от ${variables.senderCompany || "ООО «Наша Компания»"}
ИНН ${variables.senderINN || ""}
Исх. № ${variables.outNumber || "___"} от ${variables.outDate || "__.__._____"}

${variables.subject ? `Тема: ${variables.subject}` : ""}

Уважаемый(ая) ${variables.recipientName || ""}!

${variables.body || "Настоящим сообщаем..."}

С уважением,

${variables.senderPosition || "Генеральный директор"}
${variables.senderCompany || "ООО «Наша Компания»"}
_______________ ${variables.senderName || ""}`,

    agreement: `ДОПОЛНИТЕЛЬНОЕ СОГЛАШЕНИЕ № ${variables.agreementNumber || "___"}
к Договору № ${variables.mainContractNumber || ""} от ${variables.mainContractDate || ""}

г. ${variables.city || "Москва"}                                         «${variables.day || "__"}» ${variables.month || "_______"} ${variables.year || "2025"} г.

${variables.party1Name || "ООО «Наша Компания»"}, именуемое в дальнейшем "Сторона 1",
в лице ${variables.party1Position || ""} ${variables.party1Signer || ""}, действующего на основании ${variables.party1Basis || "Устава"},
и
${variables.party2Name || ""}, именуемое в дальнейшем "Сторона 2",
в лице ${variables.party2Position || ""} ${variables.party2Signer || ""}, действующего на основании ${variables.party2Basis || "Устава"},
заключили настоящее Дополнительное соглашение о нижеследующем:

1. Стороны договорились внести следующие изменения в Договор № ${variables.mainContractNumber || ""} от ${variables.mainContractDate || ""}:
${variables.changes || ""}

2. Настоящее Дополнительное соглашение вступает в силу с момента его подписания.

3. Во всём остальном, что не предусмотрено настоящим Дополнительным соглашением, Стороны руководствуются условиями Договора.

СТОРОНА 1:                                СТОРОНА 2:
${variables.party1Name || ""}              ${variables.party2Name || ""}

_______________ ${variables.party1Signer || ""}    _______________ ${variables.party2Signer || ""}
М.П.                                      М.П.`,
  };

  return templates[type] || "";
}

// ============================================
// СТАТИСТИКА
// ============================================

export interface LegalStats {
  totalContracts: number;
  activeContracts: number;
  draftContracts: number;
  disputedContracts: number;
  totalAmountRub: number;
  activeAmountRub: number;
  documentsGenerated: number;
  contractsWithRisks: number;
}

export function getLegalStats(): LegalStats {
  const contracts = getContractsStore();
  const docs = getLegalDocsStore();

  const activeContracts = contracts.filter((c) => c.status === "active");
  const contractsWithRisks = contracts.filter(
    (c) => c.extracted?.riskyClauses && c.extracted.riskyClauses.length > 0
  );

  return {
    totalContracts: contracts.length,
    activeContracts: activeContracts.length,
    draftContracts: contracts.filter((c) => c.status === "draft").length,
    disputedContracts: contracts.filter((c) => c.status === "disputed").length,
    totalAmountRub: contracts.reduce((sum, c) => sum + (c.amountRub || 0), 0),
    activeAmountRub: activeContracts.reduce((sum, c) => sum + (c.amountRub || 0), 0),
    documentsGenerated: docs.length,
    contractsWithRisks: contractsWithRisks.length,
  };
}

// Сброс данных (для тестирования)
export function resetLegalData(): void {
  contractsCache = [...initialContracts];
  legalDocsCache = [...initialLegalDocs];
  saveContracts(contractsCache);
  saveLegalDocs(legalDocsCache);
}
