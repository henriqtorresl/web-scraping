## Web Scraping

Este projeto consiste em uma API desenvolvida em Node.js que oferece um endpoint (/web-scraping) para extrair informações de uma página pública do LinkedIn. O objetivo é disponibilizar essas informações para consumo em um possível frontend, permitindo a implementação de um feed RSS com os textos das publicações, bem como fotos ou vídeos associados.

### Funcionalidades

- **Endpoint de Web Scraping**: O endpoint /web-scraping realiza a extração de informações da página pública do LinkedIn, as informações extraídas incluem textos das publicações e mídias associadas, como fotos ou vídeos.

### Tecnologias Utilizadas

- **Node.js**: O backend da API é desenvolvido em Node.js, garantindo uma execução eficiente e escalável.
  
- **Scraping**: Utiliza técnicas de web scraping para extrair as informações desejadas da página do LinkedIn.
  
- **RESTful API**: A API segue os princípios REST para oferecer acesso e manipulação de recursos de forma padronizada.

### Uso

Para utilizar a API, basta enviar uma requisição para o endpoint /web-scraping com os parâmetros necessários. Por exemplo:

```
GET /web-scraping?url=<URL_DO_PERFIL_LINKEDIN>
```

A resposta da API conterá os dados extraídos da página pública do LinkedIn no formato JSON.
