# Manutenção das otimizações

- Edite `css/style.css` e execute `python tools/build_css.py` para atualizar a versão compactada usada nas páginas. Incremente a versão da URL do CSS ao publicar novas alterações.
- `js/script.js` contém os controles essenciais. `js/motion.js` e as bibliotecas de animação carregam depois da primeira renderização, exceto com redução de movimento ou economia de dados.
- `python tools/responsive_images.py` gera versões menores sem substituir os originais. Ao trocar uma imagem existente, remova somente as suas versões derivadas em `responsive/` antes de regenerar.
- As galerias usam miniaturas próprias. As imagens de conteúdo têm dimensões explícitas, `srcset`, `sizes` e decodificação assíncrona.
- Para verificar as páginas, sirva a pasta na porta 8765 e execute `node tools/check-performance.cjs` com Playwright instalado. O teste cobre três larguras, navegação das galerias, menu, imagens, ausência de JavaScript e redução de movimento.
- Na hospedagem, habilite Brotli ou gzip para HTML/CSS/JS e cache dos arquivos estáticos. Use cache longo somente para URLs versionadas; mantenha o HTML revalidável. A configuração depende do provedor e não é aplicada pelo HTML.

As verificações locais não substituem uma medição Lighthouse/PageSpeed no endereço publicado e em rede móvel real.
