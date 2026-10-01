const form = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");
const botao = document.getElementById("botaoEntrar");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  mensagem.textContent = "";
  mensagem.className = "mensagem";
  botao.disabled = true;
  botao.textContent = "ENTRANDO...";

  try {
    const resposta = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Não foi possível entrar.");
    }

    localStorage.setItem("token", dados.token);
    localStorage.setItem("usuario", JSON.stringify(dados.usuario));

    mensagem.textContent = `Bem-vindo(a), ${dados.usuario.nome}!`;
    mensagem.className = "mensagem sucesso";

    // Depois você pode trocar pela tela principal do seu TCC:
    // window.location.href = "/home.html";
  } catch (erro) {
    mensagem.textContent = erro.message;
    mensagem.className = "mensagem erro";
  } finally {
    botao.disabled = false;
    botao.textContent = "ENTRAR";
  }
});
