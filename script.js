const webAppURL = "https://script.google.com/macros/s/AKfycbwGG50KSwU1_y2s0MTQ9Nn3uE_5dBJiMDswLRVHlyHqpQ0pAnrO7dFjNeFPKSqHPeLe/exec";

// Salvar formulário offline
document.getElementById('formulario').addEventListener('submit', function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const idade = Number(document.getElementById("idade").value);
  const generoSelecionado = document.querySelector('input[name="genero"]:checked');
  const genero = generoSelecionado ? generoSelecionado.value : "";
  const hobbiesSelecionados = Array.from(document.querySelectorAll('input[name="hobbies"]:checked')).map(el => el.value);

  const resposta = { nome, idade, genero, hobbies: hobbiesSelecionados };

  let dadosSalvos = JSON.parse(localStorage.getItem('respostasOffline')) || [];
  dadosSalvos.push(resposta);
  localStorage.setItem('respostasOffline', JSON.stringify(dadosSalvos));

  document.getElementById('status').innerText = "💾 Resposta salva offline!";
  document.getElementById('formulario').reset();

  sincronizarDados();
});

// Sincronizar dados com Google Sheets
async function sincronizarDados() {
  const dados = JSON.parse(localStorage.getItem('respostasOffline')) || [];
  if (dados.length === 0) return;

  if (!navigator.onLine) {
    document.getElementById('status').innerText = "📶 Sem conexão, dados salvos localmente.";
    return;
  }

  document.getElementById('status').innerText = "📡 Sincronizando...";

  try {
    for (const r of dados) {
      const resposta = await fetch(webAppURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r)
      });
      const resultado = await resposta.json();
      if (resultado.status !== "ok") throw new Error(resultado.mensagem || "Erro desconhecido");
    }

    localStorage.removeItem('respostasOffline');
    document.getElementById('status').innerText = "✅ Dados sincronizados!";
  } catch (erro) {
    document.getElementById('status').innerText = "❌ Erro ao sincronizar, tentará novamente quando houver internet.";
    console.error(erro);
  }
}

// Botão de sincronização manual
document.getElementById('enviar').addEventListener('click', sincronizarDados);

// Detecta quando volta a internet
window.addEventListener('online', sincronizarDados);
