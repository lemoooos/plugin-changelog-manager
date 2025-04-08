// Definição dos tipos de dados para o changelog
interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
  changeType: string;
  linkUrl?: string;
  linkLabel?: string;
  imageData?: string;
  user: {
    name: string;
    photoUrl: string;
  };
  timestamp: number;
}

// Definição do tipo para a mensagem da UI
interface FormData {
  title: string;
  description: string;
  changeType: string;
  linkUrl?: string;
  linkLabel?: string;
  imageData?: string;
  userPhotoData?: string; // Novo campo para a foto do usuário como base64
}

interface UIMessage {
  type: string;
  data?: FormData;
  pageId?: string;
  photoUrl?: string;
}

// Cores utilizadas no Changelog (baseado no design Figma)
const COLORS = {
  background: { r: 1, g: 1, b: 1 }, // #FFFFFF
  text: {
    title: { r: 0.05, g: 0.1, b: 0.2 }, // #0D1A33 (título principal)
    entryTitle: { r: 0, g: 0, b: 0 }, // #000000 (título da entrada)
    description: { r: 0.38, g: 0.35, b: 0.35 }, // #625A59 (descrição da entrada)
    userName: { r: 0.33, g: 0.33, b: 0.33 }, // #555555 (nome do usuário)
    date: { r: 0.53, g: 0.53, b: 0.53 }, // #888888 (data e hora)
    separator: { r: 0.8, g: 0.8, b: 0.8 }, // #CCCCCC (separador •)
    footer: { r: 0.51, g: 0.51, b: 0.51 }, // #838383 (texto do rodapé)
    link: { r: 0.87, g: 0.44, b: 0.05 } // #DE710C (cor do link)
  },
  border: { r: 0.91, g: 0.91, b: 0.91 }, // #E8E8E8
  typeColors: {
    'New Feature': { background: { r: 0.94, g: 0.99, b: 0.95 }, text: { r: 0.08, g: 0.53, b: 0.25 } }, // #F0FCF2, #157B40
    'Update': { background: { r: 0.93, g: 0.97, b: 1 }, text: { r: 0.06, g: 0.47, b: 0.75 } }, // #EEF6FF, #107ABF
    'Bug Fix': { background: { r: 1, g: 0.97, b: 0.91 }, text: { r: 0.8, g: 0.53, b: 0.12 } }, // #FFF7E8, #CC871F
    'Removed': { background: { r: 1, g: 0.89, b: 0.89 }, text: { r: 0.86, g: 0.15, b: 0.15 } }, // #FEE2E2, #DC2626
    'Refactoring': { background: { r: 0.96, g: 0.94, b: 1 }, text: { r: 0.46, g: 0.3, b: 0.84 } }, // #F4F0FF, #754CD6
    'Improvement': { background: { r: 0.91, g: 0.97, b: 0.99 }, text: { r: 0.15, g: 0.58, b: 0.73 } }, // #E8F8FC, #2693BA
    'Deprecation': { background: { r: 1, g: 0.9, b: 0.94 }, text: { r: 0.75, g: 0.19, b: 0.37 } }, // #FFE6F0, #BF305E
    'Layout Adjustment': { background: { r: 0.94, g: 0.94, b: 0.94 }, text: { r: 0.4, g: 0.4, b: 0.4 } } // #F0F0F0, #666666
  }
};

// Configurações do layout (baseado no design Figma)
const LAYOUT = {
  containerName: 'Changelog',
  header: {
    padding: { left: 31, right: 16, top: 40, bottom: 40 }
  },
  content: {
    padding: { left: 32, right: 32, top: 0, bottom: 0 },
    gap: 16
  },
  entry: {
    padding: { left: 0, right: 0, top: 16, bottom: 16 },
    gap: 8
  },
  userInfo: {
    padding: { left: 0, right: 0, top: 0, bottom: 0 },
    gap: 16
  },
  contentInfo: {
    padding: { left: 48, right: 0, top: 0, bottom: 0 },
    gap: 12
  },
  badge: {
    padding: { left: 8, right: 8, top: 4, bottom: 4 },
    borderRadius: 4
  },
  footer: {
    padding: { left: 31, right: 16, top: 18, bottom: 18 },
    gap: 8
  },
  avatarSize: 32,
  borderRadius: {
    container: 8,
    header: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
    footer: { topLeft: 0, topRight: 0, bottomLeft: 8, bottomRight: 8 },
    avatar: 16
  },
  imageSize: {
    width: 536,
    height: 320
  },
  maxWidth: 600
};

// Definir interface para fonte
interface FontCollection {
  regular: FontName;
  medium: FontName;
  semiBold: FontName;
  bold: FontName;
  [key: string]: FontName; // Adicionar assinatura de índice
}

// Fontes a serem usadas pelo plugin
const FONTS: {
  primary: FontCollection;
  fallback: FontCollection;
  system: FontCollection;
} = {
  // Fontes primárias (preferidas)
  primary: {
    regular: { family: "Inter", style: "Regular" },
    medium: { family: "Inter", style: "Medium" },
    semiBold: { family: "Inter", style: "SemiBold" },
    bold: { family: "Inter", style: "Bold" }
  },
  // Fontes alternativas (fallback)
  fallback: {
    regular: { family: "SF Pro Text", style: "Regular" },
    medium: { family: "SF Pro Text", style: "Medium" },
    semiBold: { family: "SF Pro Text", style: "Semibold" },
    bold: { family: "SF Pro Text", style: "Bold" }
  },
  // Fontes do sistema (último recurso)
  system: {
    regular: { family: "Arial", style: "Regular" },
    medium: { family: "Arial", style: "Regular" },
    semiBold: { family: "Arial", style: "Bold" },
    bold: { family: "Arial", style: "Bold" }
  }
};

// Função para tentar carregar fontes com fallback
async function loadFontsWithFallback(): Promise<FontCollection> {
  // Objeto para armazenar as fontes carregadas com sucesso
  const loadedFonts: FontCollection = {
    regular: FONTS.system.regular,
    medium: FONTS.system.medium,
    semiBold: FONTS.system.semiBold,
    bold: FONTS.system.bold
  };
  
  // Lista de tipos de fonte que precisamos carregar
  const fontTypes = ['regular', 'medium', 'semiBold', 'bold'] as const;
  type FontType = typeof fontTypes[number];
  
  // Para cada tipo de fonte, tente carregar começando pela primária
  for (const type of fontTypes) {
    try {
      // Tentar carregar fonte primária
      await figma.loadFontAsync(FONTS.primary[type]);
      loadedFonts[type] = FONTS.primary[type];
      console.log(`Fonte primária carregada: ${FONTS.primary[type].family} ${FONTS.primary[type].style}`);
    } catch (primaryError) {
      console.warn(`Não foi possível carregar a fonte primária ${FONTS.primary[type].family} ${FONTS.primary[type].style}. Tentando fallback...`);
      
      try {
        // Tentar carregar fonte fallback
        await figma.loadFontAsync(FONTS.fallback[type]);
        loadedFonts[type] = FONTS.fallback[type];
        console.log(`Fonte fallback carregada: ${FONTS.fallback[type].family} ${FONTS.fallback[type].style}`);
      } catch (fallbackError) {
        console.warn(`Não foi possível carregar a fonte fallback ${FONTS.fallback[type].family} ${FONTS.fallback[type].style}. Tentando fonte do sistema...`);
        
        try {
          // Tentar carregar fonte do sistema
          await figma.loadFontAsync(FONTS.system[type]);
          loadedFonts[type] = FONTS.system[type];
          console.log(`Fonte do sistema carregada: ${FONTS.system[type].family} ${FONTS.system[type].style}`);
        } catch (systemError) {
          console.error(`Não foi possível carregar nenhuma fonte para o estilo ${type}.`, systemError);
          throw new Error(`Não foi possível carregar fontes necessárias para o plugin.`);
        }
      }
    }
  }
  
  return loadedFonts;
}

// Função para verificar se existe um changelog em uma página
function hasChangelog(page: PageNode): { exists: boolean, frame?: FrameNode, count?: number } {
  try {
    console.log(`Verificando changelog na página: ${page.name}`);
    
    // Procurar por um frame de Changelog na página
    const nodes = page.children;
    console.log(`A página tem ${nodes.length} nós filhos`);
    
    const changelogFrame = nodes.find(node => 
      node.type === 'FRAME' && node.name === LAYOUT.containerName
    ) as FrameNode | undefined;
    
    if (!changelogFrame) {
      console.log('Nenhum frame de changelog encontrado');
      return { exists: false };
    }
    
    console.log(`Frame de changelog encontrado: ${changelogFrame.name}`);
    
    // Procurar pelo container de conteúdo
    const contentFrames = changelogFrame.children.filter(node => 
      node.type === 'FRAME' && node.name === 'content'
    );
    
    if (contentFrames.length === 0) {
      console.log('Container de conteúdo não encontrado');
      return { exists: true, frame: changelogFrame, count: 0 };
    }
    
    const contentContainer = contentFrames[0] as FrameNode;
    console.log(`Container de conteúdo encontrado com ${contentContainer.children.length} itens`);
    
    // Contar entradas no changelog
    const entryCount = contentContainer.children.length;
    
    return { 
      exists: true, 
      frame: changelogFrame,
      count: entryCount
    };
  } catch (error) {
    console.error('Erro ao verificar changelog:', error);
    return { exists: false };
  }
}

// Função para navegar até um frame específico
async function navigateToFrame(frame: FrameNode) {
  try {
    console.log(`Navegando para o frame: ${frame.name}`);
    // Verificar se o frame pertence à página atual
    if (frame.parent?.type === 'PAGE') {
      const framePage = frame.parent as PageNode;
      if (framePage.id !== figma.currentPage.id) {
        console.log(`O frame está na página ${framePage.name}, que não é a página atual. Alterando para esta página...`);
        await figma.setCurrentPageAsync(framePage);
      }
    }
    
    // Zoom para mostrar o frame inteiro
    figma.viewport.scrollAndZoomIntoView([frame]);
    console.log('Navegação concluída com sucesso');
  } catch (error) {
    console.error(`Erro ao navegar para o frame: ${error}`);
    figma.ui.postMessage({ type: 'error', message: `Erro ao navegar: ${error}` });
  }
}

// Função para habilitar uma página selecionada
async function selectPage(pageId: string): Promise<PageNode | null> {
  try {
    const pages = figma.root.children;
    console.log(`Buscando página com ID: ${pageId} entre ${pages.length} páginas`);
    const page = pages.find(p => p.id === pageId) as PageNode | undefined;
    
    if (page) {
      // Alternar para a página selecionada usando o método assíncrono
      console.log(`Página encontrada: ${page.name}, alterando para esta página...`);
      await figma.setCurrentPageAsync(page);
      return page;
    } else {
      console.log(`Página com ID ${pageId} não encontrada`);
    }
    
    return null;
  } catch (error) {
    console.error(`Erro ao selecionar página: ${error}`);
    figma.ui.postMessage({ type: 'error', message: `Erro ao selecionar página: ${error}` });
    return null;
  }
}

// Inicialização do plugin
figma.showUI(__html__, { width: 450, height: 550 });

// Função para lidar com mensagens da UI
figma.ui.onmessage = async (msg: UIMessage) => {
  console.log(`Plugin recebeu mensagem do tipo: ${msg.type}`);

  if (msg.type === 'get-pages') {
    try {
      // Obter as páginas diretamente do figma.root.children
      const pageNodes = figma.root.children;
      console.log(`Encontradas ${pageNodes.length} páginas no documento`);
      
      const pages = pageNodes.map(page => {
        console.log(`Processando página: ${page.name} (id: ${page.id})`);
        return {
          id: page.id,
          name: page.name
        };
      });
      
      console.log('Enviando páginas para a UI:', pages);
      figma.ui.postMessage({ 
        type: 'update-pages', 
        pages: pages 
      });
    } catch (error) {
      console.error('Erro ao obter páginas:', error);
      figma.ui.postMessage({ type: 'error', message: 'Não foi possível carregar as páginas do projeto.' });
    }
  }
  else if (msg.type === 'check-changelog') {
    // Verificar se a página selecionada tem changelog
    if (msg.pageId) {
      try {
        console.log(`Verificando changelog na página com ID: ${msg.pageId}`);
        
        // Alternar para a página selecionada
        const page = await selectPage(msg.pageId);
        
        if (page) {
          console.log(`Página selecionada: ${page.name}, verificando changelog...`);
          // Verificar se a página tem changelog
          const result = hasChangelog(page);
          
          console.log(`Resultado da verificação: existe=${result.exists}, count=${result.count || 0}`);
          figma.ui.postMessage({ 
            type: 'changelog-status', 
            hasChangelog: result.exists,
            entryCount: result.count || 0,
            currentPageId: page.id
          });
        } else {
          console.error('Página não encontrada:', msg.pageId);
          figma.ui.postMessage({ type: 'error', message: 'Página selecionada não encontrada.' });
        }
      } catch (error) {
        console.error('Erro ao verificar changelog:', error);
        figma.ui.postMessage({ type: 'error', message: 'Não foi possível verificar o changelog na página selecionada.' });
      }
    }
  }
  else if (msg.type === 'navigate-to-changelog') {
    // Navegar até o frame do changelog
    try {
      console.log('Solicitação para navegar até o changelog');
      const page = figma.currentPage;
      const result = hasChangelog(page);
      
      if (result.exists && result.frame) {
        console.log(`Changelog encontrado, navegando para o frame...`);
        await navigateToFrame(result.frame);
      } else {
        console.log('Nenhum changelog encontrado nesta página');
        figma.notify('Nenhum changelog encontrado nesta página');
      }
    } catch (error) {
      console.error('Erro ao navegar para o changelog:', error);
      figma.ui.postMessage({ type: 'error', message: 'Não foi possível navegar até o changelog.' });
    }
  }
  else if (msg.type === 'create-changelog') {
    try {
      // Verificar se temos os dados necessários
      if (!msg.data) {
        throw new Error('Dados do formulário não fornecidos');
      }

      // Obter dados do usuário atual
      const user = {
        name: figma.currentUser?.name || 'Usuário Desconhecido',
        photoUrl: msg.data.userPhotoData || figma.currentUser?.photoUrl || ''
      };

      // Criar uma nova entrada para o changelog
      const newEntry: ChangelogEntry = {
        id: generateUniqueId(),
        title: msg.data.title,
        description: msg.data.description,
        changeType: msg.data.changeType,
        linkUrl: msg.data.linkUrl,
        linkLabel: msg.data.linkLabel,
        imageData: msg.data.imageData,
        user,
        timestamp: Date.now()
      };

      // Encontrar ou criar o frame do Changelog
      await updateChangelogFrame(newEntry);

      // Verificar o novo número de entradas
      const updatedResult = hasChangelog(figma.currentPage);
      
      // Notificar a UI de sucesso e atualizar a contagem de entradas
      figma.ui.postMessage({ 
        type: 'success', 
        hasChangelog: true, 
        entryCount: updatedResult.count || 0,
        currentPageId: figma.currentPage.id
      });
      
      // Voltar para a página inicial após o sucesso
      setTimeout(() => {
        figma.ui.postMessage({ 
          type: 'navigate-to-home',
          hasChangelog: true,
          entryCount: updatedResult.count || 0,
          currentPageId: figma.currentPage.id 
        });
      }, 1500);
    } catch (error: any) {
      console.error('Erro ao criar changelog:', error);
      figma.notify(`Erro ao criar o changelog: ${error}`, { error: true });
      figma.ui.postMessage({ type: 'error', message: `Erro ao criar o changelog: ${error}` });
    }
  } 
  else if (msg.type === 'add-changelog-entry') {
    try {
      // Verificar se temos os dados necessários
      if (!msg.data) {
        throw new Error('Dados do formulário não fornecidos');
      }

      // Verificar se existe um changelog na página atual
      const result = hasChangelog(figma.currentPage);
      
      if (!result.exists) {
        throw new Error('Nenhum changelog encontrado na página atual');
      }

      // Obter dados do usuário atual
      const user = {
        name: figma.currentUser?.name || 'Usuário Desconhecido',
        photoUrl: msg.data.userPhotoData || figma.currentUser?.photoUrl || ''
      };

      // Criar uma nova entrada para o changelog
      const newEntry: ChangelogEntry = {
        id: generateUniqueId(),
        title: msg.data.title,
        description: msg.data.description,
        changeType: msg.data.changeType,
        linkUrl: msg.data.linkUrl,
        linkLabel: msg.data.linkLabel,
        imageData: msg.data.imageData,
        user,
        timestamp: Date.now()
      };

      // Adicionar a entrada ao changelog existente
      await updateChangelogFrame(newEntry);

      // Verificar o novo número de entradas
      const updatedResult = hasChangelog(figma.currentPage);
      
      // Notificar a UI de sucesso e atualizar a contagem de entradas
      figma.ui.postMessage({ 
        type: 'success', 
        hasChangelog: true, 
        entryCount: updatedResult.count || 0,
        currentPageId: figma.currentPage.id
      });
      
      // Voltar para a página inicial após o sucesso
      setTimeout(() => {
        figma.ui.postMessage({ 
          type: 'navigate-to-home',
          hasChangelog: true,
          entryCount: updatedResult.count || 0,
          currentPageId: figma.currentPage.id 
        });
      }, 1500);
    } catch (error: any) {
      console.error('Erro ao adicionar entrada ao changelog:', error);
      figma.notify(`Erro ao adicionar entrada: ${error}`, { error: true });
      figma.ui.postMessage({ type: 'error', message: `Erro ao adicionar entrada: ${error}` });
    }
  }
  else if (msg.type === 'get-user-info') {
    // Enviar informações do usuário atual para a UI
    const userInfo = {
      type: 'user-info',
      name: figma.currentUser?.name || 'Usuário',
      photoUrl: figma.currentUser?.photoUrl || null
    };
    console.log('Enviando informações do usuário para UI:', 
      JSON.stringify({...userInfo, photoUrl: userInfo.photoUrl ? '[URL disponível]' : null}));
    figma.ui.postMessage(userInfo);
  }
  else if (msg.type === 'process-user-image') {
    // Usar a função createImageAsync do Figma para baixar imagens, 
    // que gerencia CORS automaticamente
    console.log('Processando imagem do usuário usando createImageAsync');
    
    try {
      const photoUrl = msg.photoUrl;
      
      // Verificar se photoUrl existe
      if (!photoUrl) {
        console.error('URL da foto não foi fornecida');
        figma.ui.postMessage({ 
          type: 'user-image-error', 
          error: 'URL da foto não foi fornecida'
        });
        return;
      }
      
      // Verificar se já é um base64
      if (photoUrl.startsWith('data:image/')) {
        console.log('URL já é base64, retornando diretamente');
        figma.ui.postMessage({ 
          type: 'user-image-processed', 
          imageData: photoUrl 
        });
        return;
      }
      
      try {
        // A função createImageAsync lida com CORS internamente
        console.log('Tentando baixar imagem com createImageAsync:', photoUrl);
        const image = await figma.createImageAsync(photoUrl);
        
        if (image && image.hash) {
          // Se a imagem foi carregada, obter os bytes
          console.log('Imagem baixada com sucesso, obtendo bytes');
          const imageBytes = await image.getBytesAsync();
          
          // Enviar bytes para a UI para conversão final em base64
          figma.ui.postMessage({ 
            type: 'user-image-bytes', 
            imageBytes: Array.from(new Uint8Array(imageBytes)),
            format: 'PNG'
          });
        } else {
          throw new Error('Não foi possível obter o hash da imagem');
        }
      } catch (error: any) {
        console.error('Erro ao processar imagem com createImageAsync:', error);
        figma.ui.postMessage({ 
          type: 'user-image-error', 
          error: error.message || 'Erro desconhecido ao processar imagem'
        });
      }
    } catch (error: any) {
      console.error('Erro geral no processamento de imagem:', error);
      figma.ui.postMessage({ 
        type: 'user-image-error', 
        error: error.message || 'Erro desconhecido'
      });
    }
  }
  else if (msg.type === 'submit-form' && msg.data) {
    try {
      // Verificar se temos uma foto do usuário processada
      const userPhotoData = msg.data.userPhotoData;
      console.log("Recebido da UI - userPhotoData disponível:", !!userPhotoData);
      
      // Obter dados do usuário atual
      const user = {
        name: figma.currentUser?.name || 'Usuário Desconhecido',
        photoUrl: userPhotoData || figma.currentUser?.photoUrl || '' // Usar foto processada pela UI se disponível
      };

      // Criar uma nova entrada para o changelog
      const newEntry: ChangelogEntry = {
        id: generateUniqueId(),
        title: msg.data.title,
        description: msg.data.description,
        changeType: msg.data.changeType,
        linkUrl: msg.data.linkUrl,
        linkLabel: msg.data.linkLabel,
        imageData: msg.data.imageData,
        user,
        timestamp: Date.now()
      };

      // Encontrar ou criar o frame do Changelog
      await updateChangelogFrame(newEntry);

      // Notificar a UI de sucesso
      figma.ui.postMessage({ type: 'success' });
    } catch (error: any) {
      console.error('Error:', error);
      figma.notify(`Erro ao adicionar a alteração: ${error}`, { error: true });
      figma.ui.postMessage({ type: 'error', message: `Erro ao adicionar a alteração: ${error}` });
    }
  }
};

// Função para gerar um ID único
function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Função para encontrar ou criar o frame do Changelog
async function updateChangelogFrame(newEntry: ChangelogEntry): Promise<void> {
  // Verificar se estamos em uma página
  if (!figma.currentPage) {
    figma.notify('Nenhuma página selecionada', { error: true });
    return;
  }

  // Tentar carregar todas as fontes necessárias com fallback
  let availableFonts;
  try {
    availableFonts = await loadFontsWithFallback();
  } catch (error) {
    console.error('Erro fatal ao carregar fontes:', error);
    figma.notify('Erro ao carregar fontes. O plugin não pode continuar.', { error: true });
    figma.ui.postMessage({ type: 'error', message: 'Não foi possível carregar as fontes necessárias.' });
    return;
  }

  // Procurar por um frame existente de Changelog
  let changelogFrame = figma.currentPage.children.find(
    (node) => node.type === 'FRAME' && node.name === LAYOUT.containerName
  ) as FrameNode | null;

  // Verificar se é primeira criação do changelog
  const isNewChangelog = !changelogFrame;

  // Se não existir, criar um novo frame de Changelog
  if (!changelogFrame) {
    try {
      // Criar frame principal
      changelogFrame = figma.createFrame();
      changelogFrame.name = LAYOUT.containerName;
      changelogFrame.fills = [{ type: 'SOLID', color: COLORS.background }];
      changelogFrame.strokes = [{ type: 'SOLID', color: COLORS.border }];
      changelogFrame.strokeWeight = 1;
      changelogFrame.cornerRadius = LAYOUT.borderRadius.container;
      changelogFrame.layoutMode = 'VERTICAL';
      changelogFrame.counterAxisSizingMode = 'FIXED';
      changelogFrame.primaryAxisSizingMode = 'AUTO';
      changelogFrame.resize(LAYOUT.maxWidth, changelogFrame.height);
      
      // Adicionar efeitos de sombra
      changelogFrame.effects = [
        {
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.1 },
          offset: { x: 0, y: 12 },
          radius: 24,
          spread: 0,
          visible: true,
          blendMode: 'NORMAL'
        }
      ];
      
      // Criar o cabeçalho
      const header = figma.createFrame();
      header.name = 'header';
      header.fills = [{ type: 'SOLID', color: COLORS.background }];
      header.layoutMode = 'HORIZONTAL';
      header.counterAxisAlignItems = 'CENTER';
      header.paddingLeft = LAYOUT.header.padding.left;
      header.paddingRight = LAYOUT.header.padding.right;
      header.paddingTop = LAYOUT.header.padding.top;
      header.paddingBottom = LAYOUT.header.padding.bottom;
      header.primaryAxisSizingMode = 'FIXED';
      header.counterAxisSizingMode = 'AUTO';
      header.layoutAlign = 'STRETCH';
      
      // Arredondar apenas os cantos superiores do cabeçalho
      header.cornerRadius = LAYOUT.borderRadius.container;
      header.topLeftRadius = LAYOUT.borderRadius.header.topLeft;
      header.topRightRadius = LAYOUT.borderRadius.header.topRight;
      header.bottomLeftRadius = LAYOUT.borderRadius.header.bottomLeft;
      header.bottomRightRadius = LAYOUT.borderRadius.header.bottomRight;
      
      // Título do Changelog
      const title = figma.createText();
      title.fontName = availableFonts.bold;
      title.characters = 'Changelog';
      title.fontSize = 24;
      title.fills = [{ type: 'SOLID', color: COLORS.text.title }];
      
      header.appendChild(title);
      changelogFrame.appendChild(header);
      
      // Criar frame de conteúdo
      const contentFrame = figma.createFrame();
      contentFrame.name = 'content';
      contentFrame.fills = [];
      contentFrame.layoutMode = 'VERTICAL';
      contentFrame.paddingLeft = LAYOUT.content.padding.left;
      contentFrame.paddingRight = LAYOUT.content.padding.right;
      contentFrame.paddingTop = LAYOUT.content.padding.top;
      contentFrame.paddingBottom = LAYOUT.content.padding.bottom;
      contentFrame.itemSpacing = LAYOUT.content.gap;
      contentFrame.primaryAxisSizingMode = 'AUTO';
      contentFrame.counterAxisSizingMode = 'FIXED';
      contentFrame.layoutAlign = 'STRETCH';
      
      changelogFrame.appendChild(contentFrame);
      
      // Criar rodapé
      const footer = figma.createFrame();
      footer.name = 'footer';
      footer.fills = [{ type: 'SOLID', color: COLORS.background }];
      footer.layoutMode = 'HORIZONTAL';
      footer.counterAxisAlignItems = 'CENTER';
      footer.paddingLeft = LAYOUT.footer.padding.left;
      footer.paddingRight = LAYOUT.footer.padding.right;
      footer.paddingTop = LAYOUT.footer.padding.top;
      footer.paddingBottom = LAYOUT.footer.padding.bottom;
      footer.itemSpacing = LAYOUT.footer.gap;
      footer.primaryAxisSizingMode = 'FIXED';
      footer.counterAxisSizingMode = 'AUTO';
      footer.layoutAlign = 'STRETCH';
      
      // Arredondar apenas os cantos inferiores do rodapé
      footer.cornerRadius = LAYOUT.borderRadius.container;
      footer.topLeftRadius = LAYOUT.borderRadius.footer.topLeft;
      footer.topRightRadius = LAYOUT.borderRadius.footer.topRight;
      footer.bottomLeftRadius = LAYOUT.borderRadius.footer.bottomLeft;
      footer.bottomRightRadius = LAYOUT.borderRadius.footer.bottomRight;
      
      // Texto do rodapé
      const footerText = figma.createText();
      footerText.fontName = availableFonts.regular;
      footerText.characters = 'Changelog Plugin | Inter UX';
      footerText.fontSize = 10;
      footerText.fills = [{ type: 'SOLID', color: COLORS.text.footer }];
      
      footer.appendChild(footerText);
      changelogFrame.appendChild(footer);

      // Adicionar ao estágio
      figma.currentPage.appendChild(changelogFrame);
    } catch (error) {
      console.error('Erro ao criar frame de changelog:', error);
      figma.notify('Erro ao criar o frame do Changelog. Verifique as fontes necessárias.', { error: true });
      figma.ui.postMessage({ type: 'error', message: 'Não foi possível criar o layout do Changelog.' });
      return;
    }
  }

  // Criar e adicionar a nova entrada ao frame do Changelog
  const entryNode = await createChangelogEntryNode(newEntry);
  
  // Aplicar bloqueio na nova entrada para prevenir edições acidentais
  entryNode.locked = true;
  
  // Encontrar o frame de conteúdo
  const contentFrame = changelogFrame.findOne(
    node => node.type === 'FRAME' && node.name === 'content'
  ) as FrameNode | null;
  
  if (contentFrame) {
    // Verificar se o contentFrame está bloqueado e desbloquear temporariamente
    const wasLocked = contentFrame.locked;
    if (wasLocked) contentFrame.locked = false;
    
    // Adicionar a nova entrada no topo do conteúdo
    contentFrame.insertChild(0, entryNode);
    
    // Restaurar estado de bloqueio
    if (wasLocked) contentFrame.locked = true;
  } else {
    // Se não encontrar o frame de conteúdo, adicionar diretamente (fallback)
    const headerFrame = changelogFrame.findOne(
      node => node.type === 'FRAME' && node.name === 'header'
    ) as FrameNode | null;
    
    if (headerFrame) {
      // Adicionar após o cabeçalho
      const headerIndex = changelogFrame.children.indexOf(headerFrame);
      changelogFrame.insertChild(headerIndex + 1, entryNode);
    } else {
      // Último recurso: adicionar como primeiro filho
      changelogFrame.insertChild(0, entryNode);
    }
  }
  
  // Se for a primeira criação do changelog, bloquear elementos estruturais
  if (isNewChangelog) {
    // Bloquear o header e o footer para prevenir edições acidentais
    const headerFrame = changelogFrame.findOne(
      node => node.type === 'FRAME' && node.name === 'header'
    ) as FrameNode | null;
    
    const footerFrame = changelogFrame.findOne(
      node => node.type === 'FRAME' && node.name === 'footer'
    ) as FrameNode | null;
    
    if (headerFrame) headerFrame.locked = true;
    if (footerFrame) footerFrame.locked = true;
  }
}

// Função para criar um nó de entrada de changelog
async function createChangelogEntryNode(entry: ChangelogEntry): Promise<FrameNode> {
  // Usar as fontes já carregadas anteriormente (não precisamos carregar novamente)
  // Ou podemos carregar novamente se necessário
  let availableFonts;
  try {
    availableFonts = await loadFontsWithFallback();
  } catch (error) {
    console.error('Erro ao carregar fontes na criação da entrada:', error);
    throw new Error('Não foi possível carregar as fontes necessárias para criar a entrada');
  }

  // Frame container principal (frame pai)
  const containerFrame = figma.createFrame();
  containerFrame.name = `changelog-entry-${entry.id}`;
  containerFrame.layoutMode = 'VERTICAL';
  containerFrame.primaryAxisSizingMode = 'AUTO';
  containerFrame.counterAxisSizingMode = 'FIXED';
  containerFrame.resize(LAYOUT.maxWidth, containerFrame.height);
  containerFrame.itemSpacing = 0;
  containerFrame.fills = [];
  containerFrame.layoutAlign = 'STRETCH';
  
  // Frame interno com fundo branco e cantos arredondados
  const contentContainer = figma.createFrame();
  contentContainer.name = 'content-container';
  contentContainer.layoutMode = 'VERTICAL';
  contentContainer.primaryAxisSizingMode = 'AUTO';
  contentContainer.counterAxisSizingMode = 'FIXED';
  contentContainer.fills = [{ type: 'SOLID', color: COLORS.background }];
  contentContainer.cornerRadius = 8;
  contentContainer.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.05 },
      offset: { x: 0, y: 2 },
      radius: 8,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL'
    }
  ];
  contentContainer.paddingTop = 24;
  contentContainer.paddingBottom = 24;
  contentContainer.paddingLeft = 0;
  contentContainer.paddingRight = 0;
  contentContainer.itemSpacing = 16;
  contentContainer.layoutAlign = 'STRETCH';
  
  // Informação do usuário (avatar e meta)
  const userInfoFrame = figma.createFrame();
  userInfoFrame.name = 'user-info';
  userInfoFrame.fills = [];
  userInfoFrame.layoutMode = 'HORIZONTAL';
  userInfoFrame.counterAxisAlignItems = 'CENTER';
  userInfoFrame.primaryAxisSizingMode = 'AUTO';
  userInfoFrame.counterAxisSizingMode = 'AUTO';
  userInfoFrame.itemSpacing = LAYOUT.userInfo.gap;
  userInfoFrame.layoutAlign = 'STRETCH';
  
  // Avatar do usuário
  const avatarFrame = figma.createEllipse();
  avatarFrame.name = 'avatar';
  avatarFrame.resize(LAYOUT.avatarSize, LAYOUT.avatarSize);
  
  // Avatar com iniciais por padrão
  const userName = entry.user.name || 'Usuário';
  const initials = userName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  
  // Determinar cor baseada no nome do usuário (consistente para o mesmo usuário)
  const nameSum = userName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const hue = (nameSum % 360) / 360;
  avatarFrame.fills = [{ type: 'SOLID', color: HSVtoRGB(hue, 0.6, 0.8) }];
  
  console.log(`Criando avatar para usuário: ${userName}, photoUrl disponível:`, !!entry.user.photoUrl);
  
  // Verificar se temos uma URL de imagem válida em base64
  let hasValidImage = false;
  
  if (entry.user.photoUrl && entry.user.photoUrl.startsWith('data:image/')) {
    try {
      console.log("Processando imagem base64 para avatar");
      // Extrair dados base64
      const parts = entry.user.photoUrl.split(',');
      if (parts.length > 1) {
        try {
          const mimeType = (parts[0].match(/:(.*?);/) || [])[1] || 'image/png';
          console.log(`Tipo MIME detectado: ${mimeType}`);
          
          const base64Data = parts[1];
          console.log(`Tamanho dos dados base64: ${base64Data.length} caracteres`);
          
          if (base64Data && base64Data.length > 0) {
            try {
              // Decodificar base64 para bytes
              const imageBytes = figma.base64Decode(base64Data);
              console.log(`Bytes decodificados: ${imageBytes.byteLength}`);
              
              if (imageBytes.byteLength > 0) {
                try {
                  // Criar imagem Figma
                  const newImage = figma.createImage(imageBytes);
                  console.log(`Imagem criada com hash: ${newImage.hash}`);
                  
                  // Aplicar como preenchimento
                  avatarFrame.fills = [{
                    type: 'IMAGE',
                    imageHash: newImage.hash,
                    scaleMode: 'FILL'
                  }];
                  
                  console.log("Avatar preenchido com imagem base64");
                  hasValidImage = true;
                } catch (error) {
                  console.error("Erro ao criar imagem do avatar:", error);
                }
              } else {
                console.error("Bytes decodificados vazios");
              }
            } catch (error) {
              console.error("Erro ao decodificar base64:", error);
            }
          } else {
            console.error("Dados base64 vazios ou inválidos");
          }
        } catch (error) {
          console.error("Erro ao extrair partes do data URL:", error);
        }
      } else {
        console.error("Formato de data URL inválido - não há separador ','");
      }
    } catch (error) {
      console.error("Erro geral ao processar imagem base64:", error);
      // Continuar com avatar baseado em iniciais
    }
  } else if (entry.user.photoUrl) {
    console.log("URL de foto não é base64:", entry.user.photoUrl.substring(0, 50) + "...");
  } else {
    console.log("Nenhuma URL de foto disponível");
  }
  
  // Se não conseguiu usar imagem, criar texto com iniciais
  if (!hasValidImage) {
    console.log("Usando avatar com iniciais:", initials);
    try {
      // Primeiro adicionamos o avatar ao userInfoFrame
      userInfoFrame.appendChild(avatarFrame);
      
      // Criamos o texto para as iniciais
      const initialsText = figma.createText();
      initialsText.name = "avatar-initials";
      initialsText.fontName = availableFonts.medium;
      initialsText.fontSize = 14;
      initialsText.characters = initials;
      initialsText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      initialsText.textAlignHorizontal = "CENTER";
      initialsText.textAlignVertical = "CENTER";
      
      // Adicionamos na tela para obter as dimensões
      figma.currentPage.appendChild(initialsText);
      
      // Posicionamos sobre o avatar
      initialsText.x = avatarFrame.absoluteTransform[0][2] + (avatarFrame.width - initialsText.width) / 2;
      initialsText.y = avatarFrame.absoluteTransform[1][2] + (avatarFrame.height - initialsText.height) / 2;
      
      // Adicionamos o texto sobre o avatar
      userInfoFrame.appendChild(initialsText);
    } catch (error) {
      console.error("Erro ao criar iniciais:", error);
      
      // Garantir que o avatar seja adicionado em caso de erro
      if (!avatarFrame.parent) {
        userInfoFrame.appendChild(avatarFrame);
      }
    }
  } else {
    // Se a imagem foi adicionada com sucesso, adicionar o avatar ao frame
    userInfoFrame.appendChild(avatarFrame);
  }
  
  // Metadados do usuário (nome, data, hora)
  const userMetaFrame = figma.createFrame();
  userMetaFrame.name = 'user-meta';
  userMetaFrame.fills = [];
  userMetaFrame.layoutMode = 'HORIZONTAL';
  userMetaFrame.primaryAxisSizingMode = 'AUTO';
  userMetaFrame.counterAxisSizingMode = 'AUTO';
  userMetaFrame.counterAxisAlignItems = 'CENTER';
  userMetaFrame.itemSpacing = 8;
  
  // Nome do usuário
  const userNameText = figma.createText();
  userNameText.fontName = availableFonts.semiBold;
  userNameText.characters = entry.user.name;
  userNameText.fontSize = 16;
  userNameText.fills = [{ type: 'SOLID', color: COLORS.text.userName }];
  userMetaFrame.appendChild(userNameText);
  
  // Separador 1
  const separator1 = figma.createText();
  separator1.fontName = availableFonts.medium;
  separator1.characters = '•';
  separator1.fontSize = 16;
  separator1.fills = [{ type: 'SOLID', color: COLORS.text.separator }];
  userMetaFrame.appendChild(separator1);
  
  // Data formatada
  const dateText = figma.createText();
  dateText.fontName = availableFonts.medium;
  dateText.characters = formatDate(entry.timestamp).split(' ')[0]; // Apenas a data
  dateText.fontSize = 16;
  dateText.fills = [{ type: 'SOLID', color: COLORS.text.date }];
  userMetaFrame.appendChild(dateText);
  
  // Separador 2
  const separator2 = figma.createText();
  separator2.fontName = availableFonts.medium;
  separator2.characters = '•';
  separator2.fontSize = 16;
  separator2.fills = [{ type: 'SOLID', color: COLORS.text.separator }];
  userMetaFrame.appendChild(separator2);
  
  // Hora formatada
  const timeText = figma.createText();
  timeText.fontName = availableFonts.medium;
  timeText.characters = formatDate(entry.timestamp).split(' ')[1]; // Apenas a hora
  timeText.fontSize = 16;
  timeText.fills = [{ type: 'SOLID', color: COLORS.text.date }];
  userMetaFrame.appendChild(timeText);
  
  // Montar o frame de informações do usuário
  userInfoFrame.appendChild(userMetaFrame);
  
  // Badge do tipo de alteração
  const typeFrame = figma.createFrame();
  typeFrame.name = 'type-badge';
  typeFrame.layoutMode = 'HORIZONTAL';
  typeFrame.primaryAxisSizingMode = 'AUTO';
  typeFrame.counterAxisSizingMode = 'AUTO';
  typeFrame.paddingLeft = LAYOUT.badge.padding.left;
  typeFrame.paddingRight = LAYOUT.badge.padding.right;
  typeFrame.paddingTop = LAYOUT.badge.padding.top;
  typeFrame.paddingBottom = LAYOUT.badge.padding.bottom;
  typeFrame.cornerRadius = LAYOUT.badge.borderRadius;

  // Cores do badge com base no tipo de alteração
  const typeColorKey = entry.changeType as keyof typeof COLORS.typeColors;
  const badgeColor = COLORS.typeColors[typeColorKey] || COLORS.typeColors['Update'];
  typeFrame.fills = [{ type: 'SOLID', color: badgeColor.background }];
  
  // Texto do badge
  const typeText = figma.createText();
  typeText.fontName = availableFonts.bold;
  typeText.characters = entry.changeType.toUpperCase();
  typeText.fontSize = 10;
  typeText.fills = [{ type: 'SOLID', color: badgeColor.text }];
  typeFrame.appendChild(typeText);
  
  // Título da entrada
  const titleText = figma.createText();
  titleText.name = 'title';
  titleText.fontName = availableFonts.semiBold;
  titleText.characters = entry.title;
  titleText.fontSize = 20;
  titleText.fills = [{ type: 'SOLID', color: COLORS.text.entryTitle }];
  titleText.layoutAlign = 'STRETCH';
  titleText.textAutoResize = 'HEIGHT';
  
  // Descrição da entrada
  const descriptionText = figma.createText();
  descriptionText.name = 'description';
  descriptionText.fontName = availableFonts.regular;
  descriptionText.characters = entry.description;
  descriptionText.fontSize = 14;
  descriptionText.fills = [{ type: 'SOLID', color: COLORS.text.description }];
  descriptionText.layoutAlign = 'STRETCH';
  descriptionText.lineHeight = { value: 20, unit: 'PIXELS' };
  descriptionText.textAutoResize = 'HEIGHT';
  
  // Montar estrutura inicial
  contentContainer.appendChild(userInfoFrame);
  contentContainer.appendChild(typeFrame);
  contentContainer.appendChild(titleText);
  contentContainer.appendChild(descriptionText);
  
  // Frame para elementos adicionais (imagens, links) - Apenas criar se necessário
  let additionalFrame: FrameNode | null = null;
  
  // Verifica se existem elementos adicionais
  const hasAdditionalContent = (entry.linkUrl && entry.linkLabel) || entry.imageData;
  
  // Apenas cria o frame 'additional' se existir conteúdo adicional
  if (hasAdditionalContent) {
    additionalFrame = figma.createFrame();
    additionalFrame.name = 'additional';
    additionalFrame.fills = [];
    additionalFrame.layoutMode = 'VERTICAL';
    additionalFrame.primaryAxisSizingMode = 'AUTO';
    additionalFrame.counterAxisSizingMode = 'AUTO';
    additionalFrame.layoutAlign = 'STRETCH';
    additionalFrame.itemSpacing = 16;
    
    // Se tiver um link, adicionar
    if (entry.linkUrl && entry.linkLabel) {
      try {
        console.log("Tentando adicionar link:", entry.linkUrl);
        
        // Verificar se a URL é válida com abordagem simplificada
        const url = entry.linkUrl.trim();
        const isHttpUrl = url.startsWith('http://') || url.startsWith('https://');
        
        if (isHttpUrl) {
          console.log("Criando hyperlink com URL válida");
          
          // Criar texto com o label do link
          const linkText = figma.createText();
          linkText.name = 'link-text';
          linkText.fontSize = 14;
          linkText.fontName = availableFonts.regular;
          linkText.characters = `${entry.linkLabel} ↗`;
          linkText.fills = [{ type: 'SOLID', color: COLORS.text.link }];
          
          // Adicionar hyperlink diretamente, sem tentar validar com URL()
          linkText.hyperlink = { type: 'URL', value: url };
          additionalFrame.appendChild(linkText);
        } else {
          console.warn("URL inválida não adicionada ao changelog:", entry.linkUrl);
          const errorText = figma.createText();
          errorText.name = 'link-error';
          errorText.fontSize = 12;
          errorText.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.2, b: 0.2 } }];
          errorText.fontName = availableFonts.regular;
          errorText.characters = "Link não adicionado: URL inválida";
          additionalFrame.appendChild(errorText);
        }
      } catch (error) {
        console.error("Erro ao criar hyperlink:", error);
        const errorText = figma.createText();
        errorText.name = 'link-error';
        errorText.fontSize = 12;
        errorText.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.2, b: 0.2 } }];
        errorText.fontName = availableFonts.regular;
        errorText.characters = "Erro ao processar link";
        additionalFrame.appendChild(errorText);
      }
    }
    
    // Adicionar imagem caso disponível
    if (entry.imageData) {
      try {
        // Obter base64 da imagem (remover prefixo de data URI)
        const base64String = entry.imageData.split(',')[1];
        
        // Usar a função interna do Figma para decodificar base64
        const imageBytes = figma.base64Decode(base64String);
        
        // Criar imagem com os bytes
        const figmaImage = figma.createImage(imageBytes);
        
        // Criar um retângulo que conterá a imagem
        const imageFrame = figma.createRectangle();
        imageFrame.name = 'image';
        imageFrame.resize(LAYOUT.imageSize.width, LAYOUT.imageSize.height);
        imageFrame.cornerRadius = 8;
        
        // Definir a imagem como preenchimento do retângulo
        imageFrame.fills = [{
          type: 'IMAGE',
          imageHash: figmaImage.hash,
          scaleMode: 'FILL'
        }];
        
        additionalFrame.appendChild(imageFrame);
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        
        // Criar placeholder para a imagem em caso de erro
        const placeholder = figma.createRectangle();
        placeholder.name = 'image-placeholder';
        placeholder.resize(LAYOUT.imageSize.width, LAYOUT.imageSize.height);
        placeholder.cornerRadius = 8;
        placeholder.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        
        additionalFrame.appendChild(placeholder);
      }
    }
    
    // Verificar se durante a criação foi adicionado algum elemento no frame
    if (additionalFrame.children.length > 0) {
      contentContainer.appendChild(additionalFrame);
    }
  }
  
  // Inserir no container principal
  containerFrame.appendChild(contentContainer);
  
  return containerFrame;
}

// Função para formatar a data
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
   
  // Formatar data (DD/MM/YYYY)
  const day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate();
  const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1);
  const year = date.getFullYear();
  const dateStr = `${day}/${month}/${year}`;
   
  // Formatar hora (HH:MM)
  const hours = date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours();
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes();
  const timeStr = `${hours}h${minutes}`;
   
  return `${dateStr} ${timeStr}`;
}

// Função auxiliar para converter HSV para RGB (para cores de avatar)
function HSVtoRGB(h: number, s: number, v: number): {r: number, g: number, b: number} {
  let r = 0, g = 0, b = 0;
  
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  
  return { r, g, b };
}

// Comando principal para adicionar alteração
figma.command === 'addChange' && figma.showUI(__html__, { width: 450, height: 550 }); 