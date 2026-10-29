---
sidebar_position: 3
title: Extensão do VS Code
---

# Extensão do VS Code

:::warning[Em construção]
Esta página está em construção. O conteúdo pode mudar ou estar incompleto.
:::

Sua arquitetura agora tem dezenas de manifests espalhados por uma pasta. Para descobrir quem acessa o `credit-db`, você abre arquivo atrás de arquivo e busca. E só percebe que uma regra foi quebrada quando o pipeline falha dez minutos depois do push. O ideal seria ver a arquitetura enquanto edita, e ver o problema na linha que o causa.

A extensão do ASL para o VS Code faz exatamente isso. Ela adiciona um painel **ASL** na barra lateral com todos os recursos da sua arquitetura e marca os erros no editor enquanto você digita, com as mesmas verificações do [comando `asl`](./cli.md).

## Instalar

Por enquanto a extensão é distribuída como um arquivo `.vsix`. No VS Code, abra a view de Extensions, escolha **⋯** e depois **Install from VSIX…**, e selecione o arquivo. Pelo terminal:

```sh
code --install-extension asl-vscode-0.1.0.vsix
```

Abra uma pasta com arquivos `*.asl.yaml`. O ícone **ASL** aparece na barra de atividades.

## O painel ASL

O painel tem três views. No topo da primeira, **Compile architecture** roda as verificações sob demanda, e o botão **ⓘ** abre esta documentação.

### Workspace

Todos os manifests da pasta, agrupados por kind: `Application`, `Database`, `Queue`... Expanda um recurso para ver como ele se conecta ao resto, em até três grupos:

| Grupo | O que lista |
| --- | --- |
| **Ingress** | Quem acessa este recurso e as interfaces que ele expõe. |
| **Egress** | O que este recurso chama, lê, escreve ou publica. |
| **Bidirectional** | Interfaces que funcionam nos dois sentidos. |

Cada conexão aparece como `<Kind> <nome>`, seguida do tipo da conexão em cor esmaecida, por exemplo `Database credit-db` `readsAndWrites`. As interfaces aparecem como `Interface public-api`, seguidas do protocolo e do tipo. Um grupo só aparece quando tem algo para mostrar.

Clique em qualquer item para abrir o manifest no editor, na linha exata. Um recurso que é referenciado mas nunca declarado aparece como **not declared**.

### Schemas

Todos os kinds disponíveis para a pasta, com seus campos. O grupo built-in `asl/*` fica sempre no topo, seguido dos seus próprios grupos (por exemplo `acme/v1`). Um `*` marca um campo obrigatório. Clique em um kind para abrir a definição dele.

### Extra

É aqui que você aponta a extensão para as suas [custom policies](./custom-policies.md) e [custom schemas](./custom-schemas.md). Clique em uma linha e escolha a pasta, que pode estar em qualquer lugar da sua máquina. É o equivalente às opções `--policies-bundle-path` e `--schemas-bundle-path` do comando.

- Se a pasta não existe, ou nada foi encontrado nela (as subpastas também são varridas), a linha fica **vermelha**.
- Caso contrário, a linha lista o que foi encontrado: as policies pelo nome, os kinds por grupo e versão. Clique em um para abri-lo.

## Problemas no editor

Quando um manifest quebra uma regra, a extensão mostra isso onde você está trabalhando:

- a linha com o problema fica sublinhada, com a mensagem e o nome da policy ao passar o mouse;
- o **manifest inteiro** ganha fundo vermelho (amarelo no caso de warning), e a barra de rolagem mostra uma marca;
- o mesmo problema aparece no painel **Problems**;
- no painel ASL, o recurso, a conexão e o kind ficam **vermelhos** (ou amarelos).

As verificações rodam quando você abre a pasta, a cada edição de um manifest e a cada save. Uma custom policy que você alterar é reconhecida ao salvar. Não há nada para configurar.

## Ícones dos kinds

Cada kind tem um ícone no painel: um servidor para `Application`, um banco de dados para `Database`, um megafone para `Topic`, e assim por diante. Um kind seu que não define um ícone aparece com um **?**, e a view **Schemas** mostra quais são.

Para escolher o ícone, adicione `x-asl-codicon-icon` no topo da definição do kind, com o nome de qualquer ícone da [lista de ícones do VS Code](https://microsoft.github.io/vscode-codicons/dist/codicon.html):

```yaml title="schemas-bundle/acme/v1/Team.yaml"
x-asl-codicon-icon: organization
allOf:
  - $ref: ../../asl/v1/Manifest.yaml
  - type: object
    required: [spec]
    properties:
      apiVersion:
        const: acme/v1
      kind:
        const: Team
      spec:
        type: object
        additionalProperties: false
        required: [email]
        properties:
          email:
            type: string
unevaluatedProperties: false
```

O ícone fica guardado junto com a definição, então todo mundo que carregar o seu bundle vê o mesmo. O comando `asl` ignora essa linha.

## Configurações

| Configuração | Significado |
| --- | --- |
| `asl.policiesBundlePath` | Um arquivo ou pasta com as suas custom policies. Um caminho relativo é resolvido a partir da pasta do workspace. |
| `asl.schemasBundlePath` | Uma pasta de custom schemas, organizada como `<group>/<version>/<Kind>.yaml`. |

A view **Extra** grava as duas configurações para você.
