# DG-01 — Mentoria / Railway — frontend build fix (2026-11-09)

## Objetivo
Corrigir o primeiro bloqueio confirmado do build frontend:
`Error: Cannot find module '/app/scripts/verify-dist.mjs'`.

## Fonte
Os dois scripts foram extraídos sem alterações do snapshot:
`efata-777-frontend-staging-web01-main (4)(1).zip`,
e seus hashes coincidem com os arquivos na reconstrução fornecida anteriormente.

## Arquivos (criar somente se ausentes; comparar hashes se existentes)
- `scripts/verify-dist.mjs` — CREATE (necessário no erro atual).
- `scripts/build-evidence.mjs` — CREATE (próximo `RUN npm run build:evidence` exige este arquivo, conforme Dockerfile).

Não alterar `package.json`, `Dockerfile`, dependências, autenticação, migrations ou flags.

## Aplicação no GitHub
1. No repositório que o serviço frontend Railway realmente aponta, abrir a branch de revisão.
2. Criar/confirmar a pasta `scripts/` na raiz, **ao lado de** `package.json`.
3. Colocar os dois arquivos com nomes exatos (não subir o ZIP como arquivo).
4. Conferir `package.json` e `Dockerfile` existentes; revisar diff e fazer commit controlado.
5. Em Railway STAGING, validar source, branch, commit, root `/` e build em Dockerfile antes de novo deploy autorizado.
6. Manter billing, matrícula, migrations e flags perigosas desabilitados.

## Testes locais
- `node --check scripts/verify-dist.mjs`: PASS_LOCAL
- `node --check scripts/build-evidence.mjs`: PASS_LOCAL
- `verify-dist` com estrutura fake dist válida: PASS_LOCAL
- `verify-dist` com `sw.js` faltante: NEGATIVE_PASS_LOCAL
- `verify-dist` com sourcemap: NEGATIVE_PASS_LOCAL
- `build-evidence` gerou arquivos de proveniência numa fixture: PASS_LOCAL
- **Não realizado**: `npm ci`, build Vite completo, Docker build, runtime Railway.

## Rollback
Excluir somente os dois arquivos caso tenham sido criados neste patch; restaurar a branch/commit anterior.
O script `verify-dist` **não deve ser removido do pipeline** para fazê-lo passar.

## Backend
O build backend passou pelo `pip install --require-hashes` (log), mas falhou no mesmo `RUN` que
executa `python -c "import faster_whisper; import orkio_v2.main; print('STT_DEPENDENCY_PRESENT')"`.
O exportado contém `exit code: 1` mas não traz traceback/erro Python para confirmar a causa.
`ROOT_CAUSE_BACKEND=NÃO_PROVADA`. Não há patch backend neste pacote.
Coletar as linhas de saída da invocação de Python diretamente nos Build Logs do Railway, ou
reproduzir o Docker build em staging descartável com saída detalhada, antes de alterar código.
