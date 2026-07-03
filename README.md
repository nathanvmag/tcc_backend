Passaporte Digital — Backend

Backend do aplicativo Passaporte Digital, desenvolvido como Trabalho de Conclusão de Curso no Instituto de Computação da UFRJ.

Sobre

API REST construída com Strapi + Node.js + MySQL responsável por gerenciar os municípios, pontos turísticos, carimbos digitais, recompensas e usuários do sistema.

Tecnologias


Node.js
Strapi 4.x
MySQL 8.0


Como rodar localmente

bash# Instale as dependências
npm install

-Crie o arquivo de variáveis de ambiente

cp .env.example .env

-Preencha os dados do banco MySQL no .env

-Inicie em modo desenvolvimento

npm run develop
