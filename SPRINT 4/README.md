# Movi Fácil

O Movi Fácil é um site que tenta deixar o transporte público mais barato e mais interessante de usar. A ideia é simples: o usuário ganha pontos toda vez que pega ônibus ou metrô, e depois troca esses pontos por desconto na passagem ou por viagens gratuitas.

Pensamos nisso porque o uso do transporte público no Brasil vem caindo. Muita gente reclama de desconforto, de horário limitado e do custo, que pode passar de R$ 212,00 por mês. Com o projeto, queremos tornar o transporte mais vantajoso pra quem usa e ajudar a reduzir trânsito e poluição.

## O que dá pra fazer no site

- Criar conta e fazer login (conta comum ou premium, com bilhete comum, estudante ou vale-transporte)
- Ver a carteira com o saldo de pontos e o valor da próxima viagem
- Registrar uma viagem feita (cada viagem dá 10 pontos)
- Trocar pontos por desconto de 25%, 50% ou 100% na passagem
- Trocar o número do bilhete
- Excluir a conta

## Tecnologias

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- ESLint

## Estrutura de pastas

```text
public/                  favicon e imagem de fundo
src/
  assets/                logo e fotos do grupo
  components/            Cabecalho e Rodape
  pages/
    Home/
    Integrantes/
    Sobre/
    FAQ/
    Contato/
    Perfil/              login, cadastro e carteira (PerfilPage e CarteiraComIdPage)
    TrocaDePontos/
    NaoEncontrada/       página 404
  services/
    moviFacilApi.ts      todas as chamadas da API
    userStorage.ts       guarda o id do usuário no localStorage
  App.tsx                layout geral
  main.tsx               rotas
  index.css
index.html
vercel.json              faz as rotas funcionarem no deploy
vite.config.ts
package.json
```

## Rotas

- `/` – início
- `/integrantes`
- `/sobre`
- `/faq`
- `/contato`
- `/perfil` – login, cadastro e carteira
- `/troca-de-pontos`
- `/carteira/:id` – carteira de um usuário específico (rota dinâmica)
- qualquer outra coisa cai na página 404

## API:

O site consome a API em Java que fizemos em DDD. A URL base é:

https://movifacil-api.onrender.com

Endpoints que usamos:

- `POST /usuario/cadastro/{tipo}`: cadastra o usuário
- `POST /usuario/login?cpf=...&senha=...`: faz o login
- `GET /carteira/{id}/pontos`: total de pontos
- `GET /carteira/{id}/pontos/metro`: valor da próxima viagem de metrô
- `GET /carteira/{id}/pontos/onibus`: valor da próxima viagem de ônibus
- `POST /carteira/{id}/viagem-feita/{tipo}`: registra uma viagem
- `POST /carteira/{id}/descontos/{transporte}-{categoria}/{desconto}`: troca pontos por desconto
- `POST /carteira/{id}/bilhete/trocar`: troca o número do bilhete
- `DELETE /usuario/{id}/delete`: exclui a conta

As chamadas ficam todas em `src/services/moviFacilApi.ts` e as respostas são tipadas com TypeScript.

No cadastro, `tipo` identifica a conta (`comum` ou `premium`) e `tipoBilhete` identifica o bilhete (`comum`, `estudante` ou `vt`). A rota `/usuario/cadastro/{tipo}` é escolhida pelo `tipoBilhete`.

## Publicar no Render

Crie um **Static Site** conectado ao repositório e configure:

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Rewrite rule: origem `/*`, destino `/index.html`, ação **Rewrite** (necessária para abrir diretamente rotas como `/perfil`)

Depois de criar o site, configure a API Java para permitir no CORS a origem exata do site publicado (por exemplo, `https://seu-site.onrender.com`). A API também precisa continuar permitindo `http://localhost:5173` para desenvolvimento local. Sem a origem publicada liberada no backend, o navegador bloqueará as chamadas do front para a API.

## Como usar:

Links do projeto:

- Vídeo no YouTube: https://youtu.be/YMRF8ZBmy1w
- API: https://movifacil-api.onrender.com

## Equipe:


João Luiz Silva Matias de Oliveira – RM 568747 – [GitHub](https://github.com/Ja1Gizz) – [LinkedIn](https://www.linkedin.com/in/joão-luiz-silva-matias-de-oliveira-34599b408/)

Cauã Trevisanuto – RM 570312 – [GitHub](https://github.com/CauaTr) – [LinkedIn](https://www.linkedin.com/in/cauã-trevisanuto-997405411/)

Pedro de Paiva Basilio – RM 572370 – [GitHub](https://github.com/P3druuh) – [LinkedIn](https://www.linkedin.com/in/pedro-basilio-770108411)

Thiago Ferreira Rocha – RM 572492 – [GitHub](https://github.com/thiago2908) – [LinkedIn](https://www.linkedin.com/in/thiago-f-rocha-325904290/)

## Contato:

- E-mail: joaoluizmo23@gmail.com
- WhatsApp: (11) 93278-4516
- Teams: rm568747@fiap.com.br