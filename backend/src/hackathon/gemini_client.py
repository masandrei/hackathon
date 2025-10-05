import google.generativeai as genai
import os
import requests
import json
from typing import Dict, List, Optional
from dataclasses import dataclass
from dotenv import load_dotenv
from .schemas import CalculationRequest, CalculationResponse, Job as JobSchema, Leave as LeaveSchema
from .algorithm import Job as AlgorithmJob, build_multi_job_contributions
from .mapper import AVERAGE_WAGE

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API
def configure_gemini():
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable not set")
    genai.configure(api_key=api_key)
    return genai

@dataclass
class JobData:
    base_salary_monthly: float
    base_year: int
    start_year: int
    end_year: Optional[int] = None
    label: str = ""
    sick_factor: Optional[float] = None

@dataclass
class PensionRequest:
    jobs: List[JobData]
    start_year: int
    end_year: int
    retirement_year: int
    age: int
    gender: str
    goal_pension: float
    tau: float = 0.1952
    include_sick_leave: bool = True
    sick_factor_global: float = 0.97

class PensionAPIClient:
    def __init__(self, base_url: str = "http://127.0.0.1:8080"):
        self.base_url = base_url
    
    def calculate_pension_direct(self, request: PensionRequest) -> Dict:
        """Calculate pension directly using algorithm (no API call)"""
        try:
            # Convert JobData to AlgorithmJob
            algorithm_jobs = []
            for job in request.jobs:
                algorithm_job = AlgorithmJob(
                    base_salary_monthly=job.base_salary_monthly,
                    base_year=job.base_year,
                    start_year=job.start_year,
                    end_year=job.end_year,
                    label=job.label,
                    sick_factor=job.sick_factor
                )
                algorithm_jobs.append(algorithm_job)
            
            # Use the algorithm directly
            result = build_multi_job_contributions(
                jobs=algorithm_jobs,
                start_year=request.start_year,
                end_year=request.end_year,
                tau=request.tau,
                include_sick_leave=request.include_sick_leave,
                sick_factor_global=request.sick_factor_global,
                retirement_year=request.retirement_year
            )
            
            # Calculate additional metrics
            predicted_pension = result.KR / 12  # Convert to monthly
            current_avg_pension = AVERAGE_WAGE.get(request.retirement_year, 0) * 0.4  # Rough estimate
            percentile = min(95, max(5, (predicted_pension / current_avg_pension) * 50)) if current_avg_pension > 0 else 50
            
            # Convert years to dict format
            years_data = []
            for year_breakdown in result.years:
                years_data.append({
                    "year": year_breakdown.year,
                    "monthly_by_job": year_breakdown.monthly_by_job,
                    "base_annual_before_cap": year_breakdown.base_annual_before_cap,
                    "cap_annual": year_breakdown.cap_annual,
                    "base_annual_after_cap": year_breakdown.base_annual_after_cap,
                    "contributions_by_job": year_breakdown.contributions_by_job,
                    "contribution_total": year_breakdown.contribution_total,
                    "valorized_to_retirement": year_breakdown.valorized_to_retirement
                })
            
            return {
                "predicted_pension": predicted_pension,
                "current_avg_pension": current_avg_pension,
                "percentile": percentile,
                "KR": result.KR,
                "years": years_data,
                "summary": f"Przewidywana emerytura: {predicted_pension:.2f} PLN/miesiąc"
            }
            
        except Exception as e:
            raise Exception(f"Calculation failed: {str(e)}")
    
    def calculate_pension_from_api_request(self, api_request: CalculationRequest) -> Dict:
        """Calculate pension from API request format"""
        try:
            # Convert API request to algorithm format
            algorithm_jobs = []
            for job_schema in api_request.jobs:
                # Convert date format from DD-MM-YYYY to year
                start_year = int(job_schema.startDate.split('-')[2])
                end_year = int(job_schema.endDate.split('-')[2]) if job_schema.endDate else None
                
                algorithm_job = AlgorithmJob(
                    base_salary_monthly=float(api_request.salary) / 12,  # Convert annual to monthly
                    base_year=start_year,
                    start_year=start_year,
                    end_year=end_year,
                    label=f"Job {len(algorithm_jobs) + 1}",
                    sick_factor=None
                )
                algorithm_jobs.append(algorithm_job)
            
            # Use the algorithm
            result = build_multi_job_contributions(
                jobs=algorithm_jobs,
                start_year=api_request.yearWorkStart,
                end_year=api_request.yearDesiredRetirement,
                tau=0.1952,  # Default tau value
                include_sick_leave=api_request.isSickLeaveIncluded,
                sick_factor_global=0.97,
                retirement_year=api_request.yearDesiredRetirement
            )
            
            # Calculate metrics
            predicted_pension = result.KR / 12
            current_avg_pension = AVERAGE_WAGE.get(api_request.yearDesiredRetirement, 0) * 0.4
            percentile = min(95, max(5, (predicted_pension / current_avg_pension) * 50)) if current_avg_pension > 0 else 50
            
            # Convert years to dict format
            years_data = []
            for year_breakdown in result.years:
                years_data.append({
                    "year": year_breakdown.year,
                    "monthly_by_job": year_breakdown.monthly_by_job,
                    "base_annual_before_cap": year_breakdown.base_annual_before_cap,
                    "cap_annual": year_breakdown.cap_annual,
                    "base_annual_after_cap": year_breakdown.base_annual_after_cap,
                    "contributions_by_job": year_breakdown.contributions_by_job,
                    "contribution_total": year_breakdown.contribution_total,
                    "valorized_to_retirement": year_breakdown.valorized_to_retirement
                })
            
            return {
                "predicted_pension": predicted_pension,
                "current_avg_pension": current_avg_pension,
                "percentile": percentile,
                "KR": result.KR,
                "years": years_data,
                "summary": f"Przewidywana emerytura: {predicted_pension:.2f} PLN/miesiąc"
            }
            
        except Exception as e:
            raise Exception(f"Calculation failed: {str(e)}")

def summarize(age, ret_age, gender, percentile, current_avg_pension, goal_pension, predicted_pension):
    """Generate pension summary using Gemini"""
    try:
        # Configure Gemini API before using it
        configure_gemini()
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""
                Podsumuj sytuację emerytalną osoby o następujących parametrach:
                - Wiek: {age} lat
                - Wiek emerytalny: {ret_age} lat
                - Płeć: {gender}
                - Obecna średnia emerytura: {current_avg_pension:.2f} PLN
                - Oczekiwana emerytura: {goal_pension:.2f} PLN
                - Przewidywana emerytura: {predicted_pension:.2f} PLN
                - Percentyl: {percentile:.1f}%

                Uwzględnij:
                1. Ile lat zostało do emerytury.
                2. Porównanie przewidywanej emerytury z obecną średnią.
                3. Czy cel emerytalny jest realistyczny.
                4. Jak wypada na tle innych emerytów.
                5. 1–2 praktyczne rady.

                Zasady odpowiedzi:
                - Udziel tylko krótkiego, rzeczowego podsumowania w formie punktów.
                - Bez zwrotów grzecznościowych ani rozmowy z użytkownikiem.
                - Maksymalnie 6 linijek tekstu.
                - Używaj tonu neutralnego i faktów.
        """
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Przepraszamy, wystąpił błąd podczas generowania podsumowania: {str(e)}"

def analyze_pension_scenario(api_client: PensionAPIClient, request: PensionRequest) -> Dict:
    """Complete pension analysis using direct calculation and Gemini"""
    try:
        # Get pension calculation directly
        result = api_client.calculate_pension_direct(request)
        
        # Generate detailed analysis using Gemini
        configure_gemini()
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Create detailed analysis prompt
        analysis_prompt = f"""
        Przeanalizuj szczegółowo sytuację emerytalną na podstawie następujących danych:
        
        PODSTAWOWE INFORMACJE:
        - Wiek: {request.age} lat
        - Wiek emerytalny: {request.retirement_year} lat
        - Płeć: {request.gender}
        - Cel emerytalny: {request.goal_pension:.2f} PLN/miesiąc
        
        WYNIKI KALKULACJI:
        - Przewidywana emerytura: {result['predicted_pension']:.2f} PLN/miesiąc
        - Średnia emerytura w roku {request.retirement_year}: {result['current_avg_pension']:.2f} PLN/miesiąc
        - Percentyl: {result['percentile']:.1f}%
        - Kapitał emerytalny (KR): {result['KR']:.2f} PLN
        
        HISTORIA SKŁADEK (ostatnie 5 lat):
        """
        
        # Add recent contribution history
        years_data = result['years'][-5:] if len(result['years']) >= 5 else result['years']
        for year_data in years_data:
            analysis_prompt += f"""
        - Rok {year_data['year']}: 
          * Składki łącznie: {year_data['contribution_total']:.2f} PLN
          * Podstawa po kapitacji: {year_data['base_annual_after_cap']:.2f} PLN
          * Waloryzacja do emerytury: {year_data['valorized_to_retirement']:.2f} PLN
        """
        
        analysis_prompt += """
        
        Przeanalizuj i przedstaw:
        1. OCENĘ OBECNEJ SYTUACJI - czy jesteś na dobrej drodze do celu?
        2. RYZYKA - co może wpłynąć na osiągnięcie celu?
        3. REKOMENDACJE - konkretne kroki do poprawy sytuacji
        4. ALTERNATYWY - inne opcje inwestycyjne/emerytalne
        5. MONITOROWANIE - jak śledzić postęp
        
        Odpowiedz w języku polskim, używając profesjonalnego ale przystępnego tonu.
        """
        
        analysis_response = model.generate_content(analysis_prompt)
        
        return {
            "basic_summary": result['summary'],
            "detailed_analysis": analysis_response.text,
            "calculation_data": result
        }
        
    except Exception as e:
        return {"error": f"Błąd podczas analizy: {str(e)}"}

def analyze_pension_from_api_request(api_request: CalculationRequest) -> Dict:
    """Complete pension analysis from API request format"""
    try:
        # Create API client
        api_client = PensionAPIClient()
        
        # Get pension calculation from API request
        result = api_client.calculate_pension_from_api_request(api_request)
        
        # Generate detailed analysis using Gemini
        configure_gemini()
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Create detailed analysis prompt
        analysis_prompt = f"""
        Przeanalizuj szczegółowo sytuację emerytalną na podstawie następujących danych:
        
        PODSTAWOWE INFORMACJE:
        - Wiek: {api_request.age} lat
        - Wiek emerytalny: {api_request.yearDesiredRetirement} lat
        - Płeć: {api_request.sex}
        - Cel emerytalny: {float(api_request.expectedPension):.2f} PLN/miesiąc
        
        WYNIKI KALKULACJI:
        - Przewidywana emerytura: {result['predicted_pension']:.2f} PLN/miesiąc
        - Średnia emerytura w roku {api_request.yearDesiredRetirement}: {result['current_avg_pension']:.2f} PLN/miesiąc
        - Percentyl: {result['percentile']:.1f}%
        - Kapitał emerytalny (KR): {result['KR']:.2f} PLN
        
        HISTORIA SKŁADEK (ostatnie 5 lat):
        """
        
        # Add recent contribution history
        years_data = result['years'][-5:] if len(result['years']) >= 5 else result['years']
        for year_data in years_data:
            analysis_prompt += f"""
        - Rok {year_data['year']}: 
          * Składki łącznie: {year_data['contribution_total']:.2f} PLN
          * Podstawa po kapitacji: {year_data['base_annual_after_cap']:.2f} PLN
          * Waloryzacja do emerytury: {year_data['valorized_to_retirement']:.2f} PLN
        """
        
        analysis_prompt += """
        
        Przeanalizuj i przedstaw:
        1. OCENĘ OBECNEJ SYTUACJI - czy jesteś na dobrej drodze do celu?
        2. RYZYKA - co może wpłynąć na osiągnięcie celu?
        3. REKOMENDACJE - konkretne kroki do poprawy sytuacji
        4. ALTERNATYWY - inne opcje inwestycyjne/emerytalne
        5. MONITOROWANIE - jak śledzić postęp
        
        Odpowiedz w języku polskim, używając profesjonalnego ale przystępnego tonu.
        """
        
        analysis_response = model.generate_content(analysis_prompt)
        
        return {
            "basic_summary": result['summary'],
            "detailed_analysis": analysis_response.text,
            "calculation_data": result
        }
        
    except Exception as e:
        return {"error": f"Błąd podczas analizy: {str(e)}"}

def main():
    """Example usage of the integrated system"""
    try:
        # Configure Gemini
        configure_gemini()
        
        # Create API client
        api_client = PensionAPIClient()
        
        # Example pension calculation request
        example_jobs = [
            JobData(
                base_salary_monthly=8000.0,
                base_year=2024,
                start_year=2024,
                end_year=None,
                label="Główna praca",
                sick_factor=None
            )
        ]
        
        example_request = PensionRequest(
            jobs=example_jobs,
            start_year=2024,
            end_year=2060,
            retirement_year=2060,
            age=30,
            gender="M",
            goal_pension=5000.0
        )
        
        # Perform analysis
        result = analyze_pension_scenario(api_client, example_request)
        
        if "error" in result:
            print(f"Błąd: {result['error']}")
        else:
            print("=== PODSTAWOWE PODSUMOWANIE ===")
            print(result['basic_summary'])
            print("\n=== SZCZEGÓŁOWA ANALIZA ===")
            print(result['detailed_analysis'])
            
    except Exception as e:
        print(f"Błąd: {str(e)}")

def test_with_api_request():
    """Test with API request format"""
    try:
        # Create example API request
        from .schemas import Job as JobSchema, Leave as LeaveSchema
        
        example_jobs = [
            JobSchema(
                startDate="01-01-2024",
                endDate="31-12-2060",
                baseSalary=96000  # Annual salary
            )
        ]
        
        example_leaves = [
            LeaveSchema(
                startDate="01-06-2025",
                endDate="31-08-2025"
            )
        ]
        
        api_request = CalculationRequest(
            calculationDate="2024-10-05",
            calculationTime="12:00:00",
            expectedPension="5000.0",
            age=30,
            sex="M",
            salary="96000",
            isSickLeaveIncluded=True,
            totalAccumulatedFunds="0",
            yearWorkStart=2024,
            yearDesiredRetirement=2060,
            postalCode="00-001",
            jobs=example_jobs,
            leaves=example_leaves
        )
        
        # Perform analysis
        result = analyze_pension_from_api_request(api_request)
        
        if "error" in result:
            print(f"Błąd: {result['error']}")
        else:
            print("=== PODSTAWOWE PODSUMOWANIE ===")
            print(result['basic_summary'])
            print("\n=== SZCZEGÓŁOWA ANALIZA ===")
            print(result['detailed_analysis'])
            
    except Exception as e:
        print(f"Błąd: {str(e)}")

def chat_with_owl(message: str) -> Dict:
    """Chat with the owl mascot using Gemini with intelligent action detection"""
    try:
        configure_gemini()
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Rozszerzone rozpoznawanie akcji - różne warianty i synonimy
        action_patterns = {
            "calculate_pension": [
                "oblicz emeryturę", "policz emeryturę", "kalkulator emerytury", 
                "oblicz", "policz", "kalkulator", "emerytura", "emerytury",
                "chcę obliczyć", "pomóż obliczyć", "jak obliczyć emeryturę"
            ],
            "show_statistics": [
                "pokaż statystyki", "statystyki", "dane", "wykresy", 
                "pokaż dane", "statystyki emerytur", "dane ekonomiczne",
                "inflacja", "płace", "wzrost", "wartości"
            ],
            "health_check": [
                "sprawdź zdrowie", "status aplikacji", "czy działa", 
                "sprawdź aplikację", "zdrowie", "status", "działa",
                "czy wszystko ok", "sprawdź system"
            ],
            "show_help": [
                "pomoc", "funkcje", "co potrafisz", "co możesz", 
                "pomóż", "help", "menu", "opcje", "co robić",
                "jak używać", "instrukcja"
            ]
        }
        
        # Sprawdź czy wiadomość zawiera prośbę o wykonanie akcji
        detected_action = None
        message_lower = message.lower()
        
        for action, patterns in action_patterns.items():
            for pattern in patterns:
                if pattern in message_lower:
                    detected_action = action
                    break
            if detected_action:
                break
        
        if detected_action:
            # Wykonaj akcję
            action_result = execute_owl_action(detected_action, message)
            if action_result["success"]:
                owl_prompt = f"""
                Jesteś ZUŚka, sympatyczną sową-maskotką aplikacji do kalkulacji emerytur.
                
                Użytkownik napisał: "{message}"
                Wykonałeś akcję: {detected_action}
                Wynik akcji: {action_result["data"]}
                
                Odpowiedz jako ZUŚka:
                1. Potwierdź wykonanie akcji
                2. Wyjaśnij wynik w prosty sposób
                3. Użyj sówich wyrażeń jak "Hoo hoo!" lub "Skrzydła w górę!"
                4. Zachęć do dalszego korzystania z aplikacji
                
                Odpowiedz krótko i przyjaźnie.
                """
            else:
                owl_prompt = f"""
                Jesteś ZUŚka, sympatyczną sową-maskotką aplikacji do kalkulacji emerytur.
                
                Użytkownik napisał: "{message}"
                Próbowałeś wykonać akcję: {detected_action}
                Ale wystąpił błąd: {action_result["error"]}
                
                Odpowiedz jako ZUŚka:
                1. Przeproś za problem
                2. Wyjaśnij co się stało
                3. Zaproponuj alternatywne rozwiązanie
                4. Użyj sówich wyrażeń
                
                Odpowiedz krótko i przyjaźnie.
                """
        else:
            # Zwykła rozmowa
            owl_prompt = f"""
            Jesteś ZUŚka, sympatyczną sową-maskotką aplikacji do kalkulacji emerytur. 
            Jesteś ekspertem w dziedzinie emerytur i finansów osobistych.
            
            Oto wiadomość od użytkownika: "{message}"
            
            Odpowiedz jako przyjazna sowa, która:
            1. Używa prostego, zrozumiałego języka
            2. Jest pomocna i zachęcająca
            3. Może odpowiadać na pytania o emerytury, finanse, aplikację
            4. Czasami używa sówich wyrażeń jak "Hoo hoo!" lub "Skrzydła w górę!"
            5. Jest profesjonalna, ale nieformalna
            6. Zawsze kończy zachęcając do korzystania z aplikacji
            7. Może sugerować konkretne akcje jak "Powiedz 'oblicz emeryturę' żeby skorzystać z kalkulatora!"
            
            Odpowiedz krótko (maksymalnie 3-4 zdania) i przyjaźnie.
            """
        
        response = model.generate_content(owl_prompt)
        
        return {
            "response": response.text,
            "action_executed": detected_action,
            "action_result": action_result if detected_action else None
        }
        
    except Exception as e:
        return {
            "response": f"Hoo hoo! Przepraszam, ale mam problem z połączeniem. Spróbuj ponownie za chwilę! 🦉",
            "action_executed": None,
            "action_result": None
        }

def execute_owl_action(action: str, message: str) -> Dict:
    """Execute specific actions requested by user through ZUŚka"""
    try:
        if action == "calculate_pension":
            # Przykład: wywołaj kalkulację emerytury
            return {
                "success": True,
                "data": "Kalkulator emerytur jest gotowy! Wprowadź swoje dane w formularzu powyżej.",
                "action": "redirect_to_calculator"
            }
        elif action == "show_statistics":
            # Wywołaj endpoint statystyk
            import requests
            response = requests.get("http://127.0.0.1:8080/statistics")
            if response.status_code == 200:
                stats = response.json()
                return {
                    "success": True,
                    "data": f"Oto najnowsze statystyki: średnia płaca {len(stats['average_wage'])} lat danych, inflacja {len(stats['inflation'])} lat danych.",
                    "action": "show_statistics_data"
                }
            else:
                return {"success": False, "error": "Nie udało się pobrać statystyk"}
        elif action == "health_check":
            # Sprawdź status aplikacji
            import requests
            response = requests.get("http://127.0.0.1:8080/health")
            if response.status_code == 200:
                health = response.json()
                return {
                    "success": True,
                    "data": f"Aplikacja działa świetnie! Status: {health['status']}, wersja: {health['version']}",
                    "action": "show_health_status"
                }
            else:
                return {"success": False, "error": "Aplikacja ma problemy"}
        elif action == "show_help":
            # Pokaż dostępne funkcje
            return {
                "success": True,
                "data": "Dostępne funkcje: 'oblicz emeryturę', 'pokaż statystyki', 'sprawdź zdrowie'. Powiedz mi co chcesz zrobić!",
                "action": "show_help_menu"
            }
        else:
            return {"success": False, "error": "Nieznana akcja"}
            
    except Exception as e:
        return {"success": False, "error": f"Błąd wykonania akcji: {str(e)}"}

if __name__ == "__main__":
    main()