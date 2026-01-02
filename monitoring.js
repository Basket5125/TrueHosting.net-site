// Konfiguracja API
const API_URL = 'https://u-api.truehosting.net/stats';
const UPDATE_INTERVAL = 30000;

// Funkcje pomocnicze
function updateCircleProgress(circleId, percentage) {
    const circle = document.getElementById(circleId);
    if (!circle) return;
    
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    
    // Ustaw kolor na podstawie wartości
    if (percentage >= 90) {
        circle.style.stroke = '#EF4444';
    } else if (percentage >= 75) {
        circle.style.stroke = '#F59E0B';
    } else if (percentage >= 50) {
        circle.style.stroke = '#8B5CF6';
    } else {
        circle.style.stroke = '#10B981';
    }
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pl-PL');
}

// Pobieranie i aktualizacja danych
async function fetchMonitoringData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        return null;
    }
}

async function updateMonitoringUI() {
    try {
        const data = await fetchMonitoringData();
        
        if (!data) {
            throw new Error('Nie udało się pobrać danych');
        }
        
        // Aktualizuj dane serwerów
        const servers = data.servers || {};
        const serverPercentage = servers.running_percentage || 0;
        
        const serverPercentageElement = document.getElementById('serverPercentage');
        if (serverPercentageElement) {
            serverPercentageElement.innerHTML = `${serverPercentage.toFixed(1)}<span>%</span>`;
        }
        
        const activeServersElement = document.getElementById('activeServers');
        if (activeServersElement) {
            activeServersElement.textContent = formatNumber(servers.active || 0);
        }
        
        const totalServersElement = document.getElementById('totalServers');
        if (totalServersElement) {
            totalServersElement.textContent = formatNumber(servers.total || 0);
        }
        
        const inactiveServersElement = document.getElementById('inactiveServers');
        if (inactiveServersElement) {
            inactiveServersElement.textContent = formatNumber((servers.total || 0) - (servers.active || 0));
        }
        
        updateCircleProgress('serverProgress', serverPercentage);
        
        // Aktualizuj dane RAM
        const nodes = data.nodes || {};
        const ramPercentage = nodes.ram_usage_percentage || nodes.ram_usage_avg_per_node || 0;
        
        const ramPercentageElement = document.getElementById('ramPercentage');
        if (ramPercentageElement) {
            ramPercentageElement.innerHTML = `${ramPercentage.toFixed(1)}<span>%</span>`;
        }
        
        const avgRamNodeElement = document.getElementById('avgRamNode');
        if (avgRamNodeElement) {
            avgRamNodeElement.textContent = `${(nodes.ram_usage_avg_per_node || 0).toFixed(1)}%`;
        }
        
        const minRamElement = document.getElementById('minRam');
        if (minRamElement) {
            minRamElement.textContent = `${(nodes.ram_min_per_node || 0).toFixed(1)}%`;
        }
        
        const maxRamElement = document.getElementById('maxRam');
        if (maxRamElement) {
            maxRamElement.textContent = `${(nodes.ram_max_per_node || 0).toFixed(1)}%`;
        }
        
        updateCircleProgress('ramProgress', ramPercentage);
        
        // Aktualizuj czas ostatniej aktualizacji
        const now = new Date();
        const updateTimeElement = document.getElementById('updateTime');
        if (updateTimeElement) {
            updateTimeElement.textContent = formatTime(now);
        }
        
    } catch (error) {
        console.error('Błąd aktualizacji UI:', error);
        
        // Spróbuj ponownie za 10 sekund
        setTimeout(updateMonitoringUI, 10000);
    }
}

// Inicjalizacja monitoringu
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    
    // Ładuj monitoring tylko na stronie statystyki
    if (currentPage.includes('statystyki.html') || currentPage.endsWith('/') || currentPage === '') {
        // Pierwsze ładowanie danych
        updateMonitoringUI();
        
        // Ustawienie cyklicznej aktualizacji
        let updateInterval = setInterval(updateMonitoringUI, UPDATE_INTERVAL);
        
        // Obsługa ręcznego odświeżenia
        const refreshBtn = document.getElementById('refreshStats');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                clearInterval(updateInterval);
                
                // Animacja przycisku odświeżania
                this.style.animation = 'rotate 0.5s linear';
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
                
                updateMonitoringUI();
                updateInterval = setInterval(updateMonitoringUI, UPDATE_INTERVAL);
            });
        }
        
        // Inicjalizacja animacji pasków
        const progressCircles = ['serverProgress', 'ramProgress'];
        progressCircles.forEach(circleId => {
            const circle = document.getElementById(circleId);
            if (circle) {
                circle.style.strokeDasharray = '502.4 502.4';
                circle.style.strokeDashoffset = '502.4';
            }
        });
    }
});
