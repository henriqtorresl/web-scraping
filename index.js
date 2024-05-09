const puppeteer = require('puppeteer'); // lib responsável para navegar na web e assim farei o web scraping...
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/web-scraping', async (req, res) => {
    const paginaLinkedin = req.query.url; // pega a url da pagina do linkedin do query param

    if (paginaLinkedin) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(paginaLinkedin);

        const refBotaoFecharModal = await page.$('.modal__dismiss');
        if (refBotaoFecharModal) {
            await page.click('.modal__dismiss');
        }
    
        const dadosPublicacoes = await page.evaluate(() => {
            const publicacoes = document.querySelectorAll('.updates__list > li.mb-1 > div > article');
            const publicacoesList = [...publicacoes];
    
            const textos = [];
            const urls = [];
            const midias = [];
    
            publicacoesList.forEach((publicacao) => {
                const textoElement = publicacao.querySelector('.attributed-text-segment-list__container.relative');
                const texto = textoElement ? textoElement.innerText : '';
                textos.push(texto);
    
                const mediaElement = publicacao.querySelector('ul > li > img');
                if (mediaElement) {
                    const url = mediaElement.dataset.delayedUrl;
                    urls.push(url);
                    midias.push('imagem');
                } else {
                    const videoElement = publicacao.querySelector('video');
                    if (videoElement) {
                        const jsonString = videoElement.getAttribute('data-sources');
                        const jsonList = JSON.parse(jsonString);
                        const url = jsonList[0].src;
                        urls.push(url);
                        midias.push('video');
                    }
                }
            });
    
            const dadosPublicacoes = [];
            for (let i = 0; i < publicacoesList.length; i++) {
                dadosPublicacoes.push({
                    texto: textos[i],
                    url: urls[i],
                    tipoMidia: midias[i]
                })
            }
    
            return dadosPublicacoes;
        });
    
        // fecha o navegador:
        await browser.close();
    
        res.send(dadosPublicacoes);
    } else {
        res.send({msg: 'Informe a url da página pública do linkedin, para realizar a extração dos dados!'});
    }
            
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})


/* Código com mais comentários sobre como fiz o web scraping na página do linkedin */

// cria um bloco de função e executa (() => {})()
// (async () => {
//     // abre o browser
//     const browser = await puppeteer.launch();
//     // const browser = await puppeteer.launch({ headless: false }); // dessa forma eu nn qro q ele esconda o navegador e assim ele mostra os passos que ele realiza...

//     // abre uma página
//     const page = await browser.newPage();

//     // navegando dentro da página:
//     await page.goto('https://www.linkedin.com/company/grupo-icts/');

//     // tira um print
//     // await page.screenshot({ path: 'grupo-icts.png' });

//     // OBS: eu inspecionei a página do linkedin e descobri a referência do botão de fechar a modal, para prosseguir na página sem fazer o login
//     const refBotaoFecharModal = await page.$('.modal__dismiss');

//     if (refBotaoFecharModal) {
//         // fechar o botão da modal, para seguir sem login
//         await page.click('.modal__dismiss');
//     }

//     // toda essa função será executada no browser
//     // por exemplo, o console.log que eu executo aqui dentro (do page.evaluate) ele só mostra dentro do navegador gerado pela lib puppeteer
//     const dadosPublicacoes = await page.evaluate(() => {       
//         // pegar todas as publicações e extrair o conteudo que eu quero
//         // eu usei o inspecionar elemento para ir descobrindo a onde está exatamente o que eu preciso
//         const publicacoes = document.querySelectorAll('.updates__list > li.mb-1 > div > article');

//         // convertendo em um array
//         const publicacoesList = [...publicacoes];
        
//         const textos = [];
//         const urls = [];
//         const midias = [];

//         publicacoesList.forEach((publicacao) => {
//             // pegando o texto da postagem:
//             const texto = publicacao.getElementsByClassName('attributed-text-segment-list__container relative')[0].innerText;
//             textos.push(texto);

//             // pegando a imagem ou o video da postagem:
//             const media = publicacao.getElementsByTagName('ul')[1].getElementsByTagName('img');

//             if (media.length == 0) {
//                 // Extraindo o vídeo:
//                 const video = publicacao.getElementsByTagName('video');
//                 const jsonString = video[0].getAttribute('data-sources');
//                 const jsonList = JSON.parse(jsonString);
//                 const url = jsonList[0].src;
                
//                 urls.push(url);
//                 midias.push('video');
//             } else {
//                 // Extraindo a imagem:
//                 const url = media[0].dataset.delayedUrl;
//                 urls.push(url);
//                 midias.push('imagem');
//             }
//         });

//         // manipulando o retorno:
//         const dadosPublicacoes = [];
//         for (let i = 0; i < publicacoesList.length; i++) {
//             dadosPublicacoes.push({
//                 texto: textos[i],
//                 url: urls[i],
//                 tipoMidia: midias[i]
//             })
//         }

//         // transferir pra fora da função (OBS: tenho que capturar esse retorno)
//         return dadosPublicacoes;
//     });

//     // fecha o navegador:
//     await browser.close();

//     console.log(dadosPublicacoes);
// })();