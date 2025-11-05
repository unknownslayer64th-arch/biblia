// Rozszerzona baza danych Biblii
const bibliaData = {
    "stary": {
        "Rodzaju": {
            "skrot": "Rdz",
            "rozdzialy": {
                1: {
                    1: "Na początku Bóg stworzył niebo i ziemię.",
                    2: "Ziemia zaś była bezładem i pustkowiem: ciemność była nad powierzchnią bezmiaru wód, a Duch Boży unosił się nad wodami.",
                    3: "Wtedy Bóg rzekł: «Niechaj się stanie światłość!» I stała się światłość."
                },
                2: {
                    1: "W ten sposób zostały ukończone niebo i ziemia oraz wszystkie jej zastępy [stworzeń].",
                    2: "A gdy Bóg ukończył w dniu szóstym swe dzieło, nad którym pracował, odpoczął dnia siódmego po całym swym trudzie, jaki podjął."
                }
            }
        },
        "Wyjścia": {
            "skrot": "Wj",
            "rozdzialy": {
                1: {
                    1: "Oto imiona synów Izraela, którzy przybyli do Egiptu z Jakubem, każdy ze swoją rodziną:",
                    2: "Ruben, Symeon, Lewi, Juda,"
                }
            }
        }
    },
    "nowy": {
        "Ewangelia według św. Mateusza": {
            "skrot": "Mt",
            "rozdzialy": {
                1: {
                    1: "Rodowód Jezusa Chrystusa, syna Dawida, syna Abrahama.",
                    2: "Abraham był ojcem Izaaka; Izaak ojcem Jakuba; Jakub ojcem Judy i jego braci;"
                }
            }
        },
        "Ewangelia według św. Jana": {
            "skrot": "J",
            "rozdzialy": {
                1: {
                    1: "Na początku było Słowo, a Słowo było u Boga, i Bogiem było Słowo.",
                    2: "Ono było na początku u Boga."
                }
            }
        }
    }
};

class BibliaApp {
    constructor() {
        this.init();
    }

    init() {
        this.initEventListeners();
        this.initTestamentSelect();
    }

    initEventListeners() {
        document.getElementById('testamentSelect').addEventListener('change', (e) => {
            this.initKsiegSelect(e.target.value);
        });

        document.getElementById('ksiegaSelect').addEventListener('change', (e) => {
            this.initRozdzialSelect(e.target.value);
        });

        document.getElementById('rozdzialSelect').addEventListener('change', (e) => {
            const testament = document.getElementById('testamentSelect').value;
            const ksiega = document.getElementById('ksiegaSelect').value;
            const rozdzial = e.target.value;
            
            if(testament && ksiega && rozdzial) {
                this.wyswietlRozdzial(testament, ksiega, rozdzial);
            }
        });
    }

    initTestamentSelect() {
        const select = document.getElementById('testamentSelect');
        // Już mamy opcje w HTML
    }

    initKsiegSelect(testament) {
        const select = document.getElementById('ksiegaSelect');
        select.innerHTML = '<option value="">Wybierz księgę...</option>';
        
        if(!testament) return;
        
        const ksiegi = bibliaData[testament];
        if(ksiegi) {
            Object.keys(ksiegi).forEach(ksiega => {
                const option = document.createElement('option');
                option.value = ksiega;
                option.textContent = ksiega;
                select.appendChild(option);
            });
        }
        
        // Resetuj rozdziały
        this.initRozdzialSelect('');
    }

    initRozdzialSelect(ksiega) {
        const select = document.getElementById('rozdzialSelect');
        select.innerHTML = '<option value="">Rozdział...</option>';
        
        if(!ksiega) return;
        
        const testament = document.getElementById('testamentSelect').value;
        const ksiegaData = bibliaData[testament]?.[ksiega];
        
        if(ksiegaData && ksiegaData.rozdzialy) {
            Object.keys(ksiegaData.rozdzialy).forEach(rozdzial => {
                const option = document.createElement('option');
                option.value = rozdzial;
                option.textContent = `Rozdział ${rozdzial}`;
                select.appendChild(option);
            });
        }
    }

    wyswietlRozdzial(testament, ksiega, rozdzial) {
        const content = document.getElementById('bibliaContent');
        content.innerHTML = '<div class="loading">Ładowanie...</div>';
        
        setTimeout(() => {
            const ksiegaData = bibliaData[testament]?.[ksiega];
            const rozdzialData = ksiegaData?.rozdzialy?.[parseInt(rozdzial)];
            
            if(!rozdzialData) {
                content.innerHTML = '<p>Brak danych dla wybranego rozdziału</p>';
                return;
            }
            
            let html = `<div class="tytul-rozdzialu">${ksiega} ${rozdzial}</div>`;
            
            Object.keys(rozdzialData).forEach(wers => {
                html += `
                    <div class="werset">
                        <span class="nr-wersu">${wers}</span>
                        <span class="tresc-wersu">${rozdzialData[wers]}</span>
                    </div>
                `;
            });
            
            content.innerHTML = html;
            
            // Zapisz ostatnio czytany rozdział
            this.zapiszHistorie(ksiega, rozdzial);
        }, 100);
    }

    zapiszHistorie(ksiega, rozdzial) {
        const historia = {
            ksiega: ksiega,
            rozdzial: rozdzial,
            data: new Date().toISOString()
        };
        localStorage.setItem('ostatniRozdzial', JSON.stringify(historia));
    }

    wczytajHistorie() {
        const historia = localStorage.getItem('ostatniRozdzial');
        if(historia) {
            return JSON.parse(historia);
        }
        return null;
    }
}

// Inicjalizacja aplikacji po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    new BibliaApp();
    
    // Spróbuj wczytać ostatnio czytany rozdział
    const historia = new BibliaApp().wczytajHistorie();
    if(historia) {
        console.log('Ostatnio czytane:', historia);
    }
});