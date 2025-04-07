# Changelog Manager - Plugin para Figma

Um plugin de Figma para criar e gerenciar changelogs diretamente nas páginas do seu projeto.

## Recursos

- **Criar registros de alterações** organizados dentro do próprio arquivo do Figma
- **Tipos de alterações predefinidos** (Nova Feature, Bug Fix, Update, etc.)
- **Captura automática de informações do usuário** (nome e avatar)
- **Suporte para links** para documentação, protótipos ou outros recursos
- **Possibilidade de adicionar imagens** para ilustrar as alterações
- **Organização cronológica** com as alterações mais recentes em primeiro lugar

## Instruções de uso

1. Selecione a página onde deseja adicionar/atualizar o changelog
2. Execute o plugin "Changelog Manager"
3. Preencha o formulário com:
   - Título da alteração (obrigatório)
   - Descrição da alteração (obrigatório)
   - Tipo da alteração (obrigatório)
   - Link e label do link (opcional)
   - Imagem (opcional)
4. Clique em "Adicionar alteração"
5. O plugin criará ou atualizará o frame "Changelog" na página atual

## Estrutura do projeto

- `manifest.json` - Configuração do plugin
- `ui.html` - Interface do usuário do plugin
- `src/code.ts` - Código principal do plugin
- `src/types.d.ts` - Definições de tipos TypeScript

## Desenvolvimento

### Pré-requisitos

- Node.js e npm

### Instalação

```bash
npm install
```

### Compilação

```bash
npm run build
```

### Desenvolvimento com compilação contínua

```bash
npm run watch
```

## Como carregar o plugin no Figma

1. No Figma, vá para `Menu > Plugins > Development > New Plugin...`
2. Clique em "Click to choose a manifest.json file"
3. Navegue até a pasta deste projeto e selecione o arquivo `manifest.json`
4. O plugin estará disponível em `Menu > Plugins > Development > Changelog Manager`

## Personalização

Você pode modificar o layout e aparência do Changelog editando as constantes `COLORS` e `LAYOUT` no arquivo `src/code.ts`.

## Limitações

- A API do Figma não permite diretamente o upload de imagens de avatar do usuário, então usamos um placeholder
- As imagens adicionadas são exibidas como retângulos de placeholder, em uma versão futura podem ser implementadas usando a API de imagens do Figma 