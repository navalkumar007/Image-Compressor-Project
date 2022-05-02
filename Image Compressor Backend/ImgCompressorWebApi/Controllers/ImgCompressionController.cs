using ImageMagick;
using ImgCompressorWebApi.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

//Using an alias due to namespace conflicts
using IoFile = System.IO.File;

namespace ImgCompressorWebApi.Controllers
{
    [Route("api/compressImg")]
    [EnableCors("ImgCompressor_AllowSpecificOrigins")]
    [ApiController]
    public class ImgCompressionController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CompressImg([FromBody] FileModel uploadedImgFile)
        {
            //Defining the path where the images will be saved
            //Temp location used for compressing file
            string folderName = Path.Combine("Resources", "Image");
            var imageFullPath = this.getFullFilePath(folderName, uploadedImgFile.FileName);

            try
            {
                //Save uncompressed image to server
                await saveImgFileToServer(uploadedImgFile, imageFullPath).ContinueWith((task) =>
                {
                    //Get saved file info for compression
                    FileInfo uncompressedImgInfo = new FileInfo(imageFullPath);

                    //Optimize the image
                    var optimizer = new ImageOptimizer();
                    optimizer.LosslessCompress(uncompressedImgInfo);

                }, TaskContinuationOptions.OnlyOnRanToCompletion);

                //Return new compressed file for download
                FileModel fileForDownload = GetImgFile(imageFullPath);

                //Delete the file from the server once conversion is done
                deleteFileFromServer(imageFullPath);

                //Return compressed file object back to client
                return Ok(new { fileForDownload });
            }
            catch (Exception)
            {
                //Something went wrong
                //Internal error: Code 500
                return StatusCode(500, "Internal Server Error");
            }
        }

        //Method for deleting image file from server
        private void deleteFileFromServer(string filePath)
        {
            IoFile.Delete(filePath);
        }

        //Method for retrieving image file from server
        private FileModel GetImgFile(string imgFileFullPath)
        {
            FileModel fileForDownload = new FileModel();
            FileInfo imgFile = new FileInfo(imgFileFullPath);


            //Check if file exists in path
            if (IoFile.Exists(imgFileFullPath))
            {
                //Set the new  values in the file model
                byte[] fileByte = IoFile.ReadAllBytes(imgFileFullPath);
                fileForDownload.FileType = DetermineFileType(imgFileFullPath);
                fileForDownload.FileAsBase64 = $"data:{fileForDownload.FileType};base64," + ConvertToBase(fileByte);
                fileForDownload.FileName = imgFile.Name;
                fileForDownload.FileSize = (int)imgFile.Length;
            }
            return fileForDownload;
        }

        //Method for saving image file to server
        private async Task saveImgFileToServer(FileModel imgFile, string pathToSave)
        {
            //Convert base64 code to byte array
            byte[] fileAsBytesArray = ConvertToByte(imgFile.FileAsBase64);

            //Save image to server
            using (var fs = new FileStream(pathToSave, FileMode.CreateNew))
            {
                await fs.WriteAsync(fileAsBytesArray, 0, fileAsBytesArray.Length);
            }
        }

        //Method for determining file type
        private string DetermineFileType(string imgFileFullPath)
        {
            string ext = Path.GetExtension(imgFileFullPath);
            if (ext == ".png") return "image/png";
            if (ext == ".jpg" || ext == ".jpeg") return "image/jpeg";
            else return "";
        }

        //Method for converting byte to bas64 of type image
        private string ConvertToBase(byte[] fileByte)
        {
            string base64Code = Convert.ToBase64String(fileByte);

            return base64Code;
        }

        //Method for converting base64 to byte
        private byte[] ConvertToByte(string imgbaseRep)
        {
            //Remove data:image/type;base64, from base64 string
            if (imgbaseRep.Contains(","))
            {
                imgbaseRep = imgbaseRep.Substring(imgbaseRep.IndexOf(",") + 1);
            }

            //Convert base64 to byte array
            return Convert.FromBase64String(imgbaseRep);
        }

        //Method for creating image file path
        private string getFullFilePath(string folderName, string fileName)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            return Path.Combine(filePath, fileName);
        }
    }
}
