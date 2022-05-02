## Offline Image Compressor 
An Offline Image Compression Project Using Angular 13 &amp; .NET Core 6 Web API.

# OfflineImageCompressor - Backend
This project was created in .NET Core 6 Web Api 

## Setup
After cloning the project, open the solution in Visual Studio (Tested on VS Community 2022)

## Initial Checks !!Important!!
1. Check if cors service policy is pointing to correct origins in Program.cs file.
Currently it points to `localhost:4200`, which is the address that the front-end runs on by default. 
If your front-end runs on a different port then make the necessary adjustments in Program.cs file (line 13-15)

2. Check if `wwwroot` folder and `Resources/Image` folder exist in the project root (i.e. inside the ImgCompressorWebApi folder). 
	If it doesn't exist then create the three respective folders

3. Clean and rebuild the solution

## Running the project
Run in debug or debug free mode.

# OfflineImageCompressor - Frontend
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.0.

## Setup
After cloning the project, run `npm update` inside the project root

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.


