using Florence2;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace MissionHillFireworks.Inventory.Backend.Services
{
    public class Florence2OcrService
    {
        private readonly Florence2Model _model;

        public Florence2OcrService(Florence2Model model)
        {
            _model = model;
        }

        public async Task<List<string>> ReadTextAsync(byte[] imageBytes)
        {
            using var image = Image.Load(imageBytes);

            image.Mutate(x =>
            {
                x.Resize(new ResizeOptions
                {
                    Mode = ResizeMode.Max,
                    Size = new Size(1000, 1000)
                });
            });

            using var output = new MemoryStream();
            image.SaveAsPng(output);

            //using var stream = File.OpenRead("test.jpg");
            using var stream = new MemoryStream(output.ToArray());

            var ocrResults = _model.Run(TaskTypes.OCR, new Stream[] { stream }, null, CancellationToken.None);

            var results = ocrResults.Select(x => x.PureText).ToList();

            return results;
        }
    }
}
