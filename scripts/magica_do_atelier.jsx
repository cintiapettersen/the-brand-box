#target illustrator

// A MÁGICA DO ATELIER:
// Script desenvolvido para caçar automaticamente a arte gerada na Sala Secreta 
// (pasta Downloads) e injetá-la no centro do seu documento Illustrator em 1 clique.

function importaArteMagica() {
    if (app.documents.length === 0) {
        alert("Ops! Abra um documento do Illustrator primeiro (onde a cliente será diagramada)!");
        return;
    }
    
    var doc = app.activeDocument;
    
    // Checa a pasta Downloads padrão do Mac
    var downloadsFolder = new Folder("~/Downloads");
    if (!downloadsFolder.exists) {
        alert("Não consegui encontrar sua pasta de Downloads.");
        return;
    }
    
    // Busca todo arquivo com a assinatura do nosso Atelier
    var files = downloadsFolder.getFiles("atelier_arte_*.jpg");
    if (files.length === 0) {
        alert("Atenção: Nenhuma arte do Atelier recém gerada foi encontrada nos Downloads.\nVocê já apertou o botão baixar?");
        return;
    }
    
    // Ordena para pegar sempre a MAIS RECENTE
    files.sort(function(a, b) {
        return b.modified - a.modified; 
    });
    
    var latestFile = files[0];
    
    try {
        // Coloca a arte como "linked" (Placing it)
        var placedItem = doc.placedItems.add();
        placedItem.file = latestFile;
        
        // Se ela vier gigantesca da IA, vamos dar um pequeno resize pra caber visível
        // Maximizamos em 1000px pra segurança
        if (placedItem.width > 1000) {
             var scale = (1000 / placedItem.width) * 100;
             placedItem.resize(scale, scale);
        }

        // Pega a tela (Artboard) atual onde seu mouse clicou
        var artboardIndex = doc.artboards.getActiveArtboardIndex();
        var activeArtboard = doc.artboards[artboardIndex];
        var abRect = activeArtboard.artboardRect; // Array: [left, top, right, bottom]
        
        var abWidth = abRect[2] - abRect[0];
        var abHeight = abRect[1] - abRect[3];
        
        var abCenterX = abRect[0] + (abWidth / 2);
        var abCenterY = abRect[1] - (abHeight / 2);
        
        // Posição no Illustrator se assenta no left/top
        placedItem.position = [abCenterX - (placedItem.width/2), abCenterY + (placedItem.height/2)];
        
        alert("🪄 Mágica concluída! Ilustração centralizada para você.");
        
    } catch(e) {
        alert("Erro ao importar a arte: " + e);
    }
}

importaArteMagica();
