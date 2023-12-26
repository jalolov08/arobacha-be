const sharp = require("sharp");

const applyWatermark = (inputImagePath, outputImagePath, watermarkPath, watermarkSettings) => {
  sharp(inputImagePath)
    .metadata()
    .then((metadata) => {
      const width = metadata.width;
      const height = metadata.height;

      sharp(watermarkPath)
        .resize({ width: watermarkSettings.width, height: watermarkSettings.height, fit: "contain" }) 
        .toBuffer()
        .then((resizedWatermarkBuffer) => {
          sharp(inputImagePath)
            .composite([
              {
                input: resizedWatermarkBuffer,
                top: watermarkSettings.top,
                left: watermarkSettings.left,
                blend: watermarkSettings.blend,
              },
            ])
            .toFile(outputImagePath, (err, info) => {
              if (err) {
                console.error(err);
              } else {
                console.log("Водяной знак успешно добавлен!");
                console.log("Создано изображение с водяным знаком:", outputImagePath);
                console.log(info);
              }
            });
        })
        .catch((err) => {
          console.error("Error resizing watermark:", err);
        });
    })
    .catch((err) => {
      console.error("Error getting input image metadata:", err);
    });
};

module.exports = applyWatermark;
