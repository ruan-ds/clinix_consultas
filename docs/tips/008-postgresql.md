# TIP 008 - PostgreSQL (Postgres)

## Entrar no PostgreSQL via terminal
- psql -U user

## Entrar em um banco específico
- psql -U user -d nome_do_banco

## Listar bancos de dados
- \l

## Conectar em um banco específico (dentro do psql)
- \c nome_do_banco

## Listar tabelas do banco atual
- \dt

## Ver estrutura de uma tabela
- \d nome_da_tabela

## Ver estrutura detalhada (inclui constraints, indexes)
- \d+ nome_da_tabela

## Sair do psql
- \q

## Criar banco de dados
- CREATE DATABASE nome_do_banco;

## Deletar banco de dados
- DROP DATABASE nome_do_banco;

## Criar tabela (exemplo básico)
- CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL, password_hash TEXT NOT NULL);

## Inserir dados
- INSERT INTO users (email, password_hash)
VALUES ('test@test.com', 'hash_aqui');

## Consultar dados
- SELECT * FROM users;

## Consultar com filtro
- SELECT * FROM users
WHERE email = 'test@test.com';

## Atualizar dados
- UPDATE users
SET email = 'novo@email.com' WHERE id = 1;

## Deletar dados
- DELETE FROM users WHERE id = 1;

## Ver queries em execução (debug)
- SELECT * FROM pg_stat_activity;

## Ver tamanho do banco
- SELECT pg_size_pretty(pg_database_size('nome_do_banco'));

## Ver usuários do Postgres
- \du

## Criar usuário
- CREATE USER meu_usuario WITH PASSWORD 'minha_senha';

## Dar permissões no banco
- GRANT ALL PRIVILEGES ON DATABASE nome_do_banco TO meu_usuario;

## Resetar sequência (muito usado em testes)
- ALTER SEQUENCE users_id_seq RESTART WITH 1;

## Limpar tabela (mais rápido que DELETE)
- TRUNCATE TABLE users RESTART IDENTITY CASCADE;

## Deletar tabelas
- DROP SCHEMA public CASCADE;
- CREATE SCHEMA public;