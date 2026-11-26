# NeuroCore AI

Site demonstrativo de uma empresa fictícia, com navegação entre as seis páginas originais. A página de contato não envia mensagens.

## Rodar localmente

Na raiz do repositório, execute:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra <http://localhost:8000/>.

## Estrutura

`index.html`, `sobre.html`, `servicos.html`, `blog.html`, `equipe.html`, `contato.html`: páginas. `styles.css`: estilos compartilhados. `teste1.html`: entrada legada.

A CI valida o HTML e verifica arquivos e âncoras locais. Links e serviços externos não são consultados pela CI.
