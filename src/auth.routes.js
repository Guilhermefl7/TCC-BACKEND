const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const router = express.Router();

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleRegister(req, res) {
  try {
    const nome = String(req.body.nome || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const senha = String(req.body.senha || "");

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Preencha nome, email e senha." });
    }

    if (!emailValido(email)) {
      return res.status(400).json({ erro: "Email inválido." });
    }

    if (senha.length < 6) {
      return res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres." });
    }

    const [existente] = await db.execute(
      "SELECT id FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    if (existente.length > 0) {
      return res.status(409).json({ erro: "Este email já está cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const [resultado] = await db.execute(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, senhaHash]
    );

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: {
        id: resultado.insertId,
        nome,
        email
      }
    });
  } catch (erro) {
    console.error("Erro no cadastro:", erro);

    if (erro && erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Este email já está cadastrado." });
    }

    return res.status(500).json({
      erro: "Erro ao cadastrar usuário.",
      detalhe: process.env.NODE_ENV === "production" ? undefined : erro.message
    });
  }
}

async function handleLogin(req, res) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const senha = String(req.body.senha || "");

    if (!email || !senha) {
      return res.status(400).json({ erro: "Preencha email e senha." });
    }

    const [usuarios] = await db.execute(
      "SELECT id, nome, email, senha FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ erro: "Email ou senha incorretos." });
    }

    const usuario = usuarios[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Email ou senha incorretos." });
    }

    const segredo = process.env.JWT_SECRET;
    if (!segredo) {
      return res.status(500).json({ erro: "JWT_SECRET não configurado no servidor." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      segredo,
      { expiresIn: "8h" }
    );

    return res.json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (erro) {
    console.error("Erro no login:", erro);
    return res.status(500).json({
      erro: "Erro ao fazer login.",
      detalhe: process.env.NODE_ENV === "production" ? undefined : erro.message
    });
  }
}

router.post("/register", handleRegister);
router.post("/cadastro", handleRegister);
router.post("/login", handleLogin);

router.handleRegister = handleRegister;
router.handleLogin = handleLogin;

module.exports = router;
