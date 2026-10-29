---
sidebar_position: 3
title: Arquitetura como código vs Diagram as Code
---

# Arquitetura como código vs Diagram as Code

:::warning[Em construção]
Esta página está em construção. O conteúdo pode mudar ou estar incompleto.
:::

A sua empresa já pratica Diagram as Code. Eles ficam no repositório, são revisados em pull request e viram uma imagem limpa a cada merge. E mesmo assim o `billing-service` acabou lendo do `credit-db`, porque nada num arquivo de diagrama consegue dizer que isso não é permitido. O texto estava versionado. A arquitetura, não.

É essa a diferença entre as duas ideias. Os nomes são parecidos, mas não são duas versões da mesma coisa. Elas respondem a perguntas diferentes.

**Diagram as Code** (Mermaid, PlantUML, D2 e similares) só se preocupa com uma coisa: o **desenho gerado**. Entra texto, sai uma imagem. É um jeito útil de manter desenhos, mas a arquitetura continua no desenho. O texto só descreve como pintá-lo.

**Arquitetura como código** se preocupa com a **arquitetura em si**: o que existe, como se relaciona, que contratos e regras valem. É um **contexto arquitetural validável**, checado de forma determinística. O desenho, se você quiser um, é um subproduto.

## A crítica ao Diagram as Code

- **Otimiza a saída errada.** O objetivo é uma imagem mais bonita, versionada e reproduzível. Ninguém perguntou se a arquitetura por trás dela está certa.
- **`A --> B` não quer dizer nada.** É uma seta. Não diz se é leitura, escrita, chamada ou dependência, nem se é síncrona ou assíncrona. Quem decide é o leitor, então dois leitores podem discordar.
- **Valida sintaxe, não arquitetura.** Um diagrama com conexão solta, serviço duplicado ou dependência proibida compila e renderiza numa boa. A ferramenta só sabe se o desenho faz parse.
- **Não expressa regras.** "Toda aplicação que escreve em um store precisa ter owner" não cabe numa linguagem de diagramas, então a governança continua manual.
- **A verdade continua sendo uma imagem.** A fonte é um monte de caixas e setas, e você volta a ter que interpretá-las. O problema de fidelidade entre o design e a produção continua lá.

## O que a arquitetura como código muda

A arquitetura é especificada como dado tipado. Um compilador a transforma em um grafo e a verifica:

- **Formato:** cada elemento bate com a definição do seu kind.
- **Referências:** todo relacionamento aponta para algo que existe.
- **Consistência:** os nomes são únicos e os contratos fecham.
- **Policies:** as suas regras rodam sobre o grafo inteiro.

Essa validação é **determinística**: mesma entrada, mesmo resultado, sempre. É um programa comum, que roda no CI ou na sua máquina. Nenhum modelo é chamado, então o custo é **zero token**, e não existe alucinação.

## Agentes: contexto estruturado, não imagem para decifrar

Os agentes de IA já são o outro leitor da sua arquitetura, e o formato define quanto eles pagam.

- **Ler um arquivo draw.io é caro.** É um XML enorme, cheio de geometria, estilos e ids gerados. O agente gasta tokens com coordenadas e cores para reconstruir um grafo que nunca foi guardado como grafo, e ainda precisa alucinar o que as setas significam. Screenshot é pior: custa tokens de imagem e convida à alucinação.
- **Um arquivo de Diagram as Code é mais barato, mas não tem significado.** É um texto compacto, mas só diz que "essas caixas estão conectadas".
- **Uma spec ASL já é a própria estrutura.** Entidades, relacionamentos tipados, contratos e policies estão explícitos. O agente lê só o que precisa e pode pedir ao compilador que confira o trabalho dele, em vez de raciocinar sozinho sobre o que é válido.

O ciclo muda de forma: o agente propõe uma alteração, o `asl` valida de graça, e o agente só lê os diagnósticos curtos.

## Lado a lado

| | Diagram as Code | Arquitetura como código (ASL) |
| --- | --- | --- |
| Se preocupa com | O desenho gerado | A arquitetura em si |
| Saída | Uma imagem | Um modelo validado e um grafo |
| `A --> B` | Uma seta | Um relacionamento tipado: `writes`, `reads`, `calls`... |
| "Está válido?" | Só a sintaxe | Formato, referências, consistência, policies |
| Referência errada | Renderiza do mesmo jeito | Um diagnóstico que derruba o build |
| Regras e governança | Não dá para expressar | Policies, aplicadas a cada execução |
| Custo da validação | Uma pessoa olhando | Determinística, zero token |
| Agente lendo | Decifrar imagem ou layout | Ler dado estruturado |
| Significado de uma seta | Depende do leitor | Definido pela especificação |

## O mesmo exemplo, de dois jeitos

Uma seta de `worker` para `dlq`:

```text
worker --> dlq
```

O mesmo fato como relacionamento tipado:

```yaml
apiVersion: asl/v1
kind: Relationship
metadata:
  name: worker-relations
spec:
  relations:
    - from:
        kind: Application
        name: email-worker
      to:
        kind: Queue
        name: email-dlq
      type: writes
```

Os nomes acima são ilustrativos. O que importa é o formato: uma aresta tipada em um grafo que pode ser validado, consultado e imposto.

## Diagrama ainda tem o seu lugar

Diagrama é bom para comunicar. O ponto é o sentido da verdade: a especificação é a fonte, e dela dá para gerar um diagrama. O caminho inverso não funciona, porque uma imagem não carrega informação suficiente para reconstruir a arquitetura.
