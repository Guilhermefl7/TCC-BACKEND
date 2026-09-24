const form = document.getElementById("cadastroForm");
const mensagem = document.getElementById("mensagem");
const botao = document.getElementById("botaoCadastrar");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  mensagem.textContent = "";
  mensagem.className = "mensagem";
  botao.disabled = true;
  botao.textContent = "CADASTRANDO...";

  try {
    const resposta = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Não foi possível cadastrar.");
    }

    mensagem.textContent = "Cadastro realizado. Você já pode entrar.";
    mensagem.className = "mensagem sucesso";
    form.reset();

    setTimeout(() => {
      window.location.href = "/";
    }, 1200);
  } catch (erro) {
    mensagem.textContent = erro.message;
    mensagem.className = "mensagem erro";
  } finally {
    botao.disabled = false;
    botao.textContent = "CADASTRAR";
  }
});
