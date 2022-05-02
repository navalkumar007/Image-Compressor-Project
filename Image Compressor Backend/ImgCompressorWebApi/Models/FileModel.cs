namespace ImgCompressorWebApi.Models
{
    public class FileModel
    {
        public string FileName { get; set; }

        public int FileSize { get; set; }

        public string FileAsBase64 { get; set; }

        public string FileType { get; set; }
    }
}
