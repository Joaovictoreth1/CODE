<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Login Simples</title>
</head>
<body>
  <h2>Login</h2>
  
  <form onsubmit="return verificarLogin()">
    <label for="usuario">Usuário:</label><br>
    <input type="text" id="usuario" name="usuario"><br><br>
    
    <label for="senha">Senha:</label><br>
    <input type="password" id="senha" name="senha"><br><br>
    
    <input type="submit" value="Entrar">
  </form>

  <p id="mensagem"></p>

  <script>
    function verificarLogin() {
      const usuario = document.getElementById("usuario").value;
      const senha = document.getElementById("senha").value;

      if (usuario === "admin" && senha === "1234") {
        document.getElementById("mensagem").textContent = "Login bem-sucedido!";
        return false; // impede o formulário de "enviar"
      } else {
        document.getElementById("mensagem").textContent = "Usuário ou senha incorretos.";
        return false; // impede o formulário de "enviar"
      }
    }
  </script>
</body>
</html>
