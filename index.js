function enderecoCerto(enderecoOk, climaOk) {
    const enderecoContainer = document.getElementById('endereco');
    enderecoContainer.innerHTML = enderecoOk;

    if (climaOk) {
        enderecoContainer.innerHTML += `<br>Clima: ${climaOk}`;
    }
}

function fetchEndereco() {
    const cep = document.getElementById('cepInput').value.replace(/\D/g, '');

    if (cep.length !== 8) {
        enderecoCerto('Este CEP não existe.');
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                enderecoCerto('CEP não encontrado.');
            } else {
                const endereco = `${data.logradouro} - ${data.localidade}, ${data.uf}`;
                fetchClima(data.localidade, data.uf, endereco);
            }
        })
        .catch(error => {
            console.error('Falha ao buscar o endereço:', error);
            enderecoCerto('Erro ao carregar endereço.');
        });
}

function fetchClima(localidade, endereco) {
    const apiKey = '8786cb559e86d39ae78f35e887f57a5e';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?&lang=pt_br&q=${localidade}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const clima = `O clima em ${localidade}, é ${data.weather[0].description} com temperatura de ${data.main.temp/10}°C.`;
            enderecoCerto(endereco, clima);
        })
        .catch(error => {
            console.error('Falha ao buscar dados do clima:', error);
            enderecoCerto(endereco, 'Erro ao carregar dados do clima.');
        });
}

document.getElementById('btn').addEventListener('click', fetchEndereco);
