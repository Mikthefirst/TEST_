const PDFdoc = require('pdfkit');
const streamBuffers = require('stream-buffers');

async function createPDF(name, surname, imagename){
    const doc = new PDFdoc();
    const buffer = new streamBuffers.WritableStreamBuffer();

    doc.pipe(buffer);

    doc.fontSize(27)
        .text(`${name}\n${surname}`, 100, 100);
    
    doc.image(`./imgs/${imagename}`, {
        fit: [300, 300],
        align: 'center',
    });

    doc.end();

    await new Promise(resolve => doc.on('end', resolve));

    return buffer.getContents();
}

module.exports = createPDF;