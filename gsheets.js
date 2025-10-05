function doPost(e) {
  try {
    // Pega os dados enviados pelo fetch
    const dados = JSON.parse(e.postData.contents);

    // Abre a planilha pelo ID e seleciona a aba
    const ss = SpreadsheetApp.openById("1uy4Bx0Bbt-2MpT-R-3_hEuVuewcdgYPZfeBaYfc32vw");
    const sheet = ss.getSheetByName("Respostas");

    // Garante que sempre seja um array
    const respostas = Array.isArray(dados) ? dados : [dados];

    // Adiciona cada resposta na planilha
    respostas.forEach(resposta => {
      sheet.appendRow([
        resposta.nome || "",
        resposta.idade || "",
        resposta.genero || "",
        (resposta.hobbies || []).join(", ")
      ]);
    });

    // Retorna status OK
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (erro) {
    // Retorna mensagem de erro
    return ContentService
      .createTextOutput(JSON.stringify({ status: "erro", mensagem: erro.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
