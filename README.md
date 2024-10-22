# **Detector de Segurança Web**

Bem-vindo ao **Detector de Segurança Web**, uma extensão para o Google Chrome que ajuda você a visualizar e entender as conexões e atividades de segurança durante a navegação na web. Esta extensão detecta e apresenta informações importantes sobre a segurança das páginas que você visita, incluindo conexões de terceiros, ameaças potenciais, operações de armazenamento local, cookies e tentativas de Canvas fingerprinting.

## **Índice**

- [Recursos Principais](#recursos-principais)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Detalhes dos Recursos](#detalhes-dos-recursos)
- [Design e Usabilidade](#design-e-usabilidade)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## **Recursos Principais**

- **Visualização de Conexões de Terceiros**: Exibe um grafo interativo das conexões entre o site atual e os domínios de terceiros.
- **Detecção de Ameaças Potenciais**: Lista redirecionamentos suspeitos e possíveis tentativas de sequestro de navegador (hijacking e hook).
- **Monitoramento de Armazenamento Local**: Detecta e apresenta operações realizadas no `localStorage` (HTML5) pelo site visitado.
- **Análise de Cookies**: Mostra a quantidade de cookies e supercookies injetados, diferenciando entre cookies de primeira e terceira parte, bem como entre cookies de sessão e persistentes.
- **Detecção de Canvas Fingerprinting**: Identifica tentativas de Canvas fingerprinting que podem ser usadas para rastrear a atividade do usuário.
- **Interface Amigável**: Design moderno com abas para facilitar a navegação entre as informações e visualização clara dos dados.

---

## **Instalação**

Siga os passos abaixo para instalar a extensão no Google Chrome:

1. **Baixar o Código da Extensão**:

   - Faça o download ou clone este repositório para o seu computador.

2. **Acessar a Página de Extensões do Chrome**:

   - Abra o Google Chrome.
   - Na barra de endereços, digite `chrome://extensions/` e pressione **Enter**.

3. **Ativar o Modo do Desenvolvedor**:

   - No canto superior direito da página de extensões, ative o **Modo do desenvolvedor** clicando no botão de alternância.

4. **Carregar a Extensão sem Compactação**:

   - Clique em **Carregar sem compactação**.
   - Na janela que se abre, navegue até a pasta onde você salvou a extensão e selecione-a.
   - A extensão será adicionada à lista de extensões e seu ícone aparecerá ao lado da barra de endereços.

---

## **Como Usar**

1. **Navegar em um Site**:

   - Visite qualquer site que você deseja analisar.

2. **Abrir a Extensão**:

   - Clique no ícone da extensão **Detector de Segurança Web** ao lado da barra de endereços do Chrome.

3. **Explorar as Informações**:

   - A extensão abrirá uma janela popup com duas abas: **Conexões** e **Detalhes**.
   - **Conexões**: Apresenta um grafo interativo das conexões entre o domínio atual e os domínios de terceiros detectados.
   - **Detalhes**: Fornece informações detalhadas sobre ameaças potenciais, operações de armazenamento local, cookies detectados e tentativas de Canvas fingerprinting.

4. **Interagir com o Grafo**:

   - No grafo, você pode arrastar os nós para reorganizá-los e visualizar melhor as conexões.
   - Passe o mouse sobre os nós para ver o domínio correspondente.

5. **Analisar as Listas Detalhadas**:

   - Na aba **Detalhes**, revise as listas para entender as atividades de segurança relacionadas ao site atual.
   - Cada seção fornece informações específicas e ações detectadas.

---

## **Detalhes dos Recursos**

### **Visualização de Conexões de Terceiros**

- **Descrição**: Exibe um grafo das conexões entre o domínio atual e os domínios de terceiros que estão sendo acessados.
- **Uso**: Ajuda a identificar quais domínios externos estão sendo chamados pelo site, o que pode afetar sua privacidade e segurança.

### **Detecção de Ameaças Potenciais**

- **Descrição**: Lista redirecionamentos suspeitos, tanto no lado do servidor quanto no lado do cliente, que podem indicar tentativas de sequestro de navegador.
- **Detalhes Fornecidos**:
  - Tipo de ameaça (redirecionamento HTTP ou redirecionamento do cliente).
  - Método utilizado (`assign`, `replace`, `href`).
  - URL de destino do redirecionamento.

### **Monitoramento de Armazenamento Local**

- **Descrição**: Detecta operações realizadas no `localStorage`, como inserção, remoção e limpeza de dados.
- **Detalhes Fornecidos**:
  - Tipo de operação (`SetItem`, `RemoveItem`, `Clear`).
  - Chaves e valores envolvidos nas operações.

### **Análise de Cookies**

- **Descrição**: Mostra a quantidade total de cookies detectados e os classifica em:
  - Cookies de primeira parte (do próprio site) e de terceira parte (de outros domínios).
  - Cookies de sessão (expiram ao fechar o navegador) e persistentes (armazenados por um período definido).
- **Uso**: Permite entender como os sites estão armazenando informações no seu navegador e identificar possíveis riscos à privacidade.

### **Detecção de Canvas Fingerprinting**

- **Descrição**: Identifica tentativas de Canvas fingerprinting, uma técnica usada para coletar informações únicas do dispositivo do usuário.
- **Detalhes Fornecidos**:
  - Método utilizado (`toDataURL`, `toBlob`, `getImageData`).
  - URL onde a tentativa foi detectada.

---

## **Design e Usabilidade**

A extensão foi desenvolvida com foco na usabilidade e na apresentação clara das informações:

- **Interface Limpa e Organizada**: Uso de abas para separar visualmente o grafo das conexões e os detalhes técnicos.
- **Grafo Interativo**: Permite uma compreensão visual imediata das conexões de rede.
- **Listas Informativas**: Dados apresentados em listas bem estruturadas, facilitando a leitura e a análise.
- **Estilo Moderno**: Design responsivo e esteticamente agradável, com cores e tipografia que melhoram a experiência do usuário.

---

## **Contribuição**

Contribuições são bem-vindas! Se você deseja melhorar esta extensão, siga os passos abaixo:

1. **Faça um Fork do Repositório**:

   - Clique em **Fork** no canto superior direito da página do repositório.

2. **Clone o Repositório Forkado**:

   ```bash
   git clone https://github.com/seu-usuario/detector-de-seguranca-web.git
    ```

3. **Crie uma Nova Branch**:

   ```bash
   git checkout -b minha-nova-funcionalidade
   ```

4. **Faça as Alterações Necessárias**:

    - Realize as modificações no código da extensão.

5. **Commit as Alterações**:

    ```bash
    git commit -m 'Adiciona nova funcionalidade'
    ```

6. **Envie as Alterações para o Repositório Remoto**:

    ```bash
    git push origin minha-nova-funcionalidade
    ```

7. **Crie um Pull Request**:

    - Vá até a página do seu repositório forkado no GitHub.
    - Clique em **Pull Request** para abrir um novo PR.

---

## **Licença**

Este projeto está licenciado sob a Licença GNU GENERAL PUBLIC LICENSE - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

