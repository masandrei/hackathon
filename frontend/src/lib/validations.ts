import { z } from "zod";

// Schemat dla pojedynczej pracy
export const jobSchema = z.object({
  id: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data musi być w formacie YYYY-MM-DD"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data musi być w formacie YYYY-MM-DD").optional(),
  baseSalary: z.number().positive("Wynagrodzenie musi być większe od 0").max(1000000, "Wynagrodzenie jest za wysokie"),
  companyName: z.string().optional(),
  position: z.string().optional(),
}).refine((data) => {
  if (data.endDate) {
    return new Date(data.startDate) < new Date(data.endDate);
  }
  return true;
}, {
  message: "Data zakończenia musi być późniejsza niż data rozpoczęcia",
  path: ["endDate"],
});

// Schemat dla danych symulatora
export const simulatorDataSchema = z.object({
  age: z.number().min(18, "Minimalny wiek to 18 lat").max(66, "Maksymalny wiek to 66 lat"),
  sex: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Wybierz płeć" })
  }),
  salary: z.string().min(1, "Podaj wynagrodzenie").refine((val) => {
    const num = Number(val.replace(/\s/g, ""));
    return !isNaN(num) && num > 0 && num <= 1000000;
  }, "Wynagrodzenie musi być między 1 a 1 000 000 zł"),
  yearWorkStart: z.number().min(1950, "Rok jest za wczesny").max(new Date().getFullYear(), "Rok nie może być w przyszłości"),
  yearDesiredRetirement: z.number().min(2025, "Rok emerytury jest za wczesny"),
  
  // Opcjonalne
  includeJobHistory: z.boolean().optional(),
  jobs: z.array(jobSchema).optional(),
  sickLeaveData: z.object({
    option: z.enum(["none", "average", "custom"]),
    customDays: z.number().min(0).max(365).optional(),
  }).optional(),
}).refine((data) => {
  // Walidacja: rok emerytury musi być po roku rozpoczęcia pracy
  if (data.yearWorkStart && data.yearDesiredRetirement) {
    return data.yearDesiredRetirement > data.yearWorkStart;
  }
  return true;
}, {
  message: "Rok emerytury musi być późniejszy niż rok rozpoczęcia pracy",
  path: ["yearDesiredRetirement"],
});

// Pomocnicze typy
export type JobFormData = z.infer<typeof jobSchema>;
export type SimulatorFormData = z.infer<typeof simulatorDataSchema>;

// Funkcja walidująca krok po kroku
export function validateStep(step: number, data: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  
  switch (step) {
    case 1: // Płeć
      if (!data.sex) errors.push("Wybierz płeć");
      break;
      
    case 2: // Wiek
      if (!data.age || data.age < 18 || data.age > 66) {
        errors.push("Wiek musi być między 18 a 66 lat");
      }
      break;
      
    case 3: // Wynagrodzenie
      if (!data.salary || Number(data.salary.replace(/\s/g, "")) <= 0) {
        errors.push("Podaj poprawne wynagrodzenie");
      }
      break;
      
    case 4: // Początek kariery
      if (!data.yearWorkStart) {
        errors.push("Wybierz rok rozpoczęcia pracy");
      }
      break;
      
    case 5: // Historia zatrudnienia
      if (data.includeJobHistory === undefined) {
        errors.push("Wybierz opcję");
      }
      break;
      
    case 6: // Chorobowe
      if (!data.sickLeaveData?.option) {
        errors.push("Wybierz opcję chorobowych");
      }
      if (data.sickLeaveData?.option === 'custom' && !data.sickLeaveData?.customDays) {
        errors.push("Podaj liczbę dni chorobowych");
      }
      break;
      
    case 7: // Rok emerytury
      if (!data.yearDesiredRetirement) {
        errors.push("Wybierz rok emerytury");
      }
      if (data.yearWorkStart && data.yearDesiredRetirement && 
          data.yearDesiredRetirement <= data.yearWorkStart) {
        errors.push("Rok emerytury musi być późniejszy niż rok rozpoczęcia pracy");
      }
      break;
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

